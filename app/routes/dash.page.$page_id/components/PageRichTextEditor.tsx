/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { Provider } from '@lexical/yjs';
import { useOthers, useRoom, useSelf, useStatus } from '@liveblocks/react';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';
import { Doc } from 'yjs';

import { BasicProfile } from '~/types';

import { InitialConfig } from '~/components/Lexical/config';
import CommentPlugin from '~/components/Lexical/plugins/CommentPlugin';
import { MaxLengthPlugin } from '~/components/Lexical/plugins/MaxLengthPlugin';
import OnChangePlugin from '~/components/Lexical/plugins/OnChangePlugin';
import SpeechToTextPlugin from '~/components/Lexical/plugins/SpeechToTextPlugin';
import ToggleEditState from '~/components/Lexical/plugins/ToggleEditState';
import ToolbarPlugin from '~/components/Lexical/plugins/ToolbarPlugin';

import Default_Avatar from '~/assets/default_avatar.jpeg';

export type ActiveUserProfile = Omit<BasicProfile, 'id'> & { userId: string };

function initialEditorState(): void {
  const root = $getRoot();
  const paragraph = $createParagraphNode();
  const text = $createTextNode();
  paragraph.append(text);
  root.append(paragraph);
}

export function PageRichTextEditor({
  namespace,
  maxLength = 4200,
  userData,
  enableCollab,
  owner
}: {
  namespace: string;
  maxLength?: number;
  enableCollab: boolean;
  userData: ActiveUserProfile;
  owner: boolean;
}) {
  const initialConfig = InitialConfig({ namespace, editable: enableCollab });
  const [editorState, setEditorState] = useState('');
  const [textLength, setTextLength] = useState(0);
  const [init, setInit] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const room = useRoom();
  const status = useStatus();
  const userInfo = useSelf(me => me.info) as { avatar: string; color: string; name: string } || [];
  const othersInfo = useOthers();
  const otherusers = othersInfo?.map(user => user.info) as { avatar: string; color: string; name: string }[];
  const users = [userInfo].concat(otherusers);

  useEffect(() => {
    setInit(true);
  }, []);

  const createProviderFactory = useCallback((id: string, yjsDocMap: Map<string, Doc>): Provider => {
    const doc = new Doc();
    yjsDocMap.set(id, doc);
    const yProvider = new LiveblocksYjsProvider(room, doc) as Provider;
    return yProvider;
  }, []);

  const createChatProviderFactory = useCallback((id: string, yjsDocMap: Map<string, Doc>) => {
    const doc = new Doc();
    yjsDocMap.set(id, doc);
    const yProvider = new LiveblocksYjsProvider(room, doc) as Provider;
    return yProvider;
  }, []);


  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className={`rounded-sm w-full text-gray-900 font-normal text-left flex flex-col flex-auto min-h-[500px] ${!editorState ? 'overflow-hidden max-h-[500px]' : 'overflow-visible'}`}>
        <p className="w-full text-sm font-medium text-gray-600 mb-2">Participants</p>
        <div className="flex gap-2 text-blue-800 items-center text-sm mb-3 max-w-[80%]">
          {users.map((user, index) => (
            <div
              key={user.name + '_' + index}
              className="text-grey-700 text-sm px-2 py-1 rounded-lg flex gap-1 flex-wrap items-center text-gray-700" style={{ backgroundColor: user.color }}>
              <img
                src={user?.avatar || Default_Avatar}
                className="rounded-full w-4 h-4"
                alt="user-avatar"
                onError={e => {
                  e.currentTarget.src = Default_Avatar;
                  e.currentTarget.onerror = null;
                  return e;
                }}
              />
              {user.name}
            </div>
          ))}
        </div>
        <label htmlFor="lexical" className="w-full text-sm font-medium text-gray-600 mb-2">
          Body
        </label>
        <ToolbarPlugin
          enableCollab={enableCollab}
          status={status}
          owner={owner}
          handleConnectionToggle={() => status === 'connected' ? room.disconnect() : room.connect()}
        />
        <div className="bg-white bg-opacity-65 flex flex-col flex-auto rounded-b-md md:overflow-hidden relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="flex flex-col flex-auto py-2 px-4 text-gray-600 md:overflow-auto"
                id="lexical"
              />
            }
            placeholder={
              <div className="absolute top-2 z-0 px-4 pointer-events-none text-gray-400">Enter some text...</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={setEditorState} />
          {/* Only using init because Collabration Plugin references document */}
          {init && (
            <CollaborationPlugin
              id={namespace + '_room'}
              providerFactory={createProviderFactory}
              cursorColor={userInfo?.color}
              username={userInfo?.name}
              cursorsContainerRef={containerRef}
              initialEditorState={initialEditorState}
              shouldBootstrap={true}
            />
          )}
          <AutoFocusPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <HorizontalRulePlugin />
          <SpeechToTextPlugin />
          <ClearEditorPlugin />
          <ToggleEditState enable_edit={enableCollab} />
          <MaxLengthPlugin maxLength={maxLength} setTextLength={setTextLength} />
            <CommentPlugin
              namespace={namespace}
              userData={userData}
              providerFactory={createChatProviderFactory}
            />
          <p
            className={`sticky md:bottom-1 bottom-[90px] right-4 p-2 m-2 bg-slate-400 backdrop-blur-sm bg-opacity-50 rounded-lg text-xs self-end ${textLength < maxLength ? 'text-blue-800' : 'text-red-400'}`}>
            {textLength} / {maxLength} length
          </p>
        </div>
      </div>
      <input name="lexical" value={editorState} readOnly={true} className="hidden" />
    </LexicalComposer>
  );
}
