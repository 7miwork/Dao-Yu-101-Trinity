import { createContext, useContext } from 'react';
import { Lesson } from '../models/lesson';
import { LessonProgress } from '../models/progress';
import { Island } from '../models/island';
import { User } from '../../user/model/user';
import { DailyMission } from '../models/mission';
import { isSameDay, isYesterday, toISODateString } from '../utils/date';

/**
 * Learning State Interface
 * 
 * Global state structure for the learning system.
 */
export interface LearningState {
  /** Current user */
  user: User;
  
  /** All available lessons */
  lessons: Lesson[];
  
  /** Progress tracking for each lesson (O(1) access by lessonId) */
  progress: Record<string, LessonProgress>;
  
  /** Total XP earned by the student */
  totalXP: number;
  
  /** All available islands */
  islands: Island[];

  // Retention System
  /** Current streak count (consecutive days active) */
  streak: number;
  
  /** Last date the user was active (ISO string YYYY-MM-DD) */
  lastActiveDate: string | null;
  
  /** Daily missions for engagement */
  missions: DailyMission[];
}

/**
 * Learning Actions
 * 
 * Supported state mutations for the learning system.
 */
export type LearningAction =
  | { type: 'LOAD_LESSONS'; payload: Lesson[] }
  | { type: 'COMPLETE_STEP'; payload: { lessonId: string } }
  | { type: 'COMPLETE_LESSON'; payload: { lessonId: string } }
  | { type: 'RESET_PROGRESS'; payload: { lessonId: string } }
  | { type: 'LOAD_PROGRESS'; payload: LessonProgress[] }
  | { type: 'LOAD_ISLANDS'; payload: Island[] }
  | { type: 'UNLOCK_ISLAND'; payload: { islandId: string } }
  // Retention System Actions
  | { type: 'UPDATE_STREAK' }
  | { type: 'UPDATE_MISSIONS'; payload: { lessonCompleted?: boolean; stepsCompleted?: number; xpEarned?: number; islandsCompleted?: number } }
  | { type: 'COMPLETE_MISSION'; payload: { missionId: string } }
  | { type: 'LOAD_MISSIONS'; payload: DailyMission[] };

/**
 * Initial State
 */
export const initialLearningState: LearningState = {
  user: {
    id: '1',
    name: 'Player',
  },
  lessons: [],
  progress: {},
  totalXP: 0,
  islands: [],
  // Retention System
  streak: 0,
  lastActiveDate: null,
  missions: [],
};

/**
 * Helper to calculate XP per step
 */
function calculateXPPerStep(lesson: Lesson): number {
  return Math.round(lesson.xpReward / lesson.totalSteps);
}

/**
 * Learning Reducer
 * 
 * Pure function that handles state transitions based on actions.
 */
