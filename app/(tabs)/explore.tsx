import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

const COLORS = [
  { name: 'Merah', color: '#F43F5E' },
  { name: 'Kuning', color: '#EAB308' },
  { name: 'Hijau', color: '#22C55E' },
  { name: 'Biru', color: '#2563EB' },
  { name: 'Ungu', color: '#A855F7' },
  { name: 'Pink', color: '#EC4899' },
  { name: 'Orange', color: '#F97316' },
  { name: 'Coklat', color: '#92400E' },
];

export default function ExploreScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <IconSymbol size={32} name="sparkles" color="#F8FAFC" />
          </View>
          <ThemedText type="title" style={styles.title}>
            Belajar Warna
          </ThemedText>
          <ThemedText type="default" style={styles.description}>
            Pelajari nama warna, praktikkan pilihan, dan jadi juara bersama
            keluarga.
          </ThemedText>
        </View>

        {COLORS.map((color) => (
          <View key={color.name} style={styles.colorCard}>
            <View
              style={[styles.colorSwatch, { backgroundColor: color.color }]}
            />
            <ThemedText type="subtitle" style={styles.colorName}>
              {color.name}
            </ThemedText>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  header: {
    backgroundColor: '#111827',
    borderRadius: 28,
    padding: 24,
    gap: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerIcon: {
    backgroundColor: '#1D2939',
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 4,
    color: '#F8FAFC',
  },
  description: {
    lineHeight: 24,
    color: '#CBD5E1',
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 20,
    gap: 10,
    borderLeftWidth: 4,
    borderColor: '#334155',
  },
  accentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#F8FAFC',
    marginBottom: 5,
  },
  cardText: {
    color: '#CBD5E1',
    lineHeight: 22,
  },
  colorCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  colorSwatch: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#0F172A',
  },
  colorName: {
    color: '#F8FAFC',
    fontSize: 24,
    textAlign: 'center',
  },
  footerCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  sectionTitle: {
    color: '#F8FAFC',
  },
});
