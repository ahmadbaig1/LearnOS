import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COURSES } from '../data/courses';
import { markLessonComplete } from '../services/storage';

type Block =
  | { type: 'h1' | 'h2' | 'h3'; text: string }
  | { type: 'code'; text: string }
  | { type: 'bullet'; text: string }
  | { type: 'p'; text: string };

function parseMarkdown(md: string): Block[] {
  const blocks: Block[] = [];
  let inCode = false;
  let codeLines: string[] = [];

  for (const raw of md.split('\n')) {
    const line = raw;

    if (line.startsWith('```')) {
      if (inCode) {
        blocks.push({ type: 'code', text: codeLines.join('\n') });
        codeLines = [];
      }
      inCode = !inCode;
      continue;
    }
    if (inCode) { codeLines.push(line); continue; }

    if (line.startsWith('### ')) { blocks.push({ type: 'h3', text: line.slice(4) }); continue; }
    if (line.startsWith('## '))  { blocks.push({ type: 'h2', text: line.slice(3) }); continue; }
    if (line.startsWith('# '))   { blocks.push({ type: 'h1', text: line.slice(2) }); continue; }
    if (line.match(/^[-*] /))    { blocks.push({ type: 'bullet', text: line.slice(2) }); continue; }
    if (line.trim())             { blocks.push({ type: 'p', text: line }); }
  }
  return blocks;
}

function InlineText({ text, baseStyle }: { text: string; baseStyle: object }) {
  // Split on **bold** and `code`
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|`(.+?)`)/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(<Text key={i++} style={baseStyle}>{text.slice(last, m.index)}</Text>);
    if (m[2]) parts.push(<Text key={i++} style={[baseStyle, s.bold]}>{m[2]}</Text>);
    if (m[3]) parts.push(<Text key={i++} style={[s.inlineCode]}>{m[3]}</Text>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(<Text key={i++} style={baseStyle}>{text.slice(last)}</Text>);
  return <Text>{parts}</Text>;
}

