/**
 * Local Storage Utility
 * 
 * Provides functions to persist and retrieve learning state from localStorage.
 * Handles JSON serialization/deserialization and error handling.
 */

import { LearningState } from '../store/learningStore';

const STORAGE_KEY = 'dao-yu-learning-state';

/**
 * Save learning state to localStorage
 * 
 * @param state - The learning state to persist
 */
export function saveState(state: LearningState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

/**
 * Load learning state from localStorage
 * 
 * @returns The persisted learning state, or null if not found or invalid
 */
export function loadState(): LearningState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    
    if (serialized === null) {
      return null;
    }
    
    const state = JSON.parse(serialized) as LearningState;
    
    // Validate that the state has the expected structure
    if (!isValidLearningState(state)) {
      console.warn('Invalid state structure in localStorage, ignoring');
      return null;
    }
    
    return state;
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return null;
  }
}

/**
 * Clear learning state from localStorage
 */
export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear state from localStorage:', error);
  }
}

/**
 * Validate that an object has the expected LearningState structure
 * 
 * @param state - The object to validate
 * @returns true if the object is a valid LearningState
 */
function isValidLearningState(state: unknown): state is LearningState {
  if (typeof state !== 'object' || state === null) {
    return false;
  }
  
  const s = state as Record<string, unknown>;
  
  // Check required properties exist
  if (!Array.isArray(s.lessons)) {
    return false;
  }
  
  if (typeof s.progress !== 'object' || s.progress === null) {
    return false;
  }
  
  if (typeof s.totalXP !== 'number') {
    return false;
  }
  
  if (!Array.isArray(s.islands)) {
    return false;
  }
  
  // User is optional for backward compatibility
  if (s.user !== undefined) {
    if (typeof s.user !== 'object' || s.user === null) {
      return false;
    }
    
    const user = s.user as Record<string, unknown>;
    if (typeof user.id !== 'string' || typeof user.name !== 'string') {
      return false;
    }
  }
  
  return true;
}