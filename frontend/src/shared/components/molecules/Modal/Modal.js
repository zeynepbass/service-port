"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusableElements(container) {
  return [...container.querySelectorAll(FOCUSABLE)].filter((element) => !element.hasAttribute("aria-hidden"));
}

export function Modal({ open, onClose, title, description, children, className = "" }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const dialog = dialogRef.current;
    const [first] = focusableElements(dialog);
    (first ?? dialog).focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (event.key !== "Tab") return;

      const elements = focusableElements(dialog);
      if (elements.length === 0) {
        event.preventDefault();
        return;
      }
      const firstElement = elements[0];
      const lastElement = elements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#222C31]/40 px-4 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl outline-none ${className}`}
      >
        <div className="border-b border-gray-100 px-6 py-5 pr-14">
          <h2 id={titleId} className="text-xl text-gray-700">
            {title}
          </h2>
          {description && (
            <p id={descriptionId} className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-all duration-200 hover:bg-[#F7F7F9] hover:text-[#4E244D]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
