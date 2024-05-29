import { NavLink } from '@remix-run/react';

import { Fragment } from 'react/jsx-runtime';

import { UserDataEntry } from '~/types';

import { thirdButtonClassName } from '~/common/buttonFactory';
import LOCALES from '~/locales/language_en.json';

import DashIcon from '~/svg/DashIcon/DashIcon';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';
import LogOutIcon from '~/svg/LogOutIcon/LogOutIcon';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

import Default_Avatar from '~/assets/default_avatar.jpeg';

export type DashNavBarProps = {
  user: UserDataEntry;
  handleSubmit: (event: React.MouseEvent) => void;
  isLoading: boolean;
};

export default function DashNavBar({ user, handleSubmit, isLoading }: DashNavBarProps) {
  const LocalStrings = LOCALES.dash;

  return (
    <div className="flex-shrink-0 w-auto flex flex-col max-[768px]:flex-row gap-5 px-3 py-6 items-center bg-slate-50 bg-opacity-35 backdrop-blur-sm relative z-10">
      <div className="flex flex-col max-[768px]:flex-row flex-auto gap-2">
        <div className="has-tooltip cursor-pointer relative">
          <NavLink to="/dash/settings" className="flex w-[60px] h-[60px]">
            <img alt="create-img" className="w-full h-full rounded object-cover" src={user?.avatar || Default_Avatar} />
          </NavLink>
          <div className="w-full py-2 flex items-center flex-col">
            <div
              role="tooltip"
              className="absolute max-[768px]:hidden left-[80px] top-[8px] tooltip z-10 inline-block px-4 py-2 text-sm text-white transition-opacity duration-300 bg-gray-600 backdrop-blur-sm rounded-lg shadow-sm bg-opacity-35 whitespace-pre">
              {LocalStrings.primary_button}
            </div>
          </div>
        </div>

        <div className="has-tooltip cursor-pointer relative">
          <NavLink
            end={true}
            className={({ isActive, isPending, isTransitioning }) =>
              `rounded-lg px-5 text-gray-100 font-semibold flex items-center justify-center gap-2 w-[60px] h-[50px] ${isActive || isPending || isTransitioning ? 'bg-emerald-500' : 'bg-emerald-700 hover:bg-emerald-500'}`
            }
            type="button"
            to="/dash">
            <DashIcon uniqueId="dash_icon" svgColor="#fff" className="w-5 h-auto" />
          </NavLink>
          <div className="w-full py-2 flex items-center flex-col">
            <div
              role="tooltip"
              className="absolute max-[768px]:hidden left-[80px] top-[8px] tooltip z-10 inline-block px-4 py-2 text-sm text-white transition-opacity duration-300 bg-gray-600 backdrop-blur-sm rounded-lg shadow-sm bg-opacity-35 whitespace-pre">
              {LocalStrings.secondary_button}
            </div>
          </div>
        </div>

        <div className="has-tooltip cursor-pointer relative">
          <NavLink
            className={({ isActive, isPending, isTransitioning }) =>
              `rounded-lg px-5 text-gray-100 font-semibold flex items-center justify-center gap-2 w-[60px] h-[50px] ${isActive || isPending || isTransitioning ? 'bg-orange-500' : 'bg-orange-700 hover:bg-orange-500'}`
            }
            type="button"
            to="/dash/new">
            <PlusIcon uniqueId="dash_plus" svgColor="#fff" className="w-5 h-auto" />
          </NavLink>
          <div className="w-full py-2 flex items-center flex-col">
            <div
              role="tooltip"
              className="absolute max-[768px]:hidden left-[80px] top-[8px] tooltip z-10 inline-block px-4 py-2 text-sm text-white transition-opacity duration-300 bg-gray-600 backdrop-blur-sm rounded-lg shadow-sm bg-opacity-35 whitespace-pre">
              {LocalStrings.tertiary_button}
            </div>
          </div>
        </div>
      </div>
      <div className="has-tooltip cursor-pointer relative">
        <button
          className={`${thirdButtonClassName} ${isLoading ? 'py-0.5' : 'py-2.5'} w-[60px] h-[50px] px-0`}
          type="button"
          onClick={handleSubmit}>
          {isLoading ? (
            <LoadingSpinner className="w-8 h-8" svgColor="#fff" uniqueId="index-spinner" />
          ) : (
            <Fragment>
              <LogOutIcon svgColor="#fff" uniqueId="dash-logout" className="w-8 h-auto" />
            </Fragment>
          )}
        </button>
        <div className="w-full py-2 flex items-center flex-col">
          <div
            role="tooltip"
            className="absolute max-[768px]:hidden left-[80px] top-[8px] tooltip z-10 inline-block px-4 py-2 text-sm text-white transition-opacity duration-300 bg-gray-600 backdrop-blur-sm rounded-lg shadow-sm bg-opacity-35 whitespace-pre">
            {LocalStrings.sign_out_button}
          </div>
        </div>
      </div>
    </div>
  );
}
