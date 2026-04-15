import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => router.replace('/(tabs)'), 2200);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.box}>
        <Image
          source={require('@/assets/images/splash-icon.png')}
          style={styles.logo}
        />
        <ThemedText type="title" style={styles.title}>
          Tebak Warna
        </ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Aplikasi edukasi warna untuk anak kecil dan keluarga.
        </ThemedText>
      </View>
      <ThemedText type="default" style={styles.footer}>
        Siap bermain dan belajar warna dengan ceria.
      </ThemedText>
      <StatusBar style="light" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#090D16',
  },
  box: {
    alignItems: 'center',
    gap: 14,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 22,
  },
  title: {
    textAlign: 'center',
    color: '#F8FAFC',
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 300,
    color: '#CBD5E1',
  },
  footer: {
    marginTop: 32,
    opacity: 0.88,
    textAlign: 'center',
    color: '#94A3B8',
  },
});
