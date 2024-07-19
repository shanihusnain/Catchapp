import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Image, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import firebase from '../firebase'; // You'll need to set up Firebase in your project

const sampleChats = [
  { id: '1', name: 'John Doe', lastMessage: 'Hey, are we still on for the game tomorrow?', time: '10:30 AM', avatar: 'https://via.placeholder.com/100?text=John' },
  { id: '2', name: 'Jane Smith', lastMessage: 'Great game yesterday!', time: 'Yesterday', avatar: 'https://via.placeholder.com/100?text=Jane' },
  { id: '3', name: 'Mike Johnson', lastMessage: 'Can you send me the details for the next match?', time: '2 days ago', avatar: 'https://via.placeholder.com/100?text=Mike' },
];

const sampleFriends = [
  { id: '1', name: 'Alice Cooper', avatar: 'https://via.placeholder.com/100?text=Alice' },
  { id: '2', name: 'Bob Dylan', avatar: 'https://via.placeholder.com/100?text=Bob' },
  { id: '3', name: 'Charlie Brown', avatar: 'https://via.placeholder.com/100?text=Charlie' },
];

export default function FriendsAndChatScreen() {
  const [chats, setChats] = useState(sampleChats);
  const [isFriendListVisible, setIsFriendListVisible] = useState(false);
  const [friends, setFriends] = useState(sampleFriends);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [isShareVisible, setIsShareVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch friends list from Firebase
    const fetchFriends = async () => {
      // Implement Firebase fetching logic here
      // For now, we'll use sample data
      setFriends(sampleFriends);
    };

    fetchFriends();
  }, []);

  const startEditing = (friend) => {
    setSelectedFriend(friend);
    setEditedName(friend.name);
    setIsEditing(true);
  };

  const saveEdit = () => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === selectedFriend.id ? { ...friend, name: editedName } : friend
      )
    );
    setIsEditing(false);
    setSelectedFriend(null);
  };

  const removeFriend = (friend) => {
    Alert.alert(
      "Remove Friend",
      `Are you sure you want to remove ${friend.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", onPress: () => {
          setFriends((prevFriends) => prevFriends.filter((f) => f.id !== friend.id));
          Alert.alert('Friend removed', `${friend.name} has been removed from your friend list.`);
        }, style: "destructive" }
      ]
    );
  };

  const shareContact = (friend) => {
    setSelectedFriend(friend);
    setIsShareVisible(true);
  };

  const confirmShare = (chat) => {
    setIsShareVisible(false);
    // Logic to share the contact with the selected chat
    Alert.alert('Contact Shared', `You have shared ${selectedFriend.name} with ${chat.name}.`);
  };

  const startChat = (friend) => {
    // Add the friend to the chat list and navigate to the chat screen
    setChats((prevChats) => [
      ...prevChats,
      { id: friend.id, name: friend.name, lastMessage: '', time: 'Now', avatar: friend.avatar }
    ]);
    setIsFriendListVisible(false);
    router.push({ pathname: '/chat', params: { id: friend.id, name: friend.name } });
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(friendSearchQuery.toLowerCase())
  );

  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      onPress={() => router.push({ pathname: '/chat', params: { id: item.id, name: item.name } })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFriendItem = ({ item }) => (
    <View style={styles.friendItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      {isEditing && selectedFriend?.id === item.id ? (
        <TextInput
          style={styles.input}
          value={editedName}
          onChangeText={setEditedName}
          onSubmitEditing={saveEdit}
        />
      ) : (
        <Text style={styles.friendName}>{item.name}</Text>
      )}
      {isEditing && (
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={() => startEditing(item)}>
            <Ionicons name="pencil-outline" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeFriend(item)}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => shareContact(item)}>
            <Ionicons name="share-outline" size={24} color="green" />
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.startChatButton} onPress={() => startChat(item)}>
        <Ionicons name="chatbubble-outline" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setIsFriendListVisible(true)}>
            <Ionicons name="people-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search chats..."
      />
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFriendListVisible}
        onRequestClose={() => setIsFriendListVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Friends</Text>
              <View style={styles.headerIcons}>
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                  <Ionicons name={isEditing ? "close-outline" : "create-outline"} size={24} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={() => setIsFriendListVisible(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
            <TextInput
              style={styles.searchInput}
              value={friendSearchQuery}
              onChangeText={setFriendSearchQuery}
              placeholder="Search friends..."
            />
            <FlatList
              data={filteredFriends}
              renderItem={renderFriendItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.friendList}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShareVisible}
        onRequestClose={() => setIsShareVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share Contact</Text>
              <TouchableOpacity onPress={() => setIsShareVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={chats}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.chatItem} onPress={() => confirmShare(item)}>
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                  <View style={styles.chatInfo}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text>{item.lastMessage}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.chatList}
            />
          </View>
        </View>
      </Modal>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={24} color="#8E8E93" />
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
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="chatbubbles" size={24} color="#007AFF" />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    marginLeft: 10,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 15,
  },
  chatList: {
    padding: 15,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E8E93',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  friendList: {
    paddingVertical: 10,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  friendName: {
    fontSize: 16,
    marginLeft: 15,
  },
  iconsContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  startChatButton: {
    marginLeft: 10,
  },
});
