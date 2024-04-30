import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";

import type { LinksFunction } from "@remix-run/node";
import stylesheet from "./styles/tailwind.css?url";
import appStylesheer from "./styles/app.css?url";
import appleTouch from "./favicon/apple-touch-icon.png";
import favicon32 from "./favicon/favicon-32x32.png";
import favicon16 from "./favicon/favicon-16x16.png";
import favicon from "./favicon/favicon.ico";
import favManifest from "./favicon/site.webmanifest";
import favMask from "./favicon/safari-pinned-tab.svg"


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: appStylesheer },
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: appleTouch,
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: favicon32,
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: favicon16,
  },
  {
    rel: 'icon',
    type: 'image/x-icon',
    href: favicon,
  },
  { rel: 'manifest', href: favManifest },
  {
   rel: 'mask-icon',
   href: favMask,
   color: '#5bbad5',
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
      <body className="flex w-full h-full">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
