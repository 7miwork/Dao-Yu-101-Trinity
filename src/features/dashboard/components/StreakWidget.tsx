import React from 'react';
import { Card } from '@/components/ui/Card';

interface StreakWidgetProps {
  streak: number;
}

export function StreakWidget({ streak }: StreakWidgetProps) {
  return (
    <Card variant="student" padding="lg" className={`bg-gradient-to-br ${streak > 0 ? 'from-orange-50 to-red-50' : 'from-gray-50 to-slate-50'}`}>
      <h3 className="text-sm font-semibold text-gray-500 mb-3">🔥 Streak Status</h3>
      <div className="text-center">
        <div className="text-5xl mb-2">{streak > 0 ? '🔥' : '💤'}</div>
        <div className="text-3xl font-bold text-orange-500 mb-1">
          {streak} {streak === 1 ? 'day' : 'days'}
        </div>
        <p className="text-sm text-gray-600">
          {streak > 0 
            ? 'Amazing! Keep your streak alive!'
            : 'Start learning to begin your streak!'}
        </p>
        {streak > 0 && (
          <div className="mt-3 text-xs text-orange-600 font-medium">
            ⚠️ Don't break your streak!
          </div>
        )}
      </div>
    </Card>
  );
}