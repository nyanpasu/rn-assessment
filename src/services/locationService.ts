import * as Location from 'expo-location';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export const DEFAULT_LOCATION: LocationCoordinates = {
  latitude: 37.7749, // San Francisco
  longitude: -122.4194,
};

export async function getCurrentLocation(): Promise<LocationCoordinates> {
  try {
    // Request permission to access location
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      // console.log('Location permission denied');
      return DEFAULT_LOCATION;
    }

    // Get current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    // console.error('Error getting location:', error);
    return DEFAULT_LOCATION;
  }
}
