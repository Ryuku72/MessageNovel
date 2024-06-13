import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';

import { emptyContent } from '~/routes/dash.$draft_id/Lexical/helpers';
import OnChangePlugin from '~/routes/dash.$draft_id/Lexical/plugins/OnChangePlugin';
import { TextLengthPlugin } from '~/routes/dash.$draft_id/Lexical/plugins/TextLengthPlugin';

export type PlainTextEditorProps = {
  title: string;
  id: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  limit?: number;
  textLength: number;
  setTextLength: (length: number) => void;
};

export default function PlainTextEditor({
  title,
  id,
  value,
  placeholder,
  onChange,
  limit = 500,
  setTextLength,
  textLength
}: PlainTextEditorProps) {
  const initialConfig = {
    namespace: id,
    editorState: value || emptyContent,
    nodes: [],
    onError: (error: Error) => {
      throw error;
    },
    theme: {
      paragraph: 'text-gray-700'
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 font-mono">
      <label htmlFor={id} className="w-full text-sm font-medium text-gray-600">
        {title}{' '}
        <span className="text-xs font-medium text-gray-500">{`(Minimium 120 and Maximium ${limit} characters)`}</span>
      </label>
      <div className="relative flex overflow-hidden border rounded-lg border-grey-300 p-1 bg-white">
        <LexicalComposer initialConfig={initialConfig}>
          <div data-id="CommentPlugin_CommentInputBox_EditorContainer" className="relative flex flex-auto">
            <PlainTextPlugin
              contentEditable={
                <ContentEditable
                  className="w-full text-base font-normal p-3 h-[400px] overflow-y-auto text-gray-500"
                />
              }
              placeholder={
                <div className="absolute top-3 left-1 z-0 px-2 pointer-events-none text-gray-400">{placeholder}</div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <TextLengthPlugin setTextLength={setTextLength} />
            <OnChangePlugin onChange={onChange} />
          </div>
          <input className="hidden" readOnly={true} value={value} name={id} />
        </LexicalComposer>
        <p
          className={`absolute bottom-3 right-3 p-2 m-2 bg-slate-400 backdrop-blur-sm bg-opacity-20 rounded-lg text-xs self-end ${textLength >= 120 ? 'text-blue-800' : 'text-red-400'}`}>
          {textLength} / 120 length
        </p>
      </div>
    </div>
  );
}
