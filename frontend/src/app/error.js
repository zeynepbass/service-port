"use client";

export default function GlobalRouteError({ reset }) {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-[#F7F7F9] px-4 text-center"
    >
      <h1 className="text-2xl text-gray-800">Bir şeyler ters gitti</h1>
      <p className="mt-2 text-sm text-gray-500">Lütfen tekrar dene.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-[#6B4F6D] px-6 py-3 text-sm text-white hover:bg-[#4E244D]"
      >
        Tekrar dene
      </button>
    </main>
  );
}
