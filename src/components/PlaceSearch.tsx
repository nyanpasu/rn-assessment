import React, { useState, useRef, useEffect, forwardRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlacesStore } from '../stores/placesStore';
import type { Place } from '../types';
import { GOOGLE_PLACES_API_KEY } from '../util/constants';
import { getCurrentLocation, LocationCoordinates, DEFAULT_LOCATION } from '../services/locationService';

interface PlaceSearchProps {
  onPlaceSelected?: (details: google.maps.places.PlaceResult) => void;
}

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const PlaceSearch = forwardRef<KeyboardAvoidingView, PlaceSearchProps>(({ onPlaceSelected }, ref) => {
  const { addToHistory, selectPlace } = usePlacesStore();
  const [searchText, setSearchText] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationCoordinates>(DEFAULT_LOCATION);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Handle keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Fetch current location when component mounts
  useEffect(() => {
    const fetchLocation = async () => {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
    };

    fetchLocation();
  }, []);

  // Function to fetch place predictions based on search text
  const fetchPlacePredictions = async (text: string) => {
    if (!text.trim()) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Add location bias parameter using the current location
      const locationBias = `&location=${currentLocation.latitude},${currentLocation.longitude}&radius=50000`;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          text
        )}${locationBias}&key=${GOOGLE_PLACES_API_KEY}&sessiontoken=${Date.now()}`
      );

      const data = await response.json();
      if (data.status === 'OK') {
        setPredictions(data.predictions);
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch place details based on place_id
  const fetchPlaceDetails = async (placeId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,formatted_phone_number,website,rating,opening_hours,photos&key=${GOOGLE_PLACES_API_KEY}`
      );

      const data = await response.json();
      if (data.status === 'OK' && data.result) {
        const details = data.result;

        // Create a Place object for the store
        const place: Place = {
          id: details.place_id || String(Date.now()),
          name: details.name || '',
          address: details.formatted_address || '',
          location: {
            latitude: details.geometry?.location?.lat || 0,
            longitude: details.geometry?.location?.lng || 0,
          },
          phoneNumber: details.formatted_phone_number,
          website: details.website,
          rating: details.rating,
          openingHours: details.opening_hours ? {
            isOpen: details.opening_hours.open_now,
            weekdayText: details.opening_hours.weekday_text,
          } : undefined,
          photos: details.photos ? 
            details.photos.slice(0, 3).map(photo => 
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
            ) : undefined,
          timestamp: Date.now(),
        };

        // Add to history and select place
        addToHistory(place);
        selectPlace(place);

        // Clear input and predictions
        setSearchText('');
        setPredictions([]);
        Keyboard.dismiss();

        // Create a PlaceResult-like object for the onPlaceSelected callback
        if (onPlaceSelected) {
          const placeResult = {
            name: details.name,
            formatted_address: details.formatted_address,
            geometry: {
              location: {
                lat: () => details.geometry.location.lat,
                lng: () => details.geometry.location.lng,
              },
            },
            place_id: details.place_id,
          };
          onPlaceSelected(placeResult as any);
        }
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle text input changes with debounce
  const handleChangeText = (text: string) => {
    setSearchText(text);

    // Clear any existing timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set a new timeout for debouncing
    searchTimeout.current = setTimeout(() => {
      fetchPlacePredictions(text);
    }, 300);
  };

  // Handle place selection
  const handleSelectPlace = (prediction: PlacePrediction) => {
    fetchPlaceDetails(prediction.place_id);
  };

  // Handle clearing the search
  const handleClearSearch = () => {
    setSearchText('');
    setPredictions([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      ref={ref}
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            placeholder="Search for a place"
            value={searchText}
            onChangeText={handleChangeText}
            autoCapitalize="none"
            clearButtonMode="never"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        )}

        {predictions.length > 0 && (
          <View style={[styles.predictionsContainer, isKeyboardVisible && styles.keyboardOpen]}>
            <FlatList
              data={predictions}
              keyExtractor={(item) => item.place_id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.predictionRow}
                  onPress={() => handleSelectPlace(item)}
                >
                  <Ionicons name="location-outline" size={20} color="#666" style={styles.rowIcon} />
                  <View style={styles.predictionTextContainer}>
                    <Text style={styles.mainText}>{item.structured_formatting.main_text}</Text>
                    <Text style={styles.secondaryText}>{item.structured_formatting.secondary_text}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  loadingContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
    top: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  predictionsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  keyboardOpen: {
    maxHeight: 200,
  },
  predictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rowIcon: {
    marginRight: 10,
  },
  predictionTextContainer: {
    flex: 1,
  },
  mainText: {
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
