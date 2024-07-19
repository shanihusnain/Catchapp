import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, TextInput, Modal, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { sports, Sport } from './config/sportsConfig';

const sampleGames = [
  {
    id: 1,
    title: "Sunday Football Showdown",
    sport: 'Football',
    image: 'https://via.placeholder.com/100',
    currentPlayers: 8,
    maxPlayers: 10,
    time: '18:00',
    date: '2023-07-15',
    location: 'Central Park',
    placeImage: 'https://via.placeholder.com/300x200',
    players: [
      { name: 'John', profilePicture: 'https://via.placeholder.com/100?text=John' },
      { name: 'Emma', profilePicture: 'https://via.placeholder.com/100?text=Emma' },
      { name: 'Michael', profilePicture: 'https://via.placeholder.com/100?text=Michael' },
      { name: 'Sophia', profilePicture: 'https://via.placeholder.com/100?text=Sophia' }
    ],
    level: 'Intermediate'
  },
  // ... (keep the rest of your sample games)
];

export default function SearchScreen() {
  const { query } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filteredGames, setFilteredGames] = useState(sampleGames);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isGameDetailsVisible, setIsGameDetailsVisible] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isMemberDetailsVisible, setIsMemberDetailsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    })();
  }, []);

  useEffect(() => {
    filterGames();
  }, [searchQuery, selectedSports, dateFilter, timeFilter, locationFilter, statusFilter]);

  const filterGames = () => {
    setFilteredGames(sampleGames.filter(game => 
      (game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       game.sport.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedSports.length === 0 || selectedSports.includes(game.sport)) &&
      (dateFilter === '' || game.date === dateFilter) &&
      (timeFilter === '' || game.time === timeFilter) &&
      (locationFilter === '' || game.location.toLowerCase().includes(locationFilter.toLowerCase())) &&
      (statusFilter === '' || getGameStatus(game) === statusFilter)
    ));
  };

  const getGameStatus = (game) => {
    if (game.currentPlayers < game.maxPlayers) return 'Open';
    if (game.currentPlayers === game.maxPlayers) return 'Waiting List';
    return 'Closed';
  };

  const toggleSport = (sportName: string) => {
    setSelectedSports(prev => 
      prev.includes(sportName)
        ? prev.filter(s => s !== sportName)
        : [...prev, sportName]
    );
  };

  const handleJoin = (game) => {
    setSelectedGame(game);
    setIsGameDetailsVisible(true);
  };

  const confirmJoin = () => {
    Alert.alert(
      "Join Game",
      "By joining this game, you agree to arrive on time and contact the organizer for any changes. Do you agree to these terms?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "I Agree", 
          onPress: () => {
            console.log(`Joined game: ${selectedGame?.title}`);
            setIsGameDetailsVisible(false);
            router.push('/notifications');
          }
        }
      ]
    );
  };

  const openMaps = (location) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    Linking.openURL(url);
  };

  const openWaze = (location) => {
    const url = `https://waze.com/ul?q=${encodeURIComponent(location)}`;
    Linking.openURL(url);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setDateFilter(date.toISOString().split('T')[0]);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    setTimeFilter(time.toTimeString().slice(0, 5));
    hideTimePicker();
  };

  const resetFilters = () => {
    setSelectedSports([]);
    setDateFilter('');
    setTimeFilter('');
    setLocationFilter('');
    setStatusFilter('');
    setIsFilterActive(false);
  };

  const applyFilters = () => {
    filterGames();
    setIsFilterVisible(false);
    setIsFilterActive(true);
  };

  const handleMemberPress = useCallback((member) => {
    console.log('Member pressed:', member);
    setSelectedMember(member);
    setIsMemberDetailsVisible(true);
  }, []);

  const closeGameDetails = useCallback(() => {
    setIsGameDetailsVisible(false);
    setSelectedGame(null);
  }, []);

  const closeMemberDetails = useCallback(() => {
    setIsMemberDetailsVisible(false);
    setSelectedMember(null);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <TouchableOpacity onPress={() => setIsFilterVisible(true)}>
          <Ionicons name="options-outline" size={24} color={isFilterActive ? '#FFA500' : '#000'} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search activities..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {filteredGames.map(game => (
          <View key={game.id} style={[styles.gameCard, { borderColor: sports.find(s => s.name === game.sport)?.color }]}>
            <Image source={{ uri: game.image }} style={styles.gameImage} />
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>{game.title}</Text>
              <Text style={styles.gameSport}>{game.sport}</Text>
              <Text>{`${game.currentPlayers}/${game.maxPlayers} players`}</Text>
              <Text>{`${game.time} on ${game.date}`}</Text>
              <Text>{game.location}</Text>
              <Text>{`Level: ${game.level}`}</Text>
            </View>
            <TouchableOpacity style={styles.joinButton} onPress={() => handleJoin(game)}>
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterVisible}
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.filterModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter Options</Text>
                <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.filterSectionTitle}>Sports</Text>
              <View style={styles.sportsFilter}>
                {sports.map((sport) => (
                  <TouchableOpacity
                    key={sport.name}
                    style={[
                      styles.sportFilterButton,
                      selectedSports.includes(sport.name) && { backgroundColor: sport.color }
                    ]}
                    onPress={() => toggleSport(sport.name)}
                  >
                    <Ionicons name={sport.icon} size={24} color={selectedSports.includes(sport.name) ? 'white' : sport.color} />
                    <Text style={[styles.sportFilterText, selectedSports.includes(sport.name) && { color: 'white' }]}>{sport.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.filterSectionTitle}>Date</Text>
              <TouchableOpacity style={styles.dateTimeButton} onPress={showDatePicker}>
                <Text>{dateFilter || 'Select Date'}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
              />
              
              <Text style={styles.filterSectionTitle}>Time</Text>
              <TouchableOpacity style={styles.dateTimeButton} onPress={showTimePicker}>
                <Text>{timeFilter || 'Select Time'}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={hideTimePicker}
              />
              
              <Text style={styles.filterSectionTitle}>Location</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Enter location"
                value={locationFilter}
                onChangeText={setLocationFilter}
              />
              <TouchableOpacity style={styles.gpsButton} onPress={() => {
                if (userLocation) {
                  setLocationFilter(`${userLocation.coords.latitude},${userLocation.coords.longitude}`);
                } else {
                  Alert.alert('Location not available');
                }
              }}>
                <Text style={styles.gpsButtonText}>Use Current Location</Text>
              </TouchableOpacity>
              
              <Text style={styles.filterSectionTitle}>Game Status</Text>
              <View style={styles.statusFilter}>
                {['Open', 'Waiting List', 'Closed'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusFilterButton,
                      statusFilter === status && { backgroundColor: '#007AFF' }
                    ]}
                    onPress={() => setStatusFilter(status)}
                  >
                    <Text style={[styles.statusFilterText, statusFilter === status && { color: 'white' }]}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.filterButtonsContainer}>
                <TouchableOpacity style={styles.resetFilterButton} onPress={resetFilters}>
                  <Text style={styles.resetFilterButtonText}>Reset Filters</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyFilterButton} onPress={applyFilters}>
                  <Text style={styles.applyFilterButtonText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isGameDetailsVisible}
        onRequestClose={closeGameDetails}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.gameDetailsModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedGame?.title}</Text>
                <TouchableOpacity onPress={closeGameDetails}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <Image source={{ uri: selectedGame?.placeImage }} style={styles.placeImage} />
              <View style={styles.gameInfoContainer}>
                <View style={styles.gameInfoItem}>
                  <Ionicons name="football-outline" size={24} color="#007AFF" />
                  <Text style={styles.gameDetailText}>{selectedGame?.sport}</Text>
                </View>
                <View style={styles.gameInfoItem}>
                  <Ionicons name="time-outline" size={24} color="#007AFF" />
                  <Text style={styles.gameDetailText}>{`${selectedGame?.time} on ${selectedGame?.date}`}</Text>
                </View>
                <View style={styles.gameInfoItem}>
                  <Ionicons name="location-outline" size={24} color="#007AFF" />
                  <Text style={styles.gameDetailText}>{selectedGame?.location}</Text>
                </View>
                <View style={styles.gameInfoItem}>
                  <Ionicons name="people-outline" size={24} color="#007AFF" />
                  <Text style={styles.gameDetailText}>{`${selectedGame?.currentPlayers}/${selectedGame?.maxPlayers} players`}</Text>
                </View>
                <View style={styles.gameInfoItem}>
                  <Ionicons name="stats-chart-outline" size={24} color="#007AFF" />
                  <Text style={styles.gameDetailText}>{`Level: ${selectedGame?.level}`}</Text>
                </View>
              </View>
              <Text style={styles.sectionTitle}>Registered Players:</Text>
              <View style={styles.playersList}>
                {selectedGame?.players.map((player, index) => (
                  <TouchableOpacity key={index} onPress={() => handleMemberPress(player)} style={styles.playerButton}>
                    <Image source={{ uri: player.profilePicture }} style={styles.playerAvatar} />
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Ionicons name="chevron-forward-outline" size={20} color="#007AFF" />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.navigationButtons}>
                <TouchableOpacity style={styles.navigationButton} onPress={() => openMaps(selectedGame?.location)}>
                  <Ionicons name="map-outline" size={24} color="white" />
                  <Text style={styles.navigationButtonText}>Google Maps</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navigationButton} onPress={() => openWaze(selectedGame?.location)}>
                  <Ionicons name="navigate-outline" size={24} color="white" />
                  <Text style={styles.navigationButtonText}>Waze</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.joinGameButton} onPress={confirmJoin}>
                <Text style={styles.joinGameButtonText}>Join Game</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isMemberDetailsVisible}
        onRequestClose={closeMemberDetails}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.memberDetailsModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Member Details</Text>
                <TouchableOpacity onPress={closeMemberDetails}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <View style={styles.memberProfileContainer}>
                <Image source={{ uri: selectedMember?.profilePicture }} style={styles.memberProfilePicture} />
                <Text style={styles.memberName}>{selectedMember?.name}</Text>
              </View>
              <View style={styles.memberInfoContainer}>
                <View style={styles.memberInfoItem}>
                  <Ionicons name="calendar-outline" size={24} color="#007AFF" />
                  <Text style={styles.memberDetailText}>Age: 28</Text>
                </View>
                <View style={styles.memberInfoItem}>
                  <Ionicons name="location-outline" size={24} color="#007AFF" />
                  <Text style={styles.memberDetailText}>City: New York</Text>
                </View>
                <View style={styles.memberInfoItem}>
                  <Ionicons name="football-outline" size={24} color="#007AFF" />
                  <Text style={styles.memberDetailText}>Favorite Sports: Football, Basketball</Text>
                </View>
              </View>
              <View style={styles.memberActionButtons}>
                <TouchableOpacity 
                  style={styles.memberActionButton} 
                  onPress={() => {
                    console.log('Send message to', selectedMember?.name);
                    closeMemberDetails();
                  }}
                >
                  <Ionicons name="mail-outline" size={24} color="white" />
                  <Text style={styles.memberActionButtonText}>Send Message</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.memberActionButton} 
                  onPress={() => {
                    console.log('Add friend', selectedMember?.name);
                    closeMemberDetails();
                  }}
                >
                  <Ionicons name="person-add-outline" size={24} color="white" />
                  <Text style={styles.memberActionButtonText}>Add Friend</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={24} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="search" size={24} color="#007AFF" />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 15,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
  },
  content: {
    padding: 15,
  },
  gameCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 2,
  },
  gameImage: {
    width: 100,
    height: '100%',
  },
  gameInfo: {
    flex: 1,
    padding: 10,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  gameSport: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  joinButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginRight: 10,
  },
  joinButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    zIndex: 1000,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  filterModalContent: {
    paddingBottom: 20,
  },
  gameDetailsModalContent: {
    paddingBottom: 20,
  },
  memberDetailsModalContent: {
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  sportsFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sportFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    width: '48%',
  },
  sportFilterText: {
    marginLeft: 10,
  },
  dateTimeButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  filterInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  gpsButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  gpsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statusFilterButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 5,
    flex: 1,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  statusFilterText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  resetFilterButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  resetFilterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  applyFilterButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  applyFilterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  placeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  gameInfoContainer: {
    marginBottom: 15,
  },
  gameInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  gameDetailText: {
    fontSize: 16,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  playersList: {
    marginBottom: 15,
  },
  playerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  playerName: {
    fontSize: 16,
    flex: 1,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 10,
    width: '48%',
  },
  navigationButtonText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  joinGameButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  joinGameButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  memberProfileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  memberProfilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  memberInfoContainer: {
    marginBottom: 15,
  },
  memberInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  memberDetailText: {
    fontSize: 16,
    marginLeft: 10,
  },
  memberActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  memberActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 10,
    width: '48%',
  },
  memberActionButtonText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
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
});