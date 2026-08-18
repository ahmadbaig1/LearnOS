# LearnOS

An Android learning companion app built with Expo and React Native. LearnOS helps you track courses, follow structured roadmaps, work through lessons with quizzes, and manage a learning backlog — all in a clean dark-themed UI.

## Features

- **Home dashboard** — overview of your active learning at a glance
- **Courses** — browse and track courses with progress indicators
- **Roadmaps** — structured learning paths to follow step by step
- **Lessons** — read lesson content with an integrated quiz flow
- **Backlog** — queue up things you want to learn later
- **Settings** — personalise your experience
- **Dark theme** — easy on the eyes for long study sessions

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | [Expo](https://expo.dev) SDK 57 |
| UI | React Native 0.86 |
| Navigation | React Navigation (Bottom Tabs + Native Stack) |
| Storage | AsyncStorage |
| Markdown | react-native-markdown-display |
| Build | EAS Build |

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo`)
- Android emulator or physical device

### Install

```bash
git clone https://github.com/ahmadbaig1/LearnOS.git
cd LearnOS
npm install
```

### Run

```bash
npx expo start
```

Press `a` to open on Android emulator, or scan the QR code with the Expo Go app on your device.

### Build APK

```bash
eas build --platform android --profile preview
```

## Project Structure

```
LearnOS/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── CoursesScreen.tsx
│   │   ├── CourseDetailScreen.tsx
│   │   ├── LessonScreen.tsx
│   │   ├── RoadmapsScreen.tsx
│   │   ├── BacklogScreen.tsx
│   │   └── SettingsScreen.tsx
│   └── data/
│       └── quizzes.ts
├── assets/
├── App.tsx
├── app.json
└── eas.json
```

## Requirements

- Android 6.0+ (API level 23)
- Expo Go app (for development) or standalone APK

## Author

**Ahmad Baig** — [linkedin.com/in/ahmad-baig-4b425ba8](https://linkedin.com/in/ahmad-baig-4b425ba8) · [github.com/ahmadbaig1](https://github.com/ahmadbaig1)

## License

MIT
