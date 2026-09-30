"use client";

import { useRef } from "react";

export function RequestTabs({ tabs, activeKey, onChange, panelId }) {
  const buttons = useRef([]);

  function handleKeyDown(event, index) {
    const offset = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!offset) return;
    event.preventDefault();
    const next = (index + offset + tabs.length) % tabs.length;
    onChange(tabs[next].key);
    buttons.current[next]?.focus();
  }

  return (
    <div role="tablist" aria-label="İşlerim" className="mb-4 flex flex-col justify-center gap-2 px-4 sm:flex-row sm:gap-4 sm:px-0">
      {tabs.map((tab, index) => {
        const selected = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            ref={(element) => {
              buttons.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`tab-${tab.key}`}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.key)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`px-2 py-3 text-gray-600 ${selected ? "border-b-2 border-[#222C31]" : ""}`}
          >
            {tab.title}
          </button>
        );
      })}
    </div>
  );
}
