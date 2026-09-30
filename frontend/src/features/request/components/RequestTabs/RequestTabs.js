import { Button } from "@/shared/components/atoms";

export function HomeIsTabs({ tabs, openIndex, setOpenIndex }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-4 px-4 sm:px-0">
      {tabs.map((item, index) => (
        <Button
          key={index}
          onClick={() => setOpenIndex(index)}
          type="button"
          className={`py-3 px-2  text-gray-600  ${
            openIndex === index
              ? "border-b-2 border-[#222C31]"
              : ""
          }`}
        >
          {item.title}
        </Button>
      ))}
    </div>
  );
}