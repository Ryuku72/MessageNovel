import { Form, Link } from '@remix-run/react';

import { secondaryButtonClassName } from '~/common/buttonFactory';

import DialogWrapper from '~/components/DialogWrapper';
import TitleInput from '~/components/TitleInput';
import TitleTextArea from '~/components/TitleTextArea';
import CloseIcon from '~/svg/CloseIcon/CloseIcon';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

export type DashNewViewProps = {
  draftNovelTitle: string;
  setDraftNovelTitle: (title: string) => void;
  draftNovelDescription: string;
  setDraftNovelDescription: (descript: string) => void;
  isLoading: boolean;
};
export default function DashNewView({
  draftNovelTitle,
  setDraftNovelTitle,
  draftNovelDescription,
  setDraftNovelDescription,
  isLoading
}: DashNewViewProps) {
  return (
    <DialogWrapper open={true} className="max-w-full max-h-full w-full h-full justify-center p-[36px] bg-transparent">
      <div className="w-full max-w-card-l bg-white rounded-b-md rounded-t-lg flex flex-col gap-3 self-center text-mono">
        <div className="w-full pt-4 px-6 flex flex-wrap justify-between items-center">
          <h3 className="font-medium text-xl text-gray-600 underline underline-offset-4">
            &#8197;New Novel Details&nbsp;&nbsp;&nbsp;
          </h3>
          <Link
            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-red-500 hover:border hover:border-red-500 rounded"
            to="/dash">
            <CloseIcon className="w-3 h-3" uniqueId="dash-close" svgColor="currentColor" />
          </Link>
        </div>
        <Form method="post" action="/dash/new" className="flex w-full pb-4 px-6">
          <fieldset className="flex w-full flex-col gap-5">
            <TitleInput
              title={'Title'}
              id="novel-title"
              value={draftNovelTitle}
              placeholder={'Novel Title'}
              onChange={setDraftNovelTitle}
            />
            <TitleTextArea
              title={'Description'}
              id="novel-description"
              value={draftNovelDescription}
              placeholder={'Tell us what the story is about...'}
              onChange={setDraftNovelDescription}
            />
            <div className="w-full flex gap-3 flex-wrap mt-2">
              <button
                className={
                  secondaryButtonClassName +
                  ` whitespace-pre !max-w-[160px] justify-center items-center ${isLoading ? 'py-0.5' : 'py-2.5'}`
                }>
                {isLoading ? (
                  <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
                ) : (
                  <>
                    <PlusIcon uniqueId="dash_plus" svgColor="#fff" className="w-3 h-3" />
                    Create Novel
                  </>
                )}
              </button>
            </div>
          </fieldset>
        </Form>
      </div>
    </DialogWrapper>
  );
}
