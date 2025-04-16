import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface DateOnlyPickerProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
}

const DateOnlyPicker: React.FC<DateOnlyPickerProps> = ({
  value,
  onChange,
  className = "",
  disabled = false,
  id = "",
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null // Ensure the state starts as null or the provided value
  );
  const [pickerPosition, setPickerPosition] = useState<"date" | "time" | null>(null);

  const datePickerRef = useRef<DatePicker>(null);

  // Only update selectedDate if the value prop changes (i.e., initial render or when form value changes)
  useEffect(() => {
    if (value && value !== selectedDate) {
      setSelectedDate(new Date(value));
    }
  }, [value]); // Dependency on value prop to prevent infinite loop

  // Handle date selection
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (onChange) {
      onChange(date);
    }
    setPickerPosition(null); // Close picker after selection
  };

  // Open the DatePicker in date mode
  const handleDateIconClick = () => {
    setPickerPosition("date");
    setTimeout(() => {
      datePickerRef.current?.setOpen(true);
    }, 0);
  };  

  // Handle input change (disable typing)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent typing
  };

  return (
    <div className="relative flex items-center gap-2">
      <DatePicker
        id={id}
        selected={selectedDate}
        value={value ? value : ""} // Use value instead of defaultValue
        onChange={handleDateChange}        
        dateFormat="dd/MM/yyyy" // Always show both date and time in input
        disabled={disabled}
        className={cn(
          "w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50",
          className
        )}
        popperPlacement={pickerPosition === "date" ? "bottom-start" : "bottom-end"}
        ref={datePickerRef}
        onChangeRaw={handleInputChange} // Disable typing
      />
      {/* Calendar Icon */}
      <FaCalendarAlt
        className="text-black-400 hover:text-blue-500 cursor-pointer"
        onClick={handleDateIconClick}
      />      
    </div>
  );
};


export { DateOnlyPicker };
