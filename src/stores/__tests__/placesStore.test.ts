import { renderHook, act } from '@testing-library/react-hooks';
import { usePlacesStore } from '../placesStore';
import type { Place } from '../../types';

// Mock the zustand persist middleware
jest.mock('zustand/middleware', () => ({
  persist: (config: unknown) => (set: unknown, get: unknown, api: unknown) => config(set, get, api),
  createJSONStorage: () => ({}),
}));

// Mock the storage implementation
jest.mock('../../util/storage', () => ({
  zustandMMKVStorage: {},
}));

describe('usePlacesStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    const { result } = renderHook(() => usePlacesStore());
    act(() => {
      result.current.clearHistory();
      result.current.selectPlace(null);
    });
  });

  it('should initialize with empty search history and null selected place', () => {
    const { result } = renderHook(() => usePlacesStore());
    
    expect(result.current.searchHistory).toEqual([]);
    expect(result.current.selectedPlace).toBeNull();
  });

  it('should add a place to search history', () => {
    const { result } = renderHook(() => usePlacesStore());
    
    const place: Place = {
      id: '1',
      name: 'Test Place',
      address: '123 Test St',
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
      timestamp: Date.now(),
    };
    
    act(() => {
      result.current.addToHistory(place);
    });
    
    expect(result.current.searchHistory).toHaveLength(1);
    expect(result.current.searchHistory[0]).toEqual(place);
  });

  it('should not add duplicate places to history', () => {
    const { result } = renderHook(() => usePlacesStore());
    
    const place: Place = {
      id: '1',
      name: 'Test Place',
      address: '123 Test St',
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
      timestamp: Date.now(),
    };
    
    act(() => {
      result.current.addToHistory(place);
      result.current.addToHistory({...place, name: 'Updated Name'});
    });
    
    expect(result.current.searchHistory).toHaveLength(1);
    expect(result.current.searchHistory[0].name).toBe('Updated Name');
  });

  it('should select a place', () => {
    const { result } = renderHook(() => usePlacesStore());
    
    const place: Place = {
      id: '1',
      name: 'Test Place',
      address: '123 Test St',
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
      timestamp: Date.now(),
    };
    
    act(() => {
      result.current.selectPlace(place);
    });
    
    expect(result.current.selectedPlace).toEqual(place);
  });

  it('should clear history', () => {
    const { result } = renderHook(() => usePlacesStore());
    
    const place: Place = {
      id: '1',
      name: 'Test Place',
      address: '123 Test St',
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
      timestamp: Date.now(),
    };
    
    act(() => {
      result.current.addToHistory(place);
      result.current.clearHistory();
    });
    
    expect(result.current.searchHistory).toEqual([]);
  });

  it('should limit history to 20 items', () => {
    const { result } = renderHook(() => usePlacesStore());
    
    // Add 25 places
    for (let i = 0; i < 25; i++) {
      const place: Place = {
        id: `${i}`,
        name: `Place ${i}`,
        address: `${i} Test St`,
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
        timestamp: Date.now() + i,
      };
      
      act(() => {
        result.current.addToHistory(place);
      });
    }
    
    expect(result.current.searchHistory).toHaveLength(20);
    // Newest places should be at the beginning
    expect(result.current.searchHistory[0].id).toBe('24');
  });
});
