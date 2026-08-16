import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BacklogItem {
  id: string;
  title: string;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  startedAt: string;
  lastAccessedAt: string;
}

export interface StudyStreak {
  currentStreak: number;
  lastStudyDate: string;
  totalDays: number;
}

const KEYS = {
  BACKLOG: 'learnos_backlog',
  PROGRESS: 'learnos_progress',
  STREAK: 'learnos_streak',
  REMINDER_TIME: 'learnos_reminder_time',
  TOTAL_MINUTES: 'learnos_total_minutes',
};

// ── Backlog ────────────────────────────────────────────────
export async function getBacklog(): Promise<BacklogItem[]> {
  const raw = await AsyncStorage.getItem(KEYS.BACKLOG);
  return raw ? JSON.parse(raw) : [];
}

export async function saveBacklog(items: BacklogItem[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.BACKLOG, JSON.stringify(items));
}

export async function addBacklogItem(item: Omit<BacklogItem, 'id' | 'createdAt'>): Promise<BacklogItem> {
  const items = await getBacklog();
  const newItem: BacklogItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  await saveBacklog([newItem, ...items]);
  return newItem;
}

export async function removeBacklogItem(id: string): Promise<void> {
  const items = await getBacklog();
  await saveBacklog(items.filter(i => i.id !== id));
}

// ── Course Progress ────────────────────────────────────────
export async function getAllProgress(): Promise<Record<string, CourseProgress>> {
  const raw = await AsyncStorage.getItem(KEYS.PROGRESS);
  return raw ? JSON.parse(raw) : {};
}

export async function getCourseProgress(courseId: string): Promise<CourseProgress | null> {
  const all = await getAllProgress();
  return all[courseId] || null;
}

export async function markLessonComplete(courseId: string, lessonId: string): Promise<void> {
  const all = await getAllProgress();
  const existing = all[courseId];
  const now = new Date().toISOString();

  if (!existing) {
    all[courseId] = {
      courseId,
      completedLessons: [lessonId],
      startedAt: now,
      lastAccessedAt: now,
    };
  } else {
    all[courseId] = {
      ...existing,
      completedLessons: Array.from(new Set([...existing.completedLessons, lessonId])),
      lastAccessedAt: now,
    };
  }

  await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify(all));
  await updateStreak();
}

// ── Streak ─────────────────────────────────────────────────
export async function getStreak(): Promise<StudyStreak> {
  const raw = await AsyncStorage.getItem(KEYS.STREAK);
  return raw ? JSON.parse(raw) : { currentStreak: 0, lastStudyDate: '', totalDays: 0 };
}

async function updateStreak(): Promise<void> {
  const streak = await getStreak();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (streak.lastStudyDate === today) return; // already studied today

  const newStreak: StudyStreak = {
    currentStreak: streak.lastStudyDate === yesterday ? streak.currentStreak + 1 : 1,
    lastStudyDate: today,
    totalDays: streak.totalDays + 1,
  };

  await AsyncStorage.setItem(KEYS.STREAK, JSON.stringify(newStreak));
}

// ── Settings ───────────────────────────────────────────────
export async function getReminderTime(): Promise<string> {
  return (await AsyncStorage.getItem(KEYS.REMINDER_TIME)) || '20:00';
}

export async function setReminderTime(time: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.REMINDER_TIME, time);
}

export async function getTotalStudyMinutes(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.TOTAL_MINUTES);
  return raw ? parseInt(raw) : 0;
}

export async function addStudyMinutes(minutes: number): Promise<void> {
  const current = await getTotalStudyMinutes();
  await AsyncStorage.setItem(KEYS.TOTAL_MINUTES, String(current + minutes));
}
