import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import BacklogScreen from './src/screens/BacklogScreen';
import CoursesScreen from './src/screens/CoursesScreen';
import CourseDetailScreen from './src/screens/CourseDetailScreen';
import LessonScreen from './src/screens/LessonScreen';
import RoadmapsScreen from './src/screens/RoadmapsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { requestPermissions } from './src/services/notifications';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DARK_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#08080f',
    card: '#0d0d1a',
    text: '#e8eaf6',
    border: '#ffffff12',
    primary: '#00d4ff',
  },
};

const TAB_ICONS: Record<string, string> = {
  Home: '🏠', Backlog: '📋', Courses: '📚', Roadmaps: '🗺️', Settings: '⚙️',
};

function CoursesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0d0d1a' },
        headerTintColor: '#e8eaf6',
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="CoursesTab" component={CoursesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: 'Course' }} />
      <Stack.Screen name="Lesson" component={LessonScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <NavigationContainer theme={DARK_THEME}>
      <StatusBar barStyle="light-content" backgroundColor="#08080f" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>{TAB_ICONS[route.name]}</Text>,
          tabBarActiveTintColor: '#00d4ff',
          tabBarInactiveTintColor: '#4b5563',
          tabBarStyle: {
            backgroundColor: '#0d0d1a',
            borderTopColor: '#ffffff10',
            paddingBottom: Platform.OS === 'ios' ? 20 : 24,
            paddingTop: 8,
            height: Platform.OS === 'ios' ? 88 : 80,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          headerStyle: { backgroundColor: '#0d0d1a' },
          headerTintColor: '#e8eaf6',
          headerTitleStyle: { fontWeight: '800' },
          headerShadowVisible: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'LearnOS' }} />
        <Tab.Screen name="Backlog" component={BacklogScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Courses" component={CoursesStack} options={{ headerShown: false }} />
        <Tab.Screen name="Roadmaps" component={RoadmapsScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
