import React, { useEffect, useRef } from "react";

interface PlaceAutocompleteProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({
  value,
  onPlaceSelect,
  onChange,
  placeholder = "Enter a location",
  className = "",
  disabled = false,
  id = "",
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!inputRef.current) return;

    // Initialize Autocomplete only once
    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ["geometry", "formatted_address", "name"],
      types: ["geocode"],
    });

    const handlePlaceChanged = () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        onPlaceSelect(place); // Notify parent with place details
      }
    };

    // Add event listener to autocomplete
    autocomplete.addListener("place_changed", handlePlaceChanged);

    
  }, [onPlaceSelect]);

  return (
    <div className="relative">
      <input
        id={id}
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        onChange={onChange}
        className={`w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm text-sm placeholder-gray-400 focus-visible:ring-rojo1 focus-visible:outline-none focus-visible:ring-1 disabled:opacity-50 ${className}`}
      />
    </div>
  );
};

export { PlaceAutocomplete };
