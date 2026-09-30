import Image from "next/image";

export function AuthImage({ src }) {
  return (
    <div className="relative h-full min-h-[600px] w-full overflow-hidden">
      <Image src={src} alt="" fill sizes="50vw" className="object-cover" priority />
      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
    </div>
  );
}
