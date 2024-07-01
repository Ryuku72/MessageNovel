import { Form, NavLink, useNavigation } from '@remix-run/react';

import { Fragment } from 'react/jsx-runtime';

import LOCALES from '~/locales/language_en.json';
import { UserDataEntry } from '~/types';

import Default_Avatar from '~/assets/default_avatar.jpeg';
import DashIcon from '~/svg/DashIcon/DashIcon';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';
import LogOutIcon from '~/svg/LogOutIcon/LogOutIcon';
import NetworkIcon from '~/svg/NetworkIcon/NetworkIcon';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

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
            <NavLink to="/dash/settings" className="flex w-icon h-icon flex-shrink-0">
              <img
                alt="create-img"
                className="w-full h-full rounded object-cover bg-gradient-to-b from-slate-500 to-fuchsia-600"
                src={user?.avatar || Default_Avatar}
                onError={e => {
                  e.currentTarget.src = Default_Avatar;
                  e.currentTarget.onerror = null;
                  return e;
                }}
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
                `w-icon ${isActive || isPending || isTransitioning ? 'confirmButton' : 'altButton'}`
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
                `w-icon ${isActive || isPending || isTransitioning ? 'confirmButton' : 'altButton'}`
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
                `w-icon ${isActive || isPending || isTransitioning ? 'confirmButton' : 'altButton'}`
              }
              type="button"
              to="/dash/users">
              <NetworkIcon uniqueId="dash_plus" svgColor="#fff" className="w-7 h-auto" />
            </NavLink>
            <div
              role="tooltip"
              className="absolute hidden md:inline-block left-[80px] top-[8px] tooltip z-10 px-4 py-2 text-sm text-white transition-opacity duration-300 bg-gray-600 backdrop-blur-sm rounded-lg shadow-sm bg-opacity-35 whitespace-pre">
              Participants
            </div>
          </div>
        </div>
        <Form method="get" action="/auth" className="has-tooltip cursor-pointer relative">
          <button
            className={`logOutButton ${isLoading ? 'py-0.5' : 'py-2.5'} !w-icon !h-button flex-shrink-0 !p-0`}
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
