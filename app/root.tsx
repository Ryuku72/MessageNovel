import { useEffect, useState } from 'react';

import { ToastAlert } from './components/ToastAlert';
import type { LinksFunction } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError
} from '@remix-run/react';

import LoadingLayer from '~/components/LoadingLayer';
import ThreeBg from '~/components/lighthouse/threeBg';

import stylesheet from '~/styles/tailwind.css?url';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/apple-touch-icon.png'
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicon-32x32.png'
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicon-16x16.png'
  },
  {
    rel: 'icon',
    type: 'image/x-icon',
    href: '/favicon.ico'
  },
  { rel: 'manifest', href: '/site.webmanifest' },
  {
    rel: 'mask-icon',
    href: '/safari-pinned-tab.svg',
    color: '#5bbad5'
  },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: undefined
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Miltonian&display=swap'
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="flex w-full h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col w-full h-full [background:_#bfe3dd] relative">
        <LoadingLayer />
        <ThreeBg />
        <canvas id="canvas-bg" className="fixed top-0 left-0 w-full h-full" />
        {children}
        <ToastAlert />
        <ScrollRestoration />
        <Scripts />
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/TextPlugin.min.js" />
      </body>
    </html>
  );
}

export default function App() {
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const handleSceneReady = (event: Event) => {
      if ('detail' in event && event.detail === 100) setSceneReady(true);
    };
    window.addEventListener('scene ready', handleSceneReady, false);

    return () => {
      window.removeEventListener('scene ready', handleSceneReady, false);
    };
  }, []);

  return <Outlet context={{ sceneReady }} />;
}

export function ErrorBoundary() {
  const error = useRouteError() as { message?: string };

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col gap-3 w-full h-full">
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  }

  return (
    <>
      <h1>Error!</h1>
      <p>{error?.message ?? 'Unknown error'}</p>
    </>
  );
}
