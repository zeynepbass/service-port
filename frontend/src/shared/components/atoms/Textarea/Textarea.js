export function Textarea({ className = "", ref, ...props }) {
  return (
    <textarea
      ref={ref}
      className={[
        "w-full resize-none rounded-xl border border-gray-200 bg-[#F7F7F9] px-4 py-3 text-sm text-[#222C31] outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-[#C9B7CE] focus:bg-white focus:ring-2 focus:ring-[#EDE7F1]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