export function learningReducer(
  state: LearningState,
  action: LearningAction
): LearningState {
  switch (action.type) {
    case 'LOAD_LESSONS':
      return {
        ...state,
        lessons: action.payload,
      };

    case 'COMPLETE_STEP': {
      const { lessonId } = action.payload;
      const lesson = state.lessons.find(l => l.id === lessonId);
      
      if (!lesson) {
        console.warn(`Lesson with id ${lessonId} not found`);
        return state;
      }

      const existingProgress = state.progress[lessonId];
      
      if (existingProgress) {
        // Don't exceed total steps and don't update if already completed
        if (existingProgress.completedSteps >= lesson.totalSteps) {
          return state;
        }
        
        const newCompletedSteps = existingProgress.completedSteps + 1;
        const isNowCompleted = newCompletedSteps >= lesson.totalSteps;
        
        // Calculate XP gain (per step or full reward on completion)
        let xpGain = 0;
        if (isNowCompleted && !existingProgress.completed) {
          xpGain = lesson.xpReward;
        } else if (!isNowCompleted) {
          // Optional: award XP per step for future scaling
          xpGain = calculateXPPerStep(lesson);
        }
        
        return {
          ...state,
          progress: {
            ...state.progress,
            [lessonId]: {
              ...existingProgress,
              completedSteps: newCompletedSteps,
              completed: isNowCompleted,
              lastUpdated: new Date(),
            },
          },
          totalXP: state.totalXP + xpGain,
        };
      } else {
        // Create new progress entry
        const isCompleted = lesson.totalSteps === 1;
        const xpGain = isCompleted ? lesson.xpReward : calculateXPPerStep(lesson);
        
        return {
          ...state,
          progress: {
            ...state.progress,
            [lessonId]: {
              lessonId,
              completedSteps: 1,
              completed: isCompleted,
              lastUpdated: new Date(),
            },
          },
          totalXP: state.totalXP + xpGain,
        };
      }
    }

    case 'COMPLETE_LESSON': {
      const { lessonId } = action.payload;
      const lesson = state.lessons.find(l => l.id === lessonId);
      
      if (!lesson) {
        console.warn(`Lesson with id ${lessonId} not found`);
        return state;
      }

      const existingProgress = state.progress[lessonId];
      
      // If already completed, don't give XP again
      if (existingProgress?.completed) {
        return state;
      }
      
      const xpGain = lesson.xpReward;
      
      return {
        ...state,
        progress: {
          ...state.progress,
          [lessonId]: {
            lessonId,
            completedSteps: lesson.totalSteps,
            completed: true,
            lastUpdated: new Date(),
          },
        },
        totalXP: state.totalXP + xpGain,
      };
    }

    case 'RESET_PROGRESS': {
      const { lessonId } = action.payload;
      const existingProgress = state.progress[lessonId];
      const lesson = state.lessons.find(l => l.id === lessonId);
      
      // If was completed, remove the XP
      const xpToRemove = existingProgress?.completed && lesson
        ? lesson.xpReward 
        : 0;
      
      return {
        ...state,
        progress: {
          ...state.progress,
          [lessonId]: {
            lessonId,
            completedSteps: 0,
            completed: false,
            lastUpdated: new Date(),
          },
        },
        totalXP: Math.max(0, state.totalXP - xpToRemove),
      };
    }

    case 'LOAD_PROGRESS': {
      // Convert array to Record
      const progressRecord: Record<string, LessonProgress> = {};
      action.payload.forEach(p => {
        progressRecord[p.lessonId] = p;
      });
      
      return {
        ...state,
        progress: progressRecord,
      };
    }

    case 'LOAD_ISLANDS':
      return {
        ...state,
        islands: action.payload,
      };

    case 'UNLOCK_ISLAND': {
      const { islandId } = action.payload;
      
      return {
        ...state,
        islands: state.islands.map(island =>
          island.id === islandId
            ? { ...island, unlocked: true }
            : island
        ),
      };
    }

    // Retention System Cases
    case 'UPDATE_STREAK': {
      const today = new Date();
      const todayStr = toISODateString(today);
      
      // If already updated today, don't update again
      if (state.lastActiveDate && isSameDay(new Date(state.lastActiveDate), today)) {
        return state;
      }
      
      let newStreak = 1; // Default to 1 for new day
      
      if (state.lastActiveDate) {
        const lastDate = new Date(state.lastActiveDate);
        
        if (isYesterday(lastDate, today)) {
          // Consecutive day - increment streak
          newStreak = state.streak + 1;
        } else if (isSameDay(lastDate, today)) {
          // Same day - no change
          return state;
        }
        // Otherwise it's a new streak (gap > 1 day), newStreak stays 1
      }
      
      return {
        ...state,
        streak: newStreak,
        lastActiveDate: todayStr,
      };
    }

    case 'UPDATE_MISSIONS': {
      const { lessonCompleted, stepsCompleted, xpEarned, islandsCompleted } = action.payload;
      
      const updatedMissions = state.missions.map(mission => {
        if (mission.completed) return mission;
        
        let newProgress = mission.progress;
        
        // Update progress based on mission type
        if (mission.id === 'mission-lessons-2' && lessonCompleted) {
          newProgress = Math.min(mission.progress + 1, mission.target);
        } else if (mission.id === 'mission-steps-5' && stepsCompleted) {
          newProgress = Math.min(mission.progress + stepsCompleted, mission.target);
        } else if (mission.id === 'mission-xp-100' && xpEarned) {
          newProgress = Math.min(mission.progress + xpEarned, mission.target);
        } else if (mission.id === 'mission-island-1' && islandsCompleted) {
          newProgress = Math.min(mission.progress + islandsCompleted, mission.target);
        }
        
        const isCompleted = newProgress >= mission.target;
        
        return {
          ...mission,
          progress: newProgress,
          completed: isCompleted,
          completedAt: isCompleted && !mission.completed ? new Date().toISOString() : mission.completedAt,
        };
      });
      
      return {
        ...state,
        missions: updatedMissions,
      };
    }

    case 'COMPLETE_MISSION': {
      const { missionId } = action.payload;
      
      const mission = state.missions.find(m => m.id === missionId);
      if (!mission || mission.completed) {
        return state;
      }
      
      const updatedMissions = state.missions.map(m =>
        m.id === missionId
          ? { ...m, completed: true, completedAt: new Date().toISOString() }
          : m
      );
      
      return {
        ...state,
        missions: updatedMissions,
        totalXP: state.totalXP + mission.rewardXP,
      };
    }

    case 'LOAD_MISSIONS': {
      return {
        ...state,
        missions: action.payload,
      };
    }

    default:
      return state;
  }
}

/**
 * Learning Context
 * 
 * React Context for accessing learning state and dispatch.
 */
export interface LearningContextType {
  state: LearningState;
  dispatch: React.Dispatch<LearningAction>;
}

export const LearningContext = createContext<LearningContextType | undefined>(
  undefined
);