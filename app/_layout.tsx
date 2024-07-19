import React from 'react';
import { Stack } from 'expo-router';
import { SportsProvider } from './SportsContext'; // Adjust path if necessary

export default function RootLayout() {
  return (
    <SportsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
        <Stack.Screen name="profile" options={{ title: 'Profile' }} />
        <Stack.Screen name="search" options={{ title: 'Search' }} />
        <Stack.Screen name="create" options={{ title: 'Create' }} />
        <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
        <Stack.Screen name="friends-and-chat" options={{ title: 'Friends & Chat' }} />
      </Stack>
    </SportsProvider>
  );
}