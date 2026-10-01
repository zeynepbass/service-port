import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";

export const metadata = { title: "Parola sıfırla", robots: { index: false } };

export default async function Page({ searchParams }) {
  const { token } = await searchParams;
  return <ResetPasswordPage token={typeof token === "string" ? token : null} />;
}
