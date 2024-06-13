import { useEffect, useState } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';

export default function EditorTextPlugin() {
  const [editor] = useLexicalComposerContext();
  const [description, setDescription] = useState('');

  useEffect(() => {
    const editorText = editor.getEditorState().read(() => {
      return $getRoot().getTextContent();
    });
    setDescription(editorText);
  }, [editor]);

  const descriptionDetails = (detail: string) => {
    const first = detail.substring(1).trim();
    return first;
  };

  return (
    <div className="py-3 min-h-[160px] md:max-h-[400px] overflow-auto">
      <p className="text-6xl font-semibold py-0.5 px-2 capitalize border-4 border-gray-700 float-left mr-3 translate-y-[-0.5rem]">
        {description?.[0]}
      </p>
      <p className="w-full text-gray-700 text-sm pt-3 whitespace-pre-wrap">{descriptionDetails(description || '')}</p>
    </div>
  );
}
