import { Form, Link, useNavigation } from '@remix-run/react';

import { useEffect, useState } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';

import { CreateDate } from '~/helpers/DateHelper';

import DialogWrapper from '~/components/DialogWrapper';
import { emptyContent } from '~/components/Lexical/helpers';

import { TrashIcon } from '~/svg';
import CloseIcon from '~/svg/CloseIcon/CloseIcon';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import EditorTextPlugin from './EditorTextPlugin';
import { NovelWithMemberIds } from '~/types';

type DescriptionModelProps = {
  selectedNovel: NovelWithMemberIds | null;
  userId: string;
  members: { user_id: string }[];
  ownerId: string;
  close: () => void;
};

export function DescriptionModel({ selectedNovel, close, userId, ownerId, members = [] }: DescriptionModelProps) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const navigationState = useNavigation();
  const finishedDelete = 'loading' === navigationState.state && navigationState.formMethod === 'DELETE';
  const finishedPost = 'loading' === navigationState.state && navigationState.formMethod === 'POST';
  const isLoading = 'submitting' === navigationState.state && navigationState.formMethod === 'DELETE';
  const isLoadingUpdate = 'submitting' === navigationState.state && navigationState.formMethod === 'POST';
  const member = members.some(user => user.user_id === userId);
  const isOwner = userId === ownerId;

  useEffect(() => {
    if (finishedDelete) {
      setOpenConfirm(false);
      close();
    }
  }, [close, finishedDelete]);

  useEffect(() => {
    if (finishedPost) {
      close();
    }
  }, [close, finishedPost]);

  const initialConfig = {
    namespace: 'DescriptionModal',
    nodes: [],
    editorState: JSON.stringify(selectedNovel?.description) || emptyContent,
    onError: (error: Error) => {
      throw error;
    },
    editable: false,
    theme: {
      paragraph: 'descriptionText'
    }
  };

  return (
    <DialogWrapper open={Boolean(selectedNovel)}>
      <div className="w-full md:max-w-[800px] md:p-4 flex flex-col gap-1 md:self-center self-baseline text-mono m-auto md:m-0">
        <div className="bg-slate-50 bg-opacity-55 backdrop-blur-lg flex flex-col gap-0.5 rounded-t-lg rounded-b-md flex-auto md:flex-1">
          <div className="w-full pt-4 px-6 pb-2 flex flex-wrap rounded-t-[inherit] justify-between items-center bg-white">
            <h3 className="font-medium text-xl text-gray-600 underline underline-offset-4 capitalize flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setOpenConfirm(true)}
                value={selectedNovel?.id}
                title="selected_novel"
                className={
                  isOwner
                    ? 'hover:text-red-500 hover:border hover:border-current rounded text-current text-xs h-10 w-10 text-left flexCenter'
                    : 'hidden'
                }>
                <TrashIcon className="w-5 h-auto" uniqueId="descript-delete" />
              </button>
              &nbsp;{selectedNovel?.title}&nbsp;&nbsp;&nbsp;
            </h3>
            <button
              className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-red-500 hover:border hover:border-red-500 rounded"
              type="button"
              onClick={close}>
              <CloseIcon className="w-3 h-3" uniqueId="dash-close" svgColor="currentColor" />
            </button>
          </div>
          <div className="w-full px-8 py-4 bg-white flex flex-col gap-10 flex-auto md:flex-1">
            {selectedNovel && (
              <LexicalComposer initialConfig={initialConfig}>
                <EditorTextPlugin />
              </LexicalComposer>
            )}
            <div>
              <div>
                <p className="text-gray-500 text-sm">
                  <strong>Last Update:</strong> {CreateDate(selectedNovel?.updated_at, true)}
                </p>
                <p className="text-gray-500 text-sm">
                  <strong>Members:</strong> {selectedNovel?.members?.length}
                </p>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-end bg-white rounded-b-md p-2 gap-3 sticky bottom-0">
            <Link
              to={`/dash/new?novel_id=${selectedNovel?.id}`}
              className={
                isOwner
                  ? 'rounded-lg text-gray-100 font-semibold flex items-center justify-center h-[50px] w-[165px] bg-slate-700 hover:bg-slate-500'
                  : 'hidden'
              }>
              Edit Title & Blurb
            </Link>
            <button
              className={
                member && !isOwner
                  ? 'rounded-lg text-gray-100 font-semibold flex items-center justify-center h-[50px] w-[165px] bg-orange-700 hover:bg-orange-500'
                  : 'hidden'
              }
              type="button"
              onClick={close}>
              Back
            </button>
            <Link
              to={`/dash/novel/${selectedNovel?.id}`}
              className={
                member
                  ? 'rounded-lg text-gray-100 font-semibold flex items-center justify-center h-[50px] w-[165px] bg-emerald-700 hover:bg-emerald-500'
                  : 'hidden'
              }>
              Select Page
            </Link>
            <Form method="post">
              <fieldset disabled={isLoadingUpdate}>
                <button
                  name="selected_novel"
                  value={selectedNovel?.id}
                  className={
                    !member
                      ? 'rounded-lg text-gray-100 font-semibold flex items-center justify-center h-[50px] w-[165px] bg-emerald-700 hover:bg-emerald-500'
                      : 'hidden'
                  }>
                  Participate?
                </button>
              </fieldset>
            </Form>
          </div>
        </div>
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
    </DialogWrapper>
  );
}
