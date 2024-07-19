import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'banned' | 'blocked';
}

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const saveUsers = async (updatedUsers: User[]) => {
    try {
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      const updatedUsers = users.map(u => 
        u.id === editingUser.id ? editingUser : u
      );
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
      setEditingUser(null);
    }
  };

  const handleChangeRole = (user: User, newRole: 'admin' | 'manager' | 'user') => {
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, role: newRole } : u
    );
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  const handleChangeStatus = (user: User, newStatus: 'active' | 'banned' | 'blocked') => {
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, status: newStatus } : u
    );
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  const handleSendAlert = (user: User) => {
    Alert.prompt(
      'Send Alert',
      `Enter alert message for ${user.name}:`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: (message?: string) => {
            if (message) {
              // Here you would typically send this alert to your backend
              console.log(`Alert sent to ${user.name}: ${message}`);
              Alert.alert('Alert Sent', `An alert has been sent to ${user.name}`);
            }
          }
        }
      ]
    );
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>User Management</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.userItem}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userRole}>Role: {user.role}</Text>
              <Text style={[styles.userStatus, { color: user.status === 'active' ? 'green' : 'red' }]}>
                Status: {user.status}
              </Text>
            </View>
            <View style={styles.userActions}>
              <TouchableOpacity onPress={() => handleEditUser(user)} style={styles.actionButton}>
                <Ionicons name="pencil" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSendAlert(user)} style={styles.actionButton}>
                <Ionicons name="warning" size={24} color="#FF9500" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {editingUser && (
        <View style={styles.editUserContainer}>
          <Text style={styles.editUserTitle}>Edit User</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={editingUser.name}
            onChangeText={(text) => setEditingUser({ ...editingUser, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={editingUser.email}
            onChangeText={(text) => setEditingUser({ ...editingUser, email: text })}
          />
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Role:</Text>
            <TouchableOpacity
              style={[styles.pickerOption, editingUser.role === 'admin' && styles.pickerOptionSelected]}
              onPress={() => setEditingUser({ ...editingUser, role: 'admin' })}
            >
              <Text style={styles.pickerOptionText}>Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, editingUser.role === 'manager' && styles.pickerOptionSelected]}
              onPress={() => setEditingUser({ ...editingUser, role: 'manager' })}
            >
              <Text style={styles.pickerOptionText}>Manager</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, editingUser.role === 'user' && styles.pickerOptionSelected]}
              onPress={() => setEditingUser({ ...editingUser, role: 'user' })}
            >
              <Text style={styles.pickerOptionText}>User</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Status:</Text>
            <TouchableOpacity
              style={[styles.pickerOption, editingUser.status === 'active' && styles.pickerOptionSelected]}
              onPress={() => setEditingUser({ ...editingUser, status: 'active' })}
            >
              <Text style={styles.pickerOptionText}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, editingUser.status === 'banned' && styles.pickerOptionSelected]}
              onPress={() => setEditingUser({ ...editingUser, status: 'banned' })}
            >
              <Text style={styles.pickerOptionText}>Banned</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickerOption, editingUser.status === 'blocked' && styles.pickerOptionSelected]}
              onPress={() => setEditingUser({ ...editingUser, status: 'blocked' })}
            >
              <Text style={styles.pickerOptionText}>Blocked</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateUser}>
            <Text style={styles.updateButtonText}>Update User</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#8E8E93',
  },
  userRole: {
    fontSize: 14,
    marginTop: 5,
  },
  userStatus: {
    fontSize: 14,
    marginTop: 5,
  },
  userActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 10,
  },
  editUserContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editUserTitle: {
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
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pickerLabel: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  pickerOption: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginRight: 5,
  },
  pickerOptionSelected: {
    backgroundColor: '#007AFF',
  },
  pickerOptionText: {
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
});