import { expect, test } from "@playwright/test";
import { login, registerViaApi, registerViaUi, uniqueEmail } from "./helpers";

test("talep oluşturma, mesajlaşma ve değerlendirme akışı", async ({ browser }) => {
  const runId = Date.now().toString(36);
  const owner = { firstName: "Ece", lastName: `Talep${runId}`, email: uniqueEmail("owner") };
  const provider = { firstName: "Can", lastName: `Usta${runId}`, email: uniqueEmail("provider") };

  const ownerContext = await browser.newContext();
  const ownerPage = await ownerContext.newPage();

  await registerViaUi(ownerPage, owner);
  await login(ownerPage, owner.email);

  await ownerPage.getByRole("searchbox", { name: "Hizmet ara" }).fill("Boya");
  await ownerPage.getByRole("link", { name: "Boya Badana" }).first().click();
  await expect(ownerPage).toHaveURL(/\/kategori\/boya-badana$/);
  await ownerPage.goto("/kategori/boya-badana/talep-olustur");

  await ownerPage.getByRole("button", { name: "Devam" }).click();
  await expect(ownerPage.getByText("Devam etmek için bir seçenek belirleyin")).toBeVisible();

  await ownerPage.getByRole("radio", { name: "2 oda", exact: true }).check();
  await ownerPage.getByRole("button", { name: "Devam" }).click();
  await ownerPage.getByRole("radio", { name: "Evet", exact: true }).check();
  await ownerPage.getByRole("button", { name: "Devam" }).click();
  await ownerPage.getByRole("radio", { name: "Ben", exact: true }).check();
  await ownerPage.getByRole("button", { name: "Talebi Gönder" }).click();
  await expect(ownerPage.getByRole("heading", { name: "Talebini Aldık" })).toBeVisible();

  await ownerPage.getByRole("link", { name: "İşlerime git" }).click();
  const card = ownerPage.getByRole("article").filter({ hasText: "Boya Badana" });
  await expect(card).toBeVisible();
  await card.getByRole("button", { name: "Talebi pasife al" }).click();
  await expect(ownerPage.getByText("Aktif işin yok.")).toBeVisible();
  await ownerPage.getByRole("tab", { name: "Pasif işlerim" }).click();
  const passiveCard = ownerPage.getByRole("article").filter({ hasText: "Boya Badana" });
  await expect(passiveCard).toContainText("Pasif");
  await passiveCard.getByRole("button", { name: "Talebi aktifleştir" }).click();
  await ownerPage.getByRole("tab", { name: "Aktif işlerim" }).click();
  await expect(ownerPage.getByRole("article").filter({ hasText: "Boya Badana" })).toBeVisible();

  const providerContext = await browser.newContext();
  const providerPage = await providerContext.newPage();
  await registerViaApi(providerContext.request, provider);
  await login(providerPage, provider.email);

  await providerPage.goto("/kategori/boya-badana");
  const listing = providerPage.getByRole("article").filter({ hasText: `Ece ${owner.lastName}` });
  await expect(listing).toBeVisible();
  await expect(listing).not.toContainText(owner.email);
  await listing.getByRole("button", { name: "Mesaj Gönder" }).click();
  await expect(providerPage).toHaveURL(/konusma=/);

  await providerPage.getByLabel("Mesaj", { exact: true }).fill("Merhaba, yarın gelebilirim.");
  await providerPage.getByRole("button", { name: "Gönder" }).click();
  await expect(providerPage.getByText("Merhaba, yarın gelebilirim.")).toBeVisible();

  await ownerPage.getByRole("link", { name: /Mesaj Kutusu/ }).click();
  await ownerPage.getByRole("button", { name: new RegExp(`Can ${provider.lastName}`) }).click();
  await expect(ownerPage.getByText("Merhaba, yarın gelebilirim.")).toBeVisible();
  await ownerPage.getByLabel("Mesaj", { exact: true }).fill("Harika, bekliyorum.");
  await ownerPage.getByRole("button", { name: "Gönder" }).click();

  await expect(providerPage.getByText("Harika, bekliyorum.")).toBeVisible();
  await expect(providerPage.getByText(/Okundu/).first()).toBeVisible();

  await providerPage.getByRole("button", { name: "Değerlendir" }).click();
  const dialog = providerPage.getByRole("dialog", { name: "Hizmeti Değerlendir" });
  await dialog.getByRole("radio", { name: "4 yıldız" }).click();
  await dialog.getByLabel(/Yorum/).fill("Çok ilgiliydi.");
  await dialog.getByRole("button", { name: "Değerlendirmeyi Gönder" }).click();
  await expect(dialog).toBeHidden();

  await providerPage.getByRole("button", { name: "Değerlendir" }).click();
  await providerPage.getByRole("radio", { name: "5 yıldız" }).click();
  await providerPage.getByRole("button", { name: "Değerlendirmeyi Gönder" }).click();
  await expect(providerPage.getByText(/zaten değerlendirdiniz/)).toBeVisible();
  await providerPage.keyboard.press("Escape");

  await ownerPage.goto("/hesap-bilgilerim");
  await expect(ownerPage.getByText("Ortalama puanın: 4 / 5 (1 değerlendirme)")).toBeVisible();
  await ownerPage.getByRole("button", { name: "Çıkış yap" }).click();
  await expect(ownerPage).toHaveURL(/\/giris-yap/);
  await ownerPage.goto("/ana-sayfa");
  await expect(ownerPage).toHaveURL(/\/giris-yap/);

  await ownerContext.close();
  await providerContext.close();
});
