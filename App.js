import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./AppNavigator";
import { SportsProvider } from "./SportsContext";
import "expo-dev-client";

export default function App() {
  return (
    <SportsProvider>
      <SafeAreaProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </SafeAreaProvider>
    </SportsProvider>
  );
}
