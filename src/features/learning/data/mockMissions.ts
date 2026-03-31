import { DailyMission } from '../models/mission';

/**
 * Mock Daily Missions
 * 
 * Default missions that students can complete each day for XP rewards.
 */
export const mockMissions: Omit<DailyMission, 'progress' | 'completed' | 'completedAt'>[] = [
  {
    id: 'mission-lessons-2',
    title: 'Complete 2 lessons',
    target: 2,
    rewardXP: 50,
    icon: '📚',
  },
  {
    id: 'mission-steps-5',
    title: 'Complete 5 steps',
    target: 5,
    rewardXP: 30,
    icon: '👣',
  },
  {
    id: 'mission-xp-100',
    title: 'Earn 100 XP',
    target: 100,
    rewardXP: 25,
    icon: '⭐',
  },
  {
    id: 'mission-island-1',
    title: 'Complete 1 island',
    target: 1,
    rewardXP: 100,
    icon: '🏝️',
  },
];

/**
 * Initialize missions with default progress values
 * @returns Array of missions ready to use
 */
export function initializeMissions(): DailyMission[] {
  return mockMissions.map(mission => ({
    ...mission,
    progress: 0,
    completed: false,
  }));
}