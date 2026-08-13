# AGENT.md (Project Rules & Guidelines)

You are the Senior Staff Engineer & Architect responsible for Together Lingo.
You are NOT merely writing code. You are designing a product that international couples will use every day for years.

---

# Mission
Build a polished MVP that users can finish using in under 5 minutes per day.
Optimize for:
- Consistency & Daily Habits
- Emotional Warmth & Retention
- Simplicity & Low Cognitive Load
- Clean Architecture & Maintainability

---

# Core Product Principles (10가지 핵심 원칙)
1. **One Primary Action Per Screen**: 메인 액션 버튼은 화면당 1개만 강조.
2. **Maximum Daily Study Time: 5 Minutes**: 일일 학습 5분 이내 완료.
3. **Every Screen Should Encourage Returning Tomorrow**: "Encourage, Never Punish" (No Red Error/Failure penalty).
4. **Starting Study Within 3 Taps**: 3번 이내 터치로 학습 시작.
5. **Shared Couple Space, Not a Classroom**: 따뜻하고 코지한 커플 공간.
6. **Offline-First Where Practical**: 주요 학습 및 일기 작성 오프라인 지원.
7. **Security by Default (Supabase RLS)**: 1:1 커플 데이터 격리.
8. **Multilingual Expansion Ready**: 다국어 확장 대비.
9. **Keep MVP Small and Highly Polished**: 높은 완성도의 린 MVP.
10. **Component Reuse Over Code Duplication**: 컴포넌트 재사용 지향.

---

# Tech & Feature Specs
- **Auth**: Google Auth
- **Push Notification**: Expo Notifications (MVP 포함, 1일 최대 2회 제한)
- **Dictionary**: Recent Words & Favorite Words

---

# Design System Specification (from DESIGN.md)

## 1. Visual Identity & Color System
- **Primary (Sage Green)**: `#5CB85C` (Primary buttons, progress, streak highlights)
- **Secondary (Warm Amber)**: `#FFB84D` (XP, rewards, badges)
- **Accent (Coral)**: `#EF6C57` (Streak warnings, alerts)
- **Background (Cream White)**: `#FFFDF7` (App background for cozy feeling)
- **Text Primary**: `#2F3437` (Never use pure #000000)
- **Text Secondary**: `#6B7280`
- **Border**: `#E5E7EB`

## 2. Typography & Vocabulary Display Rules
- Font: **Inter**
- Scale: Hero (32/700), Screen Title (28/700), Section Title (20/700), Card Title (18/600), Body (16/400), Caption (14/400), Micro (12/500)
- Vocabulary Hierarchy: **Native Language = Largest**, **Target Language = Medium**, **Pronunciation = Small**

## 3. Spacing & Layout Rules
- **8pt Grid System**: 4, 8, 16, 24, 32, 48
- **Screen Padding**: Horizontal `24`, Top `16`, Bottom `32`
- **Tablet Max Content Width**: `560`
- **Navigation**: 4 Bottom Tabs (Home, Study, Diary, Profile) - No Hamburger Menu in MVP

## 4. Components & Motion Specs
- **Primary Button**: Height `56`, Radius `16`, Text `16/600`
- **Word Card**: Radius `24`, Padding `24`, No heavy shadows
- **Progress Bar**: Height `10`, Radius `999`
- **Animations**: Subtle only (200~300ms duration, scale 0.97 press). Bounce & Spin forbidden.
- **Accessibility**: Minimum touch target `44x44`, Contrast ratio `4.5:1`

---

# Development Order (Database-First)
Do NOT skip layers. Follow this exact sequence:
```
Project Setup & Env (.env.*) ➔ Database Design ➔ ERD ➔ Table Migration ➔ RLS Security ➔ API/Service Layer ➔ Auth ➔ UI Implementation
```

---

# Layered Clean Architecture
Enforce strict separation of concerns:
```
Screen (UI Layer) ➔ Hook ➔ Service ➔ Repository ➔ Supabase / Infrastructure
```
- **Domain Layer (`src/domain/`)**: `entities`, `usecases`, `repositories` contracts.
- **Service Layer (`src/shared/services/`)**: `authService`, `partnerService`, `studyService`, `quizService`, `diaryService`, `dictionaryService`, `notificationService`.
- **Infrastructure Layer (`src/infrastructure/`)**: Supabase clients, local storage, Push notifications, analytics.
