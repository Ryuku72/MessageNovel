import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { NovelinLibraryEntry } from '~/types';

import { DashNovelIdLoader } from './services';
import DashNovelIdView from './view';

export function loader(data: LoaderFunctionArgs) {
  if (!data.params.novelId) return null;
  return DashNovelIdLoader(data);
}

export default function DashNovelId() {
  const loaderData = useLoaderData<{ data: NovelinLibraryEntry[] }>();
  const data = loaderData?.data?.[0] || {};

  return <DashNovelIdView loaderData={data} />;
}
