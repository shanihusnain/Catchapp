// WeatherWidget.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";

const WeatherWidget = ({
  weatherLoading,
  weatherError,
  weather,
  isCelsius,
  toggleTemperatureUnit,
  convertTemperature,
  styles,
}) => (
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
            <Text style={styles.unitToggle}>{isCelsius ? "°C" : "°F"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.weatherInfo}>
          <View style={styles.weatherMain}>
            <Image
              source={{
                uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
              }}
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
            <Text style={styles.weatherDetailText}>
              Humidity: {weather.humidity}%
            </Text>
            <Text style={styles.weatherDetailText}>
              Wind: {weather.windSpeed} m/s
            </Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.forecastScroll}
        >
          {weather.forecast.map((item, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={styles.forecastTime}>{item.time}</Text>
              <Image
                source={{
                  uri: `http://openweathermap.org/img/wn/${item.icon}.png`,
                }}
                style={styles.forecastIcon}
              />
              <Text style={styles.forecastTemp}>
                {Math.round(convertTemperature(item.temperature))}°
              </Text>
            </View>
          ))}
        </ScrollView>
      </>
    ) : (
      <Text>No weather data available</Text>
    )}
  </View>
);

export default WeatherWidget;
