
export function LoginImage() {
  return (
    <div className="relative h-full min-h-[600px] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-[url('/login.jpg')] bg-cover bg-center"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 bg-black/10"
        aria-hidden="true"
      />
    </div>
  );
}
