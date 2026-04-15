import { useRouter } from 'expo-router';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const COLORS = [
  '#F43F5E',
  '#F97316',
  '#EAB308',
  '#22C55E',
  '#2563EB',
  '#A855F7',
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <ThemedText type="defaultSemiBold" style={styles.badgeText}>
            Tebak Warna Yuk!
          </ThemedText>
        </View>
        <ThemedText type="title" style={styles.title}>
          Halo, Teman Warna!
        </ThemedText>
        <ThemedText type="default" style={styles.heroText}>
          Yuk belajar warna dengan cara seru, cepat, dan mudah dipahami anak
          kecil.
        </ThemedText>
        <View style={styles.swatchRow}>
          {COLORS.map((color) => (
            <View
              key={color}
              style={[styles.swatch, { backgroundColor: color }]}
            />
          ))}
        </View>
      </View>

      <View style={styles.actionCard}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Pilih Aktivitas
        </ThemedText>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/game')}
        >
          <ThemedText type="defaultSemiBold" style={styles.primaryButtonText}>
            Main Tebak Warna
          </ThemedText>
        </Pressable>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/explore')}
        >
          <ThemedText type="defaultSemiBold" style={styles.secondaryButtonText}>
            Pelajari Warna
          </ThemedText>
        </Pressable>
      </View>

      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=400&fit=crop&crop=center',
        }}
        style={styles.banner}
        resizeMode="cover"
        borderRadius={20}
      >
        <View style={styles.bannerOverlay}>
          <View style={styles.bannerContent}>
            <ThemedText type="title" style={styles.bannerTitle}>
              Yuk Belajar Warna!
            </ThemedText>
            <ThemedText type="default" style={styles.bannerSubtitle}>
              Bersama teman-teman kecil
            </ThemedText>
          </View>
          <View style={styles.bannerDecorations}>
            <View
              style={[
                styles.decorationDot,
                { backgroundColor: '#F43F5E', top: 20, left: 20 },
              ]}
            />
            <View
              style={[
                styles.decorationDot,
                { backgroundColor: '#EAB308', top: 40, right: 40 },
              ]}
            />
            <View
              style={[
                styles.decorationDot,
                { backgroundColor: '#22C55E', bottom: 30, left: 30 },
              ]}
            />
            <View
              style={[
                styles.decorationDot,
                { backgroundColor: '#2563EB', bottom: 20, right: 20 },
              ]}
            />
            <View
              style={[
                styles.decorationDot,
                { backgroundColor: '#A855F7', top: 60, left: 60 },
              ]}
            />
          </View>
        </View>
      </ImageBackground>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
    backgroundColor: '#090D16',
  },
  heroCard: {
    backgroundColor: '#111827',
    borderRadius: 30,
    padding: 26,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1D4ED8',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#EFF6FF',
    fontSize: 12,
  },
  title: {
    color: '#F8FAFC',
    lineHeight: 44,
  },
  heroText: {
    color: '#CBD5E1',
    lineHeight: 24,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  swatch: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  actionCard: {
    backgroundColor: '#111827',
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sectionTitle: {
    color: '#E2E8F0',
  },
  primaryButton: {
    borderRadius: 24,
    backgroundColor: '#2563EB',
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: 24,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#2563EB',
    paddingVertical: 18,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#E2E8F0',
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 14,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  infoText: {
    color: '#94A3B8',
    marginTop: 8,
    lineHeight: 22,
  },
  banner: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContent: {
    alignItems: 'center',
    gap: 8,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bannerSubtitle: {
    color: '#F8FAFC',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bannerDecorations: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  decorationDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
