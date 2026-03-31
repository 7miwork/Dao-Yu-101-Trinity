/**
 * Daily Mission Interface
 * 
 * Represents a daily mission that students can complete for XP rewards.
 */
export interface DailyMission {
  /** Unique identifier for the mission */
  id: string;
  
  /** Display title of the mission */
  title: string;
  
  /** Target value to complete the mission */
  target: number;
  
  /** Current progress towards the target */
  progress: number;
  
  /** Whether the mission has been completed */
  completed: boolean;
  
  /** XP reward for completing the mission */
  rewardXP: number;
  
  /** Optional icon for the mission */
  icon?: string;
  
  /** Date when the mission was completed (ISO string) */
  completedAt?: string;
}