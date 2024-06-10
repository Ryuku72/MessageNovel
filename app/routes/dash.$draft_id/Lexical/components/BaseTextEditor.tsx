import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { EditorState, LexicalEditor } from 'lexical';

import { theme } from '../config';
import EscapeHandlerPlugin from '../plugins/EscapeHandlerPlugin';
import { OnClosePlugin } from '../plugins/OnClosePlugin';
import { KeySubmitPlugin } from '../plugins/KeySubmitPlug';

export default function BaseTextEditor({
  onEscape,
  onChange,
  onSubmit,
  editorRef,
  placeholder = 'Type a comment...',
  closed = false,
}: {
  autoFocus?: boolean;
  editorRef?: { current: null | LexicalEditor };
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
  onSubmit: (editorState: EditorState, editor: LexicalEditor) => void;
  onEscape: (e: KeyboardEvent) => boolean;
  placeholder?: string;
  closed?: boolean;
}) {
  const initialConfig = {
    namespace: 'Commenting',
    nodes: [],
    onError: (error: Error) => {
      throw error;
    },
    theme: theme
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div data-id="CommentPlugin_CommentInputBox_EditorContainer" className="relative m-2 rounded flex flex-auto border border-gray-300 bg-white">
        <PlainTextPlugin
          contentEditable={
            <ContentEditable className="flex flex-col flex-auto py-2 px-2 text-gray-600 md:overflow-auto" />
          }
          placeholder={<div className="absolute top-2 z-0 px-2 pointer-events-none text-gray-400">{placeholder}</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={onChange} />
        <EscapeHandlerPlugin onEscape={onEscape} />
        <KeySubmitPlugin onSubmit={onSubmit} />
        <ClearEditorPlugin />
        <OnClosePlugin closed={closed} />
        {editorRef !== undefined && <EditorRefPlugin editorRef={editorRef} />}
      </div>
    </LexicalComposer>
  );
}
