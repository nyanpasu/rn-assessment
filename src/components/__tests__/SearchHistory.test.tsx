import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchHistory from '../SearchHistory';
import { usePlacesStore } from '../../stores/placesStore';

// Mock the places store
jest.mock('../../stores/placesStore', () => ({
  usePlacesStore: jest.fn(),
}));

describe('SearchHistory', () => {
  const mockSelectPlace = jest.fn();
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation
    (usePlacesStore as jest.Mock).mockReturnValue({
      searchHistory: [],
      selectPlace: mockSelectPlace,
    });
  });
  
  it('should not render when visible is false', () => {
    const { queryByText } = render(
      <SearchHistory visible={false} onClose={mockOnClose} />
    );
    
    expect(queryByText('Search History')).toBeNull();
  });
  
  it('should render when visible is true', () => {
    const { getByText } = render(
      <SearchHistory visible={true} onClose={mockOnClose} />
    );
    
    expect(getByText('Search History')).toBeTruthy();
  });
  
  it('should display empty state when no history items exist', () => {
    const { getByText } = render(
      <SearchHistory visible={true} onClose={mockOnClose} />
    );
    
    expect(getByText('No search history yet')).toBeTruthy();
  });
  
  it('should display history items when they exist', () => {
    // Mock history items
    const mockHistory = [
      {
        id: '1',
        name: 'Test Place 1',
        address: '123 Test St',
        location: { latitude: 37.7749, longitude: -122.4194 },
        timestamp: Date.now(),
      },
      {
        id: '2',
        name: 'Test Place 2',
        address: '456 Test Ave',
        location: { latitude: 34.0522, longitude: -118.2437 },
        timestamp: Date.now(),
      },
    ];
    
    (usePlacesStore as jest.Mock).mockReturnValue({
      searchHistory: mockHistory,
      selectPlace: mockSelectPlace,
    });
    
    const { getByText } = render(
      <SearchHistory visible={true} onClose={mockOnClose} />
    );
    
    expect(getByText('Test Place 1')).toBeTruthy();
    expect(getByText('Test Place 2')).toBeTruthy();
    expect(getByText('123 Test St')).toBeTruthy();
    expect(getByText('456 Test Ave')).toBeTruthy();
  });
  
  it('should call selectPlace and onClose when a place is selected', () => {
    // Mock history items
    const mockHistory = [
      {
        id: '1',
        name: 'Test Place 1',
        address: '123 Test St',
        location: { latitude: 37.7749, longitude: -122.4194 },
        timestamp: Date.now(),
      },
    ];
    
    (usePlacesStore as jest.Mock).mockReturnValue({
      searchHistory: mockHistory,
      selectPlace: mockSelectPlace,
    });
    
    const { getByText } = render(
      <SearchHistory visible={true} onClose={mockOnClose} />
    );
    
    // Click on a place
    fireEvent.press(getByText('Test Place 1'));
    
    // Verify the correct functions were called
    expect(mockSelectPlace).toHaveBeenCalledWith(mockHistory[0]);
    expect(mockOnClose).toHaveBeenCalled();
  });
  
  it('should call onClose when the close button is pressed', () => {
    const { getByText } = render(
      <SearchHistory visible={true} onClose={mockOnClose} />
    );
    
    // Click on the close button
    fireEvent.press(getByText('Close'));
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});
