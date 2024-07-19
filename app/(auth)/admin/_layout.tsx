import React from 'react';
import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen name="AdminPanel" options={{ headerShown: false }} />
      <Stack.Screen name="SportsConfigManagement" options={{ headerShown: false }} />
      <Stack.Screen name="UserManagement" options={{ headerShown: false }} />
    </Stack>
  );
}