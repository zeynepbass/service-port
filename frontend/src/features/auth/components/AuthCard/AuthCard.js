import { AuthImage } from "../AuthImage";

export function AuthCard({ image, children }) {
  return (
    <main className="min-h-screen bg-[#F7F7F9] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl lg:grid-cols-2">
          <div className="flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-md">{children}</div>
          </div>
          <div className="relative hidden min-h-[600px] overflow-hidden lg:block">
            <AuthImage src={image} />
          </div>
        </div>
      </div>
    </main>
  );
}
