import { useEffect } from 'react';

import { Link, useOutletContext } from '@remix-run/react';

import LOCALES from '~/locales/language_en.json';
import GsapLogo from '~/svg/GsapLogo/GsapLogo';
import ReactLogo from '~/svg/ReactLogo/ReactLogo';
import RemixLogo from '~/svg/RemixLogo/RemixLogo';
import SupabaseLogo from '~/svg/SupabaseLogo/SupabaseLogo';
import TailwindLogo from '~/svg/TailwindLogo/TailwindLogo';
import ThreeLogo from '~/svg/ThreeLogo/ThreeLogo';
import ViteLogo from '~/svg/ViteLogo/ViteLogo';
import { MetaFunction } from '@remix-run/node';
import PublicNavBar from '~/components/PublicNavBar';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export default function About() {
  const { sceneReady } = useOutletContext() as { sceneReady: boolean };
  const LocalStrings = LOCALES.about;

  useEffect(() => {
    if (!sceneReady) return;
    const sceneEvent = new CustomEvent('sceneUpdate', {
      detail: 5
    });
    window.dispatchEvent(sceneEvent);
  }, [sceneReady]);

  const Logo = (props: { type: string }) => {
    const type = props.type;
    switch (type) {
      case 'Remix Run':
        return <RemixLogo svgColor="none" uniqueId="credit-remix" className="w-full h-full p-2" />;
      case 'React':
        return <ReactLogo svgColor="#00d8ff" uniqueId="credit-React" className="w-full h-full p-2" />;
      case 'Vite':
        return <ViteLogo uniqueId="credit-Vite" className="w-full h-full p-2" />;
      case 'ThreeJs':
        return <ThreeLogo uniqueId="credit-ThreeJs" className="w-full h-full p-2" />;
      case 'Gsap':
        return <GsapLogo uniqueId="credit-gsap" className="w-full h-full p-2" />;
      case 'TailwindCSS':
        return <TailwindLogo uniqueId="credit-twcss" className="w-full h-full p-2" />;
      case 'Supabase':
        return <SupabaseLogo uniqueId="credit-supabase" className="w-full h-full p-2" />;
    }
  };

  return (
    <div className="w-full flex relative p-10 flex-col flex-auto items-center">
      <PublicNavBar />
      <div className="max-w-[1200px] w-full flex items-center justify-center flex-col flex-auto gap-10">
        <h1 className="text-red-700 text-6xl m-0 font-mono text-center font-miltonian [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)]">{LocalStrings.title}</h1>
        <div className="p-4 w-full flex flex-wrap justify-center gap-16">
          {LocalStrings.technology.map(tech => (
            <div
              key={tech}
              className="has-tooltip cursor-pointer relative min-[768px]:h-40 max-[768px]:h-28 min-[768px]:w-40 max-[768px]:w-28">
              <Logo type={tech} />
              <div className="w-full py-2 flex justify-center">
                <div
                  role="tooltip"
                  className="tooltip z-10 inline-block px-4 py-2 text-sm text-white transition-opacity duration-300 bg-gray-600 backdrop-blur-sm rounded-lg shadow-sm bg-opacity-35">
                  {tech}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link
          to="/"
          className="rounded-lg px-5 py-2.5 text-gray-100 bg-orange-400 hover:bg-orange-500 flex items-center justify-center w-full max-w-button">
          {LocalStrings.primary_button}
        </Link>
      </div>
    </div>
  );
}
