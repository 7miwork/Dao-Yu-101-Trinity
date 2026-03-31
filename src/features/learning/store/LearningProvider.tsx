import React, { useReducer, useEffect, ReactNode } from 'react';
import {
  LearningContext,
  learningReducer,
  initialLearningState,
} from './learningStore';
import { mockLessons } from '../data/mockLessons';
import { mockIslands } from '../data/mockIslands';
import { initializeMissions } from '../data/mockMissions';
import { createInitialProgress } from '../models/progress';
import { areUnlockConditionsMet } from '../models/island';
import { saveState, loadState } from '../utils/storage';

interface LearningProviderProps {
  children: ReactNode;
}

/**
 * Learning Provider Component
 * 
 * Wraps the application and provides learning state to all child components.
 * Automatically loads mock data on mount for development.
 */
export function LearningProvider({ children }: LearningProviderProps) {
  // Try to load persisted state, otherwise use initial state
  const persistedState = loadState();
  const [state, dispatch] = useReducer(
    learningReducer,
    persistedState || initialLearningState
  );

  // Load mock data on mount (only if no persisted state)
  useEffect(() => {
    // If we have persisted state with lessons, skip loading mock data
    if (persistedState && persistedState.lessons.length > 0) {
      // Still update streak on app start
      dispatch({ type: 'UPDATE_STREAK' });
      return;
    }
    
    // Load lessons
    dispatch({ type: 'LOAD_LESSONS', payload: mockLessons });
    
    // Load islands
    dispatch({ type: 'LOAD_ISLANDS', payload: mockIslands });
    
    // Initialize progress for all lessons with proper structure
    // LOAD_PROGRESS will convert array to Record internally
    const initialProgress = mockLessons.map(lesson => createInitialProgress(lesson.id));
    dispatch({ type: 'LOAD_PROGRESS', payload: initialProgress });
    
    // Initialize missions
    const initialMissions = initializeMissions();
    dispatch({ type: 'LOAD_MISSIONS', payload: initialMissions });
    
    // Update streak on first load
    dispatch({ type: 'UPDATE_STREAK' });
  }, []);

  // Auto-save state to localStorage whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Auto-unlock islands when unlock conditions are met
  useEffect(() => {
    const { islands, progress, totalXP } = state;
    
    islands.forEach((island) => {
      // Skip already unlocked islands
      if (island.unlocked) return;
      
      // Check if unlock conditions are met
      if (island.unlockConditions && island.unlockConditions.length > 0) {
        const conditionsMet = areUnlockConditionsMet(
          island.unlockConditions,
          progress,
          totalXP,
          islands
        );
        
        if (conditionsMet) {
          dispatch({ type: 'UNLOCK_ISLAND', payload: { islandId: island.id } });
        }
      }
    });
  }, [state.islands, state.progress, state.totalXP]);

  return (
    <LearningContext.Provider value={{ state, dispatch }}>
      {children}
    </LearningContext.Provider>
  );
}
