"use client";

export default function AppError({ reset }) {
  return (
    <div role="alert" className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-xl text-gray-800">Bu sayfa yüklenemedi</h1>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-xl bg-[#6B4F6D] px-5 py-2.5 text-sm text-white"
      >
        Tekrar dene
      </button>
    </div>
  );
}
