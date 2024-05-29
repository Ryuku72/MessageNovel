import { useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export type OnChangePluginProps = { onChange: (state: string) => void };

export default function OnChangePlugin({ onChange }: OnChangePluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
        const editorStateJSON = editorState.toJSON();
      onChange(JSON.stringify(editorStateJSON));
    });
  }, [editor, onChange]);

  return null;
}
