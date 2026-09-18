const variants = {
  unstyled: "",
  auth: "w-full rounded-lg border border-gray-200 bg-[rgb(242,247,250)] p-3 text-sm outline-none transition focus:border-[rgb(34,44,49)] focus:ring-1 focus:ring-[rgb(34,44,49)]",
  settings:
    "w-full rounded-xl border border-gray-200 bg-[#F7F7F9] px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#B9A6BF] focus:bg-white focus:ring-2 focus:ring-[#EDE7F1]",
  accent:
    "w-full bg-[rgb(242,247,250)] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(255,127,60)]",
};

export function Input({
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    checked,
    className = "",
    variant = "unstyled",
  }) {
    const variantClassName = variants[variant] ?? variants.unstyled;

    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        checked={checked}
        className={[variantClassName, className].filter(Boolean).join(" ")}
      />
    );
  }