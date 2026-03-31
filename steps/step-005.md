# Step 005: Retention System (Streaks, Missions, Rewards)

## Overview

This step implements a comprehensive retention system to increase user engagement and daily return rates through gamification mechanics.

## Features Implemented

### 🔁 Daily Streak System

**Purpose**: Encourage daily learning habits by tracking consecutive days of activity.

**Logic**:
- Streak increments when user is active on consecutive days
- Streak resets to 1 if a day is missed
- Streak is updated once per session start
- Prevents multiple updates on the same day

**Implementation**:
- `streak: number` - Current streak count
- `lastActiveDate: string | null` - ISO date string (YYYY-MM-DD)
- `UPDATE_STREAK` action in reducer

**Date Utilities** (`/src/features/learning/utils/date.ts`):
```typescript
isSameDay(a: Date, b: Date): boolean
isYesterday(date: Date, reference?: Date): boolean
isToday(date: Date): boolean
toISODateString(date: Date): string
```

### 🎯 Mission System

**Purpose**: Provide daily goals to guide learning and reward progress.

**Mission Types**:
1. **Complete 2 lessons** - Reward: 50 XP
2. **Complete 5 steps** - Reward: 30 XP
3. **Earn 100 XP** - Reward: 25 XP
4. **Complete 1 island** - Reward: 100 XP

**Interface** (`/src/features/learning/models/mission.ts`):
```typescript
interface DailyMission {
  id: string;
  title: string;
  target: number;
  progress: number;
  completed: boolean;
  rewardXP: number;
  icon?: string;
  completedAt?: string;
}
```

**Actions**:
- `UPDATE_MISSIONS` - Update progress based on activity
- `COMPLETE_MISSION` - Mark mission as completed and award XP
- `LOAD_MISSIONS` - Initialize missions

### 🏆 Reward System

**Purpose**: Provide immediate feedback and motivation through XP rewards.

**Mechanics**:
- Missions award XP upon completion
- XP is added to `totalXP`
- Prevents double rewards (mission can only be completed once)
- Missions reset daily (new set of missions each day)

## State Extensions

### LearningState Additions

```typescript
interface LearningState {
  // ... existing fields
  
  // Retention System
  streak: number;
  lastActiveDate: string | null;
  missions: DailyMission[];
}
```

## UI Integration

### Student Page

**New Components**:
1. **Streak Card** - Shows current streak with fire emoji
2. **Missions Summary Card** - Shows completed/total missions
3. **Missions List** - Detailed view of all missions with progress bars

**Behavior**:
- Progress updates live when completing steps
- Completed missions show ✅ indicator
- Progress bars animate smoothly

### Teacher Page

**New Stats**:
- Current Streak (average)
- Mission Completion Rate

### Admin Page

**Engagement Indicators**:
- Current Streak
- Missions Completed (X/Y)
- Mission Completion Rate (%)
- Islands Completed

## Files Created/Modified

### New Files
- `/src/features/learning/models/mission.ts` - Mission interface
- `/src/features/learning/utils/date.ts` - Date utility functions
- `/src/features/learning/data/mockMissions.ts` - Mock mission data
- `/steps/step-005.md` - This documentation

### Modified Files
- `/src/features/learning/store/learningStore.ts` - Added state and actions
- `/src/features/learning/store/useLearning.ts` - Added hooks
- `/src/features/learning/store/LearningProvider.tsx` - Initialize missions and streak
- `/src/pages/StudentPage.tsx` - Added streak and missions UI
- `/src/pages/TeacherPage.tsx` - Added streak and mission stats
- `/src/pages/AdminPage.tsx` - Added engagement indicators

## Usage Examples

### Check Streak
```typescript
const streak = useStreak();
console.log(`Current streak: ${streak} days`);
```

### Get Missions
```typescript
const missions = useMissions();
const completed = missions.filter(m => m.completed).length;
```

### Update Missions on Activity
```typescript
dispatch({ 
  type: 'UPDATE_MISSIONS', 
  payload: { stepsCompleted: 1 } 
});
```

## Design Decisions

1. **Daily Reset**: Missions are designed to reset daily to encourage daily engagement
2. **Progress Tracking**: Missions track progress incrementally, not just completion
3. **XP Rewards**: Balanced to provide meaningful rewards without breaking progression
4. **Streak Logic**: Forgiving - only requires activity, not specific tasks
5. **UI Feedback**: Clear visual indicators for progress and completion

## Future Enhancements

- Weekly/monthly missions
- Streak milestones with bonus rewards
- Mission difficulty scaling
- Social features (compare streaks with friends)
- Push notifications for streak reminders
- Mission customization by teachers

## Testing Checklist

- [ ] Streak increments on consecutive days
- [ ] Streak resets after missing a day
- [ ] Missions update on lesson completion
- [ ] Missions update on step completion
- [ ] XP is awarded correctly
- [ ] No double rewards
- [ ] UI updates in real-time
- [ ] Persistence works correctly