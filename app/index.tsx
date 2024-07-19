import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 7000); // 7 seconds

    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();

    return () => clearTimeout(timer);
  }, [rotateValue]);

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4FC3F7', '#00B0FF', '#0091EA']}
        style={styles.background}
      >
        <View style={styles.content}>
          <Animated.View style={[styles.iconContainer, { transform: [{ rotate: rotateInterpolate }] }]}>
            <Ionicons name="football" size={100} color="#FFFFFF" />
          </Animated.View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>CatchApp</Text>
            <View style={styles.mirrorContainer}>
              <Text style={[styles.title, styles.mirrorTitle]}>CatchApp</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Connect Through Sports</Text>
          <View style={styles.shapes}>
            <Animated.View style={[styles.shape, styles.shape1, { transform: [{ rotate: rotateInterpolate }] }]} />
            <Animated.View style={[styles.shape, styles.shape2, { transform: [{ rotate: rotateInterpolate }] }]} />
            <Animated.View style={[styles.shape, styles.shape3, { transform: [{ rotate: rotateInterpolate }] }]} />
          </View>
        </View>
        <Text style={styles.footerText}>Katalan inc.</Text>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    fontFamily: 'AvenirNext-Bold',
  },
  mirrorContainer: {
    overflow: 'hidden',
    height: 24,
  },
  mirrorTitle: {
    transform: [{ scaleY: -1 }],
    opacity: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 40,
    fontFamily: 'AvenirNext-Regular',
  },
  shapes: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shape: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
  },
  shape1: {
    width: 200,
    height: 200,
    bottom: -100,
    left: -100,
  },
  shape2: {
    width: 150,
    height: 150,
    bottom: -75,
    right: -75,
  },
  shape3: {
    width: 100,
    height: 100,
    bottom: -50,
    left: '50%',
    marginLeft: -50,
  },
  footerText: {
    position: 'absolute',
    bottom: 20,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'AvenirNext-Regular',
  },
});

export default WelcomeScreen;
