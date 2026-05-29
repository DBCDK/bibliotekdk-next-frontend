import { NextResponse } from "next/server";

const ROOT_FAVICON_PATHS = new Set(["/favicon.ico", "/favicon.svg"]);

function getFaviconVariant() {
  return process.env.NEXT_PUBLIC_SITE === "studiebib" ? "studiebib" : "bibdk";
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!ROOT_FAVICON_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const extension = pathname.endsWith(".ico") ? "ico" : "svg";
  url.pathname = `/favicon/${getFaviconVariant()}/favicon.${extension}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/favicon.ico", "/favicon.svg"],
};
