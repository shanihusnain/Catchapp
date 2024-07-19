import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSports } from '../../SportsContext';
import { Sport } from '../../config/sportsConfig';

type SportIcon = 'basketball-outline' | 'football-outline' | 'baseball-outline' | 'tennisball-outline' |
  'golf-outline' | 'bicycle-outline' | 'walk-outline' | 'fitness-outline' |
  'american-football-outline' | 'barbell-outline' | 'bowling-ball-outline' | 'medal-outline' |
  'snow-outline' | 'rocket-outline' | 'boat-outline' | 'airplane-outline' |
  'car-sport-outline' | 'pulse-outline' | 'speedometer-outline' | 'heart-outline' |
  'flame-outline' | 'compass-outline' | 'shirt-outline' | 'stopwatch-outline' |
  'sunny-outline' | 'rainy-outline' | 'thunderstorm-outline' | 'body-outline' | 
  'trophy-outline' | 'nutrition-outline' | 'restaurant-outline' | 'cafe-outline' | 
  'wine-outline' | 'beer-outline' | 'game-controller-outline' | 'headset-outline' |
  'musical-notes-outline' | 'radio-outline';

interface ExtendedSport extends Sport {
  hidden: boolean;
  icon: SportIcon;
}

export default function SportsConfigManagement() {
  const router = useRouter();
  const { sports, toggleSportVisibility, addSport, deleteSport, editSport, refreshSports } = useSports();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newSport, setNewSport] = useState<ExtendedSport>({ name: '', icon: 'basketball-outline', color: '#000000', hidden: false });
  const [editingSport, setEditingSport] = useState<ExtendedSport | null>(null);
  const [isIconSelectorVisible, setIsIconSelectorVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    refreshSports();
  }, [refreshSports]);

  const handleAddSport = useCallback(async () => {
    if (newSport.name && newSport.icon && newSport.color) {
      setIsLoading(true);
      await addSport(newSport);
      setNewSport({ name: '', icon: 'basketball-outline', color: '#000000', hidden: false });
      setIsAddModalVisible(false);
      setIsLoading(false);
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  }, [newSport, addSport]);

  const handleEditSport = useCallback((sport: ExtendedSport) => {
    setEditingSport(sport);
  }, []);

  const handleUpdateSport = useCallback(async () => {
    if (editingSport) {
      setIsLoading(true);
      await editSport(editingSport.name, editingSport);
      setEditingSport(null);
      setIsLoading(false);
    }
  }, [editingSport, editSport]);

  const handleToggleHideSport = useCallback(async (sportName: string) => {
    setIsLoading(true);
    await toggleSportVisibility(sportName);
    setIsLoading(false);
  }, [toggleSportVisibility]);

  const handleDeleteSport = useCallback((sportName: string) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${sportName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: async () => {
            setIsLoading(true);
            await deleteSport(sportName);
            setIsLoading(false);
          },
          style: 'destructive'
        },
      ]
    );
  }, [deleteSport]);

  const handleManualRefresh = useCallback(async () => {
    setIsLoading(true);
    await refreshSports();
    setIsLoading(false);
  }, [refreshSports]);

  const sportIcons: SportIcon[] = [
    'basketball-outline', 'football-outline', 'baseball-outline', 'tennisball-outline',
    'golf-outline', 'bicycle-outline', 'walk-outline', 'fitness-outline',
    'american-football-outline', 'barbell-outline', 'bowling-ball-outline', 'medal-outline',
    'snow-outline', 'rocket-outline', 'boat-outline', 'airplane-outline',
    'car-sport-outline', 'pulse-outline', 'speedometer-outline', 'heart-outline',
    'flame-outline', 'compass-outline', 'shirt-outline', 'stopwatch-outline',
    'sunny-outline', 'rainy-outline', 'thunderstorm-outline', 'body-outline', 
    'trophy-outline', 'nutrition-outline', 'restaurant-outline', 'cafe-outline', 
    'wine-outline', 'beer-outline', 'game-controller-outline', 'headset-outline',
    'musical-notes-outline', 'radio-outline'
  ];

  const renderSportIcons = useCallback((selectedIcon: SportIcon) => {
    return sportIcons.map((icon) => (
      <TouchableOpacity 
        key={icon}
        style={styles.iconItem} 
        onPress={() => {
          if (editingSport) {
            setEditingSport({ ...editingSport, icon });
          } else {
            setNewSport({ ...newSport, icon });
          }
          setIsIconSelectorVisible(false);
        }}
      >
        <Ionicons name={icon} size={24} color="#007AFF" />
        {selectedIcon === icon && (
          <Ionicons name="checkmark-circle" size={24} color="green" style={styles.checkmark} />
        )}
      </TouchableOpacity>
    ));
  }, [editingSport, newSport]);

  const filteredSports = sports.filter((sport) => 
    sport.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/admin/AdminPanel')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Sports Configuration</Text>
        <TouchableOpacity onPress={() => setIsAddModalVisible(true)} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sports..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity onPress={handleManualRefresh} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>

        {filteredSports.map((sport) => (
          <View key={sport.name} style={[styles.sportItem, sport.hidden && styles.hiddenSport]}>
            <View style={styles.sportInfo}>
              <Ionicons name={sport.icon as SportIcon} size={24} color={sport.color} />
              <Text style={[styles.sportName, sport.hidden && styles.hiddenSportText]}>{sport.name}</Text>
              {sport.hidden && <Ionicons name="eye-off" size={18} color="#8E8E93" style={styles.hiddenIcon} />}
            </View>
            <View style={styles.sportActions}>
              <TouchableOpacity onPress={() => handleEditSport(sport as ExtendedSport)} style={styles.actionButton}>
                <Ionicons name="pencil" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleToggleHideSport(sport.name)} style={styles.actionButton}>
                <Ionicons name={sport.hidden ? "eye" : "eye-off"} size={24} color="#FF9500" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteSport(sport.name)} style={styles.actionButton}>
                <Ionicons name="trash" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {editingSport && (
          <View style={styles.editSportContainer}>
            <Text style={styles.editSportTitle}>Edit Sport</Text>
            <TextInput
              style={styles.input}
              placeholder="Sport Name"
              value={editingSport.name}
              onChangeText={(text) => setEditingSport({ ...editingSport, name: text })}
            />
            <TouchableOpacity style={styles.iconSelector} onPress={() => setIsIconSelectorVisible(true)}>
              <Ionicons name={editingSport.icon} size={24} color="#007AFF" />
              <Text style={styles.iconSelectorText}>Select Icon</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Color (e.g., #FF0000 for red)"
              value={editingSport.color}
              onChangeText={(text) => setEditingSport({ ...editingSport, color: text })}
            />
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateSport}>
              <Text style={styles.updateButtonText}>Update Sport</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Sport</Text>
            <TextInput
              style={styles.input}
              placeholder="Sport Name"
              value={newSport.name}
              onChangeText={(text) => setNewSport({ ...newSport, name: text })}
            />
            <TouchableOpacity style={styles.iconSelector} onPress={() => setIsIconSelectorVisible(true)}>
              <Ionicons name={newSport.icon} size={24} color="#007AFF" />
              <Text style={styles.iconSelectorText}>Select Icon</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Color (e.g., #FF0000 for red)"
              value={newSport.color}
              onChangeText={(text) => setNewSport({ ...newSport, color: text })}
            />
            <TouchableOpacity style={styles.addSportButton} onPress={handleAddSport}>
              <Text style={styles.addSportButtonText}>Add Sport</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAddModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isIconSelectorVisible}
        onRequestClose={() => setIsIconSelectorVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Icon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScrollView}>
              {renderSportIcons(editingSport ? editingSport.icon : newSport.icon)}
            </ScrollView>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsIconSelectorVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 5,
  },
  content: {
    padding: 20,
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
  refreshButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  hiddenSport: {
    backgroundColor: '#d3d3d3',
  },
  hiddenSportText: {
    color: '#8E8E93',
  },
  sportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sportName: {
    marginLeft: 10,
    fontSize: 16,
  },
  hiddenIcon: {
    marginLeft: 5,
  },
  sportActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 15,
  },
  editSportContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  editSportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  iconSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  iconSelectorText: {
    marginLeft: 10,
    color: '#007AFF',
  },
  updateButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  addSportButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addSportButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  iconScrollView: {
    marginBottom: 10,
  },
  iconItem: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginRight: 10,
    borderRadius: 5,
  },
  checkmark: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
});