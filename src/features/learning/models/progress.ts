/**
 * Progress Model
 * 
 * Tracks a student's progress through a specific lesson.
 * Each progress entry corresponds to one lesson for one student.
 */
export interface LessonProgress {
  /** ID of the lesson this progress belongs to */
  lessonId: string;
  
  /** Number of steps completed by the student */
  completedSteps: number;
  
  /** Whether the lesson is fully completed */
  completed: boolean;
  
  /** Optional: ID of the student (for multi-user scenarios) */
  studentId?: string;
  
  /** Optional: Timestamp of last progress update */
  lastUpdated?: Date;
}

/**
 * Helper function to calculate progress percentage
 */
export function calculateProgressPercentage(
  completedSteps: number,
  totalSteps: number
): number {
  if (totalSteps === 0) return 0;
  return Math.round((completedSteps / totalSteps) * 100);
}

/**
 * Helper function to check if a lesson is completed
 */
export function isLessonCompleted(
  completedSteps: number,
  totalSteps: number
): boolean {
  return completedSteps >= totalSteps;
}

/**
 * Helper function to create initial progress for a lesson
 */
export function createInitialProgress(lessonId: string): LessonProgress {
  return {
    lessonId,
    completedSteps: 0,
    completed: false,
  };
}
