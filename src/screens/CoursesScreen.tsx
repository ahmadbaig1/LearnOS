import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COURSES } from '../data/courses';
import { getAllProgress } from '../services/storage';

export default function CoursesScreen() {
  const navigation = useNavigation<any>();
  const [progress, setProgress] = useState<Record<string, any>>({});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setProgress(await getAllProgress());
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <FlatList
      data={COURSES}
      keyExtractor={c => c.id}
      style={styles.container}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Courses</Text>
          <Text style={styles.headerSub}>Structured lessons, written for you</Text>
        </View>
      }
      renderItem={({ item: course }) => {
        const p = progress[course.id];
        const completed = p ? p.completedLessons.length : 0;
        const percent = Math.round((completed / course.totalLessons) * 100);

        return (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>{course.icon}</Text>
              <View style={styles.cardMeta}>
                <Text style={styles.cardTitle}>{course.title}</Text>
                <Text style={styles.cardSub}>{course.totalLessons} lessons · {course.estimatedHours}</Text>
              </View>
              {completed > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{percent}%</Text>
                </View>
              )}
            </View>

            <Text style={styles.cardDesc}>{course.description}</Text>

            {completed > 0 && (
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: course.color }]} />
              </View>
            )}

            <Text style={[styles.startLabel, { color: course.color }]}>
              {completed === 0 ? 'Start course →' : completed === course.totalLessons ? '✓ Complete' : `Continue → Lesson ${completed + 1}`}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08080f' },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 20, marginTop: 8 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#e8eaf6' },
  headerSub: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  card: {
    backgroundColor: '#0d0d1a', borderRadius: 16, padding: 20,
    marginBottom: 14, borderWidth: 1, borderColor: '#ffffff10',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10 },
  icon: { fontSize: 36 },
  cardMeta: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#e8eaf6' },
  cardSub: { fontSize: 12, color: '#6b7280', marginTop: 2, fontFamily: 'monospace' },
  badge: { backgroundColor: '#00d4ff20', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#00d4ff' },
  cardDesc: { fontSize: 13, color: '#9ca3af', lineHeight: 20, marginBottom: 14 },
  progressBar: { height: 3, backgroundColor: '#ffffff10', borderRadius: 2, marginBottom: 12 },
  progressFill: { height: '100%', borderRadius: 2 },
  startLabel: { fontSize: 13, fontWeight: '700' },
});
