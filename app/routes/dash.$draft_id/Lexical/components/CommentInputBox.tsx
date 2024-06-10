import { useCallback, useEffect, useRef, useState } from 'react';

import { createDOMRange, createRectsFromDOMRange } from '@lexical/selection';
import { $getSelection, $isRangeSelection, EditorState, LexicalEditor, RangeSelection } from 'lexical';

import { Comment, Thread, createComment, createThread, handleOnChange } from '../helpers';
import BaseTextEditor from './BaseTextEditor';

export default function CommentInputBox({
  editor,
  cancelAddComment,
  submitAddComment,
  open,
  author
}: {
  cancelAddComment: () => void;
  editor: LexicalEditor;
  open: boolean;
  author: string;
  submitAddComment: (
    commentOrThread: Comment | Thread,
    isInlineComment: boolean,
    thread?: Thread,
    selection?: RangeSelection | null
  ) => void;
}) {
  const [content, setContent] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const selectionRef = useRef<RangeSelection | null>(null);

  const updateLocation = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        const selectionState = { container: document.createElement('div'), elements: [] };
        selectionRef.current = selection.clone();
        const anchor = selection.anchor;
        const focus = selection.focus;
        const range = createDOMRange(editor, anchor.getNode(), anchor.offset, focus.getNode(), focus.offset);
        const boxElem = boxRef.current;
        if (range !== null && boxElem !== null) {
          const { left, bottom, width } = range.getBoundingClientRect();
          const selectionRects = createRectsFromDOMRange(editor, range);
          let correctedLeft = selectionRects.length === 1 ? left + width / 2 - 125 : left - 125;
          if (correctedLeft < 10) {
            correctedLeft = 10;
          }
          boxElem.style.left = `${correctedLeft}px`;
          boxElem.style.top = `${bottom + 20 + (window.pageYOffset || document.documentElement.scrollTop)}px`;
          const selectionRectsLength = selectionRects.length;
          const { container } = selectionState;
          const elements: Array<HTMLSpanElement> = selectionState.elements;
          const elementsLength = elements.length;

          for (let i = 0; i < selectionRectsLength; i++) {
            const selectionRect = selectionRects[i];
            let elem: HTMLSpanElement = elements[i];
            if (elem === undefined) {
              elem = document.createElement('span');
              elements[i] = elem;
              container.appendChild(elem);
            }
            const color = '255, 212, 0';
            const style = `position:absolute;top:${
              selectionRect.top + (window.pageYOffset || document.documentElement.scrollTop)
            }px;left:${selectionRect.left}px;height:${selectionRect.height}px;width:${
              selectionRect.width
            }px;background-color:rgba(${color}, 0.3);pointer-events:none;z-index:5;`;
            elem.style.cssText = style;
          }

          for (let i = elementsLength - 1; i >= selectionRectsLength; i--) {
            const elem = elements[i];
            container.removeChild(elem);
            elements.pop();
          }
        }
      }
    });
  }, [editor]);

  useEffect(() => {
    updateLocation();
    const selectionState = { container: document.createElement('div'), elements: [] };
    const container = selectionState.container;
    const body = document.body;
    if (body !== null) {
      body.appendChild(container);
      return () => {
        body.removeChild(container);
      };
    }
  }, [updateLocation, open]);

  useEffect(() => {
    window.addEventListener('resize', updateLocation);

    return () => {
      window.removeEventListener('resize', updateLocation);
    };
  }, [updateLocation]);

  const onEscape = (event: KeyboardEvent): boolean => {
    event.preventDefault();
    setContent('');
    cancelAddComment();
    return true;
  };

  const submitComment = (userText: string) => {
    let quote = editor.getEditorState().read(() => {
      const selection = selectionRef.current;
      return selection ? selection.getTextContent() : '';
    });
    if (quote.length > 100) {
      quote = quote.slice(0, 99) + '…';
    }
    submitAddComment(createThread(quote, [createComment(userText, author)]), true, undefined, selectionRef.current);
    selectionRef.current = null;
  };

  const onClick = () => {
    if (canSubmit && editor) submitComment(content);
  };

  const onChange = (editorState: EditorState, _editor: LexicalEditor) => {
    const update = handleOnChange(editorState, _editor);
    setContent(update.text);
    setCanSubmit(update.canSubmit);
  };

  const onSubmit = (editorState: EditorState, _editor: LexicalEditor) => {
    const update = handleOnChange(editorState, _editor);
    if (update.text && update.canSubmit) submitComment(update.text);
  };

  return (
    <div
      data-id="CommentPlugin_CommentInputBox"
      className="absolute before:absolute w-[300px] bg-white shadow-[0_0_5px_rgba(0,_0,_0,_0.05)] rounded z-20 tooltip-spike-t [&>:first-child]:min-h-[100px] flex flex-col p-1 pt-3"
      ref={boxRef}>
      <BaseTextEditor onEscape={onEscape} onChange={onChange} closed={!open} onSubmit={onSubmit} />
      <p className="p-2 pt-0 text-xs italic text-gray-400">
        Submit: <kbd>Ctrl</kbd> or <kbd>Window</kbd> + <kbd>Enter</kbd>
      </p>
      <div className="flex p-2 pt-0.5 gap-3">
        <button
          type="button"
          onClick={cancelAddComment}
          data-id="CommentPlugin_CommentInputBox_Button"
          className="primaryButton py-1 font-normal rounded">
          Cancel
        </button>
        <button
          type="button"
          onClick={onClick}
          disabled={!canSubmit}
          className="secondaryButton py-1 disabled:bg-gray-100 disabled:text-gray-300 font-normal rounded"
          data-id="CommentPlugin_CommentInputBox_Button primary">
          Comment
        </button>
      </div>
    </div>
  );
}
