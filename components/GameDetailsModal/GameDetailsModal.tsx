import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const GameDetailsModal = ({
  isVisible,
  onClose,
  selectedGame,
  handleMemberPress,
  openMaps,
  openWaze,
  confirmJoin,

}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.gameDetailsModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedGame?.title}</Text>
              <TouchableOpacity onPress={onClose}>
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
  );
};

const styles = StyleSheet.create({
    gameDetailsModalContent: {
        paddingBottom: 20,
      },
      modalOverlay: {
        zIndex: 1000,
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
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
      modalContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
      },
      joinGameButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
      },

      joinGameButton: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
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
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      playersList: {
        marginBottom: 15,
      },
})
export default GameDetailsModal;
