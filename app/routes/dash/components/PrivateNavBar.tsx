import { NavLink } from '@remix-run/react';

import { UserDataEntry } from '~/types';

import { thirdButtonClassName } from '~/common/buttonFactory';
import LOCALES from '~/locales/language_en.json';

import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import Default_Avatar from '~/assets/default_avatar.jpeg';

export type PrivateNavBarProps = {
  user: UserDataEntry;
  title: string;
  handleSubmit: (event: React.MouseEvent) => void;
  isLoading: boolean;
};

export default function PrivateNavBar({ user, title, handleSubmit, isLoading }: PrivateNavBarProps) {
  const LocalStrings = LOCALES.dash;
  return (
    <div className="w-full flex gap-5 tems-center p-8 flex-wrap">
      <div className="flex flex-1 flex-col">
        <NavLink
          to="/settings"
          className={`flex flex-row gap-3 rounded bg-opacity-50 backdrop-blur-sm self-start px-5 py-2.5 ${user.color} shadow-sm cursor-pointer`}>
          <div className="flex justify-center rounded-full w-8 h-8 flex-none bg-white bg-opacity-50 backdrop-blur-sm p-[1px]">
            <img
              alt="create-img"
              className="w-full h-full rounded-full object-cover"
              src={user?.avatar || Default_Avatar}
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-gray-600 text-xl">{user.username}</p>
          </div>
        </NavLink>
      </div>
      <div className="flex flex-shrink-[1] flex-grow-[1] justify-center basis-auto">
        <h1 className="text-red-700 text-4xl text-center m-0 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
          {title}
        </h1>
      </div>
      <div className="flex flex-1 flex-col items-end">
        <button className={`${thirdButtonClassName} ${isLoading ? 'py-0.5' : 'py-2.5'}`} type="button" onClick={handleSubmit}>
          {isLoading ? (
            <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
          ) : (
            LocalStrings.primary_button
          )}
        </button>
      </div>
    </div>
  );
}
