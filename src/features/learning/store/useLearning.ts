import { useContext, useMemo } from 'react';
import { LearningContext, LearningContextType } from './learningStore';
import { calculateProgressPercentage } from '../models/progress';
import { calculateIslandProgress, getIslandCompletedLessonsCount } from '../models/island';

/**
 * Custom hook to access learning context
 * 
 * Provides type-safe access to learning state and dispatch.
 * Throws error if used outside of LearningProvider.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { state, dispatch } = useLearning();
 *   
 *   const handleCompleteStep = (lessonId: string) => {
 *     dispatch({ type: 'COMPLETE_STEP', payload: { lessonId } });
 *   };
 *   
 *   return <div>Total XP: {state.totalXP}</div>;
 * }
 * ```
 */
export function useLearning(): LearningContextType {
  const context = useContext(LearningContext);
  
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  
  return context;
}

/**
 * Helper hook to get progress for a specific lesson (O(1) access)
 */
export function useLessonProgress(lessonId: string) {
  const { state } = useLearning();
  return state.progress[lessonId];
}

/**
 * Helper hook to get lesson by ID
 */
export function useLesson(lessonId: string) {
  const { state } = useLearning();
  return state.lessons.find(l => l.id === lessonId);
}

/**
 * Helper hook to get completed lessons count (derived)
 */
export function useCompletedLessonsCount() {
  const { state } = useLearning();
  
  return useMemo(() => {
    return Object.values(state.progress).filter(p => p.completed).length;
  }, [state.progress]);
}

/**
 * Helper hook to get total steps completed (derived)
 */
export function useTotalStepsCompleted() {
  const { state } = useLearning();
  
  return useMemo(() => {
    return Object.values(state.progress).reduce((sum, p) => sum + p.completedSteps, 0);
  }, [state.progress]);
}

/**
 * Helper hook to get total lessons count (derived)
 */
export function useTotalLessonsCount() {
  const { state } = useLearning();
  return state.lessons.length;
}

/**
 * Helper hook to get average progress percentage (derived)
 */
export function useAverageProgress() {
  const { state } = useLearning();
  
  return useMemo(() => {
    if (state.lessons.length === 0) return 0;
    
    const totalProgress = state.lessons.reduce((sum, lesson) => {
      const lessonProgress = state.progress[lesson.id];
      const completedSteps = lessonProgress?.completedSteps || 0;
      return sum + calculateProgressPercentage(completedSteps, lesson.totalSteps);
    }, 0);
    
    return Math.round(totalProgress / state.lessons.length);
  }, [state.lessons, state.progress]);
}

/**
 * Helper hook to get total possible steps (derived)
 */
export function useTotalPossibleSteps() {
  const { state } = useLearning();
  
  return useMemo(() => {
    return state.lessons.reduce((sum, lesson) => sum + lesson.totalSteps, 0);
  }, [state.lessons]);
}

/**
 * Helper hook to get completion percentage (derived)
 */
export function useCompletionPercentage() {
  const { state } = useLearning();
  
  return useMemo(() => {
    const totalSteps = state.lessons.reduce((sum, lesson) => sum + lesson.totalSteps, 0);
    if (totalSteps === 0) return 0;
    
    const completedSteps = Object.values(state.progress).reduce((sum, p) => sum + p.completedSteps, 0);
    return Math.round((completedSteps / totalSteps) * 100);
  }, [state.lessons, state.progress]);
}

/**
 * Helper hook to check if a lesson is completed
 */
export function useIsLessonCompleted(lessonId: string) {
  const progress = useLessonProgress(lessonId);
  return progress?.completed || false;
}

/**
 * Helper hook to get lesson progress percentage
 */
export function useLessonProgressPercentage(lessonId: string) {
  const { state } = useLearning();
  const lesson = useLesson(lessonId);
  const progress = useLessonProgress(lessonId);
  
  if (!lesson) return 0;
  
  const completedSteps = progress?.completedSteps || 0;
  return calculateProgressPercentage(completedSteps, lesson.totalSteps);
}

/**
 * Helper hook to get all islands
 */
export function useIslands() {
  const { state } = useLearning();
  return state.islands;
}

/**
 * Helper hook to get island by ID
 */
export function useIsland(islandId: string) {
  const { state } = useLearning();
  return state.islands.find(i => i.id === islandId);
}

/**
 * Helper hook to get island progress percentage
 */
