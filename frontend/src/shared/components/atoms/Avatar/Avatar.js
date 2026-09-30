import Image from "next/image";

const sizes = {
  sm: { box: "h-10 w-10 text-sm", pixels: 40 },
  lg: { box: "h-40 w-40 text-4xl", pixels: 160 },
};

export function Avatar({ src, name = "", fallback, size = "sm", className = "" }) {
  const { box, pixels } = sizes[size] ?? sizes.sm;
  const base = `flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#E1D7E5] uppercase text-[#4E244D] ${box} ${className}`;

  if (src) {
    return (
      <span className={base}>
        <Image src={src} alt={name ? `${name} profil fotoğrafı` : "Profil fotoğrafı"} width={pixels} height={pixels} className="h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <span className={base} aria-hidden="true">
      {fallback || "?"}
    </span>
  );
}
