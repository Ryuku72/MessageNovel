import { ActionFunctionArgs } from '@remix-run/node';
import { Form, useNavigation } from '@remix-run/react';

import { Fragment, useState } from 'react';

import { secondaryButtonClassName } from '~/common/buttonFactory';
import LOCALES from '~/locales/language_en.json';

import TitleInput from '~/components/TitleInput';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

import TitleTextArea from './components/TitleTextArea';
import { DashNewAction } from './services';

export function action({ request }: ActionFunctionArgs) {
  return DashNewAction(request);
}

export default function DashNew() {
  const [draftNovelTitle, setDraftNovelTitle] = useState('');
  const [draftNovelDescription, setDraftNovelDescription] = useState('');

  const navigationState = useNavigation();
  const isLoading = ['submitting'].includes(navigationState.state);
  const LocalStrings = LOCALES.dash.new;
  return (
    <div className="flex flex-col max-[768px]:flex-auto items-center w-full px-10 max-[768px]:px-3 py-12 max-[768px]:py-4 gap-6 overflow-hidden">
      <h1 className="text-red-700 text-4xl m-0 underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        &nbsp;&nbsp;{LocalStrings.title}&nbsp;&nbsp;&nbsp;
      </h1>
      <div className="w-full max-w-[1250px] flex flex-wrap justify-between items-center bg-slate-50 backdrop-blur-sm bg-opacity-55 rounded-lg">
        <Form method="post" action="/dash/new" className="flex w-full py-4 px-6">
          <fieldset className="flex w-full flex-col gap-5">
            <TitleInput
              title={LocalStrings.primary_input}
              id="novel-title"
              value={draftNovelTitle}
              placeholder={LocalStrings.primary_input_placeholder}
              onChange={setDraftNovelTitle}
            />
            <TitleTextArea
              title={LocalStrings.secondary_input}
              id="novel-description"
              value={draftNovelDescription}
              placeholder={LocalStrings.secondary_input_placeholder}
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
                  <Fragment>
                    <PlusIcon uniqueId="dash_plus" svgColor="#fff" className="w-3 h-3" />
                    {LocalStrings.primary_button}
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
