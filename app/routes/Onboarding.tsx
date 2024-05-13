import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import Default_Avatar from "~/images/default_avatar.jpeg";
import TitleInput from "~/components/TitleInput";
import ColorInput from "~/components/ColorInput";
import AvatarInput from "~/components/AvatarSelectInput";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import LOCALES from "~/locales/language_en.json";
import { SupabaseClient } from "@supabase/auth-helpers-remix";
import { envConfig, envConfigType } from "~/helpers/supabase";
import LoadingSpinner from "~/svg/LoadingSpinner/LoadingSpinner";
import { useLoading } from "~/helpers/useLoading";
import { ToastAlert } from "~/components/ToastAlert";
import { PostgrestError } from "@supabase/supabase-js";

export const loader = () => envConfig();
export const meta: MetaFunction = () => {
  return [
    { title: LOCALES.meta.title },
    { name: "description", content: LOCALES.meta.description },
  ];
};

export default function Onboarding() {
  const LocalStrings = LOCALES.onboarding;
  const env = useLoaderData() as envConfigType;
  const supabase = useOutletContext() as SupabaseClient;

  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [viewImage, setViewImage] = useState(Default_Avatar);
  const [colorSelect, setColorSelect] = useState("#aeaeae");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { isLoading, withLoading } = useLoading();

  const handleError = (error: Error | PostgrestError) => {
    const errorEvent = new CustomEvent("alert from error", {
      detail: error?.message,
    });
    return document.dispatchEvent(errorEvent);
  }

  const handleOnImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;
    const [target] = e.target.files;
    const imageURL = URL.createObjectURL(target);
    console.log(target);
    setViewImage(imageURL);
    setAvatarImage(target);
  };

  const handleSubmit = (e: React.FormEvent) =>
    withLoading(async () => {
      e.preventDefault();
      const auth = await supabase.auth.signUp({
        email,
        password,
      });
      if (auth.error) return handleError(auth.error);
      if (avatarImage) {
        const extension = avatarImage.name.split(".").at(-1);
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(
            `/${auth.data.user?.id}/${auth.data.user?.id}.${extension}`,
            avatarImage
          );
        if (!error) {
          const update = await supabase
            .from("profiles")
            .update({
              username,
              color: colorSelect,
              avatar: `${env.SUPABASE_URL}/storage/v1/object/public/avatars/${auth.data.user?.id}/${auth.data.user?.id}.${extension}`,
            })
            .eq("id", auth.data.user?.id)
            .select();
          if (update.error) return handleError(update.error);
        } else return handleError(error);
      } else {
        const update = await supabase
          .from("profiles")
          .update({
            username,
            color: colorSelect,
          })
          .eq("id", auth.data.user?.id)
          .select();
        if (update.error) return handleError(update.error);
      }
      navigate("/check_email");
    })();

  return (
    <div className="flex flex-col flex-auto bg-gray-100">
      <div className="flex flex-col m-auto py-20 px-3">
        <h1 className="text-gray-600 text-3xl m-0 font-medium font-mono text-center">
          {LocalStrings.title}
        </h1>
        <div className="p-4 w-card-l max-w-full">
          <form
            method="post"
            className="w-full flex justify-center items-center gap-3 flex-col rounded-lg shadow-xl px-12 py-8 bg-white"
            onSubmit={handleSubmit}
          >
            <AvatarInput
              title={LocalStrings.avatar}
              id="onboarding-avatar"
              value={viewImage}
              onChange={handleOnImageChange}
            />
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
            />
            <TitleInput
              title={LocalStrings.password}
              id="onboarding-password"
              placeholder={LocalStrings.password_placeholder}
              value={password}
              onChange={setPassword}
            />
            <ColorInput
              title={LocalStrings.color}
              id="onboarding-color-select"
              value={colorSelect}
              onChange={setColorSelect}
            />
            <div className="w-full flex items-center flex-col gap-3 justify-center pt-3">
              <button className="rounded-lg h-10 px-4 text-gray-100 bg-blue-500 hover:bg-green-500 flex items-center justify-center font-mono">
                {isLoading ? (
                  <LoadingSpinner className="w-full h-10" svgColor="#fff" uniqueId="onboarding-loading" />
                ) : (
                  LocalStrings.primary_button
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastAlert />
    </div>
  );
}
