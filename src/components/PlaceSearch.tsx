import React, { useRef, forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { usePlacesStore } from '../stores/placesStore';
import type { Place } from '../types';

// Define your API key as an environment variable in a real app
// For assessment purposes, we're including it directly
const GOOGLE_PLACES_API_KEY = 'YOUR_GOOGLE_API_KEY';

interface PlaceSearchProps {
  onPlaceSelected?: (details: google.maps.places.PlaceResult) => void;
}

const PlaceSearch = forwardRef<View, PlaceSearchProps>(({ onPlaceSelected }, ref) => {
  const { addToHistory, selectPlace } = usePlacesStore();
  const placesRef = useRef<typeof GooglePlacesAutocomplete | null>(null);

  const handlePlaceSelect = (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null,
    // data: { description: string },
    // details: google.maps.places.PlaceResult | null = null
  ) => {
    if (!details) return;

    const place: Place = {
      id: details.place_id || String(Date.now()),
      name: details.name || '',
      address: details.formatted_address || '',
      location: {
        latitude: details.geometry?.location?.lat || 0,
        longitude: details.geometry?.location?.lng || 0,
      },
      timestamp: Date.now(),
    };

    addToHistory(place);
    selectPlace(place);

    // Clear the search text after selection
    if (placesRef.current) {
      placesRef.current.clear();
    }

    // Callback for parent components
    if (onPlaceSelected && details) {
      onPlaceSelected(details);
    }
  };

  return (
    <View ref={ref} style={styles.container}>
      <GooglePlacesAutocomplete
        ref={placesRef}
        placeholder="Search for a place"
        fetchDetails={true}
        onPress={handlePlaceSelect}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'en',
        }}
        styles={{
          container: styles.searchContainer,
          textInput: styles.textInput,
          listView: styles.listView,
          row: styles.row,
        }}
        debounce={300}
        enablePoweredByContainer={false}
        minLength={2}
      />
    </View>
  );
});

export default PlaceSearch;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '90%',
    zIndex: 1,
    top: 50,
    alignSelf: 'center',
  },
  searchContainer: {
    flex: 0,
  },
  textInput: {
    height: 50,
    fontSize: 16,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  listView: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  row: {
    padding: 13,
  },
});
