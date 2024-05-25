import { useEffect, useState } from 'react';

import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, json, Link, useActionData, useNavigation, useOutletContext } from '@remix-run/react';
import { AuthTokenResponsePassword } from '@supabase/supabase-js';

import PasswordInput from '~/components/PasswordInput';
import { PublicLayout } from '~/components/PublicLayout';
import TitleInput from '~/components/TitleInput';
import LOCALES from '~/locales/language_en.json';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import { LoginAuthUser } from '~/services/Auth';
import { primaryButtonClassName, secondaryButtonClassName } from '~/components/common/buttonFactory';
import { initServer } from '~/services/API';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export async function action({ request }: ActionFunctionArgs) {
  const supabase = await initServer(request);
  const body = await request.formData();
  const email = body.get('user-email') as string;
  const password = body.get('user-password') as string;

  const response = await LoginAuthUser({ ...supabase, email, password });
  return json(response.user, { headers: supabase.headers });
}

export default function Login() {
  const LocalStrings = LOCALES.login;
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();
  const navigationState = useNavigation();
  const actionData = useActionData() as AuthTokenResponsePassword;

  const [signInValue, setSignInValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const isLoading = navigationState.state === 'submitting';

  useEffect(() => {
    if (!sceneReady) return;

    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 3
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  useEffect(() => {
    if (!actionData) return;
    if (actionData?.error) {
      const sceneEvent = new CustomEvent('alertFromError', {
        detail: actionData.error?.message || actionData.error?.code || 'Incorrect Email or Password'
      });
      window.dispatchEvent(sceneEvent);
    }
  }, [actionData]);

  return (
    <PublicLayout>
      <div className="flex justify-center items-center gap-3 flex-col w-full max-w-c-600 flex-auto">
        <h1 className="text-red-700 text-6xl m-0 font-mono text-center font-miltonian [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)]">
          {LOCALES.login.title}
        </h1>
        <Form
          aria-label="login"        
          method="post"
          className="flex w-full flex-col gap-3 bg-white bg-opacity-25 backdrop-blur-sm rounded-lg shadow-xl px-8 py-6">
          <fieldset className="w-full flex flex-col justify-center items-center gap-3" disabled={isLoading}>
            <TitleInput
              title="Email"
              type="email"
              id="user-email"
              value={signInValue}
              onChange={setSignInValue}
              placeholder="jojo@email.com"
            />
            <PasswordInput
              title="Password"
              id="user-password"
              value={passwordValue}
              onChange={setPasswordValue}
              placeholder="****"
            />
            <div className="w-full flex items-center gap-3 justify-center pt-3">
              <Link
                to="/"
                className={primaryButtonClassName}>
                {LocalStrings.primary_button}
              </Link>
              <button
                className={`${isLoading ? 'py-0.5 ' : 'py-2.5 '} ${secondaryButtonClassName}`}
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
    </PublicLayout>
  );
}
