import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { middleware } from "./middleware";

function run(path, cookie) {
  const request = new NextRequest(new URL(path, "http://localhost:3000"), {
    headers: cookie ? { cookie } : {},
  });
  return middleware(request);
}

describe("middleware", () => {
  it("oturumsuz kullanıcıyı giriş sayfasına yönlendirir", () => {
    const response = run("/mesaj-kutusu?konusma=1");
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/giris-yap?next=%2Fmesaj-kutusu%3Fkonusma%3D1",
    );
  });

  it("public sayfalara oturumsuz erişime izin verir", () => {
    expect(run("/sifremi-unuttum").headers.get("location")).toBeNull();
    expect(run("/sifre-sifirla?token=x").headers.get("location")).toBeNull();
  });

  it("oturumu olan kullanıcıyı giriş sayfasından ana sayfaya yönlendirir", () => {
    expect(run("/giris-yap", "refresh_token=abc").headers.get("location")).toBe(
      "http://localhost:3000/ana-sayfa",
    );
  });

  it("oturumu olan kullanıcı korumalı sayfaya erişir", () => {
    expect(run("/ana-sayfa", "refresh_token=abc").headers.get("location")).toBeNull();
  });

  it("eski kategori ve kullanıcı adı adreslerini yönlendirir", () => {
    expect(run("/boya-badana", "refresh_token=abc").headers.get("location")).toBe(
      "http://localhost:3000/kategori/boya-badana",
    );
    expect(run("/kullanici-adi-giris").headers.get("location")).toBe("http://localhost:3000/giris-yap");
  });
});
