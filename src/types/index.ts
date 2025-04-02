export interface Place {
  id: string;
  name: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
}

export interface PlacesState {
  searchHistory: Place[];
  selectedPlace: Place | null;
  addToHistory: (place: Place) => void;
  selectPlace: (place: Place | null) => void;
  clearHistory: () => void;
}
