import { Link, Outlet } from '@remix-run/react';

import { NovelinLibraryEntry, UserDataEntry } from '~/types';

import { CreateDate } from '~/helpers/DateHelper';
import LOCALES from '~/locales/language_en.json';

import PrivateNavBar from './components/PrivateNavBar';

export type DashViewProps = {
  handleSubmit: (e: React.MouseEvent) => void;
  loaderData: {
    user: UserDataEntry;
    library: NovelinLibraryEntry[];
  };
  isLoading: boolean;
};

export default function DashView({ handleSubmit, loaderData, isLoading }: DashViewProps) {
  const LocalStrings = LOCALES.dash;
  const library = loaderData?.library || [];

  return (
    <div className="w-full h-full flex flex-row relative">
      <PrivateNavBar user={loaderData.user} isLoading={isLoading} handleSubmit={handleSubmit} />
      <div className="flex flex-col items-center w-full px-10 max-[768px]:px-3 py-12 max-[768px]:py-4 gap-6 overflow-hidden">
        <h1 className="text-red-700 text-4xl m-0 underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian min-[768px]:hidden">
          &nbsp;&nbsp;{LocalStrings.title}&nbsp;&nbsp;&nbsp;
        </h1>
        <div className="flex flex-col w-full rounded-lg shadow-xl bg-slate-50 backdrop-blur-sm bg-opacity-55 pb-4 overflow-auto align-start max-w-[1250px]">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-4 pl-8 py-4 text-slate-500 text-left min-w-[85px]">
                  {LocalStrings.table_heading.index}
                </th>
                <th className="border-b p-4 pl-8 py-4 text-slate-500 text-left min-w-[300px]">
                  {LocalStrings.table_heading.title}
                </th>
                <th className="border-b p-4 pl-8 py-4 text-slate-500 text-left min-w-[165px]">
                  {LocalStrings.table_heading.owner}
                </th>
                <th className="border-b p-4 pl-8 py-4 text-slate-500 text-left min-w-[165px]">
                  {LocalStrings.table_heading.created}
                </th>
                <th className="border-b p-4 pl-8 py-4 text-slate-500 text-left min-w-[165px]">
                  {LocalStrings.table_heading.updated}
                </th>
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
                    <Link to={`/dash/${insert?.id}`}>{CreateDate(insert.created_at)}</Link>
                  </td>
                  <td className="border-b border-slate-100 p-4 pl-8 text-slate-600 whitespace-nowrap text-ellipsis">
                    <Link to={`/dash/${insert?.id}`}>{CreateDate(insert.updated_at)}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
