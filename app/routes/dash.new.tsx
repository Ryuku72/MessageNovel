import { useState } from 'react';

import { Form } from '@remix-run/react';

import DialogWrapper from '~/components/DialogWrapper';
import TitleInput from '~/components/TitleInput';
import TitleTextArea from '~/components/TitleTextArea';
import CloseIcon from '~/svg/CloseIcon/CloseIcon';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';
import { Link } from 'react-router-dom';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { initServer } from '~/helpers/supabase';
import { LoadAuthUser } from '~/services/Auth';
import { ActionLibraryInsert } from '~/services/Library';

export async function action({ request }: ActionFunctionArgs) {
    const { supabaseClient, headers } = await initServer(request);
    const body = await request.formData();
    const title = body.get('novel-title') as string;
    const description = body.get('novel-description') as string;
  
    if (title && description) {
      const userRequest = await LoadAuthUser({ supabaseClient, headers });
      const user = await userRequest.json();
      const update = await ActionLibraryInsert({ user, title, description, supabaseClient, headers });
      if (update.error) return json(update, { headers: update.headers });
      return redirect('/dash', { headers });
    }
  }
  

export default function DashNew() {
  const [draftNovelTitle, setDraftNovelTitle] = useState('');
  const [draftNovelDescription, setDraftNovelDescription] = useState('');

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
        <Form method="post" action="/dash" className="flex w-full pb-4 px-6">
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
              <button className="text-gray-100 bg-blue-500 hover:bg-green-500 rounded-lg text-sm px-5 py-2.5 text-center flex items-center gap-2">
                <PlusIcon uniqueId="dash_plus" svgColor="#fff" className="w-3 h-3" />
                Create Novel
              </button>
            </div>
          </fieldset>
        </Form>
      </div>
    </DialogWrapper>
  );
}
