import { useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { CLEAR_EDITOR_COMMAND } from 'lexical';

export function OnClosePlugin({ closed }: { closed: boolean }): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (closed) {
      editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    }
  }, [closed, editor]);

  return null;
}
