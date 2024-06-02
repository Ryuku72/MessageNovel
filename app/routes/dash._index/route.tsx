import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData, useNavigation } from '@remix-run/react';

import { Fragment, useState } from 'react';

import { NovelinLibraryEntry } from '~/types';

import { secondaryButtonClassName } from '~/common/buttonFactory';
import { CreateDate } from '~/helpers/DateHelper';
import LOCALES from '~/locales/language_en.json';

import DialogWrapper from '~/components/DialogWrapper';
import CloseIcon from '~/svg/CloseIcon/CloseIcon';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

import { DashIndexLoader } from './service';

export function loader({ request }: LoaderFunctionArgs) {
  return DashIndexLoader(request);
}

export default function DashIndex() {
  const library = useLoaderData<NovelinLibraryEntry[]>();
  const [selectedNovel, setSelectedNovel] = useState<NovelinLibraryEntry | null>(null);
  const LocalStrings = LOCALES.dash;

  const navigationState = useNavigation();
  const isLoading = ['submitting'].includes(navigationState.state);

  return (
    <div className="flex flex-col max-[768px]:flex-auto items-center w-full px-10 max-[768px]:px-3 py-12 max-[768px]:py-4 gap-10 overflow-auto">
      <h1 className="text-red-700 text-4xl m-0 underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        &nbsp;&nbsp;{LocalStrings.title}&nbsp;&nbsp;&nbsp;
      </h1>
      <div className="grid grid-cols-4 max-[1740px]:grid-cols-3 max-[1275px]:grid-cols-2 max-[900px]:grid-cols-1 gap-4 w-full max-w-[1850px]">
        {library.map(insert => (
          <button
            type="button"
            key={insert.id}
            className={`flex bg-gray-400 bg-opacity-50 backdrop-blur-lg p-10 overflow-hidden relative rounded-[25px] font-mono flex-col gap-1 group transition-all duration-500 ease-linear ${selectedNovel && selectedNovel?.id === insert?.id ? 'text-gray-700' : 'text-white hover:text-gray-700'}`}
            onClick={() => setSelectedNovel(insert)}>
            <div
              className={`absolute top-[-80px] right-[-80px] w-[100px] h-[100px] rounded-full transition-all duration-500 ease-linear group-[:nth-child(10n+1)]:bg-pastel-red group-[:nth-child(10n+2)]:bg-pastel-brown group-[:nth-child(10n+3)]:bg-pastel-orange group-[:nth-child(10n+4)]:bg-pastel-yellow group-[:nth-child(10n+5)]:bg-pastel-indigo group-[:nth-child(10n+6)]:bg-pastel-blue group-[:nth-child(10n+7)]:bg-pastel-green group-[:nth-child(10n+8)]:bg-pastel-emerald group-[:nth-child(10n+9)]:bg-pastel-purple group-[:nth-child(10n+0)]:bg-pastel-black ${selectedNovel && selectedNovel?.id === insert?.id ? 'scale-[16]' : 'group-hover:scale-[16]'}`}
            />
            <h3 className="text-current text-3xl font-semibold mb-2 relative z-10 truncate max-w-full overflow-hidden capitalize">
              {insert.title}
            </h3>
            <h4 className="text-current text-lg mb-1 relative z-10 truncate max-w-full overflow-hidden">
              Author:{' '}
              <strong
                className={`${selectedNovel && selectedNovel?.id === insert?.id ? 'text-gray-700' : 'text-yellow-400 group-hover:text-gray-700'} transition-all duration-500 ease-linear`}>
                {insert.owner_username}
              </strong>
            </h4>
            <div className="flex flex-wrap gap-3">
              <p className="text-current text-xs relative z-10">
                Created:{' '}
                <strong
                  className={`${selectedNovel && selectedNovel?.id === insert?.id ? 'text-gray-700' : 'text-yellow-400 group-hover:text-gray-700'} transition-all duration-500 ease-linear`}>
                  {CreateDate(insert.created_at)}
                </strong>
              </p>
              <p className="text-current text-xs relative z-10">
                Last updated:{' '}
                <strong
                  className={`${selectedNovel && selectedNovel?.id === insert?.id ? 'text-gray-700' : 'text-yellow-400 group-hover:text-gray-700'} transition-all duration-500 ease-linear`}>
                  {CreateDate(insert.updated_at)}{' '}
                </strong>
              </p>
            </div>
          </button>
        ))}
      </div>
      <div className="w-full p-2 flex justify-end sticky bottom-0">
        <Link
          to="/dash/new"
          className={
            secondaryButtonClassName +
            ' whitespace-pre !max-w-[160px] !h-[50px] !px-0 justify-center items-center'
          }>
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
      <DialogWrapper open={Boolean(selectedNovel)}>
        <div className="w-full max-w-[800px] p-4 flex flex-col gap-1 self-center text-mono">
          <div className="bg-slate-50 bg-opacity-55 backdrop-blur-lg flex flex-col gap-0.5 rounded-t-lg rounded-b-md">
            <div className="w-full pt-4 px-6 pb-2 flex flex-wrap rounded-t-[inherit] justify-between items-center bg-white">
              <h3 className="font-medium text-xl text-gray-600 underline underline-offset-4 capitalize">
                &#8197;{selectedNovel?.title}&nbsp;&nbsp;&nbsp;
              </h3>
              <button
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-red-500 hover:border hover:border-red-500 rounded"
                type="button"
                onClick={() => setSelectedNovel(null)}>
                <CloseIcon className="w-3 h-3" uniqueId="dash-close" svgColor="currentColor" />
              </button>
            </div>
            <div className="w-full p-8 pb-4 bg-white flex flex-col gap-3">
              <p className="text-gray-700">
                Last Update: <strong className="text-gray-800">{CreateDate(selectedNovel?.updated_at)}</strong>
              </p>
              <p className="w-full min-h-[200px] text-gray-700">{selectedNovel?.description}</p>
            </div>
            <div className="flex w-full justify-end bg-white rounded-b-md p-2 gap-3">
              {/* <button
                  title="selected_novel"
                  className={thirdButtonClassName + ' h-[50px] w-[165px]'}
                  value={selectedNovel?.id}>
                  Delete
                </button> */}
              <Link
                to={`/dash/${selectedNovel?.draft_id}`}
                className="rounded-lg text-gray-100 font-semibold flex items-center justify-center h-[50px] w-[165px] bg-emerald-700 hover:bg-emerald-500">
                Write
              </Link>
            </div>
          </div>
        </div>
      </DialogWrapper>
    </div>
  );
}
