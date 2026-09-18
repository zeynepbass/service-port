
"use client";

const variants = {
  unstyled: "",
  primary:
    "w-full rounded-xl bg-[#6B4F6D] px-5 py-3 text-sm text-white shadow-sm transition-all duration-200 hover:bg-[#4E244D]",
  brand:
    "mx-auto mt-5 w-full rounded-xl bg-[rgb(78,36,77)] p-3 text-sm text-[rgb(242,247,250)] transition-colors duration-300 hover:bg-[rgb(34,44,49)] hover:text-white",
  outline:
    "w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-500 transition-all duration-200 hover:border-[#DCD0E3] hover:bg-[#F7F7F9] hover:text-[#4E244D]",
  ghost:
    "rounded-xl px-3.5 py-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-white hover:text-[#4E244D]",
};

export function Button({
  children,
  onClick,
  type,
  className = "",
  variant = "unstyled",
  disabled,
}) {
  const variantClassName = variants[variant] ?? variants.unstyled;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[variantClassName, className].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  );
}
