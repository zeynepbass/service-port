import LoginPage from "@/features/auth/pages/LoginPage";

export const metadata = { title: "Giriş yap" };

export default async function Page({ searchParams }) {
  const { next } = await searchParams;
  return <LoginPage nextPath={typeof next === "string" ? next : undefined} />;
}
