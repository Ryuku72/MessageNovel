import { MetaFunction } from '@remix-run/node';
import { useNavigate, useOutletContext } from '@remix-run/react';

import { UserDataEntry } from '~/types';

import LOCALES from '~/locales/language_en.json';

import Default_Avatar from '~/assets/default_avatar.jpeg';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export default function Settings() {
  const { user } = useOutletContext<{ user: UserDataEntry }>();
  const navigate = useNavigate();

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/dash');
  };

  const LocalStrings = LOCALES.settings;
  const colorSplit = user.color ? user.color.split('bg-') : [];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative m-auto">
      <h1 className="text-red-700 text-4xl text-center [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        {LocalStrings.title}
      </h1>
      <div className="p-4 w-card-l max-w-full">
        <div className="w-full flex justify-center items-center gap-3 flex-col rounded-lg shadow-xl px-12 py-8 bg-white bg-opacity-35 backdrop-blur-sm">
          <div className="w-full flex flex-col justify-center items-center">
            <img
              alt="create-img"
              className="w-32 h-32 rounded-full object-cover"
              src={user?.avatar || Default_Avatar}
            />
          </div>
          <div className="w-full flex flex-col gap-3 font-mono">
            <p className="w-full text-gray-600">
              {LocalStrings.email}: {user.email}
            </p>
          </div>
          <div className="w-full flex flex-col gap-3 font-mono">
            <p className="w-full text-gray-600">
              {LocalStrings.username}: {user.username}
            </p>
          </div>
          <div className="w-full flex gap-3 font-mono">
            <p className="text-gray-600">{LocalStrings.color}: </p>
            <div className="flex gap-2 items-center">
              <div className={`h-5 w-5 rounded-lg ${user.color}`} />
              <p className="text-gray-600 capitalize">{colorSplit[1]}</p>
            </div>
          </div>
        </div>
      </div>
      <button
        className="rounded-lg px-5 py-2.5 text-gray-100 bg-blue-500 hover:bg-green-500 flex items-center justify-center"
        onClick={handleSubmit}>
        {LocalStrings.primary_button}
      </button>
    </div>
  );
}
