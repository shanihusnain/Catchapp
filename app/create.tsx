import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Switch, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Slider from '@react-native-community/slider';
import { sports, Sport } from './config/sportsConfig';



const levels = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert'];

export default function CreateScreen() {
  const [step, setStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [allowWaitingList, setAllowWaitingList] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [level, setLevel] = useState(2); // Default to 'Intermediate'

  const router = useRouter();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (selectedTime: Date) => {
    setTime(selectedTime);
    hideTimePicker();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setRoomImage(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    if (step === 1 && selectedSport) {
      setStep(2);
    } else if (step === 2) {
      if (!title || !date || !time || !location || !maxPlayers) {
        Alert.alert('Missing Information', 'Please fill in all fields.');
        return;
      }
      // Here you would typically save the room data
      console.log('Room created:', { 
        selectedSport, 
        title, 
        date: date.toISOString().split('T')[0], 
        time: time.toTimeString().slice(0, 5), 
        location, 
        maxPlayers, 
        allowWaitingList, 
        level: levels[level - 1] 
      });
      Alert.alert('Success', 'Room created successfully!', [
        { text: 'OK', onPress: () => router.push('/dashboard') }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerBackground}>
          <Svg height="80" width="100%" viewBox="0 0 1440 320">
            <Defs>
              <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#007AFF" stopOpacity="1" />
                <Stop offset="100%" stopColor="#00C6FF" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Path
              fill="url(#grad)"
              d="M0,224L48,234.7C96,245,192,267,288,240C384,213,480,139,576,138.7C672,139,768,213,864,213.3C960,213,1056,139,1152,128C1248,117,1344,171,1392,197.3L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            />
          </Svg>
          <View style={styles.header}>
            {step === 2 && (
              <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            )}
            <Text style={styles.title}>{step === 1 ? 'Create a New Room' : 'Room Details'}</Text>
          </View>
        </View>
        {step === 1 ? (
          <>
            <Text style={styles.question}>Which sport would you like to do, <Text style={styles.boldText}>John</Text>?</Text>
            <View style={styles.sportsGrid}>
              {sports.map((sport) => (
                <TouchableOpacity
                  key={sport.name}
                  style={[
                    styles.sportButton,
                    { backgroundColor: sport.color },
                    selectedSport?.name === sport.name && styles.selectedSport
                  ]}
                  onPress={() => setSelectedSport(sport)}
                >
                  <Ionicons name={sport.icon} size={24} color="white" />
                  <Text style={styles.sportText}>{sport.name}</Text>
                  {selectedSport?.name === sport.name && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark" size={24} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>Let's set up your {selectedSport?.name} game, <Text style={styles.boldText}>John</Text>!</Text>

            <Text style={styles.formLabel}>Room Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter room title"
              placeholderTextColor="#888"
            />
            
            <Text style={styles.formLabel}>Date</Text>
            <TouchableOpacity style={[styles.dateTimeButton, styles.whiteBackground]} onPress={showDatePicker}>
              <Text>{date.toDateString()}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={hideDatePicker}
            />
            
            <Text style={styles.formLabel}>Time</Text>
            <TouchableOpacity style={[styles.dateTimeButton, styles.whiteBackground]} onPress={showTimePicker}>
              <Text>{time.toTimeString().slice(0, 5)}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="time"
              onConfirm={handleTimeConfirm}
              onCancel={hideTimePicker}
            />
            
            <Text style={styles.formLabel}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter location"
              placeholderTextColor="#888"
            />
            
            <Text style={styles.formLabel}>Maximum Players</Text>
            <TextInput
              style={styles.input}
              value={maxPlayers}
              onChangeText={setMaxPlayers}
              placeholder="Enter maximum players"
              placeholderTextColor="#888"
              keyboardType="numeric"
            />
            
            <View style={styles.switchContainer}>
              <Text style={styles.formLabel}>Allow Waiting List (3 spots)</Text>
              <Switch
                value={allowWaitingList}
                onValueChange={setAllowWaitingList}
              />
            </View>

            <Text style={styles.formLabel}>Level</Text>
            <View style={styles.levelContainer}>
              <Slider
                style={{width: '100%', height: 40}}
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={level}
                onValueChange={setLevel}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#000000"
              />
              <View style={styles.levelLabels}>
                {levels.map((label, index) => (
                  <Text key={label} style={[styles.levelLabel, index + 1 === level && styles.selectedLevel]}>
                    {label}
                  </Text>
                ))}
              </View>
            </View>

            <Text style={styles.formLabel}>Room Image</Text>
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              {roomImage ? (
                <Image source={{ uri: roomImage }} style={styles.roomImage} />
              ) : (
                <Text style={styles.imagePickerText}>Select an image</Text>
              )}
            </TouchableOpacity>
          </>
        )}
        
        <TouchableOpacity 
          style={[styles.nextButton, step === 1 && !selectedSport && styles.disabledButton]} 
          onPress={handleNext}
          disabled={step === 1 && !selectedSport}
        >
          <Text style={styles.nextButtonText}>{step === 1 ? 'Next' : 'Create Room'}</Text>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </ScrollView>
      
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={24} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/search')}>
          <Ionicons name="search-outline" size={24} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="add-circle" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/friends-and-chat')}>
          <Ionicons name="chatbubbles-outline" size={24} color="#8E8E93" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 20,
  },
  headerBackground: {
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sportButton: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  selectedSport: {
    borderWidth: 3,
    borderColor: 'white',
  },
  sportText: {
    color: 'white',
    marginTop: 10,
    fontWeight: 'bold',
  },
  checkmark: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#F2F2F7',
    paddingVertical: 10,
  },
  tabItem: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  dateTimeButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  whiteBackground: {
    backgroundColor: 'white',
  },
  disabledButton: {
    backgroundColor: '#D1D1D6',
  },
  imagePickerButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  roomImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imagePickerText: {
    color: '#888',
  },
  levelContainer: {
    marginBottom: 20,
  },
  levelLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  levelLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  selectedLevel: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});