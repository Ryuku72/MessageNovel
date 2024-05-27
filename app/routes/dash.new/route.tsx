import { ActionFunctionArgs } from '@remix-run/node';
import { useNavigation } from '@remix-run/react';

import { useState } from 'react';

import DashNewAction from './action';
import DashNewView from './view';

export function action({ request }: ActionFunctionArgs) {
  return DashNewAction(request);
}

export default function DashNew() {
  const [draftNovelTitle, setDraftNovelTitle] = useState('');
  const [draftNovelDescription, setDraftNovelDescription] = useState('');

  const navigationState = useNavigation();
  const isLoading = navigationState.state === 'submitting';

  return <DashNewView 
  draftNovelTitle={draftNovelTitle}
  setDraftNovelTitle={setDraftNovelTitle}
  draftNovelDescription={draftNovelDescription}
  setDraftNovelDescription={setDraftNovelDescription}
  isLoading={isLoading}
  />;
}
