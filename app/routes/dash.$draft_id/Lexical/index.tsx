import { useState } from 'react';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin,  } from '@lexical/react/LexicalRichTextPlugin';

import { InitialConfig } from './config';
import OnChangePlugin from './plugins/OnChangePlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import SpeechToTextPlugin from './plugins/SpeechToTextPlugin';
import { MaxLengthPlugin } from './plugins/MaxLengthPlugin';

export function LexicalRichTextEditor({ namespace, value, maxLength = 4200 }: { namespace: string; value: string; maxLength?: number }) {
  const initialConfig = InitialConfig(namespace, value);
  const [editorState, setEditorState] = useState('');
  const [textLength, setTextLength] = useState(0);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={`rounded-sm w-full text-gray-900 font-normal text-left flex flex-col flex-auto min-h-[500px] ${!editorState ? 'overflow-hidden max-h-[600px]' : 'overflow-visible'}`}>
        <label htmlFor="lexical" className="w-full text-sm font-medium text-gray-600 mb-2">
          Body
        </label>
        <ToolbarPlugin />
        <div className="bg-white bg-opacity-65 flex flex-col flex-auto rounded-b-md min-[768px]:overflow-hidden relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="flex flex-col flex-auto py-2 px-4 text-gray-600 min-[768px]:overflow-auto" id="lexical" />
            }
            placeholder={
              <div className="absolute top-2 z-0 px-4 pointer-events-none text-gray-400">Enter some text...</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={setEditorState} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <HorizontalRulePlugin />
          <SpeechToTextPlugin />
          <MaxLengthPlugin maxLength={maxLength} setTextLength={setTextLength} />
          <p className={`sticky bottom-1 max-[768px]:bottom-[90px] right-4 p-2 m-2 bg-slate-400 backdrop-blur-sm bg-opacity-50 rounded-lg text-xs self-end ${textLength < maxLength ? 'text-blue-800' : 'text-red-400'}`}>
            {textLength} / {maxLength} length 
          </p>
        </div>
      </div>
      <input name="lexical" value={editorState} readOnly={true} className="hidden" />
    </LexicalComposer>
  );
}
