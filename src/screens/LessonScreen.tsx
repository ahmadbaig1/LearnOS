import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COURSES } from '../data/courses';
import { markLessonComplete } from '../services/storage';

export default function LessonScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { courseId, lessonId } = route.params;
  const course = COURSES.find(c => c.id === courseId)!;
  const lesson = course.lessons.find(l => l.id === lessonId)!;
  const lessonIndex = course.lessons.indexOf(lesson);
  const isLast = lessonIndex === course.lessons.length - 1;
  const [completed, setCompleted] = useState(false);

  async function handleComplete() {
    await markLessonComplete(courseId, lessonId);
    setCompleted(true);

    if (isLast) {
      Alert.alert('🎉 Course Complete!', `You've finished ${course.title}. Great work!`, [
        { text: 'Back to courses', onPress: () => navigation.navigate('CoursesTab') },
      ]);
    } else {
      const next = course.lessons[lessonIndex + 1];
      Alert.alert('Lesson done!', `Ready for "${next.title}"?`, [
        { text: 'Next lesson', onPress: () => {
          navigation.replace('Lesson', { courseId, lessonId: next.id });
        }},
        { text: 'Later', style: 'cancel', onPress: () => navigation.goBack() },
      ]);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.courseTag}>{course.icon} {course.title}</Text>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>⏱ {lesson.duration}</Text>
          <Text style={styles.metaText}>Lesson {lessonIndex + 1} of {course.lessons.length}</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.contentCard}>
        {renderContent(lesson.content)}
      </View>

      {/* Code Example */}
      {lesson.codeExample && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💻 Code Example</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.code}>{lesson.codeExample}</Text>
          </View>
        </View>
      )}

      {/* Exercise */}
      <View style={styles.exerciseCard}>
        <Text style={styles.exerciseLabel}>✏️ Your Exercise</Text>
        <Text style={styles.exerciseText}>{lesson.exercise}</Text>
      </View>

      {/* Key Takeaways */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔑 Key Takeaways</Text>
        {lesson.keyTakeaways.map((t, i) => (
          <View key={i} style={styles.takeawayRow}>
            <Text style={styles.takeawayDot}>▸</Text>
            <Text style={styles.takeawayText}>{t}</Text>
          </View>
        ))}
      </View>

      {/* Complete Button */}
      <TouchableOpacity
        style={[styles.completeBtn, completed && styles.completeBtnDone]}
        onPress={handleComplete}
        disabled={completed}
      >
        <Text style={styles.completeBtnText}>
          {completed ? '✓ Completed' : isLast ? 'Complete Course 🎉' : 'Complete Lesson →'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function renderContent(markdown: string) {
  const lines = markdown.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLines = [];
      } else {
        elements.push(
          <View key={key++} style={styles.codeBlock}>
            <Text style={styles.code}>{codeLines.join('\n')}</Text>
          </View>
        );
        inCodeBlock = false;
      }
      continue;
    }

    if (inCodeBlock) { codeLines.push(line); continue; }
    if (!line.trim()) { elements.push(<View key={key++} style={{ height: 8 }} />); continue; }

    if (line.startsWith('# ')) {
      elements.push(<Text key={key++} style={styles.h1}>{line.slice(2)}</Text>);
    } else if (line.startsWith('## ')) {
      elements.push(<Text key={key++} style={styles.h2}>{line.slice(3)}</Text>);
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<Text key={key++} style={styles.bold}>{line.slice(2, -2)}</Text>);
    } else if (line.startsWith('- ')) {
      elements.push(
        <View key={key++} style={styles.bullet}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{line.slice(2)}</Text>
        </View>
      );
    } else {
      // Inline formatting
      const rendered = renderInline(line, key++);
      elements.push(rendered);
    }
  }

  return <>{elements}</>;
}

function renderInline(text: string, key: number) {
  // Simple inline code rendering
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <Text key={key} style={styles.paragraph}>
      {parts.map((part, i) =>
        part.startsWith('`') && part.endsWith('`')
          ? <Text key={i} style={styles.inlineCode}>{part.slice(1, -1)}</Text>
          : <Text key={i}>{part}</Text>
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08080f' },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  courseTag: { fontSize: 12, color: '#6b7280', fontFamily: 'monospace', marginBottom: 8 },
  lessonTitle: { fontSize: 24, fontWeight: '800', color: '#e8eaf6', lineHeight: 30 },
  meta: { flexDirection: 'row', gap: 16, marginTop: 8 },
  metaText: { fontSize: 12, color: '#6b7280', fontFamily: 'monospace' },
  contentCard: { backgroundColor: '#0d0d1a', borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#ffffff10' },
  h1: { fontSize: 20, fontWeight: '800', color: '#00d4ff', marginBottom: 12, marginTop: 4 },
  h2: { fontSize: 17, fontWeight: '700', color: '#e8eaf6', marginTop: 16, marginBottom: 8 },
  paragraph: { fontSize: 14, color: '#d1d5db', lineHeight: 24, marginBottom: 4 },
  bold: { fontSize: 14, fontWeight: '700', color: '#e8eaf6', marginBottom: 4 },
  bullet: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  bulletDot: { color: '#00d4ff', fontSize: 14 },
  bulletText: { flex: 1, fontSize: 14, color: '#d1d5db', lineHeight: 22 },
  codeBlock: {
    backgroundColor: '#060610', borderRadius: 12, padding: 16, marginVertical: 8,
    borderWidth: 1, borderColor: '#ffffff10',
  },
  code: { fontFamily: 'monospace', fontSize: 12, color: '#a78bfa', lineHeight: 20 },
  inlineCode: { fontFamily: 'monospace', fontSize: 13, color: '#00d4ff', backgroundColor: '#00d4ff10' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#e8eaf6', marginBottom: 12 },
  exerciseCard: {
    backgroundColor: '#7c3aed15', borderRadius: 16, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: '#7c3aed30',
  },
  exerciseLabel: { fontSize: 13, fontWeight: '700', color: '#a78bfa', marginBottom: 10 },
  exerciseText: { fontSize: 14, color: '#d1d5db', lineHeight: 22 },
  takeawayRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  takeawayDot: { color: '#00e57a', fontSize: 14, marginTop: 2 },
  takeawayText: { flex: 1, fontSize: 14, color: '#d1d5db', lineHeight: 22 },
  completeBtn: {
    backgroundColor: '#00d4ff', borderRadius: 999, padding: 18,
    alignItems: 'center', marginTop: 8,
  },
  completeBtnDone: { backgroundColor: '#00e57a30', borderWidth: 1, borderColor: '#00e57a50' },
  completeBtnText: { color: '#08080f', fontWeight: '800', fontSize: 16 },
});
