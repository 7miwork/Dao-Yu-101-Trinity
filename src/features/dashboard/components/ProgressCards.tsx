import React from 'react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/features/learning/components/ProgressBar';

interface ProgressCardsProps {
  currentLevel: number;
  totalXP: number;
  xpNeeded: number;
  progressPercent: number;
  totalProgress: number;
  completedIslands: number;
  totalIslands: number;
  totalStepsCompleted: number;
}

export function ProgressCards({
  currentLevel,
  totalXP,
  xpNeeded,
  progressPercent,
  totalProgress,
  completedIslands,
  totalIslands,
  totalStepsCompleted,
}: ProgressCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {/* Level Card */}
      <Card variant="student" padding="md" className="text-center">
        <div className="text-3xl mb-2">🎖️</div>
        <div className="text-3xl font-bold text-[var(--color-student-primary)]">
          {currentLevel}
        </div>
        <div className="text-sm text-[var(--color-student-text)] opacity-70">
          Level
        </div>
        <div className="mt-2">
          <ProgressBar 
            progress={progressPercent} 
            variant="student"
            height="sm"
          />
        </div>
      </Card>

      {/* XP Card */}
      <Card variant="student" padding="md" className="text-center">
        <div className="text-3xl mb-2">⭐</div>
        <div className="text-3xl font-bold text-[var(--color-student-primary)]">
          {totalXP}
        </div>
        <div className="text-sm text-[var(--color-student-text)] opacity-70">
          Total XP
        </div>
        <div className="text-xs text-[var(--color-student-text)] opacity-50 mt-1">
          {xpNeeded} to Lv.{currentLevel + 1}
        </div>
      </Card>

      {/* Progress Card */}
      <Card variant="student" padding="md" className="text-center">
        <div className="text-3xl mb-2">📈</div>
        <div className="text-3xl font-bold text-[var(--color-student-secondary)]">
          {totalProgress}%
        </div>
        <div className="text-sm text-[var(--color-student-text)] opacity-70">
          Progress
        </div>
      </Card>

      {/* Islands Card */}
      <Card variant="student" padding="md" className="text-center">
        <div className="text-3xl mb-2">🏝️</div>
        <div className="text-3xl font-bold text-[var(--color-student-accent)]">
          {completedIslands}/{totalIslands}
        </div>
        <div className="text-sm text-[var(--color-student-text)] opacity-70">
          Islands
        </div>
      </Card>

      {/* Steps Card */}
      <Card variant="student" padding="md" className="text-center">
        <div className="text-3xl mb-2">👣</div>
        <div className="text-3xl font-bold text-yellow-500">
          {totalStepsCompleted}
        </div>
        <div className="text-sm text-[var(--color-student-text)] opacity-70">
          Steps
        </div>
      </Card>
    </div>
  );
}