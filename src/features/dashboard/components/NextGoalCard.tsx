import React from 'react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/features/learning/components/ProgressBar';

interface NextGoal {
  type: string;
  name: string;
  target: number;
  current: number;
}

interface NextGoalCardProps {
  nextGoal: NextGoal | null;
}

export function NextGoalCard({ nextGoal }: NextGoalCardProps) {
  return (
    <Card variant="student" padding="lg" className="bg-gradient-to-br from-purple-50 to-pink-50">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">🎯 Next Goal</h3>
      {nextGoal ? (
        <div>
          <div className="text-lg font-bold text-purple-700 mb-2">
            Unlock {nextGoal.name}
          </div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-purple-600">
              {nextGoal.current}/{nextGoal.target} lessons
            </span>
          </div>
          <ProgressBar 
            progress={nextGoal.target > 0 ? (nextGoal.current / nextGoal.target) * 100 : 0} 
            variant="student"
            height="sm"
          />
          <p className="text-xs text-gray-500 mt-2">
            Complete {Math.max(0, nextGoal.target - nextGoal.current)} more lessons to unlock!
          </p>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-sm text-gray-600">All islands unlocked!</div>
        </div>
      )}
    </Card>
  );
}