/**
 * Island Unlock Condition
 * 
 * Defines conditions required to unlock an island.
 */
export interface IslandUnlockCondition {
  /** Type of condition */
  type: 'lessonCompletion' | 'requiredXP' | 'islandCompletion';
  
  /** Target value (lesson ID, XP amount, or island ID) */
  target: string | number;
}

/**
 * Island Model
 * 
 * Represents a learning island in the Dao-Yu-101 gamification system.
 * Islands group related lessons together and provide a progression path.
 */
export interface Island {
  /** Unique identifier for the island */
  id: string;
  
  /** Display title of the island */
  title: string;
  
  /** Description of what the island covers */
  description: string;
  
  /** Ordered list of lesson IDs contained in this island */
  lessonIds: string[];
  
  /** Whether the island is unlocked and accessible */
  unlocked: boolean;
  
  /** Optional icon/emoji for visual representation */
  icon?: string;
  
  /** Optional theme color for the island */
  color?: string;
  
  /** Order/position in the learning path */
  order?: number;
  
  /** Conditions required to unlock this island */
  unlockConditions?: IslandUnlockCondition[];
}

/**
 * Helper function to calculate island progress
 */
export function calculateIslandProgress(
  island: Island,
  lessonProgress: Record<string, { completed: boolean }>
): number {
  if (island.lessonIds.length === 0) return 0;
  
  const completedCount = island.lessonIds.filter(
    lessonId => lessonProgress[lessonId]?.completed
  ).length;
  
  return Math.round((completedCount / island.lessonIds.length) * 100);
}

/**
 * Helper function to check if all lessons in an island are completed
 */
export function isIslandCompleted(
  island: Island,
  lessonProgress: Record<string, { completed: boolean }>
): boolean {
  return island.lessonIds.every(
    lessonId => lessonProgress[lessonId]?.completed
  );
}

/**
 * Helper function to get completed lessons count in an island
 */
export function getIslandCompletedLessonsCount(
  island: Island,
  lessonProgress: Record<string, { completed: boolean }>
): number {
  return island.lessonIds.filter(
    lessonId => lessonProgress[lessonId]?.completed
  ).length;
}

/**
 * Helper function to check if unlock conditions are met
 */
export function areUnlockConditionsMet(
  conditions: IslandUnlockCondition[],
  lessonProgress: Record<string, { completed: boolean }>,
  totalXP: number,
  islands: Island[]
): boolean {
  if (!conditions || conditions.length === 0) return true;
  
  return conditions.every(condition => {
    switch (condition.type) {
      case 'lessonCompletion':
        return lessonProgress[condition.target as string]?.completed === true;
      
      case 'requiredXP':
        return totalXP >= (condition.target as number);
      
      case 'islandCompletion':
        const targetIsland = islands.find(i => i.id === condition.target);
        if (!targetIsland) return false;
        return targetIsland.lessonIds.every(
          lessonId => lessonProgress[lessonId]?.completed
        );
      
      default:
        return false;
    }
  });
}
