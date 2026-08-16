import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Linking, Alert, Animated,
} from 'react-native';
import { getStreak, getTotalStudyMinutes, addStudyMinutes } from '../services/storage';
import { sendStudyStartNotification } from '../services/notifications';

const MINIMALIST_PKG = 'com.quitnow.minimalist';

export default function HomeScreen() {
  const [streak, setStreak] = useState({ currentStreak: 0, totalDays: 0 });
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
      startPulse();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      if (seconds > 0) {
        const mins = Math.floor(seconds / 60);
        if (mins > 0) addStudyMinutes(mins).then(loadStats);
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerActive]);

  function startPulse() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }

  async function loadStats() {
    const [s, m] = await Promise.all([getStreak(), getTotalStudyMinutes()]);
    setStreak(s);
    setTotalMinutes(m);
  }

  function formatTime(secs: number) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  async function handleStartSession() {
    setTimerActive(true);
    setSeconds(0);
    await sendStudyStartNotification();
    openMinimalist();
  }

  function openMinimalist() {
    Linking.openURL(`intent://#Intent;package=${MINIMALIST_PKG};end`)
      .catch(() => {
        Alert.alert(
          'Tip: Enable Focus Mode',
          'Open the Minimalist app and enable your focus/allow-list session to block distractions.',
          [{ text: 'OK' }]
        );
      });
  }

  function handleStopSession() {
    const mins = Math.floor(seconds / 60);
    setTimerActive(false);
    if (mins >= 1) {
      Alert.alert('Session Complete!', `You studied for ${mins} minute${mins !== 1 ? 's' : ''}. Great work! 🎉`);
    }
  }

  const hours = Math.floor(totalMinutes / 60);
  const goalPercent = Math.min((seconds / (2 * 3600)) * 100, 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good {getTimeOfDay()}, Ahmad</Text>
        <Text style={styles.subtitle}>Ready to level up today?</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{streak.currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak 🔥</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{hours}h</Text>
          <Text style={styles.statLabel}>Total Study</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{streak.totalDays}</Text>
          <Text style={styles.statLabel}>Days Studied</Text>
        </View>
      </View>

      {/* Timer */}
      <Animated.View style={[styles.timerCard, timerActive && { transform: [{ scale: pulseAnim }] }]}>
        <Text style={styles.timerLabel}>{timerActive ? 'SESSION ACTIVE' : "TODAY'S GOAL: 2 HOURS"}</Text>
        <Text style={styles.timerDisplay}>{formatTime(seconds)}</Text>

        {timerActive && (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${goalPercent}%` }]} />
          </View>
        )}

        {!timerActive ? (
          <TouchableOpacity style={styles.startBtn} onPress={handleStartSession}>
            <Text style={styles.startBtnText}>▶ Start Study Session</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopBtn} onPress={handleStopSession}>
            <Text style={styles.stopBtnText}>⏹ End Session</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Focus Mode Card */}
      <TouchableOpacity style={styles.focusCard} onPress={openMinimalist}>
        <Text style={styles.focusIcon}>🎯</Text>
        <View style={styles.focusText}>
          <Text style={styles.focusTitle}>Open Minimalist</Text>
          <Text style={styles.focusSub}>Enable focus mode to block distractions</Text>
        </View>
        <Text style={styles.focusArrow}>→</Text>
      </TouchableOpacity>

      {/* Quick Links */}
      <Text style={styles.sectionTitle}>Quick Start</Text>
      <View style={styles.quickGrid}>
        {[
          { icon: '⚛️', label: 'React', color: '#61DAFB20' },
          { icon: '🟨', label: 'JavaScript', color: '#F7DF1E20' },
          { icon: '🐍', label: 'Python', color: '#3776AB20' },
          { icon: '🗄️', label: 'SQL', color: '#33679120' },
        ].map(item => (
          <View key={item.label} style={[styles.quickCard, { backgroundColor: item.color }]}>
            <Text style={styles.quickIcon}>{item.icon}</Text>
            <Text style={styles.quickLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08080f' },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24, marginTop: 8 },
  greeting: { fontSize: 26, fontWeight: '800', color: '#e8eaf6' },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: '#0d0d1a', borderRadius: 14,
    padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#ffffff12',
  },
  statNum: { fontSize: 24, fontWeight: '800', color: '#00d4ff' },
  statLabel: { fontSize: 11, color: '#6b7280', marginTop: 4, textAlign: 'center' },
  timerCard: {
    backgroundColor: '#0d0d1a', borderRadius: 20, padding: 28,
    alignItems: 'center', marginBottom: 16,
    borderWidth: 1, borderColor: '#00d4ff30',
  },
  timerLabel: { fontSize: 11, color: '#6b7280', letterSpacing: 1.5, marginBottom: 12, fontFamily: 'monospace' },
  timerDisplay: { fontSize: 64, fontWeight: '800', color: '#00d4ff', fontFamily: 'monospace', marginBottom: 20 },
  progressBar: { width: '100%', height: 4, backgroundColor: '#ffffff12', borderRadius: 2, marginBottom: 20 },
  progressFill: { height: '100%', backgroundColor: '#00d4ff', borderRadius: 2 },
  startBtn: {
    backgroundColor: '#00d4ff', borderRadius: 999, paddingVertical: 16,
    paddingHorizontal: 40, width: '100%', alignItems: 'center',
  },
  startBtnText: { color: '#08080f', fontWeight: '800', fontSize: 16 },
  stopBtn: {
    backgroundColor: '#ffffff12', borderRadius: 999, paddingVertical: 16,
    paddingHorizontal: 40, width: '100%', alignItems: 'center',
    borderWidth: 1, borderColor: '#ffffff20',
  },
  stopBtnText: { color: '#e8eaf6', fontWeight: '700', fontSize: 16 },
  focusCard: {
    backgroundColor: '#0d0d1a', borderRadius: 14, padding: 16, marginBottom: 24,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1, borderColor: '#7c3aed30',
  },
  focusIcon: { fontSize: 28 },
  focusText: { flex: 1 },
  focusTitle: { fontSize: 15, fontWeight: '700', color: '#e8eaf6' },
  focusSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  focusArrow: { fontSize: 18, color: '#7c3aed' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#e8eaf6', marginBottom: 12 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: {
    width: '47%', borderRadius: 14, padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#ffffff10',
  },
  quickIcon: { fontSize: 32, marginBottom: 8 },
  quickLabel: { fontSize: 13, fontWeight: '600', color: '#e8eaf6' },
});
