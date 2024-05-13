import { LoaderFunctionArgs } from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
  useOutletContext
} from "@remix-run/react";
import {
  createServerClient,
  SupabaseClient,
} from "@supabase/auth-helpers-remix";
import { envConfig } from "~/helpers/supabase";
import LOCALES from "~/locales/language_en.json";
import Default_Avatar from "~/images/default_avatar.jpeg";
import { ToastAlert } from "~/components/ToastAlert";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const env = envConfig();
  const response = new Response();
  const supabase = await createServerClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    { request, response }
  );
  const data = await supabase.auth.getUser();
  const userData = await supabase.from("profiles").select().eq("id", data.data.user?.id);
  console.log(userData);
  return { data: userData.data?.[0], headers: response.headers };
};

export type userData = {
  avatar: string;
  color: string;
  email: string;
  email_verified: boolean;
  phone_verified: boolean;
  sub: string;
  username: string;
};

export default function Dashboard() {
  const { data } = useLoaderData() as { data: userData };

  console.log(data);
  const supabase = useOutletContext() as SupabaseClient;
  const navigate = useNavigate();

  const user = {
    username: data?.username || "Not Found",
    avatar: data?.avatar || Default_Avatar,
    email: data?.email || "Unknonwn",
    color: data?.color || "#aeaeae",
  };
  const LocalStrings = LOCALES.onboarding;

  const handleSignOut = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-gray-600 text-3xl m-0 font-medium font-mono text-center">
        User Profile
      </h1>
      <div className="p-4 w-card-l max-w-full">
        <div className="w-full flex justify-center items-center gap-3 flex-col rounded-lg shadow-xl px-12 py-8 bg-white">
          <div className="w-full flex flex-col justify-center items-center">
            <img
              alt="onboarding-img"
              className="w-32 h-32 rounded-full object-cover"
              src={user.avatar}
            />
          </div>
          <div className="w-full flex flex-col gap-3 font-mono">
            <p className="w-full text-gray-600">
              {LocalStrings.username}: {user.username}
            </p>
          </div>
          <div className="w-full flex flex-col gap-3 font-mono">
            <p className="w-full text-gray-600">
              {LocalStrings.email}: {user.email}
            </p>
          </div>
          <div className="w-full flex gap-3 font-mono">
            <p className="text-gray-600">{LocalStrings.color}: </p>
            <div
              className="h-5 w-5 rounded-lg"
              style={{ backgroundColor: user.color }}
            />
            <p className="text-gray-600">{user.color}</p>
          </div>
        </div>
      </div>
      <button
        className="rounded-lg h-10 px-4 text-gray-100 bg-blue-500 hover:bg-green-500 flex items-center justify-center"
        onClick={handleSignOut}
      >
        Sign out
      </button>
      <ToastAlert />
    </div>
  );
}
