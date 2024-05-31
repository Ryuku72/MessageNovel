import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { NovelinLibraryEntry } from '~/types';

import { CreateDate } from '~/helpers/DateHelper';
import LOCALES from '~/locales/language_en.json';

import { DashIndexLoader } from './service';

export function loader({ request }: LoaderFunctionArgs) {
  return DashIndexLoader(request);
}

export default function DashIndex() {
  const library = useLoaderData<NovelinLibraryEntry[]>();
  const LocalStrings = LOCALES.dash;

  return (
    <div className="flex flex-col max-[768px]:flex-auto items-center w-full px-10 max-[768px]:px-3 py-12 max-[768px]:py-4 gap-6 overflow-hidden">
      <h1 className="text-red-700 text-4xl m-0 underline underline-offset-8 [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        &nbsp;&nbsp;{LocalStrings.title}&nbsp;&nbsp;&nbsp;
      </h1>
      <div className="flex flex-col w-full rounded-lg shadow-xl bg-slate-50 backdrop-blur-sm bg-opacity-55 pb-4 overflow-auto align-start max-w-[1250px]">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white bg-opacity-75 backdrop-blur-lg">
            <tr>
              <th className="border-b p-4 pl-8 py-4 text-slate-500 text-left">
                {LocalStrings.table_heading.index}
              </th>
              <th className="border-b p-4 pl-8 py-4 text-slate-500 text-left min-w-[300px]">
                {LocalStrings.table_heading.title}
              </th>
              <th className="border-b p-4 pl-8 py-4 text-slate-500 text-left">
                {LocalStrings.table_heading.owner}
              </th>
              <th className="border-b p-4 pl-8 py-4 text-slate-500 text-left">
                {LocalStrings.table_heading.created}
              </th>
              <th className="border-b p-4 pl-8 py-4 text-slate-500 text-left">
                {LocalStrings.table_heading.updated}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white bg-opacity-35">
            {library.map((insert, index) => (
              <tr key={insert?.id}>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-600">
                  <Link to={`/dash/${insert?.draft_id}`}>{index + 1}</Link>
                </td>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-600 whitespace-nowrap text-ellipsis">
                  <Link to={`/dash/${insert?.draft_id}`}>{insert.title}</Link>
                </td>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-600 whitespace-nowrap text-ellipsis">
                  <Link to={`/dash/${insert?.draft_id}`}>{insert.owner_username}</Link>
                </td>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-600 whitespace-nowrap text-ellipsis">
                  <Link to={`/dash/${insert?.draft_id}`}>{CreateDate(insert.created_at)}</Link>
                </td>
                <td className="border-b border-slate-100 p-4 pl-8 text-slate-600 whitespace-nowrap text-ellipsis">
                  <Link to={`/dash/${insert?.draft_id}`}>{CreateDate(insert.updated_at)}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
