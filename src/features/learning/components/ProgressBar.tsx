import React from 'react';

interface ProgressBarProps {
  /** Current progress value (0-100) */
  progress: number;
  
  /** Height of the progress bar */
  height?: 'sm' | 'md' | 'lg';
  
  /** Color variant */
  variant?: 'student' | 'teacher' | 'admin' | 'success' | 'warning';
  
  /** Show percentage text */
  showPercentage?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

const heightClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const variantColors = {
  student: 'var(--color-student-primary)',
  teacher: 'var(--color-teacher-primary)',
  admin: 'var(--color-admin-primary)',
  success: '#22c55e',
  warning: '#f59e0b',
};

/**
 * Reusable ProgressBar component
 * 
 * Displays a progress bar with customizable appearance.
 */
export function ProgressBar({
  progress,
  height = 'md',
  variant = 'student',
  showPercentage = false,
  className = '',
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[height]}`}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${clampedProgress}%`,
            backgroundColor: variantColors[variant],
          }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-gray-500 mt-1 text-right">
          {clampedProgress}%
        </div>
      )}
    </div>
  );
}