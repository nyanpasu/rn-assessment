import * as Location from 'expo-location';
import { getCurrentLocation, DEFAULT_LOCATION } from '../locationService';

// Mock expo-location
jest.mock('expo-location');

describe('locationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the current location when permissions are granted', async () => {
    // Mock the permission request
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    // Mock the getCurrentPositionAsync
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: {
        latitude: 40.7128,
        longitude: -74.0060,
      },
    });

    const location = await getCurrentLocation();

    expect(location).toEqual({
      latitude: 40.7128,
      longitude: -74.0060,
    });

    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(Location.getCurrentPositionAsync).toHaveBeenCalledTimes(1);
  });

  it('should return the default location when permissions are denied', async () => {
    // Mock the permission request
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    const location = await getCurrentLocation();

    expect(location).toEqual(DEFAULT_LOCATION);
    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
  });

  it('should return the default location when there is an error', async () => {
    // Mock the permission request to throw an error
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockRejectedValue(
      new Error('Test error')
    );

    const location = await getCurrentLocation();

    expect(location).toEqual(DEFAULT_LOCATION);
    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
  });
});
