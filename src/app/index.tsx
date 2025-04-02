import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, type Region } from 'react-native-maps';
import { usePlacesStore } from '../stores/placesStore';
import PlaceSearch from '../components/PlaceSearch';
import SearchHistory from '../components/SearchHistory';
import { getCurrentLocation, DEFAULT_LOCATION } from '../services/locationService';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  const mapRef = useRef<MapView | null>(null);
  const { selectedPlace } = usePlacesStore();
  const [region, setRegion] = useState<Region>({
    ...DEFAULT_LOCATION,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [showHistory, setShowHistory] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map with user's location
  useEffect(() => {
    const initializeMap = async () => {
      try {
        const currentLocation = await getCurrentLocation();
        setRegion({
          ...currentLocation,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error('Failed to get current location:', error);
      }
    };

    if (isMapReady) {
      initializeMap();
    }
  }, [isMapReady]);

  // Update map when a place is selected
  useEffect(() => {
    if (selectedPlace && mapRef.current && isMapReady) {
      const newRegion = {
        latitude: selectedPlace.location.latitude,
        longitude: selectedPlace.location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  }, [selectedPlace, isMapReady]);

  const handlePlaceSelected = (details: google.maps.places.PlaceResult) => {
    if (details.geometry?.location && mapRef.current) {
      const newRegion = {
        latitude: details.geometry.location.lat(),
        longitude: details.geometry.location.lng(),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onMapReady={() => setIsMapReady(true)}
      >
        {selectedPlace && (
          <Marker
            coordinate={{
              latitude: selectedPlace.location.latitude,
              longitude: selectedPlace.location.longitude,
            }}
            title={selectedPlace.name}
            description={selectedPlace.address}
          />
        )}
      </MapView>

      <PlaceSearch onPlaceSelected={handlePlaceSelected} />

      <TouchableOpacity style={styles.historyButton} onPress={toggleHistory}>
        <Ionicons name="time-outline" size={24} color="white" />
        <Text style={styles.historyButtonText}>History</Text>
      </TouchableOpacity>

      <SearchHistory visible={showHistory} onClose={() => setShowHistory(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  historyButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  historyButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '600',
  },
});