import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData, useNavigation, useSearchParams } from '@remix-run/react';

import { Fragment, useEffect, useState } from 'react';

import { secondaryButtonClassName } from '~/common/buttonFactory';
import LOCALES from '~/locales/language_en.json';

import TitleInput from '~/components/TitleInput';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

import TitleTextArea from './components/TitleTextArea';
import { DashNewAction, DashNewLoader } from './services';
import { NovelinLibraryEntry } from '~/types';

export function loader(data: LoaderFunctionArgs) {
  return DashNewLoader(data);
}

export function action(data: ActionFunctionArgs) {
  return DashNewAction(data);
}

export default function DashNew() {
  const library = useLoaderData<NovelinLibraryEntry>();
  const [draftNovelTitle, setDraftNovelTitle] = useState(library?.title || '');
  const [draftNovelDescription, setDraftNovelDescription] = useState(library?.description || '');

  const navigationState = useNavigation();
  const [searchParams] = useSearchParams();

  const isLoading = ['submitting'].includes(navigationState.state);
  const searchNovelId = searchParams.get('novel_id');
  const LocalStrings = LOCALES.dash.new;

  useEffect(() => {
    setDraftNovelTitle(library?.title || '');
    setDraftNovelDescription(library?.description || '');
  }, [library?.description, library?.title]);


  return (
    <div className="flex flex-col max-[768px]:flex-auto items-center w-full px-10 max-[768px]:px-3 py-6 max-[768px]:pt-4 max-[768px]:pb-[100px] gap-6 m-auto">
      <h1 className="text-red-700 text-4xl m-0 underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        &nbsp;&nbsp;{searchNovelId ? 'Update Details' : LocalStrings.title}&nbsp;&nbsp;&nbsp;
      </h1>
      <div className="w-full max-w-[1250px] flex flex-wrap justify-between items-center bg-slate-50 backdrop-blur-sm bg-opacity-55 rounded-lg">
        <Form
          method="post"
          className="flex w-full py-4 max-[768px]:px-2 px-6"
          onSubmit={e => {
            if (draftNovelDescription.trim().length < 120) {
              e.preventDefault();
              window.alert('description less than 120 characters');
              return false;
            }
          }}>
          <fieldset className="flex w-full flex-col gap-5">
            <TitleInput
              title={LocalStrings.primary_input}
              id="novel-title"
              value={draftNovelTitle}
              placeholder={LocalStrings.primary_input_placeholder}
              onChange={setDraftNovelTitle}
              minLength={3}
            />
            <TitleTextArea
              title={LocalStrings.secondary_input}
              id="novel-description"
              value={draftNovelDescription}
              placeholder={LocalStrings.secondary_input_placeholder}
              onChange={setDraftNovelDescription}
            />
            <div className="w-full flex gap-3 flex-wrap mt-2 justify-end">
              <button
                className={
                  secondaryButtonClassName +
                  ' whitespace-pre !max-w-[160px] !h-[50px] !px-0 justify-center items-center'
                }>
                {isLoading ? (
                  <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
                ) : (
                  <Fragment>
                    <PlusIcon uniqueId="dash_plus" svgColor="#fff" className="w-4 h-auto" />
                    {searchNovelId ? 'Update Novel' : LocalStrings.primary_button}
                  </Fragment>
                )}
              </button>
            </div>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
