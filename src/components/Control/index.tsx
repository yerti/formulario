import React, { useState } from "react";
import styles from "./styles.module.css";

interface ControlProps {
  id: string;
  type: "number" | "text" | "email" | "tel";
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  titleLabel: string;
  error?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function Control({
  id,
  type,
  value,
  onChange,
  name,
  titleLabel,
  error,
  onBlur,
  onKeyDown,
}: ControlProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }

    if (
      name === "telefonoSocio" &&
      !/[\d]/.test(e.key) &&
      e.key !== "Backspace"
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.contentTotalControl}>
      <div className={styles.contentControl}>
        <input
          id={id}
          type={type}
          value={value || ""}
          onChange={onChange}
          name={name}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        <label
          htmlFor={id}
          className={
            isFocused || value ? styles.activeLabel : styles.inactiveLabel
          }
        >
          {titleLabel}
        </label>
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
