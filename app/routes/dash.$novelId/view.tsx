import { Link } from 'react-router-dom';

import { NovelinLibraryEntry } from '~/types';

import { CreateDate } from '~/helpers/DateHelper';

import DialogWrapper from '~/components/DialogWrapper';
import CloseIcon from '~/svg/CloseIcon/CloseIcon';

export type DashNovelIdViewProps = { loaderData: NovelinLibraryEntry };

export default function DashNovelIdView({ loaderData }: DashNovelIdViewProps) {
  return (
    <DialogWrapper open={true} className="max-w-full max-h-full w-full h-full justify-center p-[36px] bg-transparent">
      <div className="w-full max-w-card-l bg-white rounded-b-md rounded-t-lg flex flex-col gap-3 self-center text-mono">
        <div className="w-full pt-4 px-6 flex flex-wrap justify-between items-center">
          <h3 className="font-medium text-xl text-gray-600 underline underline-offset-4">
            &#8197;{loaderData?.title}&#8197;
          </h3>
          <Link
            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-red-500 hover:border hover:border-red-500 rounded"
            to="/dash">
            <CloseIcon className="w-3 h-3" uniqueId="dash-close" svgColor="currentColor" />
          </Link>
        </div>
        <div className="flex flex-col gap-3 w-full pb-4 px-6">
          <p>Created: {CreateDate(loaderData.created_at)}</p>
          <p>Last Update: {CreateDate(loaderData.updated_at)}</p>
          <p>Description: {loaderData.description}</p>
        </div>
      </div>
    </DialogWrapper>
  );
}
