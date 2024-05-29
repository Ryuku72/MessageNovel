import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, Link, useActionData, useNavigate, useNavigation, useOutletContext, useSubmit } from '@remix-run/react';

import { useEffect, useState } from 'react';

import { AuthResponse } from '@supabase/supabase-js';

import { primaryButtonClassName, secondaryButtonClassName } from '~/common/buttonFactory';
import LOCALES from '~/locales/language_en.json';

import PasswordInput from '~/components/PasswordInput';
import { PublicLayout } from '~/components/PublicLayout';
import TitleInput from '~/components/TitleInput';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import AvatarInput from './components/AvatarSelectInput';
import ColorInput from './components/ColorInput';
import { CreateAction } from './services';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export function action({ request }: ActionFunctionArgs) {
  return CreateAction(request);
}

export default function Create() {
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();
  const actionData = useActionData() as AuthResponse & { success: boolean };
  const navigationState = useNavigation();
  const submit = useSubmit();
  const navigate = useNavigate();

  const [colorSelect, setColorSelect] = useState('bg-pastel-black');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageFile, setImage] = useState<File | null>(null);

  const isLoading = ['submitting', 'loading'].includes(navigationState.state);
  const LocalStrings = LOCALES.create;

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
                <Link to="/" className={primaryButtonClassName + ' py-2.5'}>
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
