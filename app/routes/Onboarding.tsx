import { useEffect, useRef, useState } from 'react';

import { type ActionFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Form, Link, json, useActionData, useNavigation, useOutletContext, useSubmit } from '@remix-run/react';
import { AuthResponse } from '@supabase/supabase-js';

import { initServer } from '~/helpers/supabase';

import AvatarInput from '~/components/AvatarSelectInput';
import ColorInput from '~/components/ColorInput';
import PasswordInput from '~/components/PasswordInput';
import TitleInput from '~/components/TitleInput';
import { ToastAlert } from '~/components/ToastAlert';
import LOCALES from '~/locales/language_en.json';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import Default_Avatar from '~/assets/default_avatar.jpeg';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export async function action({ request }: ActionFunctionArgs) {
  const { supabaseClient, headers } = await initServer(request);
  const body = await request.formData();
  const avatar = body.get('onboarding-avatar') as File;
  const email = body.get('onboarding-email') as string;
  const password = body.get('onboarding-password') as string;
  const username = body.get('onboarding-username') as string;
  const color = body.get('onboarding-color-select') as string;
  const filename = avatar?.name;

  const userData = await supabaseClient?.auth?.getUser();

  if (!userData?.data.user) {
    const auth = await supabaseClient.auth.signUp({
      email,
      password
    });
    if (auth.error) json(auth, { headers });
    return json({ success: false }, { headers });
  } else {
    if (userData.data?.user) {
      const extension = avatar.name.split('.').at(-1);
      if (filename) {
        const image = await supabaseClient.storage
          .from('assets')
          .upload(`/${userData.data.user?.id}/avatar.${extension}`, avatar);
        if (image.error) json(image, { headers });
      }

      const update = await supabaseClient.auth.updateUser({
        data: {
          avatar: filename ? `assets/${userData.data.user?.id}/avatar.${extension}` : '',
          username,
          color
        }
      });
      if (update.error) json(update, { headers });

      const profile = await supabaseClient
        .from('profiles')
        .insert({
          id: userData.data.user?.id,
          email,
          created_at: userData.data.user?.created_at,
          updated_at: userData.data.user?.updated_at,
          avatar: filename ? `assets/${userData.data.user?.id}/avatar.${extension}` : '',
          username,
          color
        })
        .select();
      if (profile.error) return json(profile, { headers });
      return json({ success: true }, { headers });
    }
  }
}

export default function Onboarding() {
  const LocalStrings = LOCALES.onboarding;
  const { sceneReady } = useOutletContext() as { sceneReady: boolean };
  const navigationState = useNavigation();
  const submit = useSubmit();
  const actionData = useActionData() as AuthResponse & { success: boolean };

  const [viewImage, setViewImage] = useState(Default_Avatar);
  const [colorSelect, setColorSelect] = useState('#aeaeae');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const formRef = useRef<HTMLFormElement | null>(null);

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
      submit(formRef.current, { method: 'post', encType: 'multipart/form-data' });
    } else if (actionData?.success) {
      const sceneEvent = new CustomEvent('alertFromError', {
        detail: 'Profile Created'
      });
      window.dispatchEvent(sceneEvent);
    }
  }, [actionData, submit]);

  const handleOnImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const [target] = e.target.files;
    const imageURL = URL.createObjectURL(target);
    setViewImage(imageURL);
  };

  return (
    <div className="flex flex-col flex-auto relative w-full h-full">
      <div className="flex flex-col m-auto py-20 px-3">
        <h1 className="text-red-800 text-4xl text-center m-0 [text-shadow:_5px_3px_2px_rgb(107_114_128_/_50%)] font-medium font-miltonian">
          {LocalStrings.title}
        </h1>
        <div className="p-4 max-w-full">
          <Form
            ref={formRef}
            method="post"
            className="w-full max-w-lg flex flex-col justify-center items-center gap-3 rounded-lg shadow-xl px-12 py-8 bg-white bg-opacity-35 backdrop-blur-sm">
            <fieldset disabled={isLoading}>
              <div className="flex gap-6 flex-wrap justify-center items-center">
                <AvatarInput
                  title={LocalStrings.avatar}
                  id="onboarding-avatar"
                  value={viewImage}
                  onChange={handleOnImageChange}
                />
                <ColorInput
                  title={LocalStrings.color}
                  id="onboarding-color-select"
                  value={colorSelect}
                  onChange={setColorSelect}
                />
              </div>
              <TitleInput
                title={LocalStrings.username}
                id="onboarding-username"
                value={username}
                placeholder={LocalStrings.username_placeholder}
                onChange={setUsername}
              />
              <TitleInput
                title={LocalStrings.email}
                id="onboarding-email"
                placeholder={LocalStrings.email_placeholder}
                value={email}
                onChange={setEmail}
                type="email"
              />
              <PasswordInput
                title={LocalStrings.password}
                id="onboarding-password"
                placeholder={LocalStrings.password_placeholder}
                value={password}
                onChange={setPassword}
              />

              <div className="w-full flex items-center gap-3 justify-center pt-3">
                <Link
                  to="/"
                  className="rounded-lg h-10 px-4 text-gray-100 w-full max-w-button bg-orange-400 hover:bg-orange-500 flex items-center justify-center">
                  {LocalStrings.secondary_button}
                </Link>
                <button
                  type="submit"
                  className="rounded-lg h-10 px-4 w-full max-w-button text-gray-100 bg-blue-500 hover:bg-green-500 flex items-center justify-center font-mono"
                  disabled={isLoading}>
                  {isLoading ? (
                    <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="onboarding-loading" />
                  ) : (
                    LocalStrings.primary_button
                  )}
                </button>
              </div>
            </fieldset>
          </Form>
        </div>
      </div>
      <ToastAlert />
    </div>
  );
}
