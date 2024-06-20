import { useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_CRITICAL, EditorState, INSERT_PARAGRAPH_COMMAND, KEY_ENTER_COMMAND, LexicalEditor } from 'lexical';

export function KeySubmitPlugin({ onSubmit }: { onSubmit: (editorState: EditorState, editor: LexicalEditor) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.registerCommand<KeyboardEvent | null>(
      KEY_ENTER_COMMAND,
      event => {
        if (event !== null) {
          event.preventDefault();
          if (event.ctrlKey || event.metaKey) onSubmit(editor._editorState, editor);
        }

        return editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND, undefined);
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, onSubmit]);

  return null;
}
