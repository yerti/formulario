import React, { useState } from "react";
import styles from "./styles.module.css";

interface CalendarProps {
  id: string;
  labelName: string;
  value: string; // Asegúrate de que `value` esté presente
  onChange?: (date: string) => void;
}

export default function Calendar({
  labelName,
  onChange,
  id,
  value,
}: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>(value);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    if (onChange) {
      onChange(newDate);
    }
  };

  return (
    <div className={styles.contentCalendar}>
      <label
        htmlFor={id}
        className={selectedDate || isFocused ? styles.active : styles.notActive}
      >
        {labelName}
      </label>
      <input
        type="date"
        id={id}
        value={selectedDate}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}
