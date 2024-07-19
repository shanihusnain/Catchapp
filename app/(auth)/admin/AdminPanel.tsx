import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AdminPanel() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    totalSports: 0,
    mostPopularSport: '',
  });

  useEffect(() => {
    // Fetch stats from your backend here
    // For now, we'll use mock data
    setStats({
      totalUsers: 1000,
      totalRooms: 50,
      totalSports: 10,
      mostPopularSport: 'Football',
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Admin Dashboard</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={24} color="#007AFF" />
            <Text style={styles.statValue}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="cube-outline" size={24} color="#007AFF" />
            <Text style={styles.statValue}>{stats.totalRooms}</Text>
            <Text style={styles.statLabel}>Total Rooms</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="football-outline" size={24} color="#007AFF" />
            <Text style={styles.statValue}>{stats.totalSports}</Text>
            <Text style={styles.statLabel}>Sports Types</Text>
          </View>
        </View>

        <View style={styles.popularSportContainer}>
          <Ionicons name="trophy-outline" size={24} color="#007AFF" />
          <Text style={styles.popularSportText}>Most Popular Sport: {stats.mostPopularSport}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/UserManagement')}>
          <Text style={styles.buttonText}>User Management</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/SportsConfigManagement')}>
          <Text style={styles.buttonText}>Sports Configuration</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/NewsManagement')}>
          <Text style={styles.buttonText}>News Management</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.push('dashboard')}>
          <Text style={styles.backButtonText}>Go back to app</Text>
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
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    width: '30%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 5,
  },
  popularSportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  popularSportText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#4FC3F7',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});