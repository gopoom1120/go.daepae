"use client";

import { useEffect, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  listAriaLabel: string;
  /** 시각적 <label> 이 별도로 있는 경우 그 id (인라인/시트 폼) */
  labelledBy?: string;
  /** 시각적 <label> 이 없는 경우 (스티키 바) */
  ariaLabel?: string;
  name?: string;
}

/** shadcn/ui Select 참고 커스텀 드롭다운 — 열기/닫기, 방향키 탐색, 선택 상태를 관리한다 */
export function SelectField({
  options,
  value,
  onChange,
  placeholder,
  listAriaLabel,
  labelledBy,
  ariaLabel,
  name = "franchiseType",
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    if (!open) return;

    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onDocKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onDocKeydown);

    const selectedIndex = options.findIndex((o) => o.value === value);
    itemRefs.current[selectedIndex >= 0 ? selectedIndex : 0]?.focus();

    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onDocKeydown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const selectItem = (v: string) => {
    onChange(v);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className={`select-field${value ? " has-value" : ""}${open ? " open" : ""}`} ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className="select-field-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelledBy}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className="select-field-value">{selectedLabel || placeholder}</span>
        <svg
          className="select-field-chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <ul className="select-field-list" role="listbox" tabIndex={-1} aria-label={listAriaLabel}>
        {options.map((opt, i) => (
          <li
            key={opt.value}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`select-field-item${opt.value === value ? " selected" : ""}`}
            role="option"
            aria-selected={opt.value === value}
            tabIndex={-1}
            onClick={() => selectItem(opt.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectItem(opt.value);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                itemRefs.current[Math.min(i + 1, options.length - 1)]?.focus();
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                itemRefs.current[Math.max(i - 1, 0)]?.focus();
              } else if (e.key === "Escape") {
                e.preventDefault();
                setOpen(false);
                triggerRef.current?.focus();
              } else if (e.key === "Tab") {
                setOpen(false);
              }
            }}
          >
            <svg
              className="select-field-check"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>{opt.label}</span>
          </li>
        ))}
      </ul>
      <input type="hidden" name={name} value={value} readOnly />
    </div>
  );
}
