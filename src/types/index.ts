export interface Place {
  id: string;
  name: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  phoneNumber?: string;
  website?: string;
  rating?: number;
  openingHours?: {
    isOpen?: boolean;
    weekdayText?: string[];
  };
  photos?: string[];
  timestamp: number;
}

export interface PlacesState {
  searchHistory: Place[];
  selectedPlace: Place | null;
  addToHistory: (place: Place) => void;
  selectPlace: (place: Place | null) => void;
  clearHistory: () => void;
}
