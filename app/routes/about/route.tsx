import { MetaFunction } from '@remix-run/node';
import { Link, useOutletContext } from '@remix-run/react';

import { useEffect } from 'react';

import LOCALES from '~/locales/language_en.json';

import { PublicLayout } from '~/components/PublicLayout';

import { LexicalLogo, LiveblocksLogo, VercelLogo } from './svg';
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

  return (
    <PublicLayout>
      <div className="max-w-[1200px] w-full flex items-center flex-col flex-auto gap-10 md:pt-[100px] pt-0">
        <h1 className="text-red-700 text-6xl m-0 font-mono text-center font-miltonian [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)]">
          {LocalStrings.title}
        </h1>
        <div className="flex flex-col gap-10 bg-slate-400 p-6 rounded-xl bg-opacity-25 backdrop-blur-sm shadow-sm">
          <h2 className="text-4xl m-0 font-mono text-center font-semibold text-gray-800 tracking-wide">
            Technology Stack
          </h2>
          <div className="w-full flex flex-wrap justify-center items-center md:gap-16 gap-6">
            <ReactLogo svgColor="#00d8ff" uniqueId="credit-React" className="w-auto max-w-full h-28 p-2" />
            <RemixLogo uniqueId="credit-remix" className="w-auto max-w-full h-28 p-2" />
            <ViteLogo uniqueId="credit-Vite" className="w-auto max-w-full h-28 p-2" />
            <LiveblocksLogo uniqueId="liveblocks-logo" className="w-auto max-w-full h-14" />
            <LexicalLogo uniqueId="lexical-logo" className="w-auto max-w-full h-14" />
            <ThreeLogo uniqueId="credit-ThreeJs" className="w-auto max-w-full h-28 p-2" />
            <GsapLogo uniqueId="credit-gsap" className="w-auto max-w-full h-20 p-2" />
            <TailwindLogo uniqueId="credit-twcss" className="w-auto max-w-full h-28 p-2" />
            <VercelLogo uniqueId="credit-vercel" className="w-auto max-w-full h-20 p-2" />
            <SupabaseLogo uniqueId="credit-supabase" className="w-auto max-w-full h-28 p-2" />
            <BunLogo uniqueId="credit-bun" className="w-auto max-w-full h-28 p-2" />
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full bg-slate-400 p-10 rounded-xl bg-opacity-25 backdrop-blur-sm shadow-sm">
          <h2 className="text-4xl m-0 font-mono text-center font-semibold text-gray-800 tracking-wide">
            {LocalStrings.background.title}
          </h2>
          <p className="text-2xl text-gray-800 font-semibold">{LocalStrings.background.name}</p>
          <p className="text-xl text-gray-100">
            <span className="font-semibold text-gray-800 break-all">Author: </span>
            {LocalStrings.background.author}
          </p>
          <a href={LocalStrings.background.source} className="text-xl text-gray-100 break-all max-w-full">
            <span className="font-semibold text-gray-800">Source:</span> {LocalStrings.background.source}
          </a>
        </div>
        <Link to="/" className="primaryButton py-2.5">
          {LocalStrings.primary_button}
        </Link>
      </div>
    </PublicLayout>
  );
}
