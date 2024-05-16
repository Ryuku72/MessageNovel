import { useEffect, useState } from 'react';

import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, Link, useNavigation, useOutletContext } from '@remix-run/react';

import { envConfig } from '~/helpers/supabase';

import AvatarInput from '~/components/AvatarSelectInput';
import ColorInput from '~/components/ColorInput';
import PasswordInput from '~/components/PasswordInput';
import TitleInput from '~/components/TitleInput';
import { ToastAlert } from '~/components/ToastAlert';
import LOCALES from '~/locales/language_en.json';
import LoadingSpinner from '~/svg/LoadingSpinner/LoadingSpinner';

import Default_Avatar from '~/assets/default_avatar.jpeg';

export const loader = () => envConfig();
export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export async function action({ request }: ActionFunctionArgs) {
  // const supabase = await initServer(request);
  const body = await request.formData();

  // const auth = await supabase.auth.signUp({
  //   email: body.get("onboarding-email") as string,
  //   password: body.get("onboarding-password") as string,
  // });

  const data = {
    username: body.get('onboarding-username'),
    color: body.get('onboarding-color-select'),
    avatar: body.get('onboarding-avatar')
  };

  // if (data?.avatar) console.dir((data.avatar as File)?.name);

  // eslint-disable-next-line no-console
  console.dir(data);

  return null;
}

export default function Onboarding() {
  const LocalStrings = LOCALES.onboarding;
  const { sceneReady } = useOutletContext() as { sceneReady: boolean };

  const [viewImage, setViewImage] = useState(Default_Avatar);
  const [colorSelect, setColorSelect] = useState('#aeaeae');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigationState = useNavigation();
  const isLoading = navigationState.state === 'submitting';

  useEffect(() => {
    if (!sceneReady) return;
    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 2
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  // const handleError = (error: Error | PostgrestError) => {
  //   const errorEvent = new CustomEvent('alert from error', {
  //     detail: error?.message
  //   });
  //   return window.dispatchEvent(errorEvent);
  // };

  const handleOnImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const [target] = e.target.files;
    const imageURL = URL.createObjectURL(target);
    setViewImage(imageURL);
  };

  // const handleSubmit = (e: React.FormEvent) =>
  //   withLoading(async () => {
  //     e.preventDefault();
  //     const auth = await supabase.auth.signUp({
  //       email,
  //       password,
  //     });
  //     if (auth.error) return handleError(auth.error);
  //     if (avatarImage) {
  //       const extension = avatarImage.name.split(".").at(-1);
  //       const { data, error } = await supabase.storage
  //         .from("avatars")
  //         .upload(
  //           `/${auth.data.user?.id}/${auth.data.user?.id}.${extension}`,
  //           avatarImage
  //         );
  //       if (!error) {
  //         const update = await supabase
  //           .from("profiles")
  //           .update({
  //             username,
  //             color: colorSelect,
  //             avatar: `${env.SUPABASE_URL}/storage/v1/object/public/avatars/${auth.data.user?.id}/${auth.data.user?.id}.${extension}`,
  //           })
  //           .eq("id", auth.data.user?.id)
  //           .select();
  //         if (update.error) return handleError(update.error);
  //       } else return handleError(error);
  //     } else {
  //       const update = await supabase
  //         .from("profiles")
  //         .update({
  //           username,
  //           color: colorSelect,
  //         })
  //         .eq("id", auth.data.user?.id)
  //         .select();
  //       if (update.error) return handleError(update.error);
  //     }
  //     navigate("/check_email");
  //   })();

  return (
    <div className="flex flex-col flex-auto relative w-full h-full">
      <div className="flex flex-col m-auto py-20 px-3">
        <h1 className="text-red-800 text-4xl text-center m-0 [text-shadow:_5px_3px_2px_rgb(107_114_128_/_50%)] font-medium font-miltonian">
          {LocalStrings.title}
        </h1>
        <div className="p-4 max-w-full">
          <Form
            method="post"
            encType="multipart/form-data"
            className="w-full max-w-lg flex flex-col justify-center items-center gap-3 rounded-lg shadow-xl px-12 py-8 bg-white bg-opacity-35 backdrop-blur-sm">
            <div className="flex gap-6 flex-wrap justify-center items-center">
              <AvatarInput
                title={LocalStrings.avatar}
                id="onboarding-avatar"
                value={viewImage}
                onChange={handleOnImageChange}
              />
              <ColorInput
                title={LocalStrings.color}
                id="onboarding-color-select"
                value={colorSelect}
                onChange={setColorSelect}
              />
            </div>
            <TitleInput
              title={LocalStrings.username}
              id="onboarding-username"
              value={username}
              placeholder={LocalStrings.username_placeholder}
              onChange={setUsername}
            />
            <TitleInput
              title={LocalStrings.email}
              id="onboarding-email"
              placeholder={LocalStrings.email_placeholder}
              value={email}
              onChange={setEmail}
              type="email"
            />
            <PasswordInput
              title={LocalStrings.password}
              id="onboarding-password"
              placeholder={LocalStrings.password_placeholder}
              value={password}
              onChange={setPassword}
            />

            <div className="w-full flex items-center gap-3 justify-center pt-3">
              <Link
                to="/"
                className="rounded-lg h-10 px-4 text-gray-100 w-full max-w-button bg-orange-400 hover:bg-orange-500 flex items-center justify-center">
                {LocalStrings.secondary_button}
              </Link>
              <button
                type="submit"
                className="rounded-lg h-10 px-4 w-full max-w-button text-gray-100 bg-blue-500 hover:bg-green-500 flex items-center justify-center font-mono"
                disabled={isLoading}>
                {isLoading ? (
                  <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="onboarding-loading" />
                ) : (
                  LocalStrings.primary_button
                )}
              </button>
            </div>
          </Form>
        </div>
      </div>
      <ToastAlert />
    </div>
  );
}
