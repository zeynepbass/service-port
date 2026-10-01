import { expect, test } from "@playwright/test";

test("oturumsuz kullanıcı korumalı sayfalara erişemez", async ({ page }) => {
  for (const path of ["/ana-sayfa", "/mesaj-kutusu", "/hesap-bilgilerim", "/kategori/boya-badana"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/giris-yap\?next=/);
  }
});

test("tarayıcıdan okunabilir oturum çerezi bulunmaz", async ({ page, context }) => {
  await page.goto("/giris-yap");
  const visible = await page.evaluate(() => document.cookie);
  expect(visible).not.toContain("token");
  const cookies = await context.cookies();
  expect(cookies.filter((cookie) => cookie.name.includes("token") && !cookie.httpOnly)).toEqual([]);
});
