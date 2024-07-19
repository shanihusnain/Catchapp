import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By using our sports matching app, you agree to these Terms and Conditions. If you do not agree, please do not use the app.
        </Text>

        <Text style={styles.sectionTitle}>2. User Registration</Text>
        <Text style={styles.paragraph}>
          You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account.
        </Text>

        <Text style={styles.sectionTitle}>3. User Conduct</Text>
        <Text style={styles.paragraph}>
          You agree to use the app responsibly and not to engage in any behavior that may be harmful to other users or the app itself.
        </Text>

        <Text style={styles.sectionTitle}>4. Privacy</Text>
        <Text style={styles.paragraph}>
          We collect and use your personal information as described in our Privacy Policy. By using the app, you consent to such collection and use.
        </Text>

        <Text style={styles.sectionTitle}>5. Safety</Text>
        <Text style={styles.paragraph}>
          While we strive to create a safe environment, we cannot guarantee the conduct of other users. Please exercise caution when meeting others for sports activities.
        </Text>

        <Text style={styles.sectionTitle}>6. Content</Text>
        <Text style={styles.paragraph}>
          You retain ownership of any content you submit to the app, but grant us a license to use, modify, and display that content in connection with the app's services.
        </Text>

        <Text style={styles.sectionTitle}>7. Termination</Text>
        <Text style={styles.paragraph}>
          We reserve the right to terminate or suspend your account at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or us.
        </Text>

        <Text style={styles.sectionTitle}>8. Disclaimer of Warranties</Text>
        <Text style={styles.paragraph}>
          The app is provided "as is" without any warranties, express or implied.
        </Text>

        <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          We shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the app.
        </Text>

        <Text style={styles.sectionTitle}>10. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We may modify these Terms at any time. Your continued use of the app after changes constitutes acceptance of those changes.
        </Text>

        <Text style={styles.paragraph}>
          By using our app, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
        </Text>
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
});