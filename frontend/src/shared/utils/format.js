const dateFormatter = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
const timeFormatter = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" });

export function formatDate(value) {
  return value ? dateFormatter.format(new Date(value)) : "";
}

export function formatTime(value) {
  return value ? timeFormatter.format(new Date(value)) : "";
}

export function formatDateRange(start, end) {
  if (!end) return "Süresiz";
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function fullName(user) {
  if (!user) return "";
  return [user.firstName, user.lastName].filter(Boolean).join(" ");
}

export function initials(user) {
  return [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((part) => part.charAt(0).toLocaleUpperCase("tr-TR"))
    .join("");
}

export function toDateInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}
