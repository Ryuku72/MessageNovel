import { Link, NavLink } from '@remix-run/react';

import { Fragment } from 'react/jsx-runtime';

import { UserDataEntry } from '~/types';

import { primaryButtonClassName, thirdButtonClassName } from '~/common/buttonFactory';
import LOCALES from '~/locales/language_en.json';

import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';
import LogOutIcon from '~/svg/LogOutIcon/LogOutIcon';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

import Default_Avatar from '~/assets/default_avatar.jpeg';

export type PrivateNavBarProps = {
  user: UserDataEntry;
  handleSubmit: (event: React.MouseEvent) => void;
  isLoading: boolean;
};

export default function PrivateNavBar({ user, handleSubmit, isLoading }: PrivateNavBarProps) {
  const LocalStrings = LOCALES.dash;
  return (
    <div className="flex-shrink-0 max-[768px]:w-auto flex flex-col gap-5 px-8 max-[768px]:px-2 py-6 max-[768px]:items-center overflow-auto bg-slate-50 bg-opacity-35 backdrop-blur-sm">
      <div className="flex flex-col flex-auto gap-6">
        <h1 className="text-red-700 text-4xl m-0 underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian max-[768px]:hidden">
        &#8197;{LocalStrings.title}&nbsp;&nbsp;&nbsp;
        </h1>
        <div className="flex flex-col">
          <NavLink
            to="/settings"
            className={`${user.color} flex flex-row gap-3 rounded-lg bg-opacity-50 backdrop-blur-sm self-start px-2 py-1.5 shadow-sm cursor-pointer max-[768px]:w-[65px] h-[70px] justify-center items-center min-[768px]:pr-4 overflow-hidden`}>
            <div className="flex rounded-full w-12 h-12 flex-none bg-white bg-opacity-50 backdrop-blur-sm p-[2px]">
              <img
                alt="create-img"
                className="w-full h-full rounded-full object-cover"
                src={user?.avatar || Default_Avatar}
              />
            </div>
            <div className="flex flex-col justify-center flex-shrink-1 max-[768px]:hidden">
              <p className="text-gray-600 font-semibold text-md max-w-[145px] text-ellipsis overflow-hidden">
                {user.username}
              </p>
              <p className="text-gray-600 text-xs max-w-[145px] text-ellipsis overflow-hidden">{user.email}</p>
            </div>
          </NavLink>
        </div>
        <div className="flex flex-col">
          <Link className={primaryButtonClassName + ' max-[768px]:w-[60px] h-[60px]'} type="button" to="/dash/new">
            <PlusIcon uniqueId="dash_plus" svgColor="#fff" className="w-5 h-auto" />
            <p className="max-[768px]:hidden whitespace-pre">{LocalStrings.secondary_button}</p>
          </Link>
        </div>
      </div>
      <div className="flex">
        <button
          className={`${thirdButtonClassName} ${isLoading ? 'py-0.5' : 'py-2.5'} max-[768px]:w-[60px] h-[60px] max-[768px]:px-0`}
          type="button"
          onClick={handleSubmit}>
          {isLoading ? (
            <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
          ) : (
            <Fragment>
              <LogOutIcon svgColor="#fff" uniqueId="dash-logout" className="w-8 h-auto" />
              <p className="max-[768px]:hidden whitespace-pre">{LocalStrings.primary_button}</p>
            </Fragment>
          )}
        </button>
      </div>
    </div>
  );
}
