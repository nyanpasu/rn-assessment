import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandMMKVStorage } from '../util/storage';
import type { Place, PlacesState } from '../types';

export const usePlacesStore = create<PlacesState>()(
  persist(
    (set) => ({
      searchHistory: [],
      selectedPlace: null,

      addToHistory: (place: Place) => set((state) => {
        // Filter out duplicate places by ID
        const filteredHistory = state.searchHistory.filter(
          (item) => item.id !== place.id
        );

        // Add new place to the beginning of history
        return {
          searchHistory: [place, ...filteredHistory].slice(0, 20) // Keep only 20 most recent
        };
      }),

      selectPlace: (place: Place | null) => set({ selectedPlace: place }),

      clearHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: 'places-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
    }
  )
);
