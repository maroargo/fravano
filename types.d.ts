declare namespace google.maps.places {
  class Autocomplete {
    constructor(
      inputField: HTMLInputElement,
      opts?: google.maps.places.AutocompleteOptions
    );
    addListener(eventName: string, handler: () => void): void;
    getPlace(): google.maps.places.PlaceResult;
  }
  
  interface AutocompleteOptions {
    types?: string[];
    fields?: string[];
  }

  interface PlaceResult {
    place_id?: string;
    geometry?: {
      location: google.maps.LatLng;
    };
    name?: string;
    formatted_address?: string;
  }
} 