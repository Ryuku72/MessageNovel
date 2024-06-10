import { Form, Link, useNavigation } from '@remix-run/react';

import { useEffect, useState } from 'react';

import { NovelinLibraryEntry } from '~/types';

import { CreateDate } from '~/helpers/DateHelper';

import DialogWrapper from '~/components/DialogWrapper';
import CloseIcon from '~/svg/CloseIcon/CloseIcon';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

type DescriptionModelProps = {
  selectedNovel: NovelinLibraryEntry | null;
  close: () => void;
};

export function DescriptionModel({ selectedNovel, close }: DescriptionModelProps) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const navigationState = useNavigation();
  const finishedDelete = 'loading' === navigationState.state && navigationState.formMethod === 'DELETE';
  const isLoading = 'submitting' === navigationState.state && navigationState.formMethod === 'DELETE';

  useEffect(() => {
    if (finishedDelete) {
      setOpenConfirm(false);
      close();
    }
  }, [close, finishedDelete]);

  const descriptionDetails = (detail: string) => {
    const first = detail.substring(1).trim();
    return first;
  };

  return (
    <DialogWrapper open={Boolean(selectedNovel)}>
      <div className="w-full md:max-w-[800px] md:p-4 flex flex-col gap-1 md:self-center self-baseline text-mono m-auto md:m-0">
        <div className="bg-slate-50 bg-opacity-55 backdrop-blur-lg flex flex-col gap-0.5 rounded-t-lg rounded-b-md flex-auto md:flex-1">
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
          <div className="w-full px-8 py-4 bg-white flex flex-col gap-3 flex-auto md:flex-1">
            <div className="py-3 min-h-[160px] md:max-h-[400px] overflow-auto">
              <p className="text-6xl font-semibold py-0.5 px-2 capitalize border-4 border-gray-700 float-left mr-3 translate-y-[-0.5rem]">
                {selectedNovel?.description?.[0]}
              </p>
              <p className="w-full text-gray-700 text-sm pt-3 whitespace-pre-wrap">
                {descriptionDetails(selectedNovel?.description || '')}
              </p>
              <p className="pt-4 text-gray-500 text-sm italic">
                Last Updated <span className="font-semibold">{CreateDate(selectedNovel?.updated_at, true)}</span>
              </p>
            </div>
            <DialogWrapper open={openConfirm}>
              <div className="bg-slate-50 bg-opacity-55 backdrop-blur-lg flex flex-col gap-0.5 rounded-t-lg rounded-b-md self-center w-full max-w-card-l">
                <div className="w-full pt-4 px-6 pb-2 flex flex-wrap rounded-t-[inherit] justify-between items-center bg-white">
                  <h3 className="font-medium text-xl text-gray-600 underline underline-offset-4 capitalize">
                    &#8197;Confirm Delete&nbsp;&nbsp;&nbsp;
                  </h3>
                  <button
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-red-500 hover:border hover:border-red-500 rounded"
                    type="button"
                    onClick={() => setOpenConfirm(false)}>
                    <CloseIcon className="w-3 h-3" uniqueId="dash-close" svgColor="currentColor" />
                  </button>
                </div>
                <div className="w-full py-8 px-4 bg-white text-gray-700">
                  Are you sure you would like to delete the novel{' '}
                  <strong className="whitespace-pre capitalize">{'"' + selectedNovel?.title + '" ?'}</strong>
                </div>
                <div className="flex w-full justify-end bg-white rounded-b-md p-2 gap-3">
                  <Form method="delete">
                    <button
                      title="delete novel"
                      value={selectedNovel?.id}
                      name="selected_novel"
                      className="rounded-lg text-gray-100 font-semibold flex items-center justify-center h-[50px] w-[165px] bg-orange-700 hover:bg-red-600">
                      {isLoading ? (
                        <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
                      ) : (
                        'Delete Novel'
                      )}
                    </button>
                  </Form>
                  <button
                    type="button"
                    onClick={() => setOpenConfirm(false)}
                    className="rounded-lg text-gray-100 font-semibold flex items-center justify-center h-[50px] w-[165px] bg-emerald-700 hover:bg-emerald-500">
                    Cancel
                  </button>
                </div>
              </div>
            </DialogWrapper>
            <button
              type="button"
              onClick={() => setOpenConfirm(true)}
              value={selectedNovel?.id}
              title="selected_novel"
              className="text-red-500 text-xs h-10 w-[165px] text-left flex items-center">
              Delete Novel
            </button>
          </div>
          <div className="flex w-full justify-end bg-white rounded-b-md p-2 gap-3 sticky bottom-0">
            <Link
              to={`/dash/new?novel_id=${selectedNovel?.id}`}
              className="rounded-lg text-gray-100 font-semibold flex items-center justify-center h-[50px] w-[165px] bg-slate-700 hover:bg-slate-500">
              Edit Title & Blurb
            </Link>
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
