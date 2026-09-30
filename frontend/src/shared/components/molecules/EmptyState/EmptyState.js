import Image from "next/image";

export function EmptyState({ title, description, image, action }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-10 text-center">
      {image && <Image src={image} alt="" width={320} height={240} className="h-auto w-64" />}
      {title && <h2 className="mt-4 text-lg text-gray-800">{title}</h2>}
      {description && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
