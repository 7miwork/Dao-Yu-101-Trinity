import { Island } from '../models/island';

/**
 * Mock Islands Data
 * 
 * Sample islands for development and testing.
 * These represent the learning path structure of Dao-Yu-101.
 */
export const mockIslands: Island[] = [
  {
    id: 'island-1',
    title: 'Basics Island',
    description: 'Start your journey into Chinese learning with fundamental characters and grammar.',
    lessonIds: ['1', '2'],
    unlocked: true,
    icon: '🏝️',
    color: '#4ade80',
    order: 1,
    unlockConditions: [], // First island is always unlocked
  },
  {
    id: 'island-2',
    title: 'Conversation Island',
    description: 'Level up your speaking skills with practical phrases and reading exercises.',
    lessonIds: ['3', '4'],
    unlocked: false,
    icon: '🌴',
    color: '#60a5fa',
    order: 2,
    unlockConditions: [
      { type: 'islandCompletion', target: 'island-1' }
    ],
  },
  {
    id: 'island-3',
    title: 'Mastery Island',
    description: 'Achieve fluency with advanced writing and composition skills.',
    lessonIds: ['5'],
    unlocked: false,
    icon: '🏔️',
    color: '#f472b6',
    order: 3,
    unlockConditions: [
      { type: 'islandCompletion', target: 'island-2' },
      { type: 'requiredXP', target: 150 }
    ],
  },
];
