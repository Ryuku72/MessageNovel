import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import {
  Form,
  Link,
  json,
  useActionData,
  useNavigate,
  useNavigation,
  useOutletContext,
  useSubmit
} from '@remix-run/react';

import { useEffect, useState } from 'react';

import { AuthResponse } from '@supabase/supabase-js';

import { initServer } from '~/services/API';
import { ActionCreateProfile, ActionSignUpUser, LoadAuthUser, ProfileBodyEntry } from '~/services/Auth';

import { primaryButtonClassName, secondaryButtonClassName } from '~/common/buttonFactory';
import LOCALES from '~/locales/language_en.json';

import AvatarInput from '~/components/AvatarSelectInput';
import ColorInput from '~/components/ColorInput';
import PasswordInput from '~/components/PasswordInput';
import { PublicLayout } from '~/components/PublicLayout';
import TitleInput from '~/components/TitleInput';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

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

  const supabase = await initServer(request);
  const authUser = await LoadAuthUser(supabase);
  if (!authUser.email || authUser.email !== email) {
    const user = ActionSignUpUser({ ...supabase, email, password });
    return json(user, { headers: supabase.headers });
  } else {
    const body: ProfileBodyEntry = {
      avatar,
      email,
      username,
      color
    };
    const user = ActionCreateProfile({
      ...supabase,
      userId: authUser.id,
      created_at: authUser.created_at,
      updated_at: authUser.updated_at || '',
      body
    });
    return json(user, { headers: supabase.headers });
  }
}

export default function Create() {
  const LocalStrings = LOCALES.create;
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
    <PublicLayout>
      <div className="flex flex-col m-auto gap-4 w-full">
        <h1 className="text-red-700 text-5xl text-center m-0 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
          {LocalStrings.title}
        </h1>
        <div className="max-w-full self-center">
          <Form
            aria-label="create-account"
            method="post"
            className="w-full max-w-lg flex rounded-lg shadow-xl px-12 max-[768px]:p-4 py-8 bg-white bg-opacity-35 backdrop-blur-sm">
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
                <Link to="/" className={primaryButtonClassName}>
                  {LocalStrings.primary_button}
                </Link>
                <button
                  className={`${secondaryButtonClassName} ${isLoading ? 'py-0.5' : 'py-2.5'}`}
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
      </div>
    </PublicLayout>
  );
}
