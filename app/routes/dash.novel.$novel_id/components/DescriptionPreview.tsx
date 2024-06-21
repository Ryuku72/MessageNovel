import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { SerializedEditorState, SerializedLexicalNode } from 'lexical';

import { InitialConfig } from '~/components/Lexical/config';

export function DescriptionPreview({ editorState }: { editorState: SerializedEditorState<SerializedLexicalNode> | null }) {
  const initialConfig = InitialConfig('description-preview', editorState, false);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="flex flex-col flex-auto py-2 text-gray-600 em:text-base" id="lexical" />
        }
        placeholder={
          <div className="absolute top-2 z-0 pointer-events-none text-base text-gray-600">Current nothing has been published by the owner...</div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
}
