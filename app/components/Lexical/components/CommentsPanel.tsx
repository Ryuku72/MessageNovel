import { useEffect, useMemo, useRef, useState } from 'react';

import { $isMarkNode, MarkNode } from '@lexical/mark';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey, NodeKey } from 'lexical';

import { ConnectIcon, DisconnectIcon } from '~/svg';
import CloseIcon from '~/svg/CloseIcon/CloseIcon';

import { Comment, Comments, Thread } from '../helpers';
import { CommentThread, CommentsPanelList } from './CommentsPanelListComment';

export default function CommentsPanel({
  activeIDs,
  deleteCommentOrThread,
  comments,
  submitAddComment,
  markNodeMap,
  close,
  author,
  show,
  status,
  handleConnectionToggle
}: {
  author: string;
  activeIDs: string[];
  comments: Comments;
  deleteCommentOrThread: (commentOrThread: Comment | Thread, thread?: Thread) => void;
  markNodeMap: Map<string, Set<NodeKey>>;
  submitAddComment: (commentOrThread: Comment | Thread, isInlineComment: boolean, thread?: Thread) => void;
  close: () => void;
  show: boolean;
  status: string;
  handleConnectionToggle: () => void;
}): JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  const isEmpty = comments.length === 0;

  const [editor] = useLexicalComposerContext();
  const [counter, setCounter] = useState(0);
  const [init, setInit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const rtf = useMemo(
    () =>
      new Intl.RelativeTimeFormat('en', {
        localeMatcher: 'best fit',
        numeric: 'auto',
        style: 'short'
      }),
    []
  );

  useEffect(() => {
    setInit(true);
  }, []);

  useEffect(() => {
    // Used to keep the time stamp up to date
    const id = setTimeout(() => {
      setCounter(counter + 1);
    }, 10000);

    return () => {
      clearTimeout(id);
    };
  }, [counter]);

  const handleClickThread = (id: string) => {
    const markNodeKeys = markNodeMap.get(id);

    if (markNodeKeys !== undefined && (activeIDs === null || activeIDs.indexOf(id) === -1) && init) {
      const activeElement = document?.activeElement;
      const markNodeKey = Array.from(markNodeKeys)[0];
      const markNode = $getNodeByKey<MarkNode>(markNodeKey, editor._editorState);
      // Move selection to the start of the mark, so that we
      // update the UI with the selected thread.
      editor.update(
        () => {
          if ($isMarkNode(markNode)) markNode.selectStart();
        },
        {
          onUpdate() {
            // Restore selection to the previous element
            if (activeElement !== null) (activeElement as HTMLElement).focus();
          }
        }
      );
    }
  };

  return (
    <div
      data-id="CommentPlugin_CommentsPanel"
      className={`fixed flex flex-col flex-auto gap-1 right-0 md:w-[400px] w-full md:h-[calc(100%_-_80px)] h-full md:top-10 top-0 z-40 transition-transform ease-out duration-500 ${show ? 'translate-x-0' : 'md:translate-x-[400px] translate-x-[767px]'}`}>
      <div className="w-full flex flex-col flex-auto gap-1 overflow-hidden rounded-l-md bg-white bg-opacity-50 backdrop-blur-sm shadow-[0_0_10px_rgba(0,_0,_0,_0.1)] ">
        <div className="w-full flex-shrink-0 pt-4 px-6 pb-2 flex flex-wrap rounded-t-[inherit] justify-between items-center bg-white bg-opacity-80 backdrop-blur-sm">
          <button type="button" className="flex gap-3 items-center" onClick={handleConnectionToggle}>
            <div
              title={`Comments YJS ${status}`}
              className={`flex gap-2 rounded cursor-pointer h-[40px] items-center justify-center pl-2 pr-3 capitalize text-gray-500 ${status === 'disconnected' ? 'bg-red-300' : 'bg-green-300'} rounded bg-opacity-25 backdrop-blur-sm`}>
              {status === 'disconnected' ? (
                <DisconnectIcon uniqueId="lexical-chat-disconnect" className="w-5 h-auto" />
              ) : (
                <ConnectIcon uniqueId="lexical-chat-connect" className="w-5 h-auto" />
              )}
            </div>
            <h3 className="font-medium text-xl text-gray-600 underline underline-offset-4 capitalize">
              &#8197;Comments&nbsp;&nbsp;&nbsp;
            </h3>
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-red-500 hover:border hover:border-red-500 rounded"
            type="button"
            onClick={close}>
            <CloseIcon className="w-3 h-3" uniqueId="dash-close" svgColor="currentColor" />
          </button>
        </div>
        <div
          data-id="CommentPlugin_CommentsPanel_Empty"
          className={
            isEmpty
              ? 'flexCenter font-base w-full flex-col flex-auto text-gray-700 bg-white bg-opacity-25 backdrop-blur-sm rounded-b-[inherit]'
              : 'hidden'
          }>
          No Comments
        </div>
        <ul
          data-id="CommentPlugin_CommentsPanel_List"
          className={isEmpty ? 'hidden' : 'flex flex-col gap-1 list-none w-full overflow-y-auto flex-auto'}
          ref={listRef}>
          {comments.map(commentOrThread => {
            const id = commentOrThread.id;
            if (commentOrThread.type === 'thread')
              return (
                <CommentThread
                  key={id}
                  author={author}
                  commentOrThread={commentOrThread}
                  handleClickThread={() => handleClickThread(id)}
                  rtf={rtf}
                  markNodeMapHasId={markNodeMap.has(id)}
                  activeIdExists={activeIDs.indexOf(id) === -1}
                  setShowModal={setShowModal}
                  showModal={showModal}
                  deleteCommentOrThread={deleteCommentOrThread}
                  submitAddComment={submitAddComment}
                />
              );
            return (
              <CommentsPanelList key={id} comment={commentOrThread} deleteComment={deleteCommentOrThread} rtf={rtf} />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
