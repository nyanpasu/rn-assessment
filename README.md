# Places Map Search App

This React Native application allows users to search for places using Google
Maps Places API, display locations on a map, maintain search history, and
select places from history.

## Features

- **Google Maps Place Search**: Search for places using the Google Maps Places API with real-time suggestions
- **Display on Map**: View selected places on a Google Map with relevant details
- **Search History**: Maintains a record of searched locations with persistence
- **Select from History**: Select places from the history to display on the map

## Prerequisites

- Google Maps API key

## Setup

1. Clone the repository

```bash
git clone <repository-url>
cd rn-assessment
```

2. Install dependencies

```bash
yarn
```

3. Configure Google Maps API Key

You need to obtain a Google Maps API key with the following APIs enabled:
- Maps SDK for Android/iOS
- Places API
- Geocoding API

After obtaining the key, update it in .env

```
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

4. Start the development server

```bash
yarn start
```

## Project Structure

- `/src/app/`: Main application screens
- `/src/components/`: Reusable components
- `/src/stores/`: State management with Zustand
- `/src/services/`: Services for handling location
- `/src/types/`: TypeScript type definitions
- `/src/util/`: Utility functions and storage helpers

## Technologies Used

- TypeScript
- React Native / Expo
- Google Maps & Places API
- Zustand for state management
- MMKV for persistent storage

## Building (Android)

Use eas to build, follow the setup instructions [here](https://docs.expo.dev/build/setup/)

```
npm install -g eas-cli
eas login
eas build:configure
```

Then make a development build like so:

```
eas build --profile development --platform android --local
```

You can then proceed to install the apk file on a real device or an emulator using adb

```
adb install build-1743602399942.apk # example!
```

## Development

To run linting:

```bash
yarn lint
```

To run tests:

```bash
yarn test
```
