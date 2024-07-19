import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

interface NewsItem {
  id: number;
  title: string;
  sport: string;
}

const SportsNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('https://your-api-url.com/sports-news');
      console.log('API Response:', response.data);
      if (Array.isArray(response.data)) {
        setNews(response.data);
      } else {
        setError('Invalid API response structure');
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError('Failed to fetch news');
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sports News</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {news.map((item) => (
          <TouchableOpacity key={item.id} style={styles.newsItem}>
            <Ionicons name="newspaper-outline" size={24} color="#007AFF" />
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsSport}>{item.sport}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  newsItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  newsSport: {
    color: '#007AFF',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SportsNews;
