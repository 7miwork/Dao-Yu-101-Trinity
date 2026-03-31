# Step 002: Learning System Core + State Architecture (v2 - XP System)

## Overview

This step implements the core learning system with a state-driven architecture using React Context and useReducer. The system manages lessons, tracks student progress with an XP reward system, and provides real-time updates across all role-based views.

## Data Models

### Lesson Model (`/src/features/learning/models/lesson.ts`)

The `Lesson` interface represents a learning unit in the system:

```typescript
interface Lesson {
  id: string;              // Unique identifier
  title: string;           // Display title
  description: string;     // Brief description
  totalSteps: number;      // Total steps in the lesson
  xpReward: number;        // XP earned on completion (NEW)
  icon?: string;           // Optional emoji/icon
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;       // Subject area
  estimatedDuration?: number; // Duration in minutes
}
```

**Design Decisions:**
- `xpReward` is required for gamification system
- XP values scale with difficulty (beginner: 50, intermediate: 75, advanced: 100)
- Enables future features like leaderboards and achievements

### Progress Model (`/src/features/learning/models/progress.ts`)

The `LessonProgress` interface tracks student advancement:

```typescript
interface LessonProgress {
  lessonId: string;        // Reference to lesson
  completedSteps: number;  // Steps completed
  completed: boolean;      // Whether lesson is fully completed (NEW)
  studentId?: string;      // Optional student identifier
  lastUpdated?: Date;      // Timestamp of last update
}
```

**Helper Functions:**
- `calculateProgressPercentage(completed, total)` - Returns 0-100 percentage
- `isLessonCompleted(completed, total)` - Checks if lesson is finished
- `createInitialProgress(lessonId)` - Creates initial progress entry

## State Architecture

### Global State Structure

```typescript
interface LearningState {
  lessons: Lesson[];        // All available lessons
  progress: LessonProgress[]; // Progress for each lesson
  totalXP: number;          // Total XP earned by student (NEW)
}
```

### Actions

```typescript
type LearningAction =
  | { type: 'LOAD_LESSONS'; payload: Lesson[] }
  | { type: 'COMPLETE_STEP'; payload: { lessonId: string } }
  | { type: 'COMPLETE_LESSON'; payload: { lessonId: string } }  // NEW
  | { type: 'RESET_PROGRESS'; payload: { lessonId: string } }
  | { type: 'LOAD_PROGRESS'; payload: LessonProgress[] };
```

### Reducer Logic (CRITICAL)

The `learningReducer` handles state transitions with XP management:

