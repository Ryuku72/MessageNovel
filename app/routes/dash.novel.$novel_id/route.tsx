import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, Link, useLoaderData, useNavigation, useOutletContext, useSubmit } from '@remix-run/react';

import { useEffect } from 'react';

import { CreateDate } from '~/helpers/DateHelper';
import { NovelWithUsers, PageWithUsers } from '~/types';

import Default_Avatar from '~/assets/default_avatar.jpeg';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

import { DashOutletContext } from '../dash/route';
import { DescriptionPreview } from './components/DescriptionPreview';
import { DashNovelIdAction, DashNovelIdLoader } from './services';

export function loader(request: LoaderFunctionArgs) {
  return DashNovelIdLoader(request);
}

export function action(data: ActionFunctionArgs) {
  return DashNovelIdAction(data);
}

export default function DashNovelId() {
  const { novel, pages } = useLoaderData() as { pages: PageWithUsers[]; novel: NovelWithUsers };
  const { user, channel, img_url } = useOutletContext<DashOutletContext>();
  const navigationState = useNavigation();
  const isLoadingUpdate = 'submitting' === navigationState.state;
  const submit = useSubmit();

  useEffect(() => {
    if (!channel) return;
    channel.track({ userId: user.id, room: 'Dashboard' });
  }, [channel, user.id]);

  return (
    <div className="flex flex-col flex-auto md:flex-1 items-center w-full md:px-10 px-3 md:py-12 py-4 gap-6">
      <h1 className="text-red-700 text-4xl underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        &nbsp;&nbsp;{novel.title}&nbsp;&nbsp;&nbsp;
      </h1>
      <div className="grid grid-cols-1 gap-4 w-full max-w-wide">
        {pages.map(page => (
          <div
            className="w-full max-w-wide rounded-lg flex flex-col gap-1 bg-white bg-opacity-35 backdrop-blur-lg p-8 text-gray-700 drop-shadow-lg"
            key={page.id}>
            <p className="text-current text-left text-xl font-semibold truncate max-w-full overflow-hidden">
              {page.reference_title}
            </p>
            <div className="flex flex-wrap gap-3">
              <p className="text-current text-sm text-left">
                Created:{' '}
                <span className="text-current transition-all duration-500 ease-linear font-semibold tracking-wide">
                  {CreateDate(page.created_at)}
                </span>
              </p>
              <p className="text-current text-sm text-left">
                Last updated:{' '}
                <span className="text-current transition-all duration-500 ease-linear font-semibold tracking-wide">
                  {CreateDate(novel.updated_at)}{' '}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <p className="text-current text-sm text-left">Participants:</p>
              <div className="flex gap-2 text-blue-800 items-center text-sm max-w-[80%]">
                {page.members.map(user => (
                  <div
                    key={user.id}
                    className={`text-grey-700 text-sm ${user.color} pl-1 pr-2 py-1 rounded flex gap-1 flex-wrap items-center text-gray-700`}>
                    <img
                      src={user.avatar ? img_url + 'public/avatars/' + user.avatar : Default_Avatar}
                      className="rounded-full w-4 h-4"
                      alt="user-avatar"
                      onError={e => {
                        e.currentTarget.src = Default_Avatar;
                        e.currentTarget.onerror = null;
                        return e;
                      }}
                    />
                    {user.username}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col w-full overflow-hidden h-[115px] relative text-sm">
              <DescriptionPreview editorState={page.published} />
            </div>
            <div className="w-full flex gap-3 flex-wrap mt-2 justify-end">
              {/* <Link
                to={`/novels/${novel.id}#${index}`}
                className="rounded-lg text-gray-100 font-semibold flex items-center justify-center h-[50px] w-[165px] bg-slate-700 hover:bg-slate-500">
                Read Novel
              </Link> */}
              <Form method="post" className={!page.members.some(member => member.id === user.id) ? 'flex' : 'hidden'}>
                <button
                  value={page.id}
                  name="selected_page"
                  disabled={isLoadingUpdate}
                  className="rounded-lg text-gray-100 font-semibold flex items-center justify-center h-[50px] w-[165px] bg-emerald-700 hover:bg-emerald-500">
                  Participate
                </button>
              </Form>
              <Link
                to={`/dash/page/${page.id}`}
                className={
                  page.members.some(member => member.id === user.id)
                    ? 'rounded-lg text-gray-100 font-semibold flex items-center justify-center h-[50px] w-[165px] bg-emerald-700 hover:bg-emerald-500'
                    : 'hidden'
                }>
                Continue Writing
              </Link>
              <Form method="delete" className={page.owner.id === user.id ? 'flex' : 'hidden'}>
                <button
                  disabled={isLoadingUpdate}
                  value={page.id}
                  name="page_id_delete"
                  className="rounded-lg text-gray-100 font-semibold flex items-center justify-center h-[50px] w-[165px] bg-orange-700 hover:bg-orange-500">
                  Delete Page
                </button>
              </Form>
            </div>
          </div>
        ))}
        <Form
          onSubmit={e => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('page_index', (pages?.length + 1).toString() || '0');
            formData.append('novel_owner', novel.owner.id);
            formData.append('updated_at', new Date().toISOString());
            submit(formData, { method: 'put' });
          }}>
          <button
            type="submit"
            name="add_page"
            className="w-full max-w-wide h-[180px] rounded-lg bg-slate-400 bg-opacity-25 backdrop-blur-lg items-center drop-shadow-lg">
            <div className="truncate max-w-full p-8 overflow-hidden flex flex-wrap gap-3 text-gray-700">
              <PlusIcon uniqueId="add_another_page" svgColor="currentColor" className="w-5 h-auto " />{' '}
              <p className="text-xl font-semibold">Add Another Page</p>
            </div>
          </button>
        </Form>
      </div>
      <div className="flex w-full max-w-wide justify-center sticky bottom-4">
        <Link to="/dash" className="primaryButton py-2.5" type="button">
          Back
        </Link>
      </div>
    </div>
  );
}
