import React from 'react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/features/learning/components/ProgressBar';

interface HeroSectionProps {
  userName: string;
  currentLevel: number;
  totalXP: number;
  nextLevelXP: number;
  xpNeeded: number;
  progressPercent: number;
  streak: number;
}

export function HeroSection({
  userName,
  currentLevel,
  totalXP,
  nextLevelXP,
  xpNeeded,
  progressPercent,
  streak,
}: HeroSectionProps) {
  return (
    <Card variant="student" padding="lg" className="mb-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* User Avatar & Name */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-3xl shadow-lg">
            🧙
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-student-text)]">
              {userName}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                Level {currentLevel}
              </span>
              <span>•</span>
              <span>Explorer</span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="flex-1 w-full md:w-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">XP Progress</span>
            <span className="text-sm font-bold text-[var(--color-student-primary)]">
              {totalXP} / {nextLevelXP}
            </span>
          </div>
          <ProgressBar 
            progress={progressPercent} 
            variant="student"
            height="md"
          />
          <div className="text-xs text-gray-500 mt-1 text-center">
            {xpNeeded} XP to Level {currentLevel + 1}
          </div>
        </div>

        {/* Streak Badge */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl">
          <div className="text-3xl">🔥</div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{streak}</div>
            <div className="text-xs text-orange-700">Day Streak</div>
          </div>
        </div>
      </div>
    </Card>
  );
}