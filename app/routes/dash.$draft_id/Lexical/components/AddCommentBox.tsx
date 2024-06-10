import { useCallback, useEffect, useRef } from 'react';

import { LexicalEditor, NodeKey } from 'lexical';

import { StickyIcon } from '../svg';

export default function AddCommentBox({
  anchorKey,
  editor,
  onAddComment
}: {
  anchorKey: NodeKey;
  editor: LexicalEditor;
  onAddComment: () => void;
}): JSX.Element {
  const boxRef = useRef<HTMLButtonElement>(null);

  const updatePosition = useCallback(() => {
    const boxElem = boxRef.current;
    const rootElement = editor.getRootElement();
    const anchorElement = editor.getElementByKey(anchorKey);
    if (boxElem !== null && rootElement !== null && anchorElement !== null) {
      const { left } = rootElement.getBoundingClientRect();
      const { top } = anchorElement.getBoundingClientRect();
      boxElem.style.setProperty('--boxLeft', `${left}px`);
      boxElem.style.setProperty('--boxTop', `${top}px`);

    }
  }, [anchorKey, editor]);

  useEffect(() => {
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [editor, updatePosition]);

  useEffect(() => {
    updatePosition();
  }, [anchorKey, editor, updatePosition]);

  return (
    <button
      type="button"
      data-id="CommentPlugin_AddCommentBox_button"
      className="w-[50px] h-[50px] flexCenter fixed rounded-xl bg-white z-10 shadow-l text-gray-500 cursor-pointer hover:bg-gray-100"
      onClick={onAddComment}
      ref={boxRef}>
      <StickyIcon svgColor="currentColor" uniqueId="lexical-comment" className="w-full h-auto p-3" />
    </button>
  );
}
