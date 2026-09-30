import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseEnv } from "../config/env.js";
import { canTransition } from "../services/request.service.js";
import { decodeCursor, encodeCursor, paginate } from "../utils/pagination.js";
import { effectiveStatus, serializeRequest } from "../utils/serializers.js";
import { toSlug } from "../utils/slug.js";

const baseEnv = {
  MONGO_URI: "mongodb://localhost/test",
  JWT_ACCESS_SECRET: "x".repeat(32),
  CLIENT_URL: "http://localhost:3000",
};

describe("ortam doğrulaması", () => {
  it("JWT secret yoksa açık hata verir", () => {
    const { JWT_ACCESS_SECRET, ...withoutSecret } = baseEnv;
    expect(JWT_ACCESS_SECRET).toBeTruthy();
    expect(() => parseEnv(withoutSecret)).toThrow(/JWT_ACCESS_SECRET/);
  });

  it("kısa secret'ı reddeder", () => {
    expect(() => parseEnv({ ...baseEnv, JWT_ACCESS_SECRET: "secretkey123" })).toThrow(/en az 32/);
  });

  it("CORS listesini ve üretimde secure çerezi varsayılan yapar", () => {
    const env = parseEnv({
      ...baseEnv,
      NODE_ENV: "production",
      CORS_ORIGINS: "https://a.com, https://b.com",
    });
    expect(env.CORS_ORIGINS).toEqual(["https://a.com", "https://b.com"]);
    expect(env.COOKIE_SECURE).toBe(true);
  });
});

describe("kaynak kod", () => {
  it("sabit JWT fallback secret içermez", () => {
    const root = path.resolve(import.meta.dirname, "..");
    const offenders = [];
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (["node_modules", "tests", "coverage", "uploads"].includes(entry.name)) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (
          entry.name.endsWith(".js") &&
          /secretkey123|JWT_SECRET\s*\|\|/.test(fs.readFileSync(full, "utf8"))
        ) {
          offenders.push(full);
        }
      }
    };
    walk(root);
    expect(offenders).toEqual([]);
  });
});

describe("toSlug", () => {
  it("Türkçe karakterleri dönüştürür", () => {
    expect(toSlug("Çatı & Şömine Tamiri")).toBe("cati-somine-tamiri");
    expect(toSlug("  İç Mekan Boyası ")).toBe("ic-mekan-boyasi");
  });
});

describe("talep durumu", () => {
  it("süresi dolan aktif talebi pasif sayar", () => {
    const past = new Date(Date.now() - 1000);
    expect(effectiveStatus({ status: "active", endsAt: past })).toBe("passive");
    expect(effectiveStatus({ status: "active", endsAt: null })).toBe("active");
    expect(effectiveStatus({ status: "cancelled", endsAt: past })).toBe("cancelled");
  });

  it("geçiş kurallarını uygular", () => {
    expect(canTransition("active", "passive")).toBe(true);
    expect(canTransition("passive", "active")).toBe(true);
    expect(canTransition("active", "cancelled")).toBe(true);
    expect(canTransition("cancelled", "active")).toBe(false);
    expect(canTransition("active", "active")).toBe(false);
    expect(canTransition("unknown", "active")).toBe(false);
  });

  it("izin verilmedikçe iletişim bilgisini serileştirmez", () => {
    const request = {
      _id: "64b000000000000000000001",
      owner: { _id: "64b000000000000000000002", firstName: "A", lastName: "B", email: "a@b.com" },
      category: "64b000000000000000000003",
      title: "Boya",
      answers: [],
      status: "active",
      phone: "+905551112233",
    };
    expect(serializeRequest(request).contact).toBeNull();
    expect(JSON.stringify(serializeRequest(request))).not.toContain("a@b.com");
    expect(serializeRequest(request, { includeContact: true }).contact.email).toBe("a@b.com");
  });
});

describe("pagination", () => {
  it("cursor'ı kodlayıp çözer", () => {
    const id = "64b000000000000000000001";
    expect(decodeCursor(encodeCursor({ _id: id })).toString()).toBe(id);
    expect(decodeCursor(undefined)).toBeNull();
    expect(() => decodeCursor("gecersiz")).toThrow();
  });

  it("fazladan kaydı hasMore olarak işaretler", () => {
    const docs = [
      { _id: "64b000000000000000000003" },
      { _id: "64b000000000000000000002" },
      { _id: "64b000000000000000000001" },
    ];
    const page = paginate(docs, 2);
    expect(page.items).toHaveLength(2);
    expect(page.meta.hasMore).toBe(true);
    expect(paginate(docs, 5).meta.nextCursor).toBeNull();
  });
});
