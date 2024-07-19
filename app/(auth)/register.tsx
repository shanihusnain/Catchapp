import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Animated, Alert, Dimensions, Switch, Easing } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { sports, Sport } from '../config/sportsConfig';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isHealthAgreed, setIsHealthAgreed] = useState(false);
  const router = useRouter();
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

  const toggleSport = (sportName: string) => {
    setSelectedSports(prev => 
      prev.includes(sportName)
        ? prev.filter(sport => sport !== sportName)
        : [...prev, sportName]
    );
  };

  const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

  const renderSportButton = (sport: Sport) => {
    const isSelected = selectedSports.includes(sport.name);

    return (
      <TouchableOpacity
        key={sport.name}
        style={[styles.sportButton, { backgroundColor: sport.color }]}
        onPress={() => toggleSport(sport.name)}
      >
        <Ionicons name={sport.icon} size={24} color="white" />
        <Text style={styles.sportText}>{sport.name}</Text>
        {isSelected && (
          <AnimatedIcon 
            name="checkmark-circle" 
            size={24} 
            color="white" 
            style={styles.checkmark}
          />
        )}
      </TouchableOpacity>
    );
  };

  const handleRegister = () => {
    if (!isTermsAgreed || !isHealthAgreed) {
      Alert.alert('Agreement Required', 'You must agree to the terms and conditions and confirm your health status to register.');
      return;
    }
    // Add further registration logic here
    console.log('Register');
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Account</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#8E8E93"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#8E8E93"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#8E8E93"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Re-enter Password"
            placeholderTextColor="#8E8E93"
            value={rePassword}
            onChangeText={setRePassword}
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Age"
            placeholderTextColor="#8E8E93"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Address (City and Street)"
            placeholderTextColor="#8E8E93"
            value={address}
            onChangeText={setAddress}
          />
        </View>
        <Text style={styles.sportsTitle}>What are you up to today?</Text>
        <View style={styles.sportsContainer}>
          {sports.map(renderSportButton)}
        </View>
        <View style={styles.agreementContainer}>
          <Switch
            value={isTermsAgreed}
            onValueChange={setIsTermsAgreed}
          />
          <View style={styles.agreementTextContainer}>
            <Text style={styles.agreementText}>I agree to the </Text>
            <Link href="/terms" asChild>
              <TouchableOpacity>
                <Text style={styles.termsLink}>terms and conditions</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
        <View style={styles.agreementContainer}>
          <Switch
            value={isHealthAgreed}
            onValueChange={setIsHealthAgreed}
          />
          <Text style={styles.agreementText}>I confirm that I am in good health</Text>
        </View>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    color: '#000',
  },
  sportsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 15,
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  sportText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  checkmark: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  agreementTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  agreementText: {
    marginLeft: 10,
    color: '#000',
  },
  termsLink: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  registerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});