import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useEffect, useMemo, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();
  const [round, setRound] = useState(createRound());
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState('');
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [hintUsed, setHintUsed] = useState(false);
  const [shakeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [confettiAnim] = useState(new Animated.Value(0));
  const [hintRevealAnim] = useState(new Animated.Value(1));

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
    return hintUsed
      ? '🎯 Hint aktif: satu pilihan dihapus, tinggal dua opsi.'
      : '👆 Pilih nama warna yang benar dari pilihan di bawah.';
  }, [hintUsed, round.target.name, status]);

  useEffect(() => {
    if (status === 'won') {
      const timeout = setTimeout(() => {
        setRound(createRound());
        setSelected('');
        setStatus('playing');
        setHintUsed(false);
        hintRevealAnim.setValue(1);
      }, 1300);
      return () => clearTimeout(timeout);
    }
  }, [hintRevealAnim, status]);

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

  const displayedOptions = useMemo(() => {
    if (!hintUsed) {
      return round.options;
    }

    const wrongOptions = round.options.filter(
      (option) => option.name !== round.target.name,
    );
    const reducedOptions = [round.target, wrongOptions[0]];
    return shuffle(reducedOptions);
  }, [hintUsed, round.options, round.target]);

  const hintText = useMemo(
    () => `Petunjuk: warna dimulai dengan huruf ${round.target.name[0]}.`,
    [round.target.name],
  );

  useEffect(() => {
    if (hintUsed) {
      hintRevealAnim.setValue(0);
      Animated.timing(hintRevealAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }).start();
    }
  }, [hintRevealAnim, hintUsed]);

  const scoreResult = useMemo(() => {
    if (score > 20) {
      return {
        label: '😍😍😍😍😍',
        message: 'Kamu jago tebak warna! 🌟',
        accent: '#FBBF24',
      };
    }
    if (score > 5) {
      return {
        label: '🥰🥰🥰🥰🥰',
        message: 'Hebat, daya ingat warnamu mantap! 😊',
        accent: '#60A5FA',
      };
    }
    if (score < 6) {
      return {
        label: '😭😭😭😭😭',
        message: 'Yuk coba lagi agar makin percaya diri.',
        accent: '#F87171',
      };
    }
    return {
      label: 'Bagus',
      message: 'Teruskan semangatmu, skor bisa naik lagi!',
      accent: '#A78BFA',
    };
  }, [score]);

  const restartGame = () => {
    setRound(createRound());
    setScore(0);
    setSelected('');
    setStatus('playing');
    setHintUsed(false);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { paddingBottom: 20 + insets.bottom }]}>
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
          <ThemedText type="title">🎨 Tebak Warna</ThemedText>
          <View style={styles.scoreRow}>
            <View style={styles.scoreBadge}>
              <ThemedText type="subtitle" style={styles.scoreLabel}>
                Skor
              </ThemedText>
              <ThemedText type="title" style={styles.scoreCount}>
                {score}
              </ThemedText>
            </View>
            <ThemedText type="defaultSemiBold" style={styles.roundLabel}>
              {status === 'lost' ? 'Berhenti' : 'Sedang Berjalan'}
            </ThemedText>
          </View>
          <View style={styles.questionBox}>
            <ThemedText type="defaultSemiBold" style={styles.questionLabel}>
              Soal:
            </ThemedText>
            <ThemedText type="title" style={styles.questionText}>
              {round.target.name}
            </ThemedText>
          </View>
        </Animated.View>

        <View style={styles.card}>
          <ThemedText type="subtitle">🎯 Tebakan</ThemedText>
          <ThemedText style={styles.instruction}>{gameMessage}</ThemedText>
          <View style={styles.hintRow}>
            <Pressable
              onPress={() => setHintUsed(true)}
              style={[styles.hintButton, hintUsed && styles.hintButtonActive]}
            >
              <IconSymbol
                name="questionmark.circle"
                size={18}
                color="#BFDBFE"
                style={styles.hintIcon}
              />
              <ThemedText type="defaultSemiBold" style={styles.hintButtonText}>
                Bantuan
              </ThemedText>
            </Pressable>
            {hintUsed && (
              <ThemedText type="default" style={styles.hintText}>
                {hintText}
              </ThemedText>
            )}
          </View>
          <View style={styles.optionGrid}>
            {displayedOptions.map((option) => {
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
                  <Animated.View
                    style={{
                      opacity: hintUsed ? hintRevealAnim : 1,
                      transform: [
                        {
                          scale: hintUsed
                            ? hintRevealAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.94, 1],
                              })
                            : 1,
                        },
                      ],
                    }}
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
                        {/* {option.name} */}
                      </ThemedText>
                    </Pressable>
                  </Animated.View>
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
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[styles.modalCard, { borderColor: scoreResult.accent }]}
            >
              <ThemedText type="title" style={styles.modalTitle}>
                Skor Akhir
              </ThemedText>
              <View style={styles.modalScoreRow}>
                <View
                  style={[
                    styles.modalScoreBadge,
                    { backgroundColor: scoreResult.accent },
                  ]}
                >
                  <ThemedText type="title" style={styles.modalScoreText}>
                    {score}
                  </ThemedText>
                </View>
                <View style={styles.modalStatusGroup}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={[
                      styles.modalStatusText,
                      { color: scoreResult.accent },
                    ]}
                  >
                    {scoreResult.label}
                  </ThemedText>
                  <ThemedText type="default" style={styles.modalDescription}>
                    {scoreResult.message}
                  </ThemedText>
                </View>
              </View>
              <Pressable
                onPress={restartGame}
                style={[
                  styles.modalButton,
                  { borderColor: scoreResult.accent },
                ]}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.modalButtonText}
                >
                  🔄 Mulai Lagi
                </ThemedText>
              </Pressable>
            </Animated.View>
          </View>
        ) : null}
      </View>
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
  scoreBadge: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#93C5FD',
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  scoreCount: {
    color: '#EFF6FF',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
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
  questionBox: {
    alignItems: 'flex-start',
    gap: 8,
    paddingTop: 10,
  },
  questionLabel: {
    color: '#94A3B8',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  questionText: {
    color: '#F8FAFC',
    fontSize: 28,
    lineHeight: 36,
  },
  instruction: {
    fontSize: 15,
    lineHeight: 24,
    color: '#E2E8F0',
  },
  optionGrid: {
    gap: 12,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    marginBottom: 6,
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  hintButtonActive: {
    backgroundColor: '#2563EB',
  },
  hintButtonText: {
    color: '#BFDBFE',
    fontSize: 14,
  },
  hintIcon: {
    marginTop: 1,
  },
  hintText: {
    flex: 1,
    color: '#C7D2FE',
    fontSize: 14,
    lineHeight: 20,
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
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#111827',
    borderRadius: 30,
    borderWidth: 2,
    padding: 26,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
  },
  modalTitle: {
    color: '#E2E8F0',
    fontSize: 22,
    marginBottom: 18,
  },
  modalScoreRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  modalScoreBadge: {
    width: 84,
    height: 84,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalScoreText: {
    color: '#0F172A',
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '800',
  },
  modalStatusGroup: {
    flex: 1,
    alignItems: 'flex-start',
  },
  modalStatusText: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 8,
  },
  modalDescription: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 22,
  },
  modalButton: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#EFF6FF',
    fontSize: 16,
  },
});
