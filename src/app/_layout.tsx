import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MMKV } from 'react-native-mmkv';
import { storage } from '../util/storage';

// Initialize storage if needed
export const globalStorage = new MMKV();

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' },
        }}
      />
    </>
  );
}