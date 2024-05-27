import { Link } from '@remix-run/react';

import { primaryButtonClassName } from '~/common/buttonFactory';
import LOCALES from '~/locales/language_en.json';

import { PublicLayout } from '~/components/PublicLayout';
import GsapLogo from '~/svg/GsapLogo/GsapLogo';
import ReactLogo from '~/svg/ReactLogo/ReactLogo';
import RemixLogo from '~/svg/RemixLogo/RemixLogo';
import SupabaseLogo from '~/svg/SupabaseLogo/SupabaseLogo';
import TailwindLogo from '~/svg/TailwindLogo/TailwindLogo';
import ThreeLogo from '~/svg/ThreeLogo/ThreeLogo';
import ViteLogo from '~/svg/ViteLogo/ViteLogo';

export default function AboutView() {
  const LocalStrings = LOCALES.about;

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
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-[1200px] w-full flex items-center flex-col flex-auto gap-10 pt-[100px] max-[768px]:pt-0">
        <h1 className="text-red-700 text-6xl m-0 font-mono text-center font-miltonian [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)]">
          {LocalStrings.title}
        </h1>
        <div className="flex flex-col gap-3">
          <h2 className="text-red-700 text-4xl m-0 font-mono text-center font-miltonian [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)]">
          {LocalStrings.technology.title}
          </h2>
          <div className="w-full flex flex-wrap justify-center gap-16 max-[768px]:gap-6">
            {LocalStrings.technology.list.map(tech => (
              <div
                key={tech.name}
                className="has-tooltip cursor-pointer relative min-[768px]:h-40 max-[768px]:h-24 min-[768px]:w-40 max-[768px]:w-24">
                <Logo type={tech.name} />
                <div className="w-full h-full py-2 flex items-center flex-col">
                  <div
                    role="tooltip"
                    className="tooltip z-10 inline-block px-4 py-2 text-sm text-white transition-opacity duration-300 bg-gray-600 backdrop-blur-sm rounded-lg shadow-sm bg-opacity-35 whitespace-pre">
                    {tech.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-red-700 text-4xl m-0 font-mono text-center font-miltonian [text-shadow:_5px_3px_2px_rgb(225_225_225_/_50%)]">
            {LocalStrings.background.title}
          </h2>
          <p>{LocalStrings.background.name}</p>
          <p>{LocalStrings.background.source}</p>
          <p>{LocalStrings.background.author}</p>
        </div>
        <Link to="/" className={primaryButtonClassName}>
          {LocalStrings.primary_button}
        </Link>
      </div>
    </PublicLayout>
  );
}
