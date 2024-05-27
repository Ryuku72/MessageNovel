import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { useActionData, useNavigate, useNavigation, useOutletContext, useSubmit } from '@remix-run/react';

import { useEffect, useState } from 'react';

import { AuthResponse } from '@supabase/supabase-js';

import LOCALES from '~/locales/language_en.json';

import { CreateAction } from './services';
import CreateView from './view';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export function action({ request }: ActionFunctionArgs) {
  return CreateAction(request);
}

export default function Create() {
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();
  const navigationState = useNavigation();
  const submit = useSubmit();
  const actionData = useActionData() as AuthResponse & { success: boolean };
  const navigate = useNavigate();

  const [colorSelect, setColorSelect] = useState('bg-pastel-black');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageFile, setImage] = useState<File | null>(null);

  const isLoading = navigationState.state === 'submitting';

  useEffect(() => {
    if (!sceneReady) return;
    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 2
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  useEffect(() => {
    if (!actionData) return;
    if (actionData?.error) {
      const sceneEvent = new CustomEvent('alertFromError', {
        detail: actionData.error?.message || actionData.error.code
      });
      window.dispatchEvent(sceneEvent);
    } else if (!actionData?.success) {
      const formData = new FormData();
      if (imageFile) formData.append('avatar', imageFile);
      formData.append('username', username);
      formData.append('color', colorSelect);
      formData.append('create-email', email);
      formData.append('create-password', password);

      submit(formData, { method: 'post', encType: 'multipart/form-data' });
    } else if (actionData?.success) {
      const sceneEvent = new CustomEvent('alertFromError', {
        detail: 'Profile Created'
      });
      window.dispatchEvent(sceneEvent);
      navigate('/dash');
    }
  }, [actionData, colorSelect, email, imageFile, navigate, password, submit, username]);

  return (
    <CreateView
      isLoading={isLoading}
      setColorSelect={setColorSelect}
      colorSelect={colorSelect}
      setUsername={setUsername}
      username={username}
      setEmail={setEmail}
      email={email}
      setPassword={setPassword}
      password={password}
      setImage={setImage}
    />
  );
}
