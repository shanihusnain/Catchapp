import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { sports, Sport } from './config/sportsConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const socialAccounts = [
  { name: 'Facebook', icon: 'logo-facebook', color: '#1877F2' },
  { name: 'Gmail', icon: 'mail', color: '#EA4335' },
  { name: 'YouTube', icon: 'logo-youtube', color: '#FF0000' },
  { name: 'TikTok', icon: 'logo-tiktok', color: '#000000' },
  { name: 'Apple', icon: 'logo-apple', color: '#A2AAAD' },
];

export default function ProfileScreen() {
  const [displayName, setDisplayName] = useState('Brian');
  const [email, setEmail] = useState('brian.smith@example.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const [receiveUpdates, setReceiveUpdates] = useState(true);
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadAdminStatus();
  }, []);

  const loadAdminStatus = async () => {
    try {
      const adminStatus = await AsyncStorage.getItem('isAdmin');
      setIsAdmin(adminStatus === 'true');
    } catch (error) {
      console.error('Error loading admin status:', error);
    }
  };

  const toggleSport = (sportName: string) => {
    setSelectedSports(prev => 
      prev.includes(sportName)
        ? prev.filter(s => s !== sportName)
        : [...prev, sportName]
    );
  };

  const handleSave = () => {
    console.log('Saving profile:', { 
      displayName, 
      email,
      password,
      selectedSports,
      receiveNotifications,
      receiveUpdates,
      connectedAccounts,
      isAdmin
    });
    router.back();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name[0]}${new Array(name.length - 1).join('*')}@${domain}`;
  };

  const toggleAccountConnection = (accountName: string) => {
    setConnectedAccounts(prev => 
      prev.includes(accountName)
        ? prev.filter(a => a !== accountName)
        : [...prev, accountName]
    );
  };

  const handleAdminConnection = async () => {
    if (adminCode === 'secret123') {
      setIsAdmin(true);
      await AsyncStorage.setItem('isAdmin', 'true');
      Alert.alert('Success', 'Admin status granted!');
    } else {
      Alert.alert('Error', 'Invalid admin code');
    }
  };

  const handleAdminDisconnection = async () => {
    setIsAdmin(false);
    await AsyncStorage.setItem('isAdmin', 'false');
    Alert.alert('Success', 'Admin status removed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>My Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={100} color="#007AFF" />
          )}
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Display Name"
          />
          <Text style={styles.emailText}>{maskEmail(email)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="New Password"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm New Password"
            secureTextEntry
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Accounts</Text>
          {socialAccounts.map((account) => (
            <TouchableOpacity
              key={account.name}
              style={styles.accountItem}
              onPress={() => toggleAccountConnection(account.name)}
            >
              <View style={styles.accountInfo}>
                <Ionicons name={account.icon} size={24} color={account.color} />
                <Text style={styles.accountName}>{account.name}</Text>
              </View>
              {connectedAccounts.includes(account.name) ? (
                <Text style={styles.connectedText}>Connected</Text>
              ) : (
                <Text style={styles.connectText}>Connect</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin Connection</Text>
          {isAdmin ? (
            <View>
              <Text style={styles.adminStatusText}>Admin Status: Connected</Text>
              <TouchableOpacity style={styles.disconnectButton} onPress={handleAdminDisconnection}>
                <Text style={styles.disconnectButtonText}>Disconnect Admin</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <TextInput
                style={styles.input}
                value={adminCode}
                onChangeText={setAdminCode}
                placeholder="Enter Admin Code"
                secureTextEntry
              />
              <TouchableOpacity style={styles.connectButton} onPress={handleAdminConnection}>
                <Text style={styles.connectButtonText}>Connect as Admin</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sports Hobbies</Text>
          <View style={styles.sportsGrid}>
            {sports.map((sport) => (
              <TouchableOpacity
                key={sport.name}
                style={[
                  styles.sportButton,
                  { backgroundColor: sport.color },
                ]}
                onPress={() => toggleSport(sport.name)}
              >
                <Ionicons name={sport.icon} size={24} color="white" />
                <Text style={styles.sportText}>{sport.name}</Text>
                {selectedSports.includes(sport.name) && (
                  <View style={styles.checkmarkContainer}>
                    <Ionicons name="checkmark" size={20} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.preferenceItem}>
            <Text>Receive Notifications</Text>
            <Switch
              value={receiveNotifications}
              onValueChange={setReceiveNotifications}
            />
          </View>
          <View style={styles.preferenceItem}>
            <Text>Receive App Updates</Text>
            <Switch
              value={receiveUpdates}
              onValueChange={setReceiveUpdates}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changePhotoText: {
    color: '#007AFF',
    marginTop: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 10,
    marginBottom: 15,
  },
  emailText: {
    paddingVertical: 10,
    color: '#666',
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sportButton: {
    width: '48%',
    aspectRatio: 2,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    position: 'relative',
  },
  sportText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 2,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountName: {
    marginLeft: 10,
    fontSize: 16,
  },
  connectedText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  connectText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  adminStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  connectButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  connectButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disconnectButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  disconnectButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});