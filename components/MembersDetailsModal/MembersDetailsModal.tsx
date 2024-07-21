import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MemberDetailsModal = ({ isVisible, onClose, selectedMember }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.memberDetailsModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Member Details</Text>
              <TouchableOpacity onPress={onClose}>
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
                  console.log("Send message to", selectedMember?.name);
                  onClose();
                }}
              >
                <Ionicons name="mail-outline" size={24} color="white" />
                <Text style={styles.memberActionButtonText}>Send Message</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.memberActionButton}
                onPress={() => {
                  console.log("Add friend", selectedMember?.name);
                  onClose();
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
  );
};
export default MemberDetailsModal;
const styles = StyleSheet.create({
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
        // width: '48%',
      },
      memberActionButtonText: {
        color: 'white',
        marginLeft: 10,
        fontWeight: 'bold',
      },
})