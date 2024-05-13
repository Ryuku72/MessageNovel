import type { MetaFunction } from "@remix-run/node";
import * as THREE from "three";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );

    camera.position.setZ(0);
    camera.position.setX(-20);
    camera.position.setY(-10);

    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#canvas-bg") as HTMLCanvasElement,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);

    const geometry = new THREE.DodecahedronGeometry(50, 1);
    const material = new THREE.MeshBasicMaterial({
      color: colorSelect,
      wireframe: true,
    });
    const hedron = new THREE.Mesh(geometry, material);

    scene.add(hedron);

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);
    const animate = () => {
    hedron.rotation.x += 0.001;
    hedron.rotation.y += 0.001;
    hedron.rotation.z += 0.001;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    }
    animate();

  }, []);

  const handleError = (error: Error | PostgrestError) => {
    const errorEvent = new CustomEvent("alert from error", {
      detail: error?.message,
    });
    return document.dispatchEvent(errorEvent);
  };

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
    <div className="flex flex-col flex-auto relative w-full h-full">
      <div className="flex flex-col m-auto py-20 px-3">
        <h1 className="text-gray-600 text-3xl m-0 font-medium font-mono text-center">
          {LocalStrings.title}
        </h1>
        <div className="p-4 max-w-full">
          <form
            method="post"
            className="w-full max-w-lg flex flex-col justify-center items-center gap-3 rounded-lg shadow-xl px-12 py-8 bg-white"
            onSubmit={handleSubmit}
          >
            <div className="flex gap-6">
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
            />
            <TitleInput
              title={LocalStrings.password}
              id="onboarding-password"
              placeholder={LocalStrings.password_placeholder}
              value={password}
              onChange={setPassword}
            />

            <div className="w-full flex items-center flex-col gap-3 justify-center pt-3">
              <button className="rounded-lg h-10 px-4 text-gray-100 bg-blue-500 hover:bg-green-500 flex items-center justify-center font-mono">
                {isLoading ? (
                  <LoadingSpinner
                    className="w-full h-10"
                    svgColor="#fff"
                    uniqueId="onboarding-loading"
                  />
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
