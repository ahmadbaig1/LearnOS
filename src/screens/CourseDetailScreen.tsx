import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COURSES } from '../data/courses';
import { getCourseProgress } from '../services/storage';

export default function CourseDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { courseId } = route.params;
  const course = COURSES.find(c => c.id === courseId)!;
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const p = await getCourseProgress(courseId);
      setCompletedLessons(p ? p.completedLessons : []);
    });
    return unsubscribe;
  }, []);

  const percent = Math.round((completedLessons.length / course.lessons.length) * 100);

  return (
    <FlatList
      data={course.lessons}
      keyExtractor={l => l.id}
      style={styles.container}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <View>
          <View style={styles.hero}>
            <Text style={styles.heroIcon}>{course.icon}</Text>
            <Text style={styles.heroTitle}>{course.title}</Text>
            <Text style={styles.heroSub}>{course.totalLessons} lessons · {course.estimatedHours}</Text>
            <Text style={styles.heroDesc}>{course.description}</Text>

            {completedLessons.length > 0 && (
              <View style={styles.progressSection}>
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>{percent}% complete</Text>
                  <Text style={styles.progressLabel}>{completedLessons.length}/{course.totalLessons}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: course.color }]} />
                </View>
              </View>
            )}
          </View>
          <Text style={styles.lessonsTitle}>Lessons</Text>
        </View>
      }
      renderItem={({ item: lesson, index }) => {
        const done = completedLessons.includes(lesson.id);
        const locked = index > 0 && !completedLessons.includes(course.lessons[index - 1].id);

        return (
          <TouchableOpacity
            style={[styles.lessonRow, done && styles.lessonDone, locked && styles.lessonLocked]}
            onPress={() => {
              if (!locked) navigation.navigate('Lesson', { courseId, lessonId: lesson.id });
            }}
            disabled={locked}
          >
            <View style={[styles.lessonNum, done && { backgroundColor: course.color }]}>
              <Text style={[styles.lessonNumText, done && { color: '#08080f' }]}>
                {done ? '✓' : String(index + 1)}
              </Text>
            </View>
            <View style={styles.lessonInfo}>
              <Text style={[styles.lessonTitle, locked && { color: '#4b5563' }]}>{lesson.title}</Text>
              <Text style={styles.lessonDuration}>{lesson.duration}</Text>
            </View>
            {!locked && <Text style={styles.lessonArrow}>→</Text>}
            {locked && <Text style={styles.lockIcon}>🔒</Text>}
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08080f' },
  content: { paddingBottom: 40 },
  hero: { padding: 24, paddingTop: 16, borderBottomWidth: 1, borderColor: '#ffffff10' },
  heroIcon: { fontSize: 48, marginBottom: 12 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#e8eaf6' },
  heroSub: { fontSize: 13, color: '#6b7280', marginTop: 4, fontFamily: 'monospace' },
  heroDesc: { fontSize: 14, color: '#9ca3af', marginTop: 12, lineHeight: 22 },
  progressSection: { marginTop: 20 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 12, color: '#6b7280', fontFamily: 'monospace' },
  progressBar: { height: 4, backgroundColor: '#ffffff10', borderRadius: 2 },
  progressFill: { height: '100%', borderRadius: 2 },
  lessonsTitle: { fontSize: 16, fontWeight: '700', color: '#6b7280', padding: 20, paddingBottom: 8, letterSpacing: 1 },
  lessonRow: {
    flexDirection: 'row', alignItems: 'center', padding: 18,
    marginHorizontal: 16, marginBottom: 8, backgroundColor: '#0d0d1a',
    borderRadius: 14, borderWidth: 1, borderColor: '#ffffff10', gap: 14,
  },
  lessonDone: { borderColor: '#00d4ff20' },
  lessonLocked: { opacity: 0.5 },
  lessonNum: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#ffffff10',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  lessonNumText: { fontWeight: '700', color: '#e8eaf6', fontSize: 14 },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: 15, fontWeight: '600', color: '#e8eaf6' },
  lessonDuration: { fontSize: 12, color: '#6b7280', marginTop: 2, fontFamily: 'monospace' },
  lessonArrow: { color: '#6b7280', fontSize: 16 },
  lockIcon: { fontSize: 14 },
});
