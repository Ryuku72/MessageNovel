import { useEffect, useState } from 'react';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
// import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
// import { Provider } from '@lexical/yjs';
// import { Doc } from 'yjs';

import { InitialConfig } from './config';
import { MaxLengthPlugin } from './plugins/MaxLengthPlugin';
import OnChangePlugin from './plugins/OnChangePlugin';
import SpeechToTextPlugin from './plugins/SpeechToTextPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';

export function LexicalRichTextEditor({
  namespace,
  value,
  maxLength = 4200,
  username,
  color
}: {
  namespace: string;
  value: string;
  maxLength?: number;
  username: string;
  color: string;
}) {
  const initialConfig = InitialConfig(namespace, value);
  const [editorState, setEditorState] = useState('');
  const [textLength, setTextLength] = useState(0);

  useEffect(() => {
    const userColor = (color: string) => {
      switch (color) {
        case 'bg-pastel-black':
          return '211, 211, 211';
        case 'bg-pastel-red':
          return '255, 153, 153';
        case 'bg-pastel-brown':
          return '255, 204, 204';
        case 'bg-pastel-orange':
          return '255, 218, 185';
        case 'bg-pastel-indigo':
          return '153, 204, 255';
        case 'bg-pastel-blue':
          return '218, 240, 247';
        case 'bg-pastel-green':
          return '178, 223, 219';
        case 'bg-pastel-emerald':
          return '204, 255, 204';
        case 'bg-pastel-purple':
          return '204, 204, 255';
        default:
          return '255, 255, 204';
      }
    };
    
    if (color && typeof document !== 'undefined') {
      document.body.style.setProperty('--userColor', userColor(color));
    }
  }, [color]);


  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className={`rounded-sm w-full text-gray-900 font-normal text-left flex flex-col flex-auto min-h-[500px] ${!editorState ? 'overflow-hidden max-h-[600px]' : 'overflow-visible'}`}>
        <label htmlFor="lexical" className="w-full text-sm font-medium text-gray-600 mb-2">
          Body
        </label>
        <ToolbarPlugin username={username} color={color} />
        <div className="bg-white bg-opacity-65 flex flex-col flex-auto rounded-b-md md:overflow-hidden relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="flex flex-col flex-auto py-2 px-4 text-gray-600 md:overflow-auto"
                id="lexical"
              />
            }
            placeholder={
              <div className="absolute top-2 z-0 px-4 pointer-events-none text-gray-400">Enter some text...</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={setEditorState} />
          <HistoryPlugin />
          {/* <CollaborationPlugin
            id={namespace}
            providerFactory={function (id: string, yjsDocMap: Map<string, Doc>): Provider {

            //   Provider {
            //     awareness: ProviderAwareness;
            //     connect(): void | Promise<void>;
            //     disconnect(): void;
            //     off(type: 'sync', cb: (isSynced: boolean) => void): void;
            //     off(type: 'update', cb: (arg0: unknown) => void): void;
            //     off(type: 'status', cb: (arg0: {
            //         status: string;
            //     }) => void): void;
            //     off(type: 'reload', cb: (doc: Doc) => void): void;
            //     on(type: 'sync', cb: (isSynced: boolean) => void): void;
            //     on(type: 'status', cb: (arg0: {
            //         status: string;
            //     }) => void): void;
            //     on(type: 'update', cb: (arg0: unknown) => void): void;
            //     on(type: 'reload', cb: (doc: Doc) => void): void;
            // }

              console.log(id, yjsDocMap);
              return null;
            }}
            shouldBootstrap={false}
          /> */}
          <AutoFocusPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <HorizontalRulePlugin />
          <SpeechToTextPlugin />
          <ClearEditorPlugin />
          <MaxLengthPlugin maxLength={maxLength} setTextLength={setTextLength} />
          <p
            className={`sticky md:bottom-1 bottom-[90px] right-4 p-2 m-2 bg-slate-400 backdrop-blur-sm bg-opacity-50 rounded-lg text-xs self-end ${textLength < maxLength ? 'text-blue-800' : 'text-red-400'}`}>
            {textLength} / {maxLength} length
          </p>
        </div>
      </div>
      <input name="lexical" value={editorState} readOnly={true} className="hidden" />
    </LexicalComposer>
  );
}
