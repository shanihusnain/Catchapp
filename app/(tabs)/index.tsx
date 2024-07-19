import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function WelcomeScreen() {
  const fadeAnim = new Animated.Value(0);
  const spinAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      router.replace('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.iconContainer, opacity: fadeAnim }}>
        <Ionicons name="football-outline" size={100} color="#A3FFD6" />
      </Animated.View>
      <Animated.Text style={{ ...styles.title, opacity: fadeAnim }}>
        CatchApp
      </Animated.Text>
      <View style={styles.sportsIconsContainer}>
        <Animated.View style={{ ...styles.sportsIcon, transform: [{ rotate: spin }] }}>
          <Ionicons name="basketball-outline" size={50} color="#A3FFD6" />
        </Animated.View>
        <Animated.View style={{ ...styles.sportsIcon, transform: [{ rotate: spin }] }}>
          <Ionicons name="tennisball-outline" size={50} color="#A3FFD6" />
        </Animated.View>
        <Animated.View style={{ ...styles.sportsIcon, transform: [{ rotate: spin }] }}>
          <Ionicons name="fitness-outline" size={50} color="#A3FFD6" />
        </Animated.View>
        <Animated.View style={{ ...styles.sportsIcon, transform: [{ rotate: spin }] }}>
          <Ionicons name="american-football-outline" size={50} color="#A3FFD6" />
        </Animated.View>
        <Animated.View style={{ ...styles.sportsIcon, transform: [{ rotate: spin }] }}>
          <Ionicons name="swim-outline" size={50} color="#A3FFD6" />
        </Animated.View>
      </View>
      <ActivityIndicator size="large" color="#A3FFD6" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1678',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#A3FFD6',
  },
  sportsIconsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  sportsIcon: {
    marginHorizontal: 10,
  },
  spinner: {
    marginTop: 20,
  },
});
