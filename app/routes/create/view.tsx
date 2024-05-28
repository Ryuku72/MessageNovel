import { Form, Link } from '@remix-run/react';

import { primaryButtonClassName, secondaryButtonClassName } from '~/common/buttonFactory';
import LOCALES from '~/locales/language_en.json';

import PasswordInput from '~/components/PasswordInput';
import { PublicLayout } from '~/components/PublicLayout';
import TitleInput from '~/components/TitleInput';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import AvatarInput from './components/AvatarSelectInput';
import ColorInput from './components/ColorInput';

export type CreateViewProps = {
  isLoading: boolean;
  setColorSelect: (color: string) => void;
  colorSelect: string;
  setUsername: (name: string) => void;
  username: string;
  setEmail: (email: string) => void;
  email: string;
  setPassword: (password: string) => void;
  password: string;
  setImage: (image: File) => void;
};

export default function CreateView({
  isLoading,
  setColorSelect,
  colorSelect,
  setUsername,
  username,
  setEmail,
  email,
  setPassword,
  password,
  setImage
}: CreateViewProps) {
  const LocalStrings = LOCALES.create;

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
