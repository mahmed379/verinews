import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

export interface GlassSelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface GlassSelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: GlassSelectOption<T>[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 shrink-0 text-slate-300 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <path d="M5.5 7.5L10 12l4.5-4.5" />
    </svg>
  );
}

/**
 * GlassSelect
 *
 * A reusable dropdown that matches VeriNews' glassmorphism design
 * language (see .glass-card / .glass-input / .glass-button in index.css).
 * Drop-in replacement for a native <select>, but fully custom-rendered
 * so the popup menu can carry the glass blur/border/shadow treatment
 * that browsers won't apply to native <option> lists.
 *
 * Supports Arrow Up/Down, Home/End, Enter, Escape and Tab, and exposes
 * the standard ARIA listbox pattern (role="combobox"/"listbox").
 */
export function GlassSelect<T extends string = string>({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
  disabled = false,
  id,
  name,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: GlassSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

  const generatedId = useId();
  const baseId = id ?? generatedId;
  const listboxId = `${baseId}-listbox`;

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  // Close on outside click.
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // When opening, seed the highlighted option and move focus into the listbox.
  useEffect(() => {
    if (!open) return;

    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);

    const frame = requestAnimationFrame(() => {
      listboxRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep the highlighted option scrolled into view.
  useEffect(() => {
    if (!open) return;
    optionRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, open]);

  function openDropdown() {
    if (disabled) return;
    setOpen(true);
  }

  function closeDropdown(refocusButton = true) {
    setOpen(false);
    if (refocusButton) buttonRef.current?.focus();
  }

  function commitSelection(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    if (option.value !== value) onChange(option.value);
    closeDropdown();
  }

  function moveHighlight(delta: number) {
    setHighlightedIndex((current) => {
      let next = current;
      for (let step = 0; step < options.length; step++) {
        next = Math.min(Math.max(next + delta, 0), options.length - 1);
        if (!options[next]?.disabled) return next;
        if (next === 0 || next === options.length - 1) break;
      }
      return current;
    });
  }

  function handleButtonKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
      case "Enter":
      case " ":
        event.preventDefault();
        openDropdown();
        break;
      default:
        break;
    }
  }

  function handleListboxKeyDown(event: ReactKeyboardEvent<HTMLUListElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveHighlight(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveHighlight(-1);
        break;
      case "Home":
        event.preventDefault();
        setHighlightedIndex(0);
        break;
      case "End":
        event.preventDefault();
        setHighlightedIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commitSelection(highlightedIndex);
        break;
      case "Escape":
        event.preventDefault();
        closeDropdown();
        break;
      case "Tab":
        // Let focus continue moving naturally; just close the menu.
        setOpen(false);
        break;
      default:
        break;
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {name && <input type="hidden" name={name} value={value} readOnly />}

      <button
        ref={buttonRef}
        type="button"
        id={baseId}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        onClick={() => (open ? closeDropdown(false) : openDropdown())}
        onKeyDown={handleButtonKeyDown}
        className={`
          flex w-full items-center justify-between gap-2
          rounded-xl border border-white/20 bg-slate-900/80
          px-4 py-3 text-left text-sm
          backdrop-blur-xl shadow-lg
          outline-none transition-all duration-200
          hover:border-blue-400/30 hover:bg-blue-500/15
          focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30
          disabled:cursor-not-allowed disabled:opacity-50
          ${open ? "border-blue-400 ring-2 ring-blue-400/30" : ""}
        `}
      >
        <span className={selectedOption ? "text-white" : "text-slate-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={
            options[highlightedIndex]
              ? `${baseId}-option-${highlightedIndex}`
              : undefined
          }
          onKeyDown={handleListboxKeyDown}

            className="
                glass-select-menu
                absolute z-[9999] mt-2 max-h-64 w-full min-w-max
                overflow-auto rounded-2xl
                border border-white/20
                bg-slate-900/95
                p-1.5
                shadow-2xl
                outline-none
                backdrop-blur-xl
            "
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={option.value}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                id={`${baseId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                onMouseEnter={() =>
                  !option.disabled && setHighlightedIndex(index)
                }
                onClick={() => commitSelection(index)}
                className={`
                  flex cursor-pointer select-none items-center justify-between
                  gap-2 rounded-xl border border-transparent px-3 py-2.5
                  text-sm transition-all duration-150
                  ${option.disabled ? "cursor-not-allowed opacity-40" : ""}
                  ${
                    isSelected
                      ? "border-blue-400/30 bg-blue-500/20 text-blue-200"
                      : isHighlighted
                        ? "border-blue-400/20 bg-blue-500/15 text-white"
                        : "text-slate-300"
                  }
                `}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 shrink-0 text-blue-300"
                    aria-hidden="true"
                  >
                    <path d="M4 10.5l3.5 3.5L16 5.5" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