export function useIslandProgressPercentage(islandId: string) {
  const { state } = useLearning();
  const island = useIsland(islandId);
  
  if (!island) return 0;
  
  return calculateIslandProgress(island, state.progress);
}

/**
 * Helper hook to get completed lessons count in an island
 */
export function useIslandCompletedLessonsCount(islandId: string) {
  const { state } = useLearning();
  const island = useIsland(islandId);
  
  if (!island) return 0;
  
  return getIslandCompletedLessonsCount(island, state.progress);
}

/**
 * Helper hook to check if island is completed
 */
export function useIsIslandCompleted(islandId: string) {
  const { state } = useLearning();
  const island = useIsland(islandId);
  
  if (!island) return false;
  
  return island.lessonIds.every(
    lessonId => state.progress[lessonId]?.completed
  );
}

/**
 * Helper hook to get unlocked islands count
 */
export function useUnlockedIslandsCount() {
  const { state } = useLearning();
  return state.islands.filter(i => i.unlocked).length;
}

/**
 * Helper hook to get completed islands count
 */
export function useCompletedIslandsCount() {
  const { state } = useLearning();
  
  return useMemo(() => {
    return state.islands.filter(island =>
      island.lessonIds.every(lessonId => state.progress[lessonId]?.completed)
    ).length;
  }, [state.islands, state.progress]);
}

/**
 * XP thresholds for each level
 * Level 1: 0 XP
 * Level 2: 100 XP
 * Level 3: 250 XP
 * Level 4: 500 XP
 * Level 5: 1000 XP
 * etc.
 */
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500];

/**
 * Helper function to calculate level from total XP
 */
export function calculateLevel(totalXP: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
}

/**
 * Helper function to get XP needed for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    // Beyond defined levels, use exponential growth
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 
           (currentLevel - LEVEL_THRESHOLDS.length + 1) * 2500;
  }
  return LEVEL_THRESHOLDS[currentLevel];
}

/**
 * Helper function to get XP progress within current level
 */
export function getXPProgressInLevel(totalXP: number, currentLevel: number): number {
  const currentThreshold = currentLevel > 1 ? LEVEL_THRESHOLDS[currentLevel - 1] : 0;
  const nextThreshold = getXPForNextLevel(currentLevel);
  const xpInLevel = totalXP - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;
  return Math.round((xpInLevel / xpNeeded) * 100);
}

/**
 * Helper hook to get current level
 */
export function useCurrentLevel() {
  const { state } = useLearning();
  return calculateLevel(state.totalXP);
}

/**
 * Helper hook to get XP progress info
 */
export function useXPProgress() {
  const { state } = useLearning();
  const currentLevel = calculateLevel(state.totalXP);
  const nextLevelXP = getXPForNextLevel(currentLevel);
  const progressPercent = getXPProgressInLevel(state.totalXP, currentLevel);
  
  return {
    currentLevel,
    totalXP: state.totalXP,
    nextLevelXP,
    xpNeeded: nextLevelXP - state.totalXP,
    progressPercent,
  };
}

// ============================================
// Retention System Hooks
// ============================================

/**
 * Helper hook to get current streak
 */
export function useStreak() {
  const { state } = useLearning();
  return state.streak;
}

/**
 * Helper hook to get last active date
 */
export function useLastActiveDate() {
  const { state } = useLearning();
  return state.lastActiveDate;
}

/**
 * Helper hook to get all missions
 */
export function useMissions() {
  const { state } = useLearning();
  return state.missions;
}

/**
 * Helper hook to get completed missions count
 */
export function useCompletedMissionsCount() {
  const { state } = useLearning();
  
  return useMemo(() => {
    return state.missions.filter(m => m.completed).length;
  }, [state.missions]);
}

/**
 * Helper hook to get total missions count
 */
export function useTotalMissionsCount() {
  const { state } = useLearning();
  return state.missions.length;
}

/**
 * Helper hook to get mission completion rate
 */
export function useMissionCompletionRate() {
  const { state } = useLearning();
  
  return useMemo(() => {
    if (state.missions.length === 0) return 0;
    const completed = state.missions.filter(m => m.completed).length;
    return Math.round((completed / state.missions.length) * 100);
  }, [state.missions]);
}

/**
 * Helper hook to get total XP earned from missions
 */
export function useMissionXPEarned() {
  const { state } = useLearning();
  
  return useMemo(() => {
    return state.missions
      .filter(m => m.completed)
      .reduce((sum, m) => sum + m.rewardXP, 0);
  }, [state.missions]);
}
