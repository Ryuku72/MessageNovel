import { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, Link, useActionData, useNavigation, useOutletContext, useSubmit } from '@remix-run/react';

import { useEffect, useState } from 'react';

import LOCALES from '~/locales/language_en.json';
import { UserDataEntry } from '~/types';

import AvatarInput from '~/components/AvatarSelectInput';
import ColorInput from '~/components/ColorInput';
import DialogWrapper from '~/components/DialogWrapper';
import TitleInput from '~/components/TitleInput';

import { TrashIcon } from '~/svg';
import CloseIcon from '~/svg/CloseIcon/CloseIcon';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import { DashOutletContext } from '../dash/route';
import { SettingsAction } from './services';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export function action({ request }: ActionFunctionArgs) {
  return SettingsAction(request);
}

export default function DashSettings() {
  const { user, channel } = useOutletContext<DashOutletContext>();
  const navigationState = useNavigation();
  const actionData = useActionData<UserDataEntry>();
  const isLoading = 'submitting' === navigationState.state;
  const submit = useSubmit();

  const [colorSelect, setColorSelect] = useState(user.color);
  const [username, setUsername] = useState(user.username);
  const [imageFile, setImage] = useState<File | null>(null);
  const [showDelModal, setShowDelModal] = useState(false);

  useEffect(() => {
    if (!channel || !actionData) return;
    channel.send({
      type: 'broadcast',
      event: 'user update',
      payload: actionData
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  useEffect(() => {
    if (!channel || channel.state !== 'joined') return;
    channel.track({ userId: user.id, room: 'Settings' });
  }, [channel, user.id]);

  const disabled = username === user.username && !imageFile && user.color === colorSelect;
  const formDisabled = ['submitting', 'loading'].includes(navigationState.state);
  const LocalStrings = LOCALES.settings;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative m-auto md:mb-0 md:pb-10 py-10 pb-[100px]">
      <h1 className="text-red-700 text-4xl text-center [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)] font-miltonian">
        {LocalStrings.title}
      </h1>
      <Form
        onSubmit={e => {
          e.preventDefault();
          const formData = new FormData();
          if (imageFile) formData.append('avatar', imageFile);
          formData.append('color', colorSelect);
          formData.append('username', username);
          submit(formData, { method: 'post', encType: 'multipart/form-data' });
        }}
        aria-label="update-account"
        method="post"
        className="p-4 w-card-l max-w-full">
        <fieldset className="w-full flex flex-col justify-center items-center gap-3" disabled={formDisabled}>
          <div
            className={`w-full flex justify-center items-center gap-3 flex-col rounded-lg shadow-xl px-12 py-8 ${user.color} bg-opacity-65 backdrop-blur-lg`}>
            <AvatarInput title="Upload file" id="avatar" setImage={setImage} imageSrc={user?.avatar} />
            <TitleInput title={LocalStrings.email} id="email" value={user.email} disabled={true} />
            <TitleInput
              title={LocalStrings.username}
              id="username"
              value={username}
              placeholder="Enter New Username..."
              onChange={setUsername}
            />
            <ColorInput title={LocalStrings.color} id="color" value={colorSelect} onChange={setColorSelect} />
          </div>
          <div className="flex flex-wrap gap-3 w-full justify-center">
            <Link to="/dash" className="primaryButton py-2.5" type="button">
              Back
            </Link>
            <button
              className={`secondaryButton ${isLoading ? 'py-0.5' : 'py-2.5'} disabled:bg-gray-300`}
              type="submit"
              disabled={disabled}>
              {isLoading ? (
                <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="index-spinner" />
              ) : (
                'Update'
              )}
            </button>
          </div>
        </fieldset>
      </Form>
      <button
        type="button"
        onClick={() => setShowDelModal(true)}
        className="absolute top-3 right-3 text-sm text-red-700 hover:text-red-500 text-right h-[40px] px-5 border-red-700 hover:border-red-500 border rounded bg-white bg-opacity-10 backdrop-blur-sm font-bold">
        <TrashIcon uniqueId="deleteaccount" svgColor="currentColor" className="w-4 h-auto" />
      </button>
      <DialogWrapper open={showDelModal}>
        <Form
          method="delete"
          className="w-full max-w-card-l md:p-4 p-0 flex flex-col gap-1 md:self-center self-baseline text-mono m-auto md:m-0">
          <fieldset disabled={formDisabled}>
            <div className="bg-slate-50 bg-opacity-55 backdrop-blur-lg flex flex-col gap-0.5 rounded-t-lg rounded-b-md flex-auto md:flex-1">
              <div className="w-full pt-4 px-6 pb-2 flex flex-wrap rounded-t-[inherit] justify-between items-center bg-white">
                <h3 className="font-medium text-xl text-gray-600 underline underline-offset-4 capitalize">
                  &#8197;Delete User Account&nbsp;&nbsp;&nbsp;
                </h3>
                <button
                  className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-red-500 hover:border hover:border-red-500 rounded"
                  type="button"
                  onClick={() => setShowDelModal(false)}>
                  <CloseIcon className="w-3 h-3" uniqueId="dash-close" svgColor="currentColor" />
                </button>
              </div>
              <div className="w-full py-4 px-4 bg-white rounded-b-md flex flex-col gap-6">
                <p className="text-base text-gray-700 whitespace-pre-wrap">
                  {
                    'By deleting this account will be remove all associated novels and comments\n\nAre you sure you want to delete this user account?'
                  }
                </p>
                <div className="flex w-full justify-end bg-white rounded-b-md gap-3">
                  <button className="primaryButton py-2.5">Delete</button>{' '}
                  <button
                    type="button"
                    className="secondaryButton py-2.5"
                    onClick={() => {
                      setShowDelModal(false);
                    }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </fieldset>
        </Form>
      </DialogWrapper>
    </div>
  );
}
