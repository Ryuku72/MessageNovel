import { Link, Outlet } from '@remix-run/react';

import { NovelinLibraryEntry } from '~/types';

import { primaryButtonClassName } from '~/common/buttonFactory';
import { CreateDate } from '~/helpers/DateHelper';
import LOCALES from '~/locales/language_en.json';

import PrivateNavBar from '~/components/PrivateNavBar';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

import { UserDataEntry } from './type';

export type DashViewProps = {
  handleSubmit: (e: React.MouseEvent) => void;
  loaderData: {
    user: UserDataEntry;
    library: NovelinLibraryEntry[];
  };
};

export default function DashView({ handleSubmit, loaderData }: DashViewProps) {
  const LocalStrings = LOCALES.dash;
  const library = loaderData?.library || [];

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
