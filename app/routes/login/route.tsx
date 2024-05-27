import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useActionData, useNavigation, useOutletContext } from '@remix-run/react';

import { useEffect, useState } from 'react';

import { AuthTokenResponsePassword } from '@supabase/supabase-js';

import LOCALES from '~/locales/language_en.json';

import LoginAction from './action';
import LoginLoader from './loader';
import LoginView from './view';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export function loader({ request }: LoaderFunctionArgs) {
  return LoginLoader(request);
}

export function action({ request }: ActionFunctionArgs) {
  return LoginAction(request);
}

export default function Login() {
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
        detail: actionData.error?.message || 'Incorrect Email or Password'
      });
      window.dispatchEvent(sceneEvent);
    }
  }, [actionData]);

  return (
    <LoginView
      isLoading={isLoading}
      signInValue={signInValue}
      setSignInValue={setSignInValue}
      passwordValue={passwordValue}
      setPasswordValue={setPasswordValue}
    />
  );
}
