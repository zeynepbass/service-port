import { NextResponse } from "next/server";

export const SESSION_COOKIE = "refresh_token";

const AUTH_PAGES = ["/giris-yap", "/kayit-ol"];
const PUBLIC_PAGES = [...AUTH_PAGES, "/sifremi-unuttum", "/sifre-sifirla"];
const APP_ROOTS = new Set([
  "ana-sayfa",
  "kategori",
  "hizmet",
  "detay",
  "mesaj-kutusu",
  "hesap-bilgilerim",
  "veri-gizliligi",
  "giris-yap",
  "kayit-ol",
  "sifremi-unuttum",
  "sifre-sifirla",
  "kullanici-adi-giris",
]);

function redirectTo(request, pathname, searchParams) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = searchParams ? `?${new URLSearchParams(searchParams)}` : "";
  return NextResponse.redirect(url);
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);
  const segments = pathname.split("/").filter(Boolean);

  if (pathname === "/kullanici-adi-giris") {
    return redirectTo(request, "/giris-yap");
  }

  if (segments.length === 1 && !APP_ROOTS.has(segments[0])) {
    return redirectTo(request, `/kategori/${segments[0]}`);
  }

  if (PUBLIC_PAGES.includes(pathname)) {
    return hasSession && AUTH_PAGES.includes(pathname)
      ? redirectTo(request, "/ana-sayfa")
      : NextResponse.next();
  }

  if (!hasSession) {
    const next = `${pathname}${request.nextUrl.search}`;
    return redirectTo(request, "/giris-yap", pathname === "/" ? undefined : { next });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|uploads|_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)"],
};
