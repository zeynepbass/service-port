import Link from "next/link";

export const metadata = { title: "Sayfa bulunamadı" };

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-[#F7F7F9] px-4 text-center"
    >
      <p className="text-sm font-medium text-[#6B4F6D]">404</p>
      <h1 className="mt-2 text-2xl text-gray-800">Aradığın sayfa bulunamadı</h1>
      <Link
        href="/ana-sayfa"
        className="mt-6 rounded-xl bg-[#6B4F6D] px-6 py-3 text-sm text-white hover:bg-[#4E244D]"
      >
        Ana sayfaya dön
      </Link>
    </main>
  );
}
