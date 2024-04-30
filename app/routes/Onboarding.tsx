import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { useState } from "react";
import Default_Avatar from "~/images/default_avatar.jpeg";
import TitleInput from "~/components/TitleInput";
import ColorInput from "~/components/ColorInput";
import AvatarInput from "~/components/AvatarSelectInput";
import { useLoaderData } from "@remix-run/react";
import { createClient } from "@supabase/supabase-js";
import Locales from "~/locales/language_en.json";

export const meta: MetaFunction = () => {
  return [
    { title: "Onboarding | Message Novel" },
    { name: "description", content: "Collaborate and build your own noval" },
  ];
};

export const loader = () => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_KEY!,
  };
  return { env };
};

export default function Onboarding() {
  const [avatarImage, setAvatarImage] = useState(Default_Avatar);
  const [colorSelect, setColorSelect] = useState("#aeaeae");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { env } = useLoaderData<{
    env: { SUPABASE_URL: string; SUPABASE_ANON_KEY: string };
  }>();
  const [superbase] = useState(() =>
    createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  );

  const LocalStrings = Locales.onboarding;

  const handleOnImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const [target] = e.target.files;
    const imageURL = URL.createObjectURL(target);
    setAvatarImage(imageURL);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    superbase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          color: colorSelect,
          avatar: avatarImage,
        },
      },
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-gray-100">
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
            title= {LocalStrings.avatar}
            id="onboarding-avatar"
            value={avatarImage}
            onChange={handleOnImageChange}
          />
          <TitleInput
            title= {LocalStrings.username}
            id="onboarding-username"
            value={username}
            placeholder= {LocalStrings.username_placeholder}
            onChange={setUsername}
          />
          <TitleInput
            title= {LocalStrings.email}
            id="onboarding-email"
            placeholder= {LocalStrings.email_placeholder}
            value={email}
            onChange={setEmail}
          />
          <TitleInput
            title= {LocalStrings.password}
            id="onboarding-password"
            placeholder= {LocalStrings.password_placeholder}
            value={password}
            onChange={setPassword}
          />
          <ColorInput
            title= {LocalStrings.color}
            id="onboarding-color-select"
            value={colorSelect}
            onChange={setColorSelect}
          />
          <div className="w-full flex items-center justify-center pt-3">
            <button className="rounded-lg h-10 px-4 text-gray-100 bg-blue-500 hover:bg-green-500 flex items-center justify-center">
              {LocalStrings.primary_button}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
