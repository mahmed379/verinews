import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

    return createPortal(
    <div
      className="
      fixed
      inset-0
      z-[9999]
      flex
      items-center
      justify-center
      bg-black/60
      backdrop-blur-sm
      p-4
      "
      onClick={onClose}
      role="presentation"
    >
      <div
        className="
        glass-card
        w-full
        max-w-md
        rounded-2xl
        bg-slate-900/90
        border
        border-slate-700
        p-6
        text-white
        "
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-white"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
            text-slate-400
            transition-colors
            hover:text-white
            "
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>,
    document.body
  );
}