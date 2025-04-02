import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import MapScreen from '../index';
import { usePlacesStore } from '../../stores/placesStore';
import * as LocationService from '../../services/locationService';

// Mock dependencies
jest.mock('../../stores/placesStore', () => ({
  usePlacesStore: jest.fn(),
}));

jest.mock('../../services/locationService', () => ({
  getCurrentLocation: jest.fn(),
  DEFAULT_LOCATION: {
    latitude: 37.7749,
    longitude: -122.4194,
  },
}));

jest.mock('react-native-maps', () => {
  const MockMapView = ({ children, onMapReady }) => {
    useEffect(() => {
      onMapReady?.();
    }, [onMapReady]);
    return <View>{children}</View>;
  };

  MockMapView.Marker = ({ coordinate, title }) => (
    <View testID="map-marker" accessibilityLabel={`marker-${title}`} accessibilityHint={JSON.stringify(coordinate)} />
  );

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMapView.Marker,
    PROVIDER_GOOGLE: 'google',
  };
});

jest.mock('../../components/PlaceSearch', () => {
  return {
    __esModule: true,
    default: ({ onPlaceSelected }) => <View testID="place-search" />,
  };
});

jest.mock('../../components/SearchHistory', () => {
  return {
    __esModule: true,
    default: ({ visible, onClose }) => (
      visible ? <TouchableOpacity testID="search-history" onPress={onClose} /> : null
    ),
  };
});

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => <View testID="ionicons" />,
}));

describe('MapScreen', () => {
  const mockSelectedPlace = {
    id: '1',
    name: 'Test Place',
    address: '123 Test St',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    timestamp: Date.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the store
    (usePlacesStore as jest.Mock).mockReturnValue({
      selectedPlace: null,
    });

    // Mock location service
    (LocationService.getCurrentLocation as jest.Mock).mockResolvedValue({
      latitude: 37.7749,
      longitude: -122.4194,
    });
  });

  it('should render MapView and PlaceSearch components', () => {
    const { getByTestId } = render(<MapScreen />);

    // Check that the PlaceSearch component is rendered
    expect(getByTestId('place-search')).toBeTruthy();
  });

  it('should show the SearchHistory component when the history button is pressed', () => {
    // Render the component with necessary mocks
    const { getByText, getByTestId, queryByTestId } = render(<MapScreen />);

    // Initially, the SearchHistory should not be visible
    expect(queryByTestId('search-history')).toBeNull();

    // Press the history button
    fireEvent.press(getByText('History'));

    // Now the SearchHistory should be visible
    expect(getByTestId('search-history')).toBeTruthy();
  });

  it('should display a marker when a place is selected', () => {
    // Mock selected place
    (usePlacesStore as jest.Mock).mockReturnValue({
      selectedPlace: mockSelectedPlace,
    });

    const { getByTestId } = render(<MapScreen />);

    // Expect a marker to be rendered with the correct properties
    const marker = getByTestId('map-marker');
    expect(marker).toBeTruthy();
    expect(marker.props['accessibilityLabel']).toBe('marker-Test Place');
    expect(JSON.parse(marker.props['accessibilityHint'])).toEqual({
      latitude: 37.7749,
      longitude: -122.4194,
    });
  });
});
