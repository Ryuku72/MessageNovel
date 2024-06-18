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
import { SupabaseClient } from '@supabase/supabase-js';
import { Doc } from 'yjs';

import { InitialConfig } from './config';
import { getDocFromMap } from './helpers';
import SupabaseProvider from './helpers/provider';
import CommentPlugin from './plugins/CommentPlugin';
import { MaxLengthPlugin } from './plugins/MaxLengthPlugin';
import OnChangePlugin from './plugins/OnChangePlugin';
import SpeechToTextPlugin from './plugins/SpeechToTextPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';

export type ActiveUserProfile = { userId: string; username: string; color: string; avatar: string };

export function LexicalRichTextEditor({
  namespace,
  maxLength = 4200,
  userData,
  supabase,
  collab
}: {
  namespace: string;
  maxLength?: number;
  userData: {
    username: string;
    color: string;
    avatar: string;
    userId: string;
  };
  supabase: SupabaseClient;
  collab: number[];
}) {
  const initialConfig = InitialConfig(namespace, null);
  const [editorState, setEditorState] = useState('');
  const [textLength, setTextLength] = useState(0);
  const [activeUsers, setActiveUsers] = useState<ActiveUserProfile[]>([]);
  const [yjsProvider, setYjsProvider] = useState<SupabaseProvider>();
  const [yjsChatProvider, setYjsChatProvider] = useState<SupabaseProvider>();
  const [init, setInit] = useState(false);
  const [novelStatus, setNovelStatus] = useState('disconnected');
  const [chatStatus, setChatStatus] = useState('disconnect');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const updateRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInit(true);

    return () => {
      if (yjsProvider) (yjsProvider as unknown as SupabaseProvider).destroy();
      if (updateRef.current) clearTimeout(updateRef.current);
    };
  }, []);

  useEffect(() => {
    if (!yjsProvider) return;

    const handleOnlineUsers = (
      users: { [key: string]: { userId: string; username: string; color: string; avatar: string } }[]
    ) => {
      if (updateRef.current) clearTimeout(updateRef.current);
      if (!users) return;
      const result = users.flatMap(group => Object.values(group).flat());
      updateRef.current = setTimeout(() => setActiveUsers(result), 300);
    };

    (yjsProvider as unknown as SupabaseProvider).on('online users', handleOnlineUsers);

    return () => {
      (yjsProvider as unknown as SupabaseProvider).off('online users', handleOnlineUsers);
    };
  }, [yjsProvider]);

  useEffect(() => {
    if (userData.color && typeof document !== 'undefined') {
      document.body.style.setProperty('--userColor', userColor(userData.color));
    }
  }, [userData.color]);

  const handleConnectionToggle = (provider: SupabaseProvider, status: string) => {
    if (status === 'connected') provider.onDisconnect();
    else if (status === 'disconnected') provider.onConnecting();
  };

  const createProviderFactory = useCallback((id: string, yjsDocMap: Map<string, Doc>): Provider => {
    const doc = getDocFromMap(id, yjsDocMap);
    const provider = new SupabaseProvider(doc, supabase, {
      tableName: 'draft_novel',
      id: namespace,
      channel: namespace + '_collab',
      columnName: 'collab',
      enableLogger: false,
      resyncInterval: 30000,
      initialData: collab,
      userData
    });

    provider.on('status', (event: { status: string }) => {
      if (event.status) setNovelStatus(event.status);
    });

    // This is a hack to get reference to provider with standard CollaborationPlugin.
    // To be fixed in future versions of Lexical.
    setTimeout(() => setYjsProvider(provider), 0);

    return provider as unknown as Provider;
  }, []);

  const createChatProviderFactory = useCallback((id: string, yjsDocMap: Map<string, Doc>) => {
    const doc = getDocFromMap(id, yjsDocMap);
    const provider = new SupabaseProvider(doc, supabase, {
      tableName: 'draft_novel',
      id: namespace,
      channel: namespace + '_comments',
      columnName: 'comments',
      enableLogger: false,
      resyncInterval: 600000,
      userData
    });

    provider.on('status', (event: { status: string }) => {
      if (event.status) setChatStatus(event.status);
    });

    setTimeout(() => setYjsChatProvider(provider), 0);
    return provider as unknown as Provider;
  }, []);

  const userColor = (color: string) => {
    switch (color) {
      case 'bg-pastel-black':
        return '211, 211, 211';
      case 'bg-pastel-red':
        return '255, 153, 153';
      case 'bg-pastel-brown':
        return '255, 204, 204';
      case 'bg-pastel-orange':
        return '255, 218, 185';
      case 'bg-pastel-indigo':
        return '153, 204, 255';
      case 'bg-pastel-blue':
        return '218, 240, 247';
      case 'bg-pastel-green':
        return '178, 223, 219';
      case 'bg-pastel-emerald':
        return '204, 255, 204';
      case 'bg-pastel-purple':
        return '204, 204, 255';
      default:
        return '255, 255, 204';
    }
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className={`rounded-sm w-full text-gray-900 font-normal text-left flex flex-col flex-auto min-h-[500px] ${!editorState ? 'overflow-hidden max-h-[600px]' : 'overflow-visible'}`}>
        <p className="w-full text-sm font-medium text-gray-600 mb-2">Participants</p>
        <div className="flex gap-2 text-blue-800 items-center text-sm mb-3 max-w-[80%]">
          {activeUsers.map(user => (
            <div
              key={user.userId}
              className={`text-grey-700 text-sm ${user.color} px-2 py-1 rounded-lg flex gap-1 flex-wrap items-center text-gray-700`}>
              <img src={user.avatar} className="rounded-full w-4 h-4" alt="user-avatar" />
              {user.username}
            </div>
          ))}
        </div>
        <label htmlFor="lexical" className="w-full text-sm font-medium text-gray-600 mb-2">
          Body
        </label>
        <ToolbarPlugin status={novelStatus} handleConnectionToggle={() => yjsProvider && handleConnectionToggle(yjsProvider, novelStatus)} />
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
              id={namespace}
              providerFactory={createProviderFactory}
              username={userData?.username}
              cursorColor={`rgb(${userColor(userData?.color)})`}
              cursorsContainerRef={containerRef}
              shouldBootstrap={false}
            />
          )}
          <AutoFocusPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <HorizontalRulePlugin />
          <SpeechToTextPlugin />
          <ClearEditorPlugin />
          <MaxLengthPlugin maxLength={maxLength} setTextLength={setTextLength} />
          <CommentPlugin userData={userData} providerFactory={createChatProviderFactory} status={chatStatus} handleConnectionToggle={() => yjsChatProvider && handleConnectionToggle(yjsChatProvider, chatStatus)}  />
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
