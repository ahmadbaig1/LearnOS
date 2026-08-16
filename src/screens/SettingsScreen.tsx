import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { getReminderTime, setReminderTime } from '../services/storage';
import { scheduleDailyReminder, cancelAllReminders, requestPermissions } from '../services/notifications';

export default function SettingsScreen() {
  const [time, setTime] = useState('20:00');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getReminderTime().then(setTime);
  }, []);

  async function handleSaveReminder() {
    const [hStr, mStr] = time.split(':');
    const h = parseInt(hStr), m = parseInt(mStr);
    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
      Alert.alert('Invalid time', 'Enter time as HH:MM (e.g. 20:00 for 8 PM)');
      return;
    }

    const granted = await requestPermissions();
    if (!granted) {
      Alert.alert('Permission needed', 'Allow notifications in Settings to enable daily reminders.');
      return;
    }

    await setReminderTime(time);
    await scheduleDailyReminder(h, m);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleCancelReminders() {
    await cancelAllReminders();
    Alert.alert('Reminders off', 'Daily study reminders have been cancelled.');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Reminder</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Study reminder time</Text>
          <Text style={styles.sublabel}>You'll get a push notification to start studying (24h format)</Text>
          <TextInput
            style={styles.timeInput}
            value={time}
            onChangeText={setTime}
            placeholder="HH:MM"
            placeholderTextColor="#6b7280"
            keyboardType="numbers-and-punctuation"
            maxLength={5}
          />
          <TouchableOpacity style={[styles.btn, saved && styles.btnSaved]} onPress={handleSaveReminder}>
            <Text style={styles.btnText}>{saved ? '✓ Saved!' : 'Save & Schedule'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelReminders}>
            <Text style={styles.cancelText}>Cancel all reminders</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Firebase Setup */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Firebase Sync Setup</Text>
        <View style={styles.card}>
          <Text style={styles.label}>To push roadmaps from your laptop:</Text>
          <View style={styles.steps}>
            {[
              'Go to console.firebase.google.com',
              'Create a new project → Add Web App',
              'Copy the config into src/services/firebase.ts',
              'Run the push-roadmap.js script from your laptop',
            ].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>{i + 1}</Text></View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About LearnOS</Text>
        <View style={styles.card}>
          {[
            ['Version', '1.0.0'],
            ['Built with', 'Expo + React Native'],
            ['Courses', '4 (React, JS, Python, SQL)'],
            ['Total lessons', '20'],
          ].map(([k, v]) => (
            <View key={k} style={styles.infoRow}>
              <Text style={styles.infoKey}>{k}</Text>
              <Text style={styles.infoVal}>{v}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08080f' },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24, marginTop: 8 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#e8eaf6' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, color: '#6b7280', letterSpacing: 1, marginBottom: 10, fontFamily: 'monospace' },
  card: {
    backgroundColor: '#0d0d1a', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#ffffff10',
  },
  label: { fontSize: 15, fontWeight: '600', color: '#e8eaf6', marginBottom: 6 },
  sublabel: { fontSize: 13, color: '#6b7280', marginBottom: 14, lineHeight: 20 },
  timeInput: {
    backgroundColor: '#111124', borderRadius: 12, padding: 14, color: '#e8eaf6',
    fontSize: 20, fontFamily: 'monospace', fontWeight: '700', borderWidth: 1,
    borderColor: '#ffffff12', marginBottom: 14, textAlign: 'center',
  },
  btn: {
    backgroundColor: '#00d4ff', borderRadius: 999, padding: 16,
    alignItems: 'center', marginBottom: 10,
  },
  btnSaved: { backgroundColor: '#00e57a' },
  btnText: { color: '#08080f', fontWeight: '800', fontSize: 15 },
  cancelBtn: { padding: 12, alignItems: 'center' },
  cancelText: { color: '#6b7280', fontSize: 14 },
  steps: { marginTop: 10 },
  stepRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 12 },
  stepNum: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#00d4ff20',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepNumText: { fontSize: 12, fontWeight: '700', color: '#00d4ff' },
  stepText: { flex: 1, fontSize: 13, color: '#d1d5db', lineHeight: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ffffff08' },
  infoKey: { fontSize: 14, color: '#9ca3af' },
  infoVal: { fontSize: 14, color: '#e8eaf6', fontWeight: '600' },
});
