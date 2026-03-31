/**
 * Mission Generator
 * 
 * Rule-based mission generation system.
 * Generates dynamic missions based on user progress and state.
 */

// ============================================
// Types
// ============================================

export interface MissionTemplate {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  icon: string;
  targetGenerator: (context: MissionContext) => number;
  rewardXPGenerator: (context: MissionContext) => number;
  condition?: (context: MissionContext) => boolean;
}

export type MissionType = 
  | 'complete_lessons'
  | 'gain_xp'
  | 'unlock_island'
  | 'maintain_streak'
  | 'complete_steps'
  | 'daily_login';

export interface MissionContext {
  completedLessons: number;
  totalLessons: number;
  totalXP: number;
  streak: number;
  unlockedIslands: number;
  totalIslands: number;
  totalStepsCompleted: number;
  currentLevel: number;
}

export interface GeneratedMission {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  icon: string;
  target: number;
  progress: number;
  rewardXP: number;
  completed: boolean;
}

// ============================================
// Mission Templates
// ============================================

const MISSION_TEMPLATES: MissionTemplate[] = [
  {
    id: 'complete_lessons_2',
    type: 'complete_lessons',
    title: 'Complete 2 Lessons',
    description: 'Finish any 2 lessons today',
    icon: '📚',
    targetGenerator: () => 2,
    rewardXPGenerator: () => 50,
  },
  {
    id: 'complete_lessons_5',
    type: 'complete_lessons',
    title: 'Complete 5 Lessons',
    description: 'Finish any 5 lessons',
    icon: '📖',
    targetGenerator: () => 5,
    rewardXPGenerator: () => 100,
    condition: (ctx) => ctx.completedLessons >= 2,
  },
  {
    id: 'gain_xp_50',
    type: 'gain_xp',
    title: 'Gain 50 XP',
    description: 'Earn 50 experience points',
    icon: '⭐',
    targetGenerator: () => 50,
    rewardXPGenerator: () => 25,
  },
  {
    id: 'gain_xp_100',
    type: 'gain_xp',
    title: 'Gain 100 XP',
    description: 'Earn 100 experience points',
    icon: '🌟',
    targetGenerator: () => 100,
    rewardXPGenerator: () => 50,
    condition: (ctx) => ctx.totalXP >= 50,
  },
  {
    id: 'gain_xp_250',
    type: 'gain_xp',
    title: 'Gain 250 XP',
    description: 'Earn 250 experience points',
    icon: '💫',
    targetGenerator: () => 250,
    rewardXPGenerator: () => 100,
    condition: (ctx) => ctx.totalXP >= 100,
  },
  {
    id: 'complete_steps_10',
    type: 'complete_steps',
    title: 'Complete 10 Steps',
    description: 'Finish 10 learning steps',
    icon: '👣',
    targetGenerator: () => 10,
    rewardXPGenerator: () => 30,
  },
  {
    id: 'complete_steps_25',
    type: 'complete_steps',
    title: 'Complete 25 Steps',
    description: 'Finish 25 learning steps',
    icon: '🦶',
    targetGenerator: () => 25,
    rewardXPGenerator: () => 75,
    condition: (ctx) => ctx.totalStepsCompleted >= 10,
  },
  {
    id: 'maintain_streak_3',
    type: 'maintain_streak',
    title: '3-Day Streak',
    description: 'Learn for 3 days in a row',
    icon: '🔥',
    targetGenerator: () => 3,
    rewardXPGenerator: () => 75,
  },
  {
    id: 'maintain_streak_7',
    type: 'maintain_streak',
    title: '7-Day Streak',
    description: 'Learn for 7 days in a row',
    icon: '🔥🔥',
    targetGenerator: () => 7,
    rewardXPGenerator: () => 150,
    condition: (ctx) => ctx.streak >= 3,
  },
  {
    id: 'unlock_island',
    type: 'unlock_island',
    title: 'Unlock New Island',
    description: 'Unlock a new learning island',
    icon: '🏝️',
    targetGenerator: () => 1,
    rewardXPGenerator: () => 100,
    condition: (ctx) => ctx.unlockedIslands < ctx.totalIslands,
  },
  {
    id: 'daily_login',
    type: 'daily_login',
    title: 'Daily Login',
    description: 'Log in and start learning',
    icon: '🌅',
    targetGenerator: () => 1,
    rewardXPGenerator: () => 10,
  },
];

// ============================================
// Mission Generator Functions
// ============================================

/**
 * Generate missions based on current context
 * 
 * @param context - Current user progress context
 * @param count - Number of missions to generate (default: 3)
 * @returns Array of generated missions
 */
export function generateMissions(
  context: MissionContext,
  count: number = 3
): GeneratedMission[] {
  // Filter templates by conditions
  const eligibleTemplates = MISSION_TEMPLATES.filter(template => {
    if (!template.condition) return true;
    return template.condition(context);
  });

  // Shuffle and select templates
  const shuffled = shuffleArray([...eligibleTemplates]);
  const selectedTemplates = shuffled.slice(0, count);

  // Generate missions from templates
  return selectedTemplates.map(template => {
    const target = template.targetGenerator(context);
    const rewardXP = template.rewardXPGenerator(context);
    const progress = calculateProgress(template.type, context, target);

    return {
      id: `${template.id}_${Date.now()}`,
      type: template.type,
      title: template.title,
      description: template.description,
      icon: template.icon,
      target,
      progress,
      rewardXP,
      completed: progress >= target,
    };
  });
}

/**
 * Calculate progress for a mission type
 */
function calculateProgress(
  type: MissionType,
  context: MissionContext,
  target: number
): number {
  switch (type) {
    case 'complete_lessons':
      return Math.min(context.completedLessons, target);
    case 'gain_xp':
      return Math.min(context.totalXP, target);
    case 'unlock_island':
      return Math.min(context.unlockedIslands, target);
    case 'maintain_streak':
      return Math.min(context.streak, target);
    case 'complete_steps':
      return Math.min(context.totalStepsCompleted, target);
    case 'daily_login':
      return 1; // Always complete if generated
    default:
      return 0;
  }
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Update mission progress based on context
 * 
 * @param missions - Current missions
 * @param context - Updated context
 * @returns Updated missions with new progress
 */
export function updateMissionProgress(
  missions: GeneratedMission[],
  context: MissionContext
): GeneratedMission[] {
  return missions.map(mission => {
    const progress = calculateProgress(mission.type, context, mission.target);
    return {
      ...mission,
      progress,
      completed: progress >= mission.target,
    };
  });
}

/**
 * Check if a mission should be replaced
 * 
 * @param mission - Mission to check
 * @param context - Current context
 * @returns True if mission should be replaced
 */
export function shouldReplaceMission(
  mission: GeneratedMission,
  context: MissionContext
): boolean {
  // Replace completed missions
  if (mission.completed) return true;
  
  // Replace missions that can no longer be completed
  const template = MISSION_TEMPLATES.find(t => t.id === mission.id.split('_')[0]);
  if (template?.condition && !template.condition(context)) {
    return true;
  }
  
  return false;
}

// ============================================
// Exports
// ============================================

export const missionGenerator = {
  generateMissions,
  updateMissionProgress,
  shouldReplaceMission,
  templates: MISSION_TEMPLATES,
};

export default missionGenerator;