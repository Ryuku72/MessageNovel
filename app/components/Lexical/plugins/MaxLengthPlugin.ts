import { useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $trimTextContentFromAnchor } from '@lexical/selection';
import { $restoreEditorState } from '@lexical/utils';
import { $getRoot, $getSelection, $isRangeSelection, EditorState, RootNode } from 'lexical';

export function MaxLengthPlugin({
  maxLength,
  setTextLength
}: {
  maxLength: number;
  setTextLength: (length: number) => void;
}): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    let lastRestoredEditorState: EditorState | null = null;
    return editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
        return;
      }
      const prevEditorState = editor.getEditorState();
      const prevTextContentSize = prevEditorState.read(() => rootNode.getTextContentSize());
      const textContentSize = rootNode.getTextContentSize();
      if (prevTextContentSize !== textContentSize) {
        const delCount = textContentSize - maxLength;
        const anchor = selection.anchor;

        if (delCount > 0) {
          // Restore the old editor state instead if the last
          // text content was already at the limit.
          if (prevTextContentSize === maxLength && lastRestoredEditorState !== prevEditorState) {
            lastRestoredEditorState = prevEditorState;
            $restoreEditorState(editor, prevEditorState);
          } else {
            $trimTextContentFromAnchor(editor, anchor, delCount);
          }
        }
      }
    });
  }, [editor, maxLength]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const rootNode = $getRoot();
        const contentSize = rootNode.getTextContentSize();
        setTextLength(contentSize);
      });
    });
  }, [editor, setTextLength]);

  return null;
}