function MarkdownView({ content }: { content: string }) {
  const blocks = parseMarkdown(content);
  return (
    <View>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h1': return <Text key={i} style={s.h1}>{b.text}</Text>;
          case 'h2': return <Text key={i} style={s.h2}>{b.text}</Text>;
          case 'h3': return <Text key={i} style={s.h3}>{b.text}</Text>;
          case 'code': return (
            <ScrollView key={i} horizontal showsHorizontalScrollIndicator={false} style={s.codeBlock}>
              <Text style={s.codeText}>{b.text}</Text>
            </ScrollView>
          );
          case 'bullet': return (
            <View key={i} style={s.bulletRow}>
              <Text style={s.bulletDot}>›</Text>
              <InlineText text={b.text} baseStyle={s.bulletText} />
            </View>
          );
          default: return (
            <View key={i} style={s.paraWrap}>
              <InlineText text={b.text} baseStyle={s.para} />
            </View>
          );
        }
      })}
    </View>
  );
}

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
      Alert.alert('Course Complete!', `You finished ${course.title}. Great work!`, [
        { text: 'Back to courses', onPress: () => navigation.navigate('CoursesTab') },
      ]);
    } else {
      const next = course.lessons[lessonIndex + 1];
      Alert.alert('Lesson done!', `Ready for "${next.title}"?`, [
        { text: 'Next lesson', onPress: () => navigation.replace('Lesson', { courseId, lessonId: next.id }) },
        { text: 'Later', style: 'cancel', onPress: () => navigation.goBack() },
      ]);
    }
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.header}>
        <Text style={s.courseTag}>{course.icon}  {course.title}</Text>
        <Text style={s.lessonTitle}>{lesson.title}</Text>
        <View style={s.meta}>
          <Text style={s.metaText}>⏱ {lesson.duration}</Text>
          <Text style={s.metaText}>Lesson {lessonIndex + 1} of {course.lessons.length}</Text>
        </View>
      </View>

      <View style={s.card}>
        <MarkdownView content={lesson.content} />
      </View>

      {lesson.codeExample ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Code Example</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.codeBlock}>
            <Text style={s.codeText}>{lesson.codeExample}</Text>
          </ScrollView>
        </View>
      ) : null}

      <View style={s.exerciseCard}>
        <Text style={s.exerciseLabel}>Your Exercise</Text>
        <Text style={s.exerciseBody}>{lesson.exercise}</Text>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Key Takeaways</Text>
        {lesson.keyTakeaways.map((t, i) => (
          <View key={i} style={s.takeawayRow}>
            <Text style={s.takeawayDot}>▸</Text>
            <Text style={s.takeawayText}>{t}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[s.completeBtn, completed && s.completeBtnDone]}
        onPress={handleComplete}
        disabled={completed}
      >
        <Text style={s.completeBtnText}>
          {completed ? '✓ Completed' : isLast ? 'Finish Course' : 'Complete Lesson →'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08080f' },
  content: { padding: 20, paddingBottom: 48 },

  header: { marginBottom: 20 },
  courseTag: { fontSize: 12, color: '#6b7280', fontFamily: 'monospace', marginBottom: 8 },
  lessonTitle: { fontSize: 24, fontWeight: '800', color: '#e8eaf6', lineHeight: 30 },
  meta: { flexDirection: 'row', gap: 16, marginTop: 8 },
  metaText: { fontSize: 12, color: '#6b7280', fontFamily: 'monospace' },

  card: {
    backgroundColor: '#0d0d1a', borderRadius: 16, padding: 20,
    marginBottom: 20, borderWidth: 1, borderColor: '#ffffff10',
  },

  h1: { fontSize: 20, fontWeight: '800', color: '#00d4ff', marginTop: 8, marginBottom: 10 },
  h2: { fontSize: 17, fontWeight: '700', color: '#e8eaf6', marginTop: 16, marginBottom: 8 },
  h3: { fontSize: 15, fontWeight: '700', color: '#a78bfa', marginTop: 12, marginBottom: 6 },
  para: { fontSize: 14, color: '#d1d5db', lineHeight: 24 },
  paraWrap: { marginBottom: 6 },
  bold: { fontWeight: '700', color: '#e8eaf6' },
  inlineCode: {
    backgroundColor: '#00d4ff18', color: '#00d4ff',
    fontFamily: 'monospace', fontSize: 13,
    paddingHorizontal: 4, borderRadius: 4,
  },
  bulletRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  bulletDot: { color: '#00d4ff', fontSize: 16, lineHeight: 24 },
  bulletText: { flex: 1, fontSize: 14, color: '#d1d5db', lineHeight: 24 },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#e8eaf6', marginBottom: 12 },
  codeBlock: {
    backgroundColor: '#060610', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#ffffff10',
  },
  codeText: { fontFamily: 'monospace', fontSize: 12, color: '#a78bfa', lineHeight: 20 },

  exerciseCard: {
    backgroundColor: '#7c3aed15', borderRadius: 16, padding: 20,
    marginBottom: 20, borderWidth: 1, borderColor: '#7c3aed30',
  },
  exerciseLabel: { fontSize: 13, fontWeight: '700', color: '#a78bfa', marginBottom: 10 },
  exerciseBody: { fontSize: 14, color: '#d1d5db', lineHeight: 22 },

  takeawayRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  takeawayDot: { color: '#00e57a', fontSize: 14, marginTop: 2 },
  takeawayText: { flex: 1, fontSize: 14, color: '#d1d5db', lineHeight: 22 },

  completeBtn: {
    backgroundColor: '#00d4ff', borderRadius: 999, padding: 18,
    alignItems: 'center', marginTop: 8,
  },
  completeBtnDone: {
    backgroundColor: 'transparent', borderWidth: 1, borderColor: '#00e57a50',
  },
  completeBtnText: { color: '#08080f', fontWeight: '800', fontSize: 16 },
});
