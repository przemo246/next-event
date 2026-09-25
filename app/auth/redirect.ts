import { NextResponse } from "next/server";

// The origin the browser actually used. `request.url` can't be trusted for this:
// `next dev` reports its own hostname (localhost) and proxies report internal hosts,
// so the session cookie would land on one host and the redirect on another.
const getOrigin = (request: Request) => {
  const url = new URL(request.url);
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    url.host;
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0].trim() ??
    url.protocol.replace(":", "");

  return `${proto}://${host}`;
};

// Only allow same-origin paths, never "//evil.com", "@evil.com" or absolute URLs.
export const safePath = (path: string | null) =>
  path?.startsWith("/") && !path.startsWith("//") ? path : "/";

export const redirectTo = (request: Request, path: string) =>
  NextResponse.redirect(`${getOrigin(request)}${path}`);
