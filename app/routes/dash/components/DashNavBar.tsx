import { Form, NavLink, useNavigation } from '@remix-run/react';

import { Fragment } from 'react/jsx-runtime';

import { UserDataEntry } from '~/types';

import LOCALES from '~/locales/language_en.json';

import DashIcon from '~/svg/DashIcon/DashIcon';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';
import LogOutIcon from '~/svg/LogOutIcon/LogOutIcon';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

import Default_Avatar from '~/assets/default_avatar.jpeg';
import NetworkIcon from '~/svg/NetworkIcon/NetworkIcon';

export type DashNavBarProps = {
  user: UserDataEntry;
};

export default function DashNavBar({ user }: DashNavBarProps) {
  const navigationState = useNavigation();
  const isLoading = ['submitting'].includes(navigationState.state);
  const LocalStrings = LOCALES.dash;

  return (
    <div className="relative md:pr-[85px]">
      <div className="flex-shrink-0 md:w-auto w-full flex md:flex-col flex-row gap-3 px-3 md:py-6 py-3 items-center bg-slate-50 bg-opacity-35 backdrop-blur-sm z-10 fixed md:h-full bottom-0">
        <div className="flex md:flex-col flex-row flex-auto gap-3">
          <div className="has-tooltip cursor-pointer relative">
            <NavLink to="/dash/settings" className="flex w-[60px] h-[60px] flex-shrink-0">
              <img
                alt="create-img"
                className="w-full h-full rounded object-cover bg-gradient-to-b from-slate-500 to-fuchsia-600"
                src={user?.avatar || Default_Avatar}
              />
            </NavLink>
            <div
              role="tooltip"
              className="absolute hidden md:inline-block left-[80px] top-[8px] tooltip z-10 px-4 py-2 text-sm text-white transition-opacity duration-300 bg-gray-600 backdrop-blur-sm rounded-lg shadow-sm bg-opacity-35 whitespace-pre">
              {LocalStrings.primary_button}
            </div>
          </div>

          <div className="has-tooltip cursor-pointer relative">
            <NavLink
              end={true}
              className={({ isActive, isPending, isTransitioning }) =>
                `rounded-lg text-gray-100 font-semibold flex items-center justify-center gap-2 w-[60px] h-[50px] ${isActive || isPending || isTransitioning ? 'bg-emerald-700 hover:bg-emerald-500' : 'bg-slate-700 hover:bg-slate-500'}`
              }
              type="button"
              to="/dash">
              <DashIcon uniqueId="dash_icon" svgColor="#fff" className="w-5 h-auto" />
            </NavLink>
            <div
              role="tooltip"
              className="absolute hidden md:inline-block left-[80px] top-[8px] tooltip z-10 px-4 py-2 text-sm text-white transition-opacity duration-300 bg-gray-600 backdrop-blur-sm rounded-lg shadow-sm bg-opacity-35 whitespace-pre">
              {LocalStrings.secondary_button}
            </div>
          </div>
          <div className="has-tooltip cursor-pointer relative">
            <NavLink
              className={({ isActive, isPending, isTransitioning }) =>
                `rounded-lg text-gray-100 font-semibold flex items-center justify-center gap-2 w-[60px] h-[50px] ${isActive || isPending || isTransitioning ?  'bg-emerald-700 hover:bg-emerald-500' : 'bg-slate-700 hover:bg-slate-500'}`
              }
              type="button"
              to="/dash/new">
              <PlusIcon uniqueId="dash_plus" svgColor="#fff" className="w-5 h-auto" />
            </NavLink>
            <div
              role="tooltip"
              className="absolute hidden md:inline-block left-[80px] top-[8px] tooltip z-10 px-4 py-2 text-sm text-white transition-opacity duration-300 bg-gray-600 backdrop-blur-sm rounded-lg shadow-sm bg-opacity-35 whitespace-pre">
              {LocalStrings.tertiary_button}
            </div>
          </div>
          <div className="has-tooltip cursor-pointer relative">
            <NavLink
              className={({ isActive, isPending, isTransitioning }) =>
                `rounded-lg text-gray-100 font-semibold flex items-center justify-center gap-2 w-[60px] h-[50px] ${isActive || isPending || isTransitioning ? 'bg-emerald-700 hover:bg-emerald-500' : 'bg-slate-700 hover:bg-slate-500'}`
              }
              type="button"
              to="/dash/users">
              <NetworkIcon uniqueId="dash_plus" svgColor="#fff" className="w-7 h-auto" />
            </NavLink>
            <div
              role="tooltip"
              className="absolute hidden md:inline-block left-[80px] top-[8px] tooltip z-10 px-4 py-2 text-sm text-white transition-opacity duration-300 bg-gray-600 backdrop-blur-sm rounded-lg shadow-sm bg-opacity-35 whitespace-pre">
              Network
            </div>
          </div>
        </div>
        <Form method="get" action="/auth" className="has-tooltip cursor-pointer relative">
          <button
            className={`tertiaryButton ${isLoading ? 'py-0.5' : 'py-2.5'} !w-[60px] !h-[50px] flex-shrink-0 !p-0`}
            type="submit"
            name="intent"
            value="signout">
            {isLoading ? (
              <LoadingSpinner className="w-8 h-8" svgColor="#fff" uniqueId="index-spinner" />
            ) : (
              <Fragment>
                <LogOutIcon svgColor="#fff" uniqueId="dash-logout" className="w-auto h-8 translate-x-0.5" />
              </Fragment>
            )}
          </button>
          <div
            role="tooltip"
            className="absolute hidden md:inline-block left-[80px] top-[8px] tooltip z-10 px-4 py-2 text-sm text-white transition-opacity duration-300 bg-gray-600 backdrop-blur-sm rounded-lg shadow-sm bg-opacity-35 whitespace-pre">
            {LocalStrings.sign_out_button}
          </div>
        </Form>
      </div>
    </div>
  );
}