#### COMPLETE_STEP Action:
1. Find lesson by ID
2. Check if already completed (don't exceed totalSteps)
3. Increment completedSteps
4. If completedSteps === totalSteps:
   - Mark completed = true
   - Add XP (only if not already completed)
5. Return new immutable state

#### COMPLETE_LESSON Action:
1. Find lesson by ID
2. Check if already completed (prevent duplicate XP)
3. Set completedSteps = totalSteps
4. Mark completed = true
5. Add XP reward
6. Return new immutable state

**Important Rules:**
- NEVER exceed totalSteps
- NEVER give XP twice for same lesson
- Always keep state immutable
- XP is only awarded once per lesson completion

## State Management

### LearningStore (`/src/features/learning/store/learningStore.ts`)

Contains:
- State interface definition
- Action types
- Reducer function
- Context creation

### useLearning Hook (`/src/features/learning/store/useLearning.ts`)

Custom hook providing:
- Type-safe access to state and dispatch
- Error boundary for missing provider
- Helper hooks for common queries:
  - `useLessonProgress(lessonId)`
  - `useLesson(lessonId)`
  - `useCompletedLessonsCount()`
  - `useTotalStepsCompleted()`

### LearningProvider (`/src/features/learning/store/LearningProvider.tsx`)

The provider:
- Initializes state with useReducer
- Loads mock data on mount
- Creates proper progress entries with `createInitialProgress`
- Exposes state and dispatch via Context

## UI Integration

### Student Page

**Features:**
- **XP Display**: Shows total XP earned at top
- **Lesson Grid**: Displays all lessons with:
  - Title and description
  - XP reward indicator (+50 XP, +75 XP, etc.)
  - Progress bar
  - Step counter (X/Y steps)
  - "Complete Step" button (disabled when completed)
  - "✅ Completed" badge for finished lessons
- **Quick Stats**: Steps completed, lessons done, in progress

**State Usage:**
```typescript
const { state, dispatch } = useLearning();
const { lessons, progress, totalXP } = state;

// Check completion
const isCompleted = lessonProgress?.completed || false;

// Dispatch action
dispatch({ type: 'COMPLETE_STEP', payload: { lessonId } });
```

### Teacher Page

**Features:**
- **Statistics Cards**:
  - Total lessons
  - Completed lessons count
  - Average progress percentage
  - Steps completed/total ratio
- **Lesson Progress Overview**: Visual bars for each lesson with completion status
- **Recent Activity**: Mock activity feed

**Statistics Calculated:**
- Completed lessons: `progress.filter(p => p.completed).length`
- Average progress: Sum of all lesson percentages / number of lessons
- Completion rate: Total completed steps / total possible steps

### Admin Page

**Features:**
- **System Metrics**: Server, database, API, memory, CPU, storage, users, error rate
- **Learning System Stats**:
  - Total lessons
  - Progress entries
  - Steps completed
  - **Total XP Generated** (NEW)
- **System Logs**: Recent system events
- **Quick Controls**: System management buttons

## Mock Data

Located at `/src/features/learning/data/mockLessons.ts`:

```typescript
export const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to Chinese Characters',
    description: 'Learn the basics...',
    totalSteps: 5,
    xpReward: 50,  // Beginner level
    icon: '📚',
    difficulty: 'beginner',
    category: 'Characters',
    estimatedDuration: 30,
  },
  // ... more lessons with varying XP rewards
];
```

**XP Scaling:**
- Beginner lessons: 50 XP
- Intermediate lessons: 75 XP
- Advanced lessons: 100 XP

## File Structure

```
src/features/learning/
├── models/
│   ├── lesson.ts          # Lesson interface with xpReward
│   └── progress.ts        # Progress interface with completed flag
├── store/
│   ├── learningStore.ts   # State, actions, reducer, context
│   ├── LearningProvider.tsx # Provider component
│   └── useLearning.ts     # Custom hook (NEW)
└── data/
    └── mockLessons.ts     # Sample lesson data with XP
```

## Key Design Patterns

1. **Separation of Concerns**: Models, state, and UI are separate
2. **Type Safety**: Full TypeScript coverage
3. **Immutability**: Reducer returns new state objects
4. **Context Pattern**: Global state without external libraries
5. **Custom Hooks**: Encapsulated state access logic
6. **XP System**: Gamification for engagement

## Scalability Considerations

### Future Extensions Ready:
- **Islands System** (Step 003): Can add island progress to state
- **Gamification**: XP system ready for:
  - Leaderboards
  - Achievements/badges
  - Level progression
  - Rewards store
- **Backend Integration**: State structure ready for API sync
- **Multi-user**: studentId field in progress for user-specific tracking

### Adding New Features:
1. Add new action type to `LearningAction`
2. Handle in reducer
3. Update UI components
4. No need to change existing logic

## Benefits

- **No External Dependencies**: Uses only React built-ins
- **Predictable State**: Unidirectional data flow
- **Real-time Updates**: All components re-render on state change
- **Scalable**: Easy to add new actions and state properties
- **Testable**: Pure reducer functions are easy to test
- **Engaging**: XP system motivates students

## Testing the System

1. Open Student page
2. Click "Complete Step" on any lesson
3. Watch progress bar update
4. Complete all steps in a lesson
5. Verify XP is awarded (check total XP display)
6. Button changes to "✅ Completed"
7. Try clicking again - should be disabled (no duplicate XP)
8. Check Teacher page shows updated stats
9. Check Admin page shows total XP generated

## Future Enhancements

- Persist XP and progress to localStorage
- Add student-specific progress tracking
- Implement lesson ordering/dependencies
- Add quiz/assessment steps
- Backend synchronization
- Offline support with service workers
- Leaderboards and achievements
- XP-based level progression