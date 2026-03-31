/**
 * Engagement Engine v1
 * 
 * Handles XP multipliers, streak bonuses, and mission reward scaling.
 * This engine provides rule-based engagement mechanics to motivate learners.
 */

// ============================================
// Types
// ============================================

export interface StreakBonusRule {
  minDays: number;
  maxDays: number;
  bonusPercent: number;
  label: string;
}

export interface XPMultiplier {
  base: number;
  streakMultiplier: number;
  dailyBonus: number;
}

export interface EngagementConfig {
  baseXPPerStep: number;
  streakBonusRules: StreakBonusRule[];
  dailyLoginBonus: number;
  missionCompletionMultiplier: number;
}

// ============================================
// Configuration
// ============================================

const DEFAULT_CONFIG: EngagementConfig = {
  baseXPPerStep: 10,
  streakBonusRules: [
    { minDays: 3, maxDays: 6, bonusPercent: 5, label: '3-Day Streak' },
    { minDays: 7, maxDays: 13, bonusPercent: 10, label: '7-Day Streak' },
    { minDays: 14, maxDays: 29, bonusPercent: 20, label: '14-Day Streak' },
    { minDays: 30, maxDays: 59, bonusPercent: 30, label: '30-Day Streak' },
    { minDays: 60, maxDays: 89, bonusPercent: 40, label: '60-Day Streak' },
    { minDays: 90, maxDays: Infinity, bonusPercent: 50, label: '90-Day Streak' },
  ],
  dailyLoginBonus: 5,
  missionCompletionMultiplier: 1.5,
};

// ============================================
// Streak Bonus Logic
// ============================================

/**
 * Calculate streak bonus percentage based on current streak
 * 
 * @param streak - Current streak days
 * @param rules - Streak bonus rules (optional, uses default if not provided)
 * @returns Bonus percentage (0-50)
 * 
 * @example
 * ```ts
 * const bonus = calculateStreakBonus(7); // Returns 10
 * const bonus = calculateStreakBonus(14); // Returns 20
 * ```
 */
export function calculateStreakBonus(
  streak: number,
  rules: StreakBonusRule[] = DEFAULT_CONFIG.streakBonusRules
): number {
  if (streak <= 0) return 0;
  
  for (const rule of rules) {
    if (streak >= rule.minDays && streak <= rule.maxDays) {
      return rule.bonusPercent;
    }
  }
  
  return 0;
}

/**
 * Get streak bonus label for display
 * 
 * @param streak - Current streak days
 * @returns Label string or null if no bonus
 */
export function getStreakBonusLabel(streak: number): string | null {
  if (streak <= 0) return null;
  
  for (const rule of DEFAULT_CONFIG.streakBonusRules) {
    if (streak >= rule.minDays && streak <= rule.maxDays) {
      return rule.label;
    }
  }
  
  return null;
}

/**
 * Get next streak milestone
 * 
 * @param streak - Current streak days
 * @returns Next milestone info or null if at max
 */
export function getNextStreakMilestone(streak: number): { days: number; bonus: number } | null {
  for (const rule of DEFAULT_CONFIG.streakBonusRules) {
    if (streak < rule.minDays) {
      return { days: rule.minDays, bonus: rule.bonusPercent };
    }
  }
  return null;
}

// ============================================
// XP Calculation
// ============================================

/**
 * Calculate XP for completing a step with all bonuses applied
 * 
 * @param baseXP - Base XP for the step (default: 10)
 * @param streak - Current streak days
 * @param isFirstStepToday - Whether this is the first step completed today
 * @returns Final XP amount with bonuses
 * 
 * @example
 * ```ts
 * const xp = calculateStepXP(10, 7, false); // 10 + 10% streak bonus = 11 XP
 * const xp = calculateStepXP(10, 7, true); // 10 + 10% streak + 5 daily = 16 XP
 * ```
 */
export function calculateStepXP(
  baseXP: number = DEFAULT_CONFIG.baseXPPerStep,
  streak: number = 0,
  isFirstStepToday: boolean = false
): number {
  const streakBonus = calculateStreakBonus(streak);
  const streakMultiplier = 1 + (streakBonus / 100);
  
  let totalXP = Math.round(baseXP * streakMultiplier);
  
  // Add daily login bonus for first step
  if (isFirstStepToday) {
    totalXP += DEFAULT_CONFIG.dailyLoginBonus;
  }
  
  return totalXP;
}

/**
 * Calculate XP for completing a mission
 * 
 * @param baseReward - Base mission reward XP
 * @param streak - Current streak days
 * @returns Final XP amount with bonuses
 */
export function calculateMissionXP(baseReward: number, streak: number = 0): number {
  const streakBonus = calculateStreakBonus(streak);
  const streakMultiplier = 1 + (streakBonus / 100);
  const missionMultiplier = DEFAULT_CONFIG.missionCompletionMultiplier;
  
  return Math.round(baseReward * streakMultiplier * missionMultiplier);
}

/**
 * Calculate XP for completing a lesson
 * 
 * @param stepsInLesson - Number of steps in the lesson
 * @param streak - Current streak days
 * @returns Total XP for completing the lesson
 */
export function calculateLessonXP(stepsInLesson: number, streak: number = 0): number {
  const baseXP = stepsInLesson * DEFAULT_CONFIG.baseXPPerStep;
  const streakBonus = calculateStreakBonus(streak);
  const streakMultiplier = 1 + (streakBonus / 100);
  
  return Math.round(baseXP * streakMultiplier);
}

// ============================================
// Engagement Metrics
// ============================================

export interface EngagementMetrics {
  totalXP: number;
  streak: number;
  streakBonus: number;
  streakLabel: string | null;
  nextMilestone: { days: number; bonus: number } | null;
  dailyBonusActive: boolean;
}

/**
 * Calculate current engagement metrics
 * 
 * @param totalXP - Total XP earned
 * @param streak - Current streak days
 * @param isFirstStepToday - Whether any step was completed today
 * @returns Engagement metrics object
 */
export function calculateEngagementMetrics(
  totalXP: number,
  streak: number,
  isFirstStepToday: boolean = false
): EngagementMetrics {
  return {
    totalXP,
    streak,
    streakBonus: calculateStreakBonus(streak),
    streakLabel: getStreakBonusLabel(streak),
    nextMilestone: getNextStreakMilestone(streak),
    dailyBonusActive: isFirstStepToday,
  };
}

// ============================================
// Reward Scaling
// ============================================

/**
 * Scale reward based on difficulty and engagement
 * 
 * @param baseReward - Base reward amount
 * @param difficulty - Difficulty multiplier (1-5)
 * @param streak - Current streak days
 * @returns Scaled reward
 */
export function scaleReward(
  baseReward: number,
  difficulty: number = 1,
  streak: number = 0
): number {
  const difficultyMultiplier = 1 + (difficulty - 1) * 0.2; // 1.0 to 1.8
  const streakBonus = calculateStreakBonus(streak);
  const streakMultiplier = 1 + (streakBonus / 100);
  
  return Math.round(baseReward * difficultyMultiplier * streakMultiplier);
}

// ============================================
// Exports
// ============================================

export const engagementEngine = {
  calculateStreakBonus,
  getStreakBonusLabel,
  getNextStreakMilestone,
  calculateStepXP,
  calculateMissionXP,
  calculateLessonXP,
  calculateEngagementMetrics,
  scaleReward,
  config: DEFAULT_CONFIG,
};

export default engagementEngine;