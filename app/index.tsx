import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

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
      <View style={styles.bubbles}>
        <View style={[styles.bubble, styles.bubbleLarge]} />
        <View style={[styles.bubble, styles.bubbleMedium]} />
        <View style={[styles.bubble, styles.bubbleSmall]} />
      </View>
      <Animated.View style={[styles.box, { opacity: fadeAnim }]}>
        <Animated.Image
          source={require('@/assets/icons/icon.png')}
          style={[styles.logo, animatedLogoStyle]}
          resizeMode="contain"
        />
        <ThemedText type="title" style={styles.title}>
          Tebak Warna
        </ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Mainkan permainan warna yang ceria dan penuh keceriaan.
        </ThemedText>
      </Animated.View>
      <ThemedText type="default" style={styles.footer}>
        Ayo tebak warna, kumpulkan skor, dan bersenang-senang!
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
    backgroundColor: '#11264A',
    borderRadius: 36,
    padding: 30,
    borderWidth: 1,
    borderColor: '#324270',
    shadowColor: '#0A1B3D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 12,
  },
  bubbles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.16,
  },
  bubbleLarge: {
    width: 220,
    height: 220,
    backgroundColor: '#4F46E5',
    top: 24,
    left: 32,
  },
  bubbleMedium: {
    width: 152,
    height: 152,
    backgroundColor: '#0EA5E9',
    top: 80,
    right: 24,
  },
  bubbleSmall: {
    width: 96,
    height: 96,
    backgroundColor: '#F59E0B',
    bottom: 80,
    left: 48,
  },
  logo: {
    width: 144,
    height: 144,
    borderRadius: 32,
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
