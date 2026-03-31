import { Lesson } from '../models/lesson';

/**
 * Mock Lessons Data
 * 
 * Sample lessons for development and testing.
 * These represent the core curriculum of Dao-Yu-101.
 */
export const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to Chinese Characters',
    description: 'Learn the basics of Chinese character structure, radicals, and stroke order.',
    totalSteps: 5,
    xpReward: 50,
    icon: '📚',
    difficulty: 'beginner',
    category: 'Characters',
    estimatedDuration: 30,
    order: 1,
  },
  {
    id: '2',
    title: 'Basic Grammar Patterns',
    description: 'Master fundamental sentence structures and common grammar patterns.',
    totalSteps: 5,
    xpReward: 50,
    icon: '✏️',
    difficulty: 'beginner',
    category: 'Grammar',
    estimatedDuration: 45,
    order: 2,
  },
  {
    id: '3',
    title: 'Conversational Phrases',
    description: 'Practice essential phrases for everyday conversations.',
    totalSteps: 5,
    xpReward: 75,
    icon: '💬',
    difficulty: 'intermediate',
    category: 'Speaking',
    estimatedDuration: 40,
    order: 3,
  },
  {
    id: '4',
    title: 'Reading Comprehension',
    description: 'Develop reading skills with graded texts and exercises.',
    totalSteps: 5,
    xpReward: 75,
    icon: '📖',
    difficulty: 'intermediate',
    category: 'Reading',
    estimatedDuration: 50,
    order: 4,
  },
  {
    id: '5',
    title: 'Advanced Writing Skills',
    description: 'Enhance your writing abilities with complex compositions.',
    totalSteps: 5,
    xpReward: 100,
    icon: '✍️',
    difficulty: 'advanced',
    category: 'Writing',
    estimatedDuration: 60,
    order: 5,
  },
];
