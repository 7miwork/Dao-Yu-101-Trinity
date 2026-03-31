import React from 'react';
import { Island } from '../models/island';
import { Lesson } from '../models/lesson';
import { useIslandProgressPercentage, useIslandCompletedLessonsCount, useLearning } from '../store/useLearning';
import { ProgressBar } from './ProgressBar';
import { LessonNode } from './LessonNode';

interface IslandCardProps {
  /** The island to display */
  island: Island;
  
  /** All lessons (to look up lesson details) */
  lessons: Lesson[];
  
  /** Handler for lesson click */
  onLessonClick: (lessonId: string) => void;
}

/**
 * IslandCard component
 * 
 * Displays an island with its lessons as nodes.
 */
export function IslandCard({ island, lessons, onLessonClick }: IslandCardProps) {
  const progressPercentage = useIslandProgressPercentage(island.id);
  const completedLessonsCount = useIslandCompletedLessonsCount(island.id);
  const { state } = useLearning();
  
  // Get lessons for this island
  const islandLessons = island.lessonIds
    .map(id => lessons.find(l => l.id === id))
    .filter((l): l is Lesson => l !== undefined);
  
  // Determine if each lesson is locked
  const getLessonLockedStatus = (lessonIndex: number): boolean => {
    if (!island.unlocked) return true;
    
    // First lesson is always available if island is unlocked
    if (lessonIndex === 0) return false;
    
    // Check if previous lesson is completed
    const previousLessonId = island.lessonIds[lessonIndex - 1];
    return !state.progress[previousLessonId]?.completed;
  };
  
  // Determine island state
  const isCompleted = progressPercentage === 100;
  
  return (
    <div 
      className={`
        rounded-2xl p-6 shadow-lg transition-all duration-300 transform
        ${!island.unlocked 
          ? 'bg-gray-100 opacity-60 blur-[1px] scale-[0.98]' 
          : isCompleted
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-green-100'
            : 'bg-white border-2 border-transparent hover:border-[var(--color-student-primary)] hover:shadow-xl hover:scale-[1.02]'
        }
      `}
      style={{
        borderColor: island.unlocked && island.color && !isCompleted ? island.color : undefined,
      }}
    >
      {/* Island Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className={`
              w-14 h-14 rounded-full flex items-center justify-center text-3xl transition-all duration-300
              ${!island.unlocked 
                ? 'bg-gray-200 grayscale' 
                : isCompleted
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-200'
                  : 'bg-white shadow-md hover:shadow-lg'
              }
            `}
          >
            {!island.unlocked 
              ? '🔒' 
              : isCompleted 
                ? '✅' 
                : (island.icon || '🏝️')
            }
          </div>
          <div>
            <h3 className={`text-lg font-bold ${island.unlocked ? 'text-[var(--color-student-text)]' : 'text-gray-400'}`}>
              {island.title}
            </h3>
            <p className={`text-sm ${island.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
              {island.description}
            </p>
          </div>
        </div>
        
        {/* Status badge */}
        <div 
          className={`
            px-3 py-1 rounded-full text-xs font-medium transition-all
            ${!island.unlocked 
              ? 'bg-gray-200 text-gray-500' 
              : isCompleted
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-green-100 text-green-700'
            }
          `}
        >
          {!island.unlocked 
            ? '🔒 Locked' 
            : isCompleted 
              ? '✨ Completed' 
              : '🔓 Unlocked'
          }
        </div>
      </div>
      
      {/* Progress section (only for unlocked islands) */}
      {island.unlocked && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">
              {completedLessonsCount} of {island.lessonIds.length} lessons completed
            </span>
            <span className="font-medium text-[var(--color-student-primary)]">
              {progressPercentage}%
            </span>
          </div>
          <ProgressBar 
            progress={progressPercentage} 
            variant="student"
            height="md"
          />
        </div>
      )}
      
      {/* Lesson nodes */}
      <div className="flex flex-col items-center gap-2 py-4">
        {islandLessons.map((lesson, index) => (
          <LessonNode
            key={lesson.id}
            lesson={lesson}
            locked={getLessonLockedStatus(index)}
            onClick={() => onLessonClick(lesson.id)}
            position={index}
            totalInIsland={islandLessons.length}
          />
        ))}
      </div>
      
      {/* Locked message */}
      {!island.unlocked && (
        <div className="text-center text-gray-500 text-sm mt-4 p-3 bg-gray-50 rounded-lg">
          🔒 Complete the previous island to unlock
        </div>
      )}
    </div>
  );
}