import { useEffect, useState } from 'react';

import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, Link, useActionData, useNavigate, useNavigation, useOutletContext, useSubmit } from '@remix-run/react';
import { AuthResponse } from '@supabase/supabase-js';

import AvatarInput from '~/components/AvatarSelectInput';
import ColorInput from '~/components/ColorInput';
import PasswordInput from '~/components/PasswordInput';
import PublicNavBar from '~/components/PublicNavBar';
import TitleInput from '~/components/TitleInput';
import { ToastAlert } from '~/components/ToastAlert';
import LOCALES from '~/locales/language_en.json';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import { ActionAuthUser, UserParamsEntry } from '~/services/Auth';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData();
  const email = data.get('create-email') as string;
  const password = data.get('create-password') as string;
  const avatar = data.get('avatar') as File;
  const username = data.get('username') as string;
  const color = data.get('color') as string;

  const body: UserParamsEntry = {
    avatar,
    email,
    password,
    username,
    color
  };

  return ActionAuthUser({ request, body });
}

export default function Create() {
  const LocalStrings = LOCALES.create;
  const { sceneReady } = useOutletContext() as { sceneReady: boolean };
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
    <div className="flex flex-col flex-auto relative w-full h-full">
      <PublicNavBar />
      <div className="flex flex-col m-auto py-20 px-3">
        <h1 className="text-red-700 text-5xl text-center m-0 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
          {LocalStrings.title}
        </h1>
        <div className="p-4 max-w-full">
          <Form
            method="post"
            className="w-full max-w-lg flex rounded-lg shadow-xl px-12 py-8 bg-white bg-opacity-35 backdrop-blur-sm">
            <fieldset className="w-full flex flex-col justify-center items-center gap-3" disabled={isLoading}>
              <div className="flex gap-6 flex-wrap justify-center items-center">
                <AvatarInput title={LocalStrings.avatar} id="create-avatar" setImage={setImage} />
                <ColorInput
                  title={LocalStrings.color}
                  id="create-color-select"
                  value={colorSelect}
                  onChange={setColorSelect}
                />
              </div>
              <TitleInput
                title={LocalStrings.username}
                id="create-username"
                value={username}
                placeholder={LocalStrings.username_placeholder}
                onChange={setUsername}
              />
              <TitleInput
                title={LocalStrings.email}
                id="create-email"
                placeholder={LocalStrings.email_placeholder}
                value={email}
                onChange={setEmail}
                type="email"
              />
              <PasswordInput
                title={LocalStrings.password}
                id="create-password"
                placeholder={LocalStrings.password_placeholder}
                value={password}
                onChange={setPassword}
              />
              <div className="w-full flex items-center gap-3 justify-center pt-3">
                <Link
                  to="/"
                  className="rounded-lg px-5 py-2.5 text-gray-100 w-full max-w-button bg-orange-400 hover:bg-orange-500 flex items-center justify-center">
                  {LocalStrings.primary_button}
                </Link>
                <button
                  className={`${isLoading ? 'py-0.5' : 'py-2.5'} rounded-lg px-5 text-gray-100 bg-blue-500 hover:bg-green-500 w-full max-w-button flex items-center justify-center`}
                  type="submit"
                  disabled={false}>
                  {isLoading ? (
                    <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
                  ) : (
                    LocalStrings.secondary_button
                  )}
                </button>
              </div>
            </fieldset>
          </Form>
        </div>
        <ToastAlert />
      </div>
    </div>
  );
}
