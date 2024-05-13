import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import type { LinksFunction } from "@remix-run/node";
import stylesheet from "./styles/tailwind.css?url";
import appStylesheer from "./styles/app.css?url";
import appleTouch from "./favicon/apple-touch-icon.png";
import favicon32 from "./favicon/favicon-32x32.png";
import favicon16 from "./favicon/favicon-16x16.png";
import favicon from "./favicon/favicon.ico";
import favManifest from "./favicon/site.webmanifest";
import favMask from "./favicon/safari-pinned-tab.svg";
import { envConfig, envConfigType } from "./helpers/supabase";
import { useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";

export const loader = () => envConfig();
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: appStylesheer },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: appleTouch,
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: favicon32,
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: favicon16,
  },
  {
    rel: "icon",
    type: "image/x-icon",
    href: favicon,
  },
  { rel: "manifest", href: favManifest },
  {
    rel: "mask-icon",
    href: favMask,
    color: "#5bbad5",
  },
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
      <body className="flex flex-col w-full h-full">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const env = useLoaderData() as envConfigType;
  const [supabase] = useState(() => createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY));
  return <Outlet context={supabase} />;
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
      <p>{error?.message ?? "Unknown error"}</p>
    </>
  );
}
