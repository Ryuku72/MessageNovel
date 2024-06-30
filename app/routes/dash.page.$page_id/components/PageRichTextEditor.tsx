/* eslint-disable react-hooks/exhaustive-deps */
import { useSubmit } from '@remix-run/react';

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
import { useOthers, useRoom, useStatus } from '@liveblocks/react';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';
import { Doc } from 'yjs';

import { userColor } from '~/helpers/UserColor';
import { BasicProfile } from '~/types';

import { InitialConfig } from '~/components/Lexical/config';
import CommentPlugin from '~/components/Lexical/plugins/CommentPlugin';
import { MaxLengthPlugin } from '~/components/Lexical/plugins/MaxLengthPlugin';
import OnChangePlugin from '~/components/Lexical/plugins/OnChangePlugin';
import SpeechToTextPlugin from '~/components/Lexical/plugins/SpeechToTextPlugin';
import ToggleEditState from '~/components/Lexical/plugins/ToggleEditState';
import ToolbarPlugin from '~/components/Lexical/plugins/ToolbarPlugin';

import Default_Avatar from '~/assets/default_avatar.jpeg';
import { ConnectIcon, DisconnectIcon, PrivateNovelIcon, PublicNovelIcon, SyncIcon } from '~/svg';

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
  const initialConfig = InitialConfig({ namespace, editable: enableCollab || owner });
  const [editorState, setEditorState] = useState('');
  const [textLength, setTextLength] = useState(0);
  const [toggleCollab, setToggleCollab] = useState(enableCollab);
  const [isSynced, setIsSynced] = useState(false);
  const [init, setInit] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const submit = useSubmit();

  const room = useRoom();
  const status = useStatus();
  const userInfo = {
    avatar: userData.avatar,
    color: userColor(userData.color),
    name: userData.username
  };
  const othersInfo = useOthers();
  const otherusers = othersInfo?.map(user => user.info);
  const users = [userInfo].concat(otherusers);

  useEffect(() => {
    setInit(true);
  }, []);

  useEffect(() => {
    setToggleCollab(enableCollab);
  }, [enableCollab]);

  const createProviderFactory = useCallback((id: string, yjsDocMap: Map<string, Doc>): Provider => {
    const doc = new Doc();
    yjsDocMap.set(id, doc);
    const yProvider = new LiveblocksYjsProvider(room, doc) as Provider;
    yProvider.on('sync', (status) => setIsSynced(status));
    return yProvider;
  }, []);

  const createChatProviderFactory = useCallback((id: string, yjsDocMap: Map<string, Doc>) => {
    const doc = new Doc();
    yjsDocMap.set(id, doc);
    const yProvider = new LiveblocksYjsProvider(room, doc) as Provider;
    yProvider.on('sync', (status) => setIsSynced(status));
    return yProvider;
  }, []);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className="rounded-sm w-full text-gray-900 font-normal text-left flex flex-col flex-auto min-h-[500px]">
        <p className="w-full text-sm font-medium text-gray-600 mb-2">Participants</p>
        <div className="flex gap-2 text-blue-800 items-center text-sm mb-3 max-w-[80%]">
          {users.map((user, index) => (
            <div
              key={user.name + '_' + index}
              className="text-grey-700 text-sm px-2 py-1 rounded-lg flex gap-1 flex-wrap items-center text-gray-700"
              style={{ backgroundColor: user.color }}>
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
        <ToolbarPlugin />
        <div className="bg-white bg-opacity-65 flex flex-col flex-auto rounded-b-md relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="flex flex-col flex-auto py-2 px-4 text-gray-600" id="lexical" />
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
          <ToggleEditState enable_edit={toggleCollab || owner} />
          <MaxLengthPlugin maxLength={maxLength} setTextLength={setTextLength} />
          <CommentPlugin namespace={namespace} userData={userData} providerFactory={createChatProviderFactory} />
          <div className="sticky md:bottom-3 bottom-[90px] right-4 self-end m-2 flex gap-2">
            <p
              className={`bg-slate-400 backdrop-blur-sm bg-opacity-50 px-2 flex items-center h-access rounded-lg text-xs self-end ${textLength < maxLength ? 'text-blue-800' : 'text-red-400'}`}>
              {textLength} / {maxLength} length
            </p>
            <button
              type="button"
              title={`Novel YJS ${status}`}
              className={`flex gap-2 rounded cursor-pointer w-access h-access flex-[0,0,auto] items-center justify-center pl-2 pr-3 capitalize text-gray-500 ${status === 'disconnected' || status === 'initial' ? 'bg-red-300' : status === 'connecting' ? 'bg-blue-400' : 'bg-green-300'} bg-opacity-25 backdrop-blur-sm ${!isSynced ? 'pointer-events-none' : 'pointer-events-auto'}`}
              onClick={() => (status === 'connected' ? room.disconnect() : room.connect())}>
              {!isSynced ? (
                <SyncIcon uniqueId="lexical-sync" className="w-5 h-auto animate-spin" />
              ) : status === 'disconnected' || status === 'initial' ? (
                <DisconnectIcon uniqueId="lexical-disconnect" className="w-5 h-auto" />
              ) : (
                <ConnectIcon uniqueId="lexical-connect" className="w-5 h-auto" />
              )}
            </button>
            <button
              type="button"
              disabled={!owner}
              title={`Owner has ${enableCollab ? 'enabled collabaration' : 'disabled collabaration'} `}
              className={`flex gap-2 rounded cursor-pointer h-access items-center justify-center pl-2 pr-3 capitalize ${!enableCollab ? 'bg-purple-400 text-gray-600' : 'bg-orange-500 text-gray-500'} bg-opacity-25 backdrop-blur-sm`}
              onClick={e => {
                e.preventDefault();
                const formData = new FormData();
                formData.append('enable_collab', (!enableCollab).toString());
                formData.append('page_id', namespace);
                submit(formData, { method: 'POST', action: '/api/page/enable_collab', navigate: false });
              }}>
              {enableCollab ? (
                <PublicNovelIcon uniqueId="public-novel-icon" className="w-5 h-auto -scale-x-100" />
              ) : (
                <PrivateNovelIcon uniqueId="public-novel-icon" className="w-5 h-auto -scale-x-100" />
              )}
              {enableCollab ? 'Collab' : 'Solo'}
            </button>
          </div>
        </div>
      </div>
      <input name="lexical" value={editorState} readOnly={true} className="hidden" />
    </LexicalComposer>
  );
}
