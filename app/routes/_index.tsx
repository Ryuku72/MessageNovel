import { useEffect, useState } from 'react';

import type { MetaFunction } from '@remix-run/node';
import { Link, useNavigate, useOutletContext } from '@remix-run/react';
import { SupabaseClient } from '@supabase/supabase-js';

import { useLoading } from '~/helpers/useLoading';

import TitleInput from '~/components/TitleInput';
import { ToastAlert } from '~/components/ToastAlert';
import LOCALES from '~/locales/language_en.json';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export default function Index() {
  const [signInValue, setSignInValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const { isLoading, withLoading } = useLoading();

  const { supabase, sceneReady } = useOutletContext() as {
    supabase: SupabaseClient;
    sceneReady: boolean;
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (!sceneReady) return;

    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 1
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  const handleSubmit = (e?: React.FormEvent) =>
    withLoading(() => {
      e?.preventDefault();
      return supabase.auth
        .signInWithPassword({
          email: signInValue,
          password: passwordValue
        })
        .then(res => {
          if (!res?.error) return navigate('/dashboard');
          const errorEvent = new CustomEvent('alert from error', {
            detail: res?.error?.message
          });
          document.dispatchEvent(errorEvent);
          return res;
        })
        .catch(err => {
          const errorEvent = new CustomEvent('alert from error', {
            detail: err.message
          });
          document.dispatchEvent(errorEvent);
          return err;
        });
    })();

  return (
    <div className="w-full h-full flex justify-center items-center flex-col flex-auto absolute">
      <div className="p-12 flex justify-center items-center gap-3 flex-col w-full max-w-c-600 flex-auto">
        <h1 className="text-red-800 text-6xl m-0 [text-shadow:_5px_3px_2px_rgb(107_114_128_/_50%)] font-medium font-miltonian">
          {LOCALES.index.title}
        </h1>
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
          <TitleInput
            title="Sign In"
            id="index-signin"
            value={signInValue}
            onChange={setSignInValue}
            placeholder="jojo@email.com"
          />
          <TitleInput
            title="Password"
            id="index-password"
            value={passwordValue}
            onChange={setPasswordValue}
            placeholder="****"
          />
          <div className="w-full flex items-center gap-3 justify-center pt-3">
            <Link
              to="/onboarding"
              className="rounded-lg h-10 px-4 text-gray-100 bg-orange-400 hover:bg-orange-500 flex items-center justify-center w-full max-w-button">
              {LOCALES.index.secondary_button}
            </Link>
            <button
              className="rounded-lg h-10 px-4 text-gray-100 bg-blue-500 hover:bg-green-500 w-full max-w-button flex items-center justify-center"
              onClick={handleSubmit}
              disabled={isLoading}>
              {isLoading ? (
                <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
              ) : (
                LOCALES.index.primary_button
              )}
            </button>
          </div>
        </form>
      </div>
      <ToastAlert />
    </div>
  );
}
