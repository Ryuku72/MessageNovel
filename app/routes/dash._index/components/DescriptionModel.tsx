import { Link } from '@remix-run/react';

import { NovelinLibraryEntry } from '~/types';

import { CreateDate } from '~/helpers/DateHelper';

import DialogWrapper from '~/components/DialogWrapper';
import CloseIcon from '~/svg/CloseIcon/CloseIcon';

type DescriptionModelProps = {
  selectedNovel: NovelinLibraryEntry | null;
  close: () => void;
};

export function DescriptionModel({ selectedNovel, close }: DescriptionModelProps) {
  const descriptionDetails = (detail: string) => {
    const first = detail.substring(1).trim();
    return first;
  };

  return (
    <DialogWrapper open={Boolean(selectedNovel)}>
      <div className="w-full min-[768px]:max-w-[800px] min-[768px]:p-4 flex flex-col gap-1 min-[768px]:self-center text-mono max-[768px]:self-baseline max-[768px]:m-auto">
        <div className="bg-slate-50 bg-opacity-55 backdrop-blur-lg flex flex-col gap-0.5 rounded-t-lg rounded-b-md max-[768px]:flex-auto">
          <div className="w-full pt-4 px-6 pb-2 flex flex-wrap rounded-t-[inherit] justify-between items-center bg-white">
            <h3 className="font-medium text-xl text-gray-600 underline underline-offset-4 capitalize">
              &#8197;{selectedNovel?.title}&nbsp;&nbsp;&nbsp;
            </h3>
            <button
              className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-red-500 hover:border hover:border-red-500 rounded"
              type="button"
              onClick={close}>
              <CloseIcon className="w-3 h-3" uniqueId="dash-close" svgColor="currentColor" />
            </button>
          </div>
          <div className="w-full p-8 pb-4 bg-white flex flex-col gap-3 max-[768px]:flex-auto">
            <p className="text-gray-700">
              Last Update: <span className="text-gray-800">{CreateDate(selectedNovel?.updated_at, true)}</span>
            </p>
            <div className="py-3 min-[768px]:max-h-[400px] overflow-auto">
              <p className="text-6xl font-semibold py-0.5 px-2 capitalize border-4 border-gray-700 float-left mr-3 translate-y-[-0.5rem]">
                {selectedNovel?.description?.[0]}
              </p>
              <p className="w-full min-h-[200px] text-gray-700 text-sm pt-3 whitespace-pre-wrap">
                {descriptionDetails(selectedNovel?.description || '')}
              </p>
            </div>
            <Link
              to={`/dash/new?novel_id=${selectedNovel?.id}`}
              className="text-red-500 text-xs h-10 w-[165px] text-left flex items-center">
              Edit Description
            </Link>
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
              Write Novel
            </Link>
          </div>
        </div>
      </div>
    </DialogWrapper>
  );
}
