# Places Map Search App

This React Native application allows users to search for places using Google Maps Places API, display locations on a map, maintain search history, and select places from history.

## Features

- **Google Maps Place Search**: Search for places using the Google Maps Places API with real-time suggestions
- **Display on Map**: View selected places on a Google Map with relevant details
- **Search History**: Maintains a record of searched locations with persistence
- **Select from History**: Select places from the history to display on the map

## Prerequisites

- Node.js and npm or yarn
- Expo CLI
- Google Maps API key

## Setup

1. Clone the repository

```bash
git clone <repository-url>
cd places-map-app
```

2. Install dependencies

```bash
yarn install
```

3. Configure Google Maps API Key

You need to obtain a Google Maps API key with the following APIs enabled:
- Maps SDK for Android/iOS
- Places API
- Geocoding API

After obtaining the key, update it in `src/components/PlaceSearch.tsx`:

```typescript
const GOOGLE_PLACES_API_KEY = 'YOUR_GOOGLE_API_KEY';
```

For a better approach in a real-world application, create a .env file in the project root:

```
GOOGLE_MAPS_API_KEY=your_api_key_here
```

Then install the necessary package:

```bash
yarn add react-native-dotenv
```

Update your babel.config.js to include:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["module:react-native-dotenv", {
        "moduleName": "@env",
        "path": ".env",
        "blacklist": null,
        "whitelist": null,
        "safe": false,
        "allowUndefined": true
      }]
    ]
  };
}
```

And import the API key in your component:

```typescript
import { GOOGLE_MAPS_API_KEY } from '@env';
```

4. Start the development server

```bash
yarn start
```

## Project Structure

- `/src/app/`: Main application screens
- `/src/components/`: Reusable components (PlaceSearch, SearchHistory)
- `/src/stores/`: State management with Zustand
- `/src/services/`: Services for handling location
- `/src/types/`: TypeScript type definitions
- `/src/util/`: Utility functions and storage helpers

## Technologies Used

- React Native / Expo
- Google Maps & Places API
- Zustand for state management
- MMKV for persistent storage
- TypeScript

## Development

To run linting:

```bash
npm run lint
```

To run tests:

```bash
npm run test
```

## License

This project is licensed under the MIT License.