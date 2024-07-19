import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, Animated, Dimensions, Easing } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin';
const MANAGER_EMAIL = 'manager@gmail.com';
const MANAGER_PASSWORD = 'manager';
const NORMAL_USER_EMAIL = 'user@gmail.com';
const NORMAL_USER_PASSWORD = 'user123';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const scaleValue = new Animated.Value(1);
  const floatValue = useRef(new Animated.Value(0)).current;
  const [shapes] = useState([
    { top: 50, left: 30 },
    { top: 150, left: 200 },
    { top: 300, left: 100 },
    { top: 450, left: 250 },
    { top: 600, left: 50 },
  ]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatValue, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatValue]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    let userRole = '';
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      userRole = 'admin';
    } else if (email === MANAGER_EMAIL && password === MANAGER_PASSWORD) {
      userRole = 'manager';
    } else if (email === NORMAL_USER_EMAIL && password === NORMAL_USER_PASSWORD) {
      userRole = 'user';
    } else {
      setError('Invalid email or password');
      return;
    }

    await AsyncStorage.setItem('userRole', userRole);
    router.replace('/dashboard');
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.shapeContainer}>
        {shapes.map((shape, index) => (
          <Animated.View
            key={index}
            style={[
              styles.shape,
              {
                top: shape.top,
                left: shape.left,
                transform: [
                  {
                    translateY: floatValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 10],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to your account</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#8E8E93"
            value={email}
            onChangeText={(text) => { setEmail(text); setError(''); }}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#8E8E93"
            value={password}
            onChangeText={(text) => { setPassword(text); setError(''); }}
            secureTextEntry
          />
        </View>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin} 
          onPressIn={handlePressIn} 
          onPressOut={handlePressOut}
        >
          <Animated.View style={animatedStyle}>
            <Text style={styles.buttonText}>Log In</Text>
          </Animated.View>
        </TouchableOpacity>
        
        <View style={styles.socialLoginContainer}>
          <Text style={styles.socialLoginText}>Or login with</Text>
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Social Login', 'Facebook login is not implemented yet.')}>
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Social Login', 'Google login is not implemented yet.')}>
              <Ionicons name="logo-google" size={24} color="#EA4335" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Social Login', 'Apple login is not implemented yet.')}>
              <Ionicons name="logo-apple" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        <Link href="/(auth)/register" asChild>
          <TouchableOpacity style={styles.signUpButton}>
            <Text style={styles.signUpButtonText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  shapeContainer: {
    position: 'absolute',
    width,
    height,
    overflow: 'hidden',
  },
  shape: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(79, 195, 247, 0.5)',
    position: 'absolute',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 30,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    elevation: 2,
  },
  input: {
    paddingVertical: 15,
    color: '#000',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialLoginContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  socialLoginText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 15,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 2,
  },
  signUpButton: {
    backgroundColor: '#4FC3F7',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});