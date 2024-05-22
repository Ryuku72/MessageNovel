import { useEffect, useState } from 'react';

import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, Link, useActionData, useNavigation, useOutletContext } from '@remix-run/react';
import { AuthTokenResponsePassword } from '@supabase/supabase-js';

import PasswordInput from '~/components/PasswordInput';
import PublicNavBar from '~/components/PublicNavBar';
import TitleInput from '~/components/TitleInput';
import LOCALES from '~/locales/language_en.json';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';
import { LoginAuthUser } from '~/services/Auth';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const email = body.get('index-signin') as string;
  const password = body.get('index-password') as string;

 const response = await LoginAuthUser({ request, body: { email, password }});
 return response;
}

export default function Login() {
  const LocalStrings = LOCALES.login;
  const { sceneReady } = useOutletContext() as { sceneReady: boolean };
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
    <div className="w-full h-full flex justify-center items-center flex-col flex-auto absolute">
      <PublicNavBar />
      <div className="p-12 flex justify-center items-center gap-3 flex-col w-full max-w-c-600 flex-auto">
        <h1 className="text-red-700 text-6xl m-0 font-mono text-center font-miltonian [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)]">
          {LOCALES.login.title}
        </h1>
        <Form
          method="post"
          className="flex w-full flex-col gap-3 bg-white bg-opacity-25 backdrop-blur-sm rounded-lg shadow-xl px-8 py-6">
          <fieldset className="w-full flex flex-col justify-center items-center gap-3" disabled={isLoading}>
            <TitleInput
              title="Email"
              type="email"
              id="index-signin"
              value={signInValue}
              onChange={setSignInValue}
              placeholder="jojo@email.com"
            />
            <PasswordInput
              title="Password"
              id="index-password"
              value={passwordValue}
              onChange={setPasswordValue}
              placeholder="****"
            />
            <div className="w-full flex items-center gap-3 justify-center pt-3">
              <Link
                to="/"
                className="rounded-lg px-5 py-2.5 text-gray-100 bg-orange-400 hover:bg-orange-500 flex items-center justify-center w-full max-w-button">
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
    </div>
  );
}
