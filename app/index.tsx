import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SplashScreen() {
  const router = useRouter();
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const animatedLogoStyle = useMemo(
    () => ({
      transform: [{ scale: logoScale }],
      opacity: fadeAnim,
    }),
    [fadeAnim, logoScale],
  );

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(logoScale, {
        toValue: 1.05,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => router.replace('/(tabs)'), 2200);
    return () => {
      clearTimeout(timeout);
      fadeAnim.stopAnimation();
      logoScale.stopAnimation();
    };
  }, [fadeAnim, logoScale, router]);

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={[styles.box, { opacity: fadeAnim }]}>
        <Animated.Image
          source={require('@/assets/images/splash-icon.png')}
          style={[styles.logo, animatedLogoStyle]}
        />
        <ThemedText type="title" style={styles.title}>
          Tebak Warna
        </ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Aplikasi edukasi warna untuk anak kecil dan keluarga.
        </ThemedText>
      </Animated.View>
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
    gap: 18,
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#0F172A',
    borderRadius: 32,
    padding: 28,
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 28,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    color: '#F8FAFC',
    fontSize: 28,
    lineHeight: 36,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 320,
    color: '#CBD5E1',
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    marginTop: 32,
    opacity: 0.88,
    textAlign: 'center',
    color: '#94A3B8',
  },
});
