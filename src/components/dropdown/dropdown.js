"use client";

import { useState, useEffect, useRef } from "react";

import s from "./dropdown.module.css";

export function Dropdown({ label, triggerContent, dropdownContent }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div className={s.dropdownGroup} ref={dropdownRef}>
      {label && <div className={s.selectorLabel}>{label}</div>}

      <div className={s.dropdown}>
        <div
          className={`${s.dropdownTrigger} ${isOpen ? s.open : ""}`}
          onClick={() => {
            setIsOpen((s) => !s);
          }}
        >
          {triggerContent}

          <div className={s.dropdownArrow} />
        </div>

        {isOpen && <div className={s.dropdownContent}>{dropdownContent}</div>}
      </div>
    </div>
  );
}
