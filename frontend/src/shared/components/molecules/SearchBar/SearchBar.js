import { Search } from "lucide-react";
import { Input } from "@/shared/components/atoms";

export function SearchBar({ value, onChange, onToggle, expanded, label = "Hizmet ara", controls }) {
  return (
    <div className="flex items-center rounded-full bg-[rgb(242,247,250)] pr-2 shadow-inner focus-within:ring-1 focus-within:ring-[rgb(34,44,49)]">
      <Input
        type="search"
        aria-label={label}
        placeholder="Başka bir ihtiyacın?"
        className="flex-1 rounded-full bg-transparent p-3 text-gray-700 focus:outline-none"
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={controls}
        aria-label={expanded ? "Hizmet listesini kapat" : "Hizmet listesini aç"}
        className="mr-2 rounded-full p-1 text-[rgb(78,36,77)] focus-visible:outline-2 focus-visible:outline-[#6B4F6D]"
      >
        <Search size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
