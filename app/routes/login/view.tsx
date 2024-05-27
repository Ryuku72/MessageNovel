import { Form, Link } from '@remix-run/react';

import { primaryButtonClassName, secondaryButtonClassName } from '~/common/buttonFactory';
import LOCALES from '~/locales/language_en.json';

import PasswordInput from '~/components/PasswordInput';
import { PublicLayout } from '~/components/PublicLayout';
import TitleInput from '~/components/TitleInput';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

export type LoginProps = {
  isLoading: boolean;
  signInValue: string;
  setSignInValue: (state: string) => void;
  passwordValue: string;
  setPasswordValue: (state: string) => void;
};
export default function LoginView({
  isLoading,
  signInValue,
  setSignInValue,
  passwordValue,
  setPasswordValue
}: LoginProps) {
  const LocalStrings = LOCALES.login;

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
              <Link to="/" className={primaryButtonClassName}>
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
