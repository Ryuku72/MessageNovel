import { useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { RootNode } from 'lexical';

export function TextLengthPlugin({ setTextLength }: { setTextLength: (length: number) => void }): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
      const textContentSize = rootNode.getTextContentSize();
      setTextLength(textContentSize);
    });
  }, [editor, setTextLength]);

  return null;
}
