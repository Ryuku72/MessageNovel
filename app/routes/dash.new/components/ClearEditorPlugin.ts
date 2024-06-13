import { useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TextNode } from 'lexical';

export function ClearEditorPlugin({ clearCondition, value }: { clearCondition: boolean; value: string }): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerNodeTransform(TextNode, (rootNode: TextNode) => {
      const textContent = rootNode.getTextContent();
      if (textContent !== value && clearCondition) rootNode.setTextContent('');
    });
  }, [editor, clearCondition, value]);

  return null;
}
