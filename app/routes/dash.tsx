import { useEffect } from 'react';

import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from '@remix-run/node';
import { Link, Outlet, useLoaderData, useOutletContext, useSubmit } from '@remix-run/react';

import PrivateNavBar from '~/components/PrivateNavBar';
import { primaryButtonClassName } from '~/components/common/buttonFactory';
import LOCALES from '~/locales/language_en.json';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

import { initServer } from '~/services/API';
import { ActionSignOut, LoadAuthUser } from '~/services/Auth';
import { LoadLibrary, NovelinLibraryEntry } from '~/services/Library';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export type UserDataEntry = {
  id: string;
  avatar: string;
  username: string;
  email: string;
  color: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const data = await initServer(request);
  const user = await LoadAuthUser(data);
  const library = await LoadLibrary({ ...data, ownerId: user.id });
  const userData: UserDataEntry = {
    avatar: user.user_metadata.avatar,
    id: user.id,
    username: user.user_metadata.username || 'Not Found',
    email: user?.email || 'Unknonwn',
    color: user.user_metadata.color || '#aeaeae'
  };

  return json({ library, user: userData }, { headers: data.headers });
}

export async function action({ request }: ActionFunctionArgs) {
  const data = await initServer(request);
  const body = await request.formData();
  const type = body.get('type') as string;

  if (type === 'sign_out') {
    await ActionSignOut(data);
    return redirect('/', { headers: data.headers });
  }

  return null;
}

export default function Dash() {
  const loaderData =
    useLoaderData<{
      user: UserDataEntry;
      library: NovelinLibraryEntry[];
    }>() || {};
  const library = loaderData?.library || [];
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();
  const submit = useSubmit();

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
    const month = new Date(date).getMonth().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    });
    const year = new Date(date).getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const formData = new FormData();
    formData.append('type', 'sign_out');
    submit(formData, { method: 'post' });
  };

  return (
    <div className="w-full h-full flex flex-col items-center relative">
      <PrivateNavBar user={loaderData.user} title={LocalStrings.title} handleSubmit={handleSubmit} />
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
                  <td className="border-b border-slate-100 p-4 pl-8 text-slate-600">
                    <Link to={`/dash/${insert?.id}`}>{index + 1}</Link>
                  </td>
                  <td className="border-b border-slate-100 p-4 pl-8 text-slate-600 whitespace-nowrap text-ellipsis">
                    <Link to={`/dash/${insert?.id}`}>{insert.title}</Link>
                  </td>
                  <td className="border-b border-slate-100 p-4 pl-8 text-slate-600 whitespace-nowrap text-ellipsis">
                    <Link to={`/dash/${insert?.id}`}>{insert.owner_username}</Link>
                  </td>
                  <td className="border-b border-slate-100 p-4 pl-8 text-slate-600 whitespace-nowrap text-ellipsis">
                    <Link to={`/dash/${insert?.id}`}>{createDate(insert.created_at)}</Link>
                  </td>
                  <td className="border-b border-slate-100 p-4 pl-8 text-slate-600 whitespace-nowrap text-ellipsis">
                    <Link to={`/dash/${insert?.id}`}>{createDate(insert.updated_at)}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full flex gap-5 justify-end items-center p-8 sticky bottom-0 right-0">
        <Link className={primaryButtonClassName} type="button" to="/dash/new">
          <PlusIcon uniqueId="dash_plus" svgColor="#fff" className="w-3 h-3" />
          New Novel
        </Link>
        <Outlet />
      </div>
    </div>
  );
}
