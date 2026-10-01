import { expect } from "@playwright/test";

export const API_URL = process.env.E2E_API_URL ?? "http://localhost:6398";
export const PASSWORD = "E2eParola123";

export function uniqueEmail(prefix) {
  return `${prefix}.${Date.now()}.${Math.random().toString(36).slice(2, 7)}@example.com`;
}

export async function registerViaUi(page, { firstName, lastName, email }) {
  await page.goto("/kayit-ol");
  await page.getByLabel("Ad", { exact: true }).fill(firstName);
  await page.getByLabel("Soyad").fill(lastName);
  await page.getByLabel("E-posta").fill(email);
  await page.getByLabel("Parola").fill(PASSWORD);
  await page.getByRole("button", { name: "Kayıt Ol" }).click();
  await expect(page).toHaveURL(/\/giris-yap/);
}

export async function registerViaApi(request, { firstName, lastName, email }) {
  const response = await request.post(`${API_URL}/api/auth/register`, {
    data: { firstName, lastName, email, password: PASSWORD },
  });
  expect(response.status()).toBe(201);
}

export async function login(page, email) {
  await page.goto("/giris-yap");
  await page.getByLabel("E-posta").fill(email);
  await page.getByLabel("Parola").fill(PASSWORD);
  await page.getByRole("button", { name: "Giriş Yap" }).click();
  await expect(page).toHaveURL(/\/ana-sayfa/);
}
