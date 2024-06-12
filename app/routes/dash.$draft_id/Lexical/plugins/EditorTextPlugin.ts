import { useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';

export default function EditorTextPlugin({ setText }: { setText: (state: string) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
      const editorText = editor.getEditorState().read(() => {
        return $getRoot().getTextContent();
      });
      setText(editorText);
  }, [editor, setText]);

  return null;
}