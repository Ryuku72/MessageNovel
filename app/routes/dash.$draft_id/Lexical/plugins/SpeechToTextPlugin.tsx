import { useCallback, useEffect, useRef, useState } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { LexicalCommand, LexicalEditor, RangeSelection } from 'lexical';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  REDO_COMMAND,
  UNDO_COMMAND,
  createCommand
} from 'lexical';

const getElement = (): HTMLElement => {
  let element = document.getElementById('report-container');

  if (element === null) {
    element = document.createElement('div');
    element.id = 'report-container';
    element.style.position = 'fixed';
    element.style.top = '50%';
    element.style.left = '50%';
    element.style.fontSize = '32px';
    element.style.transform = 'translate(-50%, -50px)';
    element.style.padding = '20px';
    element.style.background = 'rgba(240, 240, 240, 0.4)';
    element.style.borderRadius = '20px';

    if (document.body) {
      document.body.appendChild(element);
    }
  }

  return element;
};

export function useReport(): (arg0: string) => ReturnType<typeof setTimeout> {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanup = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    if (document.body) {
      document.body.removeChild(getElement());
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return useCallback(
    content => {
      const element = getElement();
      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
      element.innerHTML = content;
      timer.current = setTimeout(cleanup, 1000);
      return timer.current;
    },
    [cleanup]
  );
}

export const SPEECH_TO_TEXT_COMMAND: LexicalCommand<boolean> = createCommand('SPEECH_TO_TEXT_COMMAND');

const VOICE_COMMANDS: Readonly<Record<string, (arg0: { editor: LexicalEditor; selection: RangeSelection }) => void>> = {
  '\n': ({ selection }) => {
    selection.insertParagraph();
  },
  redo: ({ editor }) => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  },
  undo: ({ editor }) => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  }
};

export default function SpeechToTextPlugin(): null {
  const [editor] = useLexicalComposerContext();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  // @ts-expect-error missing type
  const recognition = useRef<typeof SpeechRecognition | null>(null);
  const report = useReport();

  useEffect(() => {
    const SUPPORT_SPEECH_RECOGNITION: boolean = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

    if (isEnabled && recognition.current === null && SUPPORT_SPEECH_RECOGNITION) {
      // @ts-expect-error missing type
      const SpeechRecognition = window?.SpeechRecognition || window?.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.addEventListener('result', (event: typeof SpeechRecognition) => {
        const resultItem = event.results.item(event.resultIndex);
        const { transcript } = resultItem.item(0);
        report(transcript);

        if (!resultItem.isFinal) {
          return;
        }

        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            const command = VOICE_COMMANDS[transcript.toLowerCase().trim()];

            if (command) {
              command({
                editor,
                selection
              });
            } else if (transcript.match(/\s*\n\s*/)) {
              selection.insertParagraph();
            } else {
              selection.insertText(transcript);
            }
          }
        });
      });
    }

    if (recognition.current) {
      if (isEnabled) {
        recognition.current.start();
      } else {
        recognition.current.stop();
      }
    }

    return () => {
      if (recognition.current !== null) {
        recognition.current.stop();
      }
    };
  }, [editor, isEnabled, report]);

  useEffect(() => {
    return editor.registerCommand(
      SPEECH_TO_TEXT_COMMAND,
      (_isEnabled: boolean) => {
        setIsEnabled(_isEnabled);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
