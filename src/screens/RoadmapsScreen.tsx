import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { subscribeToRoadmaps, isFirebaseConfigured, Roadmap } from '../services/firebase';

const SAMPLE: Roadmap[] = [
  {
    id: 'sample-1',
    title: 'React Mastery Path',
    description: 'Full roadmap from components to advanced patterns',
    topics: ['JSX & Components', 'useState & useEffect', 'React Router', 'Context API', 'Custom Hooks', 'React Query', 'Testing with RTL'],
    source: 'laptop',
  },
  {
    id: 'sample-2',
    title: 'Python for Automation',
    description: 'Build scripts, APIs, and AI integrations',
    topics: ['Basics & Data Types', 'Functions & Classes', 'File I/O', 'requests & APIs', 'argparse & CLI tools', 'Groq/Claude API'],
    source: 'laptop',
  },
];

export default function RoadmapsScreen() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    if (!configured) {
      setRoadmaps(SAMPLE);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToRoadmaps(data => {
      setRoadmaps(data.length > 0 ? data : SAMPLE);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <FlatList
      data={roadmaps}
      keyExtractor={r => r.id!}
      style={styles.container}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <View>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Roadmaps</Text>
            <Text style={styles.headerSub}>Plans pushed from your laptop</Text>
          </View>

          {!configured && (
            <View style={styles.infoBanner}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text style={styles.infoText}>
                Showing sample roadmaps. Set up Firebase in src/services/firebase.ts to push real plans from your laptop.
              </Text>
            </View>
          )}
        </View>
      }
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator color="#00d4ff" style={{ marginTop: 60 }} />
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🗺️</Text>
            <Text style={styles.emptyTitle}>No roadmaps yet</Text>
            <Text style={styles.emptySub}>Run the push-roadmap script from your laptop to send plans here.</Text>
          </View>
        )
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.sourceTag}>
              <Text style={styles.sourceText}>💻 {item.source}</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>{item.description}</Text>
          <Text style={styles.topicsLabel}>{item.topics.length} TOPICS</Text>
          {item.topics.map((topic, i) => (
            <View key={i} style={styles.topicRow}>
              <View style={styles.topicDot} />
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          ))}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08080f' },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 16, marginTop: 8 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#e8eaf6' },
  headerSub: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  infoBanner: {
    flexDirection: 'row', gap: 10, backgroundColor: '#00d4ff10',
    borderRadius: 12, padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: '#00d4ff20', alignItems: 'flex-start',
  },
  infoIcon: { fontSize: 16 },
  infoText: { flex: 1, fontSize: 13, color: '#9ca3af', lineHeight: 20 },
  card: {
    backgroundColor: '#0d0d1a', borderRadius: 16, padding: 20,
    marginBottom: 14, borderWidth: 1, borderColor: '#ffffff10',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: '#e8eaf6', marginRight: 10 },
  sourceTag: { backgroundColor: '#ffffff10', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  sourceText: { fontSize: 11, color: '#9ca3af', fontFamily: 'monospace' },
  cardDesc: { fontSize: 13, color: '#9ca3af', lineHeight: 20, marginBottom: 16 },
  topicsLabel: { fontSize: 10, color: '#4b5563', letterSpacing: 1.5, marginBottom: 10, fontFamily: 'monospace' },
  topicRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  topicDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00d4ff', flexShrink: 0 },
  topicText: { fontSize: 14, color: '#d1d5db' },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#e8eaf6', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 22 },
});
