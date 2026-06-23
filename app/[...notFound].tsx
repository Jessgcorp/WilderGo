import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function NotFound() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops — page not found</Text>
      <Text style={styles.message}>
        The route you tried to open doesn't exist or is not available in this build.
      </Text>
      <View style={styles.actions}>
        <Button title="Go to Home" onPress={() => router.replace('/')} />
        <Button title="Go to Login" onPress={() => router.replace('/(auth)/login')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  message: { textAlign: 'center', marginBottom: 20, color: '#666' },
  actions: { width: '100%', gap: 12 },
});
