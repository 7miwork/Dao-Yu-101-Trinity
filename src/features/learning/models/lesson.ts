/**
 * Lesson Model
 * 
 * Represents a learning unit in the Dao-Yu-101 system.
 * Each lesson contains a series of steps that students complete sequentially.
 */
export interface Lesson {
  /** Unique identifier for the lesson */
  id: string;
  
  /** Display title of the lesson */
  title: string;
  
  /** Brief description of what the lesson covers */
  description: string;
  
  /** Total number of steps in this lesson */
  totalSteps: number;
  
  /** XP reward for completing this lesson */
  xpReward: number;
  
  /** Optional icon/emoji for visual representation */
  icon?: string;
  
  /** Difficulty level of the lesson */
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  
  /** Category or subject area */
  category?: string;
  
  /** Estimated duration in minutes */
  estimatedDuration?: number;
  
  /** Order/position for rendering (used within islands) */
  order?: number;
}
