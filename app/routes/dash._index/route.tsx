import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData, useNavigation } from '@remix-run/react';

import { Fragment, useState } from 'react';

import { NovelinLibraryEntry } from '~/types';

import { CreateDate } from '~/helpers/DateHelper';
import LOCALES from '~/locales/language_en.json';

import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

import { DescriptionModel } from './components/DescriptionModel';
import { DashIndexAction, DashIndexLoader } from './service';

export function loader({ request }: LoaderFunctionArgs) {
  return DashIndexLoader(request);
}

export function action({ request }: ActionFunctionArgs) {
  return DashIndexAction(request);
}

export default function DashIndex() {
  const library = useLoaderData<NovelinLibraryEntry[]>();
  const [selectedNovel, setSelectedNovel] = useState<NovelinLibraryEntry | null>(null);
  const LocalStrings = LOCALES.dash;

  const navigationState = useNavigation();
  const isLoading = ['submitting'].includes(navigationState.state);

  return (
    <div className="flex flex-col flex-auto md:flex-1 items-center w-full md:px-10 px-3 md:py-12 py-4 gap-10">
      <h1 className="text-red-700 text-4xl underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        &nbsp;&nbsp;{LocalStrings.title}&nbsp;&nbsp;&nbsp;
      </h1>
      <div className="grid wide:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 w-full max-w-wide">
        {library.map(insert => (
          <button
            type="button"
            key={insert.id}
            className={`flex bg-gray-400 bg-opacity-50 backdrop-blur-xl p-10 overflow-hidden relative rounded-[25px] font-mono flex-col gap-1 group transition-all duration-500 ease-linear ${selectedNovel && selectedNovel?.id === insert?.id ? 'text-gray-700' : 'md:text-white hover:text-gray-700 text-gray-700'}`}
            onClick={() => setSelectedNovel(insert)}>
            <div
              className={`absolute top-[-80px] right-[-80px] w-[100px] h-[100px] rounded-full transition-all duration-500 ease-linear group-[:nth-child(10n+1)]:bg-pastel-red group-[:nth-child(10n+2)]:bg-pastel-brown group-[:nth-child(10n+3)]:bg-pastel-orange group-[:nth-child(10n+4)]:bg-pastel-yellow group-[:nth-child(10n+5)]:bg-pastel-indigo group-[:nth-child(10n+6)]:bg-pastel-blue group-[:nth-child(10n+7)]:bg-pastel-green group-[:nth-child(10n+8)]:bg-pastel-emerald group-[:nth-child(10n+9)]:bg-pastel-purple group-[:nth-child(10n+0)]:bg-pastel-black ${selectedNovel && selectedNovel?.id === insert?.id ? 'scale-[16]' : 'group-hover:scale-[16] scale-[16] md:scale-0'}`}
            />
            <h3 className="text-current text-3xl font-semibold tracking-wide mb-2 relative z-10 truncate max-w-full overflow-hidden capitalize">
              {insert.title}
            </h3>
            <h4 className="text-current text-lg md:mb-2 relative z-10 truncate max-w-full overflow-hidden">
              Author:{' '}
              <span
                className={`${selectedNovel && selectedNovel?.id === insert?.id ? 'text-current' : ' md:text-yellow-400 group-hover:text-gray-700 text-current'} transition-all duration-500 ease-linear font-semibold tracking-wide`}>
                {insert.owner_username}
              </span>
            </h4>
            <div className="flex flex-wrap md:flex-col md:gap-1 gap-3">
              <p className="text-current text-xs relative z-10 text-left">
                Created:{' '}
                <span
                  className={`${selectedNovel && selectedNovel?.id === insert?.id ? 'text-current' : ' md:text-yellow-400 group-hover:text-gray-700 text-current'} transition-all duration-500 ease-linear font-semibold tracking-wide`}>
                  {CreateDate(insert.created_at)}
                </span>
              </p>
              <p className="text-current text-xs relative z-10 text-left">
                Last updated:{' '}
                <span
                  className={`${selectedNovel && selectedNovel?.id === insert?.id ? 'text-current' : ' md:text-yellow-400 group-hover:text-gray-700 text-current'} transition-all duration-500 ease-linear font-semibold tracking-wide`}>
                  {CreateDate(insert.updated_at)}{' '}
                </span>
              </p>
            </div>
          </button>
        ))}
      </div>
      <div className="w-full max-w-[1850px] p-2 flex md:sticky md:bottom-0 pb-[120px] md:pb-2">
        <Link
          to="/dash/new"
          className="
          secondaryButton whitespace-pre !max-w-[160px] !h-[50px] !px-0 justify-center items-center">
          {isLoading ? (
            <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
          ) : (
            <Fragment>
              <PlusIcon uniqueId="dash_plus" svgColor="#fff" className="w-4 h-auto" />
              New Novel
            </Fragment>
          )}
        </Link>
      </div>
      <DescriptionModel selectedNovel={selectedNovel} close={() => setSelectedNovel(null)} />
    </div>
  );
}
