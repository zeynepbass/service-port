const turkishMap = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u" };

export function toSlug(text = "") {
  return text
    .toString()
    .replace(/[çğıİöşü]/gi, (char) => turkishMap[char] ?? turkishMap[char.toLowerCase()] ?? char)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
}
