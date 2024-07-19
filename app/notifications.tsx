import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const sampleNotifications = [
  { id: 1, type: 'game', title: "You've joined Sunday Football Showdown", message: "Don't forget to arrive at Central Park by 18:00 on July 15, 2023.", read: false },
  { id: 2, type: 'friend_request', title: "New Friend Request", message: "John Doe wants to add you as a friend", read: true, sender: { name: "John Doe", profilePicture: "https://via.placeholder.com/100?text=John" } },
  { id: 3, type: 'game', title: "Reminder: Tennis Doubles Tournament", message: "Your game starts in 2 hours. Get ready!", read: false },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const router = useRouter();

  const handleNotificationPress = (notification) => {
    if (notification.type !== 'friend_request') {
      // Handle other notification types
      console.log('Handle other notification');
    }
  };

  const handleAcceptFriend = (notification) => {
    console.log(`Accepted friend request from ${notification.sender.name}`);
    // Here you would typically update the friend list and remove the notification
    setNotifications(notifications.filter(n => n.id !== notification.id));
  };

  const handleRejectFriend = (notification) => {
    console.log(`Rejected friend request from ${notification.sender.name}`);
    // Here you would typically just remove the notification
    setNotifications(notifications.filter(n => n.id !== notification.id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteAll = () => {
    Alert.alert(
      "Delete All Notifications",
      "Are you sure you want to delete all notifications?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => setNotifications([]) }
      ]
    );
  };

  const archiveAll = () => {
    Alert.alert(
      "Archive All Notifications",
      "Are you sure you want to archive all notifications?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Archive", onPress: () => {
          // In a real app, you would move these to an archive instead of deleting
          setNotifications([]);
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={markAllAsRead}>
          <Text style={styles.actionButtonText}>Mark all as read</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={deleteAll}>
          <Text style={styles.actionButtonText}>Delete all</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={archiveAll}>
          <Text style={styles.actionButtonText}>Archive all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {notifications.map(notif => (
          <TouchableOpacity 
            key={notif.id} 
            style={[styles.notificationItem, notif.read ? styles.readNotification : styles.unreadNotification]}
            onPress={() => handleNotificationPress(notif)}
          >
            {notif.type === 'friend_request' ? (
              <View style={styles.friendRequestContainer}>
                <Image source={{ uri: notif.sender.profilePicture }} style={styles.senderAvatar} />
                <View style={styles.friendRequestContent}>
                  <Text style={styles.notificationTitle}>{notif.title}</Text>
                  <Text style={styles.notificationMessage}>{notif.message}</Text>
                </View>
                <View style={styles.friendRequestActions}>
                  <TouchableOpacity 
                    style={[styles.friendRequestButton, styles.acceptButton]}
                    onPress={() => handleAcceptFriend(notif)}
                  >
                    <Ionicons name="add" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.friendRequestButton, styles.rejectButton]}
                    onPress={() => handleRejectFriend(notif)}
                  >
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.notificationIcon}>
                  <Ionicons name={notif.read ? "checkmark-circle-outline" : "ellipse"} size={24} color={notif.read ? "#8E8E93" : "#007AFF"} />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notif.title}</Text>
                  <Text style={styles.notificationMessage}>{notif.message}</Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  readNotification: {
    backgroundColor: '#FFFFFF',
  },
  unreadNotification: {
    backgroundColor: '#E5F2FF',
  },
  notificationIcon: {
    marginRight: 15,
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#8E8E93',
  },
  friendRequestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  senderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  friendRequestContent: {
    flex: 1,
  },
  friendRequestActions: {
    flexDirection: 'row',
  },
  friendRequestButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
});