import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./AppNavigator";
import { SportsProvider } from "./SportsContext";
import "expo-dev-client";
import { MarkerProvider } from "./app/services/MarkerContext";

export default function App() {
  return (
    <MarkerProvider>
      <SportsProvider>
        <SafeAreaProvider>
          <AppNavigator />
          <StatusBar style="light" />
        </SafeAreaProvider>
      </SportsProvider>
    </MarkerProvider>
  );
}
