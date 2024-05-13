import type { MetaFunction } from "@remix-run/node";
import * as THREE from "three";
import { Link, useNavigate, useOutletContext } from "@remix-run/react";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import TitleInput from "~/components/TitleInput";
import { ToastAlert } from "~/components/ToastAlert";
import { useLoading } from "~/helpers/useLoading";
import LOCALES from "~/locales/language_en.json";
import LoadingSpinner from "~/svg/LoadingSpinner/LoadingSpinner";

export const meta: MetaFunction = () => {
  return [
    { title: LOCALES.meta.title },
    { name: "description", content: LOCALES.meta.description },
  ];
};

export default function Index() {
  const [signInValue, setSignInValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const { isLoading, withLoading } = useLoading();

  const supabase = useOutletContext() as SupabaseClient;
  const navigate = useNavigate();

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
    camera.position.setX(0);

    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#canvas-bg") as HTMLCanvasElement,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);

    const length = 20,
      width = 30;

    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, width);
    shape.lineTo(length, width);
    shape.lineTo(length, 0);
    shape.lineTo(0, 0);

    const extrudeSettings = {
      steps: 2,
      depth: 20,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 12,
      bevelSegments: 1,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshBasicMaterial({
      color: 0xccccff,
      wireframe: true,
    });
    const hedron = new THREE.Mesh(geometry, material);

    scene.add(hedron);

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);

    function animate() {
      requestAnimationFrame(animate);

      hedron.rotation.x += 0.0005;
      hedron.rotation.y += 0.0006;
      hedron.rotation.z += 0.001;

      renderer.render(scene, camera);
    }

    animate();
  }, []);

  const handleSubmit = (e?: React.FormEvent) =>
    withLoading(() => {
      e?.preventDefault();
      return supabase.auth
        .signInWithPassword({
          email: signInValue,
          password: passwordValue,
        })
        .then((res) => {
          if (!res?.error) navigate("/dashboard");

          const errorEvent = new CustomEvent("alert from error", {
            detail: res?.error?.message,
          });
          document.dispatchEvent(errorEvent);
          return res;
        })
        .catch((err) => {
          const errorEvent = new CustomEvent("alert from error", {
            detail: err.message,
          });
          document.dispatchEvent(errorEvent);
          return err;
        });
    })();

  return (
    <div className="w-full h-full flex justify-center items-center flex-col flex-auto absolute">
      <div className="p-12 flex justify-center items-center gap-3 flex-col w-full max-w-c-600 flex-auto">
        <h1 className="text-gray-600 text-3xl m-0 font-medium font-mono">
          {LOCALES.index.title}
        </h1>
        <form onSubmit={handleSubmit} className="flex  w-full flex-col gap-3">
          <TitleInput
            title="Sign In"
            id="index-signin"
            value={signInValue}
            onChange={setSignInValue}
            placeholder="jojo@email.com"
          />
          <TitleInput
            title="Password"
            id="index-password"
            value={passwordValue}
            onChange={setPasswordValue}
            placeholder="****"
          />
          <div className="w-full flex items-center flex-col gap-3 justify-center pt-3">
            <button
              className="rounded-lg h-10 px-4 text-gray-100 bg-blue-500 hover:bg-green-500 w-full max-w-button flex items-center justify-center"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner
                  className="w-full h-10"
                  svgColor="#fff"
                  uniqueId="index-spinner"
                />
              ) : (
                LOCALES.index.primary_button
              )}
            </button>
            <Link
              to="/onboarding"
              className="rounded-lg h-10 px-4 text-gray-100 bg-orange-400 hover:bg-orange-500 flex items-center justify-center w-full max-w-button"
            >
              {LOCALES.index.secondary_button}
            </Link>
          </div>
        </form>
      </div>
      <ToastAlert />
    </div>
  );
}
