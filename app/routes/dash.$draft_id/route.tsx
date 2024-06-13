import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, NavLink, useLoaderData, useNavigation, useOutletContext } from '@remix-run/react';

import { useState } from 'react';

import { NovelEntry } from '~/types';

import LOCALES from '~/locales/language_en.json';

import TitleInput from '~/components/TitleInput';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import { LexicalRichTextEditor } from './Lexical';
import { DashNovelIdAction, DashNovelIdLoader } from './services';
import { DashOutletContext } from '../dash/route';

export function loader(data: LoaderFunctionArgs) {
  if (!data.params.draft_id) return null;
  return DashNovelIdLoader(data);
}

export function action(data: ActionFunctionArgs) {
  return DashNovelIdAction(data);
}

export default function DashNovelId() {
  const loaderData = useLoaderData<NovelEntry>();
  const { user } = useOutletContext<DashOutletContext>();
  const navigationState = useNavigation();
  const isLoading = ['submitting'].includes(navigationState.state);

  const LocalStrings = LOCALES.dash.draft;
  const [titleValue, setTitleValue] = useState(loaderData?.title);

  return (
    <div className="w-full h-full flex flex-row relative">
      <div className="flex flex-col md:flex-1 flex-auto items-center w-full md:px-10 px-0 py-12 pt-4 md:pt-12 gap-6 md:overflow-hidden">
        <h1 className="text-red-700 text-4xl underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
          &nbsp;&nbsp;{LocalStrings.title}&nbsp;&nbsp;&nbsp;
        </h1>
        <div className="w-full max-w-[1850px] flex flex-col flex-auto gap-3 text-mono md:pb-0 pb-[120px] md:overflow-hidden">
        <Form
          aria-label="draft-update"
          method="post"
          className="w-full flex flex-col gap-3 text-mono relative bg-white bg-opacity-50 backdrop-blur-sm rounded-b-md rounded-t-md md:px-4 px-2 py-4 md:overflow-hidden">
          <TitleInput
            title="Novel Title"
            id="novel-title"
            value={titleValue}
            placeholder={'Enter Novel Title'}
            onChange={setTitleValue}
          />
          <LexicalRichTextEditor namespace={loaderData?.id} value={loaderData?.body} username={user.username} color={user.color} />
          <div className="w-full flex items-center gap-3 justify-end pt-3">
            <NavLink to="/dash" className="primaryButton py-2.5">
                {LocalStrings.secondary_button}
            </NavLink>
            <button
              className={`secondaryButton ${isLoading ? 'py-0.5' : 'py-2.5'}`}
              type="submit"
              disabled={false}>
              {isLoading ? (
                <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
              ) : (
                LocalStrings.primary_button
              )}
            </button>
          </div>
        </Form>
      </div>
      </div>
    </div>
  );
}
