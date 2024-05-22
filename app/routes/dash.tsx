import { useEffect } from 'react';

import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, redirect } from '@remix-run/node';
import { Link, Outlet, useLoaderData, useOutletContext } from '@remix-run/react';

import { initServer } from '~/helpers/supabase';

import PrivateNavBar from '~/components/PrivateNavBar';
import LOCALES from '~/locales/language_en.json';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

import { LoadAuthUser, UserDataEntry } from '~/services/Auth';
import { LoadLibrary } from '~/services/Library';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const data = await initServer(request);
  const response = await LoadAuthUser(data);
  const user = await response.json();
  const library = await LoadLibrary({ user, ...data });
  return library;
};

export async function action({ request }: ActionFunctionArgs) {
  const { supabaseClient, headers } = await initServer(request);
  const body = await request.formData();
  const type = body.get('type') as string;

  if (type === 'sign_out') {
    await supabaseClient.auth.signOut();
    return redirect('/', { headers });
  }
}

export default function Dash() {
  const loaderData =
    useLoaderData<{
      user: UserDataEntry;
      library: { id: string; title: string; owner_username: string; created_at: string; updated_at: string }[];
    }>() || {};

  const library = loaderData?.library || [];
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();

  useEffect(() => {
    if (!sceneReady) return;
    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 4
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  const LocalStrings = LOCALES.dash;

  const createDate = (date: string) => {
    const day = new Date(date).getDate().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    });
    const month =   new Date(date).getMonth().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    });
    const year = new Date(date).getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="w-full h-full flex flex-col items-center relative">
      <PrivateNavBar user={loaderData.user} title={LocalStrings.title} />
      <div className="flex flex-col max-w-[1250px] w-full px-6 overflow-hidden">
        <div className="flex flex-col flex-auto w-full rounded-lg shadow-xl bg-slate-50 backdrop-blur-sm bg-opacity-75 pb-4 overflow-auto">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-4 pl-8 py-4 text-slate-500 text-left min-w-[85px]">Index</th>
                <th className="border-b p-4 pl-8 py-4 text-slate-500 text-left min-w-[300px]">Title</th>
                <th className="border-b p-4 pl-8 py-4 text-slate-500 text-left min-w-[165px]">Owner</th>
                <th className="border-b p-4 pl-8 py-4 text-slate-500 text-left min-w-[165px]">Created</th>
                <th className="border-b p-4 pl-8 py-4 text-slate-500 text-left min-w-[165px]">Updated</th>
              </tr>
            </thead>
            <tbody className="bg-white bg-opacity-75">
              {library.map((insert, index) => (
                <tr key={insert?.id}>
                  <td className="border-b border-slate-100 p-4 pl-8 text-slate-600">{index + 1}</td>
                  <td className="border-b border-slate-100 p-4 pl-8 text-slate-600 whitespace-nowrap text-ellipsis">
                    {insert.title}
                  </td>
                  <td className="border-b border-slate-100 p-4 pl-8 text-slate-600 whitespace-nowrap text-ellipsis">
                    {insert.owner_username}
                  </td>
                  <td className="border-b border-slate-100 p-4 pl-8 text-slate-600 whitespace-nowrap text-ellipsis">
                    {createDate(insert.created_at)}
                  </td>
                  <td className="border-b border-slate-100 p-4 pl-8 text-slate-600 whitespace-nowrap text-ellipsis">
                    {createDate(insert.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full flex gap-5 justify-end items-center p-8 sticky bottom-0 right-0">
        <Link
          className="rounded-lg px-5 py-2.5 text-gray-100 bg-slate-400 hover:bg-slate-600 hover:text-gray-100 w-full max-w-button flex items-center justify-center bg-opacity-95 backdrop-blur-sm shadow-xl gap-2"
          type="button"
          to="/dash/new">
          <PlusIcon uniqueId="dash_plus" svgColor="#fff" className="w-3 h-3" />
          New Novel
        </Link>
        <Outlet />
      </div>
    </div>
  );
}
