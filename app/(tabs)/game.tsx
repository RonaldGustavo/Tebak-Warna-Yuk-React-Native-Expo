import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useEffect, useMemo, useState } from 'react';
import {
    Animated,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

const COLORS = [
  { name: 'Merah', hex: '#EF4444' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Kuning', hex: '#F59E0B' },
  { name: 'Hijau', hex: '#22C55E' },
  { name: 'Biru', hex: '#2563EB' },
  { name: 'Ungu', hex: '#8B5CF6' },
  { name: 'Pink', hex: '#EC4899' },
];

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function getTextColor(hex: string) {
  const value = parseInt(hex.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? '#111827' : '#ffffff';
}

function createRound() {
  const target = COLORS[Math.floor(Math.random() * COLORS.length)];
  const options = shuffle([
    target,
    ...shuffle(COLORS)
      .filter((color) => color.name !== target.name)
      .slice(0, 2),
  ]);
  return { target, options };
}

export default function GameScreen() {
  const [round, setRound] = useState(createRound());
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState('');
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shakeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [confettiAnim] = useState(new Animated.Value(0));

  const animateCorrect = () => {
    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Confetti animation
    Animated.timing(confettiAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      confettiAnim.setValue(0);
    });
  };

  const animateWrong = () => {
    // Shake animation
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const gameMessage = useMemo(() => {
    if (status === 'lost') {
      return `😅 Game over! Jawaban benar: ${round.target.name}`;
    }
    if (status === 'won') {
      return '🎉 Hebat! Jawabanmu tepat. Lanjut ke soal berikutnya...';
    }
    return '👆 Pilih nama warna yang benar dari pilihan di bawah.';
  }, [round.target.name, status]);

  useEffect(() => {
    if (status === 'won') {
      const timeout = setTimeout(() => {
        setRound(createRound());
        setSelected('');
        setStatus('playing');
      }, 1300);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  const handleChoice = (choice: string) => {
    if (status !== 'playing') return;
    setSelected(choice);

    if (choice === round.target.name) {
      setScore((current) => current + 1);
      setStatus('won');
      animateCorrect();
    } else {
      setStatus('lost');
      animateWrong();
    }
  };

  const restartGame = () => {
    setRound(createRound());
    setScore(0);
    setSelected('');
    setStatus('playing');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View
          style={[
            styles.headerCard,
            {
              transform: [
                {
                  translateX: shakeAnim.interpolate({
                    inputRange: [-10, 10],
                    outputRange: [-10, 10],
                  }),
                },
              ],
            },
          ]}
        >
          <ThemedText type="title">🎨 Main Tebak Warna</ThemedText>
          <View style={styles.scoreRow}>
            <ThemedText type="subtitle">Skor: {score}</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.roundLabel}>
              {status === 'lost' ? 'Berhenti' : 'Sedang Berjalan'}
            </ThemedText>
          </View>
          <View style={styles.colorPreview}>
            <View
              style={[styles.colorDot, { backgroundColor: round.target.hex }]}
            />
            <ThemedText type="defaultSemiBold">🔍 Warna misteri</ThemedText>
          </View>
        </Animated.View>

        <View style={styles.card}>
          <ThemedText type="subtitle">🎯 Tebakan</ThemedText>
          <ThemedText style={styles.instruction}>{gameMessage}</ThemedText>
          <View style={styles.optionGrid}>
            {round.options.map((option) => {
              const isSelected = selected === option.name;
              return (
                <Animated.View
                  key={option.name}
                  style={[
                    styles.choiceButton,
                    {
                      backgroundColor: option.hex,
                      opacity: status !== 'playing' && !isSelected ? 0.4 : 1,
                      borderColor: isSelected
                        ? status === 'lost'
                          ? '#F97316'
                          : '#22C55E'
                        : 'rgba(255,255,255,0.16)',
                      transform: [
                        {
                          scale: isSelected && status === 'won' ? scaleAnim : 1,
                        },
                      ],
                    },
                  ]}
                >
                  <Pressable
                    onPress={() => handleChoice(option.name)}
                    style={styles.choicePressable}
                  >
                    <ThemedText
                      type="defaultSemiBold"
                      style={[
                        styles.choiceLabel,
                        { color: getTextColor(option.hex) },
                      ]}
                    >
                      {option.name}
                    </ThemedText>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {status === 'won' && (
          <View style={styles.confettiContainer}>
            {[...Array(6)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.confettiDot,
                  {
                    backgroundColor: COLORS[i % COLORS.length].hex,
                    left: `${20 + i * 12}%`,
                    transform: [
                      {
                        translateY: confettiAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -100],
                        }),
                      },
                      {
                        scale: confettiAnim,
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        )}

        {status === 'lost' ? (
          <View style={styles.gameOverCard}>
            <ThemedText type="subtitle">Skor Akhir: {score}</ThemedText>
            <ThemedText type="default" style={styles.footerText}>
              Jawaban salah. Yuk coba lagi untuk catat skor lebih tinggi! 🚀
            </ThemedText>
            <Pressable onPress={restartGame} style={styles.restartButton}>
              <ThemedText type="defaultSemiBold">🔄 Main Ulang</ThemedText>
            </Pressable>
          </View>
        ) : null}
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
    gap: 18,
    padding: 20,
  },
  headerCard: {
    backgroundColor: '#111827',
    borderRadius: 30,
    padding: 24,
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
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  roundLabel: {
    color: '#94A3B8',
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 30,
    padding: 24,
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
  gameOverCard: {
    backgroundColor: '#0F172A',
    borderRadius: 30,
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: '#4338CA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorDot: {
    width: 42,
    height: 42,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  instruction: {
    fontSize: 15,
    lineHeight: 24,
    color: '#E2E8F0',
  },
  optionGrid: {
    gap: 12,
  },
  choiceButton: {
    borderRadius: 24,
    minHeight: 80,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  choicePressed: {
    opacity: 0.8,
  },
  choicePressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    minHeight: 68,
  },
  confettiContainer: {
    position: 'absolute',
    top: 200,
    left: 0,
    right: 0,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confettiDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  choiceLabel: {
    fontSize: 20,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footerText: {
    color: '#CBD5E1',
  },
  restartButton: {
    backgroundColor: '#6366F1',
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: 'center',
  },
});
