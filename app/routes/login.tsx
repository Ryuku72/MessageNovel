import { useEffect, useState } from 'react';

import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, Link, json, redirect, useActionData, useNavigation, useOutletContext } from '@remix-run/react';
import { AuthTokenResponsePassword } from '@supabase/supabase-js';

import { initServer } from '~/helpers/supabase';

import PasswordInput from '~/components/PasswordInput';
import TitleInput from '~/components/TitleInput';
import LOCALES from '~/locales/language_en.json';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const email = body.get('index-signin') as string;
  const password = body.get('index-password') as string;

  const { supabaseClient, headers } = await initServer(request);
  const init = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });
  if (init.error) return json(init, { headers });
  else return redirect('/dash', { headers });
}

export default function Login() {
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
      <div className="p-12 flex justify-center items-center gap-3 flex-col w-full max-w-c-600 flex-auto">
        <Form method="post" className="flex w-full flex-col gap-3">
          <TitleInput
            title="Email"
            type="email"
            id="index-signin"
            value={signInValue}
            onChange={setSignInValue}
            placeholder="jojo@email.com"
            labelColor="text-white"
          />
          <PasswordInput
            title="Password"
            id="index-password"
            value={passwordValue}
            onChange={setPasswordValue}
            placeholder="****"
            labelColor="text-white"
          />
          <div className="w-full flex items-center gap-3 justify-center pt-3">
            <Link
              to="/"
              className="rounded-lg h-10 px-4 text-gray-100 bg-orange-400 hover:bg-orange-500 flex items-center justify-center w-full max-w-button">
              {LOCALES.login.primary_button}
            </Link>
            <button
              className="rounded-lg h-10 px-4 text-gray-100 bg-blue-500 hover:bg-green-500 w-full max-w-button flex items-center justify-center"
              type="submit"
              disabled={false}>
              {isLoading ? (
                <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
              ) : (
                LOCALES.login.secondary_button
              )}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
