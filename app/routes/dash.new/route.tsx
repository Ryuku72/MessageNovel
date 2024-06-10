import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, NavLink, useLoaderData, useNavigation, useSearchParams } from '@remix-run/react';

import { Fragment, useEffect, useState } from 'react';

import LOCALES from '~/locales/language_en.json';

import TitleInput from '~/components/TitleInput';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

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
  const resetState = navigationState.state === 'loading' && !navigationState.formMethod;

  useEffect(() => {
    if (resetState) return;
    setDraftNovelTitle(library?.title || '');
    setDraftNovelDescription(library?.description || '');
  }, [library, resetState]);


  return (
    <div className="flex flex-col flex-auto md:flex-1 items-center w-full md:px-10 px-3 pt-4 pb-[100px] md:py-6 gap-6 m-auto">
      <h1 className="text-red-700 text-4xl m-0 underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        &nbsp;&nbsp;{searchNovelId ? 'Update Details' : LocalStrings.title}&nbsp;&nbsp;&nbsp;
      </h1>
      <div className="w-full max-w-[1250px] flex flex-wrap justify-between items-center bg-slate-50 backdrop-blur-sm bg-opacity-55 rounded-lg">
        <Form
          method="post"
          className="flex w-full py-4 px-2 md:px-6"
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
            <NavLink to="/dash" className="primaryButton py-2.5">
                Back
            </NavLink>
              <button
                className="secondaryButton whitespace-pre !max-w-[160px] !h-[50px] !px-0 justify-center items-center">
                {isLoading ? (
                  <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
                ) : (
                  <Fragment>
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
