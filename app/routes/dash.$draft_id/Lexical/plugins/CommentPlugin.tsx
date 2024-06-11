import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  $createMarkNode,
  $getMarkIDs,
  $isMarkNode,
  $unwrapMarkNode,
  $wrapSelectionInMarkNode,
  MarkNode
} from '@lexical/mark';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister, registerNestedElementResolver } from '@lexical/utils';
import type { LexicalCommand, NodeKey, RangeSelection } from 'lexical';
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand
} from 'lexical';

import DialogWrapper from '~/components/DialogWrapper';

import AddCommentBox from '../components/AddCommentBox';
import CommentInputBox from '../components/CommentInputBox';
import CommentsPanel from '../components/CommentsPanel';
import { Comment, CommentStore, Thread, useCollabAuthorName, useCommentStore } from '../helpers';
import { ChatIcon } from '../svg';

export const INSERT_INLINE_COMMAND: LexicalCommand<void> = createCommand('INSERT_INLINE_COMMAND');

export default function CommentPlugin({ username, color }: { username: string; color: string }): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const commentStore = useMemo(() => new CommentStore(editor), [editor]);
  const comments = useCommentStore(commentStore);
  const author = useCollabAuthorName(username, color);

  const [activeAnchorKey, setActiveAnchorKey] = useState<NodeKey | null>();
  const [activeIDs, setActiveIDs] = useState<Array<string>>([]);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [init, setInit] = useState(false);

  const markNodeMap = useMemo<Map<string, Set<NodeKey>>>(() => {
    return new Map();
  }, []);

  useEffect(() => {
    setInit(true);
  }, []);

  useEffect(() => {
    const changedElems: Array<HTMLElement> = [];
    activeIDs.map(id => {
      const keys = markNodeMap.get(id);
      if (keys !== undefined) {
        for (const key of keys) {
          const elem = editor.getElementByKey(key);
          if (elem !== null) {
            elem.classList.add('selected');
            changedElems.push(elem);
            setShowComments(true);
          }
        }
      }
    });
    return () => {
      for (let i = 0; i < changedElems.length; i++) {
        const changedElem = changedElems[i];
        changedElem.classList.remove('selected');
      }
    };
  }, [activeIDs, editor, markNodeMap]);

  useEffect(() => {
    const markNodeKeysToIDs: Map<NodeKey, Array<string>> = new Map();

    return mergeRegister(
      registerNestedElementResolver<MarkNode>(
        editor,
        MarkNode,
        (from: MarkNode) => {
          return $createMarkNode(from.getIDs());
        },
        (from: MarkNode, to: MarkNode) => {
          // Merge the IDs
          const ids = from.getIDs();
          ids.forEach(id => {
            to.addID(id);
          });
        }
      ),
      editor.registerMutationListener(MarkNode, mutations => {
        editor.getEditorState().read(() => {
          for (const [key, mutation] of mutations) {
            const node: null | MarkNode = $getNodeByKey(key);
            let ids: NodeKey[] = [];

            if (mutation === 'destroyed') {
              ids = markNodeKeysToIDs.get(key) || [];
            } else if ($isMarkNode(node)) {
              ids = node.getIDs();
            }

            for (let i = 0; i < ids.length; i++) {
              const id = ids[i];
              let markNodeKeys = markNodeMap.get(id);
              markNodeKeysToIDs.set(key, ids);

              if (mutation === 'destroyed') {
                if (markNodeKeys !== undefined) {
                  markNodeKeys.delete(key);
                  if (markNodeKeys.size === 0) {
                    markNodeMap.delete(id);
                  }
                }
              } else {
                if (markNodeKeys === undefined) {
                  markNodeKeys = new Set();
                  markNodeMap.set(id, markNodeKeys);
                }
                if (!markNodeKeys.has(key)) {
                  markNodeKeys.add(key);
                }
              }
            }
          }
        });
      }),
      editor.registerUpdateListener(({ editorState, tags }) => {
        editorState.read(() => {
          const selection = $getSelection();
          let hasActiveIds = false;
          let hasAnchorKey = false;

          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();

            if ($isTextNode(anchorNode)) {
              const commentIDs = $getMarkIDs(anchorNode, selection.anchor.offset);
              if (commentIDs !== null) {
                setActiveIDs(commentIDs);
                hasActiveIds = true;
              }
              if (!selection.isCollapsed()) {
                setActiveAnchorKey(anchorNode.getKey());
                hasAnchorKey = true;
              }
            }
          }
          if (!hasActiveIds) {
            setActiveIDs(_activeIds => (_activeIds.length === 0 ? _activeIds : []));
          }
          if (!hasAnchorKey) {
            setActiveAnchorKey(null);
          }
          if (!tags.has('collaboration') && $isRangeSelection(selection)) {
            setShowCommentInput(false);
          }
        });
      }),
      editor.registerCommand(
        INSERT_INLINE_COMMAND,
        () => {
          const domSelection = window.getSelection();
          if (domSelection !== null) {
            domSelection.removeAllRanges();
          }
          setShowCommentInput(true);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor, markNodeMap]);

  const onAddComment = () => {
    editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined);
  };

  const cancelAddComment = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      // Restore selection
      if (selection !== null) {
        selection.dirty = true;
      }
    });
    setShowCommentInput(false);
  }, [editor]);

  const submitAddComment = useCallback(
    (
      commentOrThread: Comment | Thread,
      isInlineComment: boolean,
      thread?: Thread,
      selection?: RangeSelection | null
    ) => {
      commentStore.addComment(commentOrThread, thread);
      if (isInlineComment) {
        editor.update(() => {
          if ($isRangeSelection(selection)) {
            const isBackward = selection.isBackward();
            const id = commentOrThread.id;

            // Wrap content in a MarkNode
            $wrapSelectionInMarkNode(selection, isBackward, id);
          }
        });
        setShowCommentInput(false);
      }
    },
    [commentStore, editor]
  );

  const deleteCommentOrThread = useCallback(
    (comment: Comment | Thread, thread?: Thread) => {
      if (comment.type === 'comment') {
        const deletionInfo = commentStore.deleteCommentOrThread(comment, thread);
        if (!deletionInfo) {
          return;
        }
        const { markedComment, index } = deletionInfo;
        commentStore.addComment(markedComment, thread, index);
      } else {
        commentStore.deleteCommentOrThread(comment);
        // Remove ids from associated marks
        const id = thread !== undefined ? thread.id : comment.id;
        const markNodeKeys = markNodeMap.get(id);
        if (markNodeKeys !== undefined) {
          // Do async to avoid causing a React infinite loop
          setTimeout(() => {
            editor.update(() => {
              for (const key of markNodeKeys) {
                const node: null | MarkNode = $getNodeByKey(key);
                if ($isMarkNode(node)) {
                  node.deleteID(id);
                  if (node.getIDs().length === 0) {
                    $unwrapMarkNode(node);
                  }
                }
              }
            });
          });
        }
      }
    },
    [commentStore, editor, markNodeMap]
  );

  const openCommentBox = init && activeAnchorKey !== null && activeAnchorKey !== undefined && !showCommentInput;

  const CreatePortalEl = useMemo(
    () =>
      ({ element, condition }: { element: JSX.Element; condition: boolean }) => {
        if (!condition) return null;

        return createPortal(element, document.body);
      },
    []
  );

  return (
    <div className="relative">
      <button
        type="button"
        className={`flex  gap-3 rounded cursor-pointer h-[40px] items-center justify-center px-2 ${showComments ? 'bg-gray-200 text-gray-600' : 'text-gray-500'}`}
        data-id="CommentPlugin_ShowCommentsButton"
        onClick={() => setShowComments(!showComments)}
        title={showComments ? 'Hide Comments' : 'Show Comments'}>
        <ChatIcon uniqueId="commentPlugin-icon" className="w-5 h-auto -scale-x-100" />{' '}
        {showComments ? 'Hide Comments' : 'Show Comments'}
      </button>
      <CreatePortalEl
        condition={init}
        element={
          <CommentsPanel
            comments={comments}
            submitAddComment={submitAddComment}
            deleteCommentOrThread={deleteCommentOrThread}
            activeIDs={activeIDs}
            markNodeMap={markNodeMap}
            close={() => setShowComments(false)}
            author={author}
            show={showComments}
          />
        }
      />
      <DialogWrapper open={showCommentInput} animate={false}>
        <CommentInputBox
          editor={editor}
          cancelAddComment={cancelAddComment}
          submitAddComment={submitAddComment}
          open={showCommentInput}
          author={author}
        />
      </DialogWrapper>
      <CreatePortalEl
        condition={openCommentBox && init}
        element={
          <AddCommentBox
            anchorKey={openCommentBox ? activeAnchorKey : ''}
            editor={editor}
            onAddComment={onAddComment}
          />
        }
      />
    </div>
  );
}
