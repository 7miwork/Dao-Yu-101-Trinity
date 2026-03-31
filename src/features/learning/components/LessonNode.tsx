import React, { useState, useEffect } from 'react';
import { Lesson } from '../models/lesson';
import { useLessonProgress, useLessonProgressPercentage } from '../store/useLearning';

interface LessonNodeProps {
  /** The lesson to display */
  lesson: Lesson;
  
  /** Whether the lesson is locked */
  locked: boolean;
  
  /** Click handler */
  onClick: () => void;
  
  /** Position in the island (for connecting lines) */
  position: number;
  
  /** Total lessons in the island */
  totalInIsland: number;
}

type LessonState = 'locked' | 'available' | 'completed';

/**
 * LessonNode component
 * 
 * Displays a lesson as a circular node with different states.
 */
export function LessonNode({
  lesson,
  locked,
  onClick,
  position,
  totalInIsland,
}: LessonNodeProps) {
  const progress = useLessonProgress(lesson.id);
  const progressPercentage = useLessonProgressPercentage(lesson.id);
  const isCompleted = progress?.completed || false;
  
  // Determine state
  let state: LessonState;
  if (locked) {
    state = 'locked';
  } else if (isCompleted) {
    state = 'completed';
  } else {
    state = 'available';
  }
  
  // State-based styling
  const stateStyles = {
    locked: {
      bg: 'bg-gray-300',
      border: 'border-gray-400',
      text: 'text-gray-500',
      icon: '🔒',
    },
    available: {
      bg: 'bg-white',
      border: 'border-[var(--color-student-primary)]',
      text: 'text-[var(--color-student-text)]',
      icon: lesson.icon || '📚',
    },
    completed: {
      bg: 'bg-[var(--color-student-primary)]',
      border: 'border-[var(--color-student-primary)]',
      text: 'text-white',
      icon: '✅',
    },
  };
  
  const styles = stateStyles[state];
  
  // Click feedback state
  const [showXpPopup, setShowXpPopup] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  // Calculate if this is the last node
  const isLastNode = position === totalInIsland - 1;
  
  // Handle click with feedback
  const handleClick = () => {
    if (state === 'locked') return;
    
    // Trigger click animation
    setIsClicked(true);
    setShowXpPopup(true);
    
    // Reset click animation
    setTimeout(() => setIsClicked(false), 150);
    
    // Hide XP popup after delay
    setTimeout(() => setShowXpPopup(false), 800);
    
    // Call original onClick
    onClick();
  };
  
  return (
    <div className="flex flex-col items-center">
      {/* Connecting line (except for first node) */}
      {position > 0 && (
        <div 
          className={`w-1 h-8 -mt-4 mb-2 ${
            state === 'completed' 
              ? 'bg-[var(--color-student-primary)]' 
              : 'bg-gray-300'
          }`}
        />
      )}
      
      {/* Node circle */}
      <button
        onClick={handleClick}
        disabled={state === 'locked'}
        className={`
          relative w-16 h-16 rounded-full border-4 
          ${styles.bg} ${styles.border}
          flex items-center justify-center
          transition-all duration-150 ease-out
          ${state !== 'locked' ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed opacity-60'}
          ${isClicked ? 'scale-95' : ''}
          shadow-lg hover:shadow-xl
        `}
      >
        <span className="text-2xl">{styles.icon}</span>
        
        {/* Progress ring for available lessons */}
        {state === 'available' && progressPercentage > 0 && (
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="var(--color-student-primary)"
              strokeWidth="4"
              strokeDasharray={`${progressPercentage * 2.89} 289`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
        )}
        
        {/* XP Popup */}
        {showXpPopup && state !== 'locked' && (
          <div 
            className="absolute -top-8 left-1/2 -translate-x-1/2 
                       text-sm font-bold text-[var(--color-student-primary)]
                       animate-bounce pointer-events-none"
          >
            +{lesson.xpReward / lesson.totalSteps} XP
          </div>
        )}
      </button>
      
      {/* Lesson title */}
      <div className={`mt-2 text-center max-w-20 ${styles.text}`}>
        <div className="text-xs font-medium truncate">
          {lesson.title}
        </div>
        
        {/* Progress indicator for available lessons */}
        {state === 'available' && progress && (
          <div className="text-xs opacity-70 mt-0.5">
            {progress.completedSteps}/{lesson.totalSteps}
          </div>
        )}
        
        {/* XP reward */}
        {state !== 'locked' && (
          <div className="text-xs text-[var(--color-student-primary)] font-medium mt-0.5">
            +{lesson.xpReward} XP
          </div>
        )}
      </div>
    </div>
  );
}