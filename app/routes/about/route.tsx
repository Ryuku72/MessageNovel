import { MetaFunction } from '@remix-run/node';
import { Link, useOutletContext } from '@remix-run/react';

import { useEffect } from 'react';

import LOCALES from '~/locales/language_en.json';

import { PublicLayout } from '~/components/PublicLayout';

import BunLogo from './svg/BunLogo/BunLogo';
import GsapLogo from './svg/GsapLogo/GsapLogo';
import ReactLogo from './svg/ReactLogo/ReactLogo';
import RemixLogo from './svg/RemixLogo/RemixLogo';
import SupabaseLogo from './svg/SupabaseLogo/SupabaseLogo';
import TailwindLogo from './svg/TailwindLogo/TailwindLogo';
import ThreeLogo from './svg/ThreeLogo/ThreeLogo';
import ViteLogo from './svg/ViteLogo/ViteLogo';

export const meta: MetaFunction = () => {
  return [{ title: LOCALES.meta.title }, { name: 'description', content: LOCALES.meta.description }];
};

export default function About() {
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();
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
      case 'Remix':
        return <RemixLogo svgColor="none" uniqueId="credit-remix" className="w-full h-full p-2" />;
      case 'React':
        return <ReactLogo svgColor="#00d8ff" uniqueId="credit-React" className="w-full h-full p-2" />;
      case 'Vite':
        return <ViteLogo uniqueId="credit-Vite" className="w-full h-full p-2" />;
      case 'Three Js':
        return <ThreeLogo uniqueId="credit-ThreeJs" className="w-full h-full p-2" />;
      case 'Gsap':
        return <GsapLogo uniqueId="credit-gsap" className="w-full h-full p-2" />;
      case 'TailwindCSS':
        return <TailwindLogo uniqueId="credit-twcss" className="w-full h-full p-2" />;
      case 'Supabase':
        return <SupabaseLogo uniqueId="credit-supabase" className="w-full h-full p-2" />;
      case 'Bun':
        return <BunLogo uniqueId="credit-bun" className="w-full h-full p-2" />;
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-[1200px] w-full flex items-center flex-col flex-auto gap-10 md:pt-[100px] pt-0">
        <h1 className="text-red-700 text-6xl m-0 font-mono text-center font-miltonian [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)]">
          {LocalStrings.title}
        </h1>
        <div className="flex flex-col gap-3 bg-slate-400 p-6 rounded-xl bg-opacity-25 backdrop-blur-sm shadow-sm">
          <h2 className="text-4xl m-0 font-mono text-center font-semibold text-gray-800 tracking-wide">
            {LocalStrings.technology.title}
          </h2>
          <div className="w-full flex flex-wrap justify-center md:gap-16 gap-6">
            {LocalStrings.technology.list.map(tech => (
              <div
                key={tech.name}
                className="has-tooltip cursor-pointer relative md:h-40 h-24 md:w-40 w-24">
                <Logo type={tech.name} />
                <div
                  role="tooltip"
                  className="absolute md:flex hidden w-full h-full left-0 bottom-0 tooltip z-10 justify-center items-center transition-opacity duration-300">
                  <Link
                    to={tech.link}
                    className=" bg-gray-900 backdrop-blur-sm rounded-lg shadow-sm bg-opacity-45 text-sm px-4 py-2 text-white cursor-pointer max-w-full whitespace-pre-wrap">
                    {tech.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full bg-slate-400 p-10 rounded-xl bg-opacity-25 backdrop-blur-sm shadow-sm">
          <h2 className="text-4xl m-0 font-mono text-center font-semibold text-gray-800 tracking-wide">
            {LocalStrings.background.title}
          </h2>
          <p className="text-2xl text-gray-800 font-semibold">{LocalStrings.background.name}</p>
          <p className="text-xl text-gray-100" ><span className="font-semibold text-gray-800">Source:</span> {LocalStrings.background.source}</p>
          <p className="text-xl text-gray-100"><span className="font-semibold text-gray-800">Author: </span>{LocalStrings.background.author}</p>
        </div>
        <Link to="/" className="primaryButton py-2.5">
          {LocalStrings.primary_button}
        </Link>
      </div>
    </PublicLayout>
  );
}
