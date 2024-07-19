import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import firebase from '../firebase'; // You'll need to set up Firebase in your project
import * as ImagePicker from 'expo-image-picker';

export default function ChatScreen() {
  const { id, name } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const flatListRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch messages from Firebase
    const fetchMessages = async () => {
      // Implement Firebase fetching logic here
      // For now, we'll use sample data
      setMessages([
        { id: '1', text: 'Hey there!', sender: 'them', timestamp: new Date().getTime() - 3600000 },
        { id: '2', text: 'Hi! How are you?', sender: 'me', timestamp: new Date().getTime() - 3300000 },
      ]);
    };

    fetchMessages();
  }, [id]);

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'me',
      timestamp: new Date().getTime(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Send message to Firebase
    // Implement Firebase sending logic here
  };

  const sendImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newMessage = {
        id: Date.now().toString(),
        image: result.assets[0].uri,
        sender: 'me',
        timestamp: new Date().getTime(),
      };

      setMessages([...messages, newMessage]);

      // Upload image to Firebase Storage and send message
      // Implement Firebase uploading and sending logic here
    }
  };

  const filteredMessages = messages.filter((message) =>
    message.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'me' ? styles.myMessage : styles.theirMessage]}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.messageImage} />
      ) : (
        <Text style={styles.messageText}>{item.text}</Text>
      )}
      <Text style={styles.messageTime}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
      </View>
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search messages..."
      />
      <FlatList
        ref={flatListRef}
        data={filteredMessages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton} onPress={sendImage}>
          <Ionicons name="attach" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#007AFF" />
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 15,
  },
  messageList: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    color: '#000',
    fontSize: 16,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  messageTime: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  attachButton: {
    padding: 5,
  },
  sendButton: {
    padding: 5,
  },
});
