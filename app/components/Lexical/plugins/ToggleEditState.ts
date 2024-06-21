import { useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';


export default function ToggleEditState({ enable_edit }: { enable_edit: boolean }): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.setEditable(enable_edit);
  }, [editor, enable_edit]);

  return null;
}
