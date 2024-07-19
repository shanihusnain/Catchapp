import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sports, Sport } from './config/sportsConfig';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const API_KEY = 'd888abc55a29978c02f8acb1e8ac169b';
const { width, height } = Dimensions.get('window');

interface Weather {
  temperature: number;
  condition: string;
  location: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    time: string;
    temperature: number;
    icon: string;
  }>;
}

interface Room {
  id: string;
  sport: Sport;
  location: {
    latitude: number;
    longitude: number;
  };
}

export default function DashboardScreen() {
  const [avatarUri, setAvatarUri] = useState<string>('https://via.placeholder.com/64');
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const router = useRouter();
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0
  });
  const mapViewRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  useEffect(() => {
    fetchWeather();
    checkUserRole();
    fetchRooms();
  }, []);

  const checkUserRole = async () => {
    const role = await AsyncStorage.getItem('userRole');
    setUserRole(role);
  };

  const fetchWeather = async () => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setWeatherError('Permission to access location was denied');
        setWeatherLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

      const [currentWeatherResponse, forecastResponse] = await Promise.all([
        axios.get(currentWeatherUrl),
        axios.get(forecastUrl)
      ]);

      const currentWeather = currentWeatherResponse.data;
      const forecast = forecastResponse.data;

      setWeather({
        temperature: currentWeather.main.temp,
        condition: currentWeather.weather[0]?.main || 'Unknown',
        location: currentWeather.name || 'Unknown Location',
        icon: currentWeather.weather[0]?.icon || '01d',
        humidity: currentWeather.main.humidity,
        windSpeed: currentWeather.wind.speed,
        forecast: forecast.list.slice(0, 6).map((item: any) => ({
          time: new Date(item.dt * 1000).getHours() + ':00',
          temperature: item.main.temp,
          icon: item.weather[0].icon,
        })),
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeatherError('Failed to fetch weather');
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchRooms = async () => {
    const mockRooms: Room[] = sports.map((sport, index) => ({
      id: `room-${index}`,
      sport: sport,
      location: {
        latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
      },
    }));

    setRooms(mockRooms);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
    setIsDropdownVisible(false);
  };

  const handleSearch = () => {
    router.push({
      pathname: '/search',
      params: { query: searchQuery }
    });
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const convertTemperature = (celsius: number) => {
    return isCelsius ? celsius : (celsius * 9 / 5) + 32;
  };

  const WeatherWidget = () => (
    <View style={styles.weatherWidget}>
      {weatherLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : weatherError ? (
        <Text style={styles.errorText}>{weatherError}</Text>
      ) : weather ? (
        <>
          <View style={styles.weatherHeader}>
            <Text style={styles.weatherLocation}>{weather.location}</Text>
            <TouchableOpacity onPress={toggleTemperatureUnit}>
              <Text style={styles.unitToggle}>{isCelsius ? '°C' : '°F'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.weatherInfo}>
            <View style={styles.weatherMain}>
              <Image
                source={{ uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png` }}
                style={styles.weatherIcon}
              />
              <View>
                <Text style={styles.weatherTemp}>
                  {Math.round(convertTemperature(weather.temperature))}°
                </Text>
                <Text style={styles.weatherCondition}>{weather.condition}</Text>
              </View>
            </View>
            <View style={styles.weatherDetails}>
              <Text style={styles.weatherDetailText}>Humidity: {weather.humidity}%</Text>
              <Text style={styles.weatherDetailText}>Wind: {weather.windSpeed} m/s</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastScroll}>
            {weather.forecast.map((item, index) => (
              <View key={index} style={styles.forecastItem}>
                <Text style={styles.forecastTime}>{item.time}</Text>
                <Image
                  source={{ uri: `http://openweathermap.org/img/wn/${item.icon}.png` }}
                  style={styles.forecastIcon}
                />
                <Text style={styles.forecastTemp}>{Math.round(convertTemperature(item.temperature))}°</Text>
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <Text>No weather data available</Text>
      )}
    </View>
  );

  const RoomsFinder = () => (
    <View style={styles.roomsFinderContainer}>
      <Text style={styles.roomsFinderTitle}>Rooms Finder</Text>
      <View style={[styles.mapContainer, isMapExpanded && styles.mapExpanded]}>
        {userLocation.latitude !== 0 && userLocation.longitude !== 0 ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            ref={mapViewRef}
            loadingEnabled
            style={styles.map}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          >
            {rooms.map((room) => (
              <Marker
                key={room.id}
                coordinate={room.location}
                title={room.sport.name}
                description={`Room for ${room.sport.name}`}
              />
            ))}
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Text>Loading map...</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.expandButton}
        onPress={() => setIsMapExpanded(!isMapExpanded)}
      >
        <Text>{isMapExpanded ? 'Shrink Map' : 'Expand Map'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hey Brian,</Text>
          <TouchableOpacity onPress={() => setIsDropdownVisible(!isDropdownVisible)}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          </TouchableOpacity>
        </View>
        {isDropdownVisible && (
          <View style={styles.dropdown}>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => router.push('/profile')}>
              <Ionicons name="person-outline" size={24} color="#007AFF" />
              <Text style={styles.dropdownText}>My Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={pickImage}>
              <Ionicons name="camera-outline" size={24} color="#007AFF" />
              <Text style={styles.dropdownText}>Change Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem}>
              <Ionicons name="help-circle-outline" size={24} color="#007AFF" />
              <Text style={styles.dropdownText}>Contact Support</Text>
            </TouchableOpacity>
            {(userRole === 'admin' || userRole === 'manager') && (
              <TouchableOpacity style={styles.dropdownItem} onPress={() => router.push('/admin/AdminPanel')}>
                <Ionicons name="settings-outline" size={24} color="#007AFF" />
                <Text style={styles.dropdownText}>Admin Panel</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <WeatherWidget />
        <RoomsFinder />
        <Text style={styles.question}>What are you up to today?</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search activities..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
      </ScrollView>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/search')}>
          <Ionicons name="search-outline" size={24} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/create')}>
          <Ionicons name="add-circle-outline" size={24} color="#8E8E93" />
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
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  dropdown: {
    position: 'absolute',
    top: 90,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dropdownText: {
    marginLeft: 10,
    fontSize: 16,
  },
  weatherWidget: {
    backgroundColor: '#4A90E2',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weatherLocation: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  unitToggle: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  weatherInfo: {
    flexDirection: 'column',
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  weatherIcon: {
    width: 80,
    height: 80,
  },
  weatherTemp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  weatherCondition: {
    fontSize: 18,
    color: 'white',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weatherDetailText: {
    fontSize: 14,
    color: 'white',
  },
  forecastScroll: {
    marginTop: 10,
  },
  forecastItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  forecastTime: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  forecastIcon: {
    width: 30,
    height: 30,
  },
  forecastTemp: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
  roomsFinderContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  roomsFinderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mapContainer: {
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  mapExpanded: {
    height: 400,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  tabItem: {
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
});
