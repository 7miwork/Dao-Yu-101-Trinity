import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  useLearning,
  useCompletedLessonsCount,
  useTotalStepsCompleted,
  useAverageProgress,
  useTotalPossibleSteps,
  useIslands,
  useCompletedIslandsCount,
  useUnlockedIslandsCount,
  useStreak,
  useMissionCompletionRate,
  useCompletedMissionsCount,
  useTotalMissionsCount
} from '@/features/learning/store/useLearning';
import { ProgressBar } from '@/features/learning/components/ProgressBar';

interface RecentActivity {
  id: number;
  student: string;
  action: string;
  lesson: string;
  time: string;
}

const recentActivity: RecentActivity[] = [
  {
    id: 1,
    student: 'Alice Chen',
    action: 'completed',
    lesson: 'Introduction to Characters',
    time: '5 min ago',
  },
  {
    id: 2,
    student: 'Bob Wang',
    action: 'started',
    lesson: 'Grammar Patterns',
    time: '12 min ago',
  },
  {
    id: 3,
    student: 'Carol Li',
    action: 'submitted quiz',
    lesson: 'Conversational Phrases',
    time: '25 min ago',
  },
  {
    id: 4,
    student: 'David Zhang',
    action: 'completed',
    lesson: 'Reading Comprehension',
    time: '1 hour ago',
  },
  {
    id: 5,
    student: 'Emma Liu',
    action: 'asked question',
    lesson: 'Advanced Writing',
    time: '2 hours ago',
  },
];

const actionColors: Record<string, string> = {
  completed: 'var(--color-teacher-primary)',
  started: 'var(--color-teacher-secondary)',
  'submitted quiz': 'var(--color-teacher-accent)',
  'asked question': 'var(--color-teacher-border)',
};

export function TeacherPage() {
  const { state } = useLearning();
  const { lessons, islands, progress } = state;

  // Use derived hooks
  const completedLessons = useCompletedLessonsCount();
  const totalStepsCompleted = useTotalStepsCompleted();
  const averageProgress = useAverageProgress();
  const totalSteps = useTotalPossibleSteps();
  const completedIslands = useCompletedIslandsCount();
  const unlockedIslands = useUnlockedIslandsCount();
  const streak = useStreak();
  const missionCompletionRate = useMissionCompletionRate();
  const completedMissions = useCompletedMissionsCount();
  const totalMissions = useTotalMissionsCount();

  // Completion percentage
  const completionPercentage = totalSteps > 0
    ? Math.round((totalStepsCompleted / totalSteps) * 100)
    : 0;

  return (
    <>
      {/* Stats Cards */}
      <Card variant="teacher" padding="lg">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">📚</div>
          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
            {lessons.length} total
          </span>
        </div>
        <div className="text-3xl font-bold text-[var(--color-teacher-text)] mb-1">
          {lessons.length}
        </div>
        <div className="text-sm text-[var(--color-teacher-text)] opacity-70">
          Total Lessons
        </div>
      </Card>

      <Card variant="teacher" padding="lg">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">✅</div>
          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
            {completedLessons} done
          </span>
        </div>
        <div className="text-3xl font-bold text-[var(--color-teacher-text)] mb-1">
          {completedLessons}
        </div>
        <div className="text-sm text-[var(--color-teacher-text)] opacity-70">
          Completed Lessons
        </div>
      </Card>

      <Card variant="teacher" padding="lg">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">📈</div>
          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
            {completionPercentage}%
          </span>
        </div>
        <div className="text-3xl font-bold text-[var(--color-teacher-text)] mb-1">
          {averageProgress}%
        </div>
        <div className="text-sm text-[var(--color-teacher-text)] opacity-70">
          Average Progress
        </div>
      </Card>

      <Card variant="teacher" padding="lg">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">🏝️</div>
          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
            {completedIslands}/{islands.length}
          </span>
        </div>
        <div className="text-3xl font-bold text-[var(--color-teacher-text)] mb-1">
          {completedIslands}/{islands.length}
        </div>
        <div className="text-sm text-[var(--color-teacher-text)] opacity-70">
          Islands Completed
        </div>
      </Card>

      {/* Streak Stats */}
      <Card variant="teacher" padding="lg">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">🔥</div>
          <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">
            avg streak
          </span>
        </div>
        <div className="text-3xl font-bold text-[var(--color-teacher-text)] mb-1">
          {streak}
        </div>
        <div className="text-sm text-[var(--color-teacher-text)] opacity-70">
          Current Streak
        </div>
      </Card>

      {/* Mission Completion Rate */}
      <Card variant="teacher" padding="lg">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">🎯</div>
          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
            {completedMissions}/{totalMissions}
          </span>
        </div>
        <div className="text-3xl font-bold text-[var(--color-teacher-text)] mb-1">
          {missionCompletionRate}%
        </div>
        <div className="text-sm text-[var(--color-teacher-text)] opacity-70">
          Mission Completion Rate
        </div>
      </Card>

      {/* Island Overview - spans 2 columns */}
      <Card variant="teacher" padding="lg" className="md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-teacher-text)]">
            🗺️ Island Progress Overview
          </h2>
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        </div>
        <div className="space-y-4">
          {islands.map((island) => {
            const islandLessons = island.lessonIds
              .map(id => lessons.find(l => l.id === id))
              .filter(Boolean);
            const completedInIsland = island.lessonIds.filter(
              id => progress[id]?.completed
            ).length;
            const progressPercent = island.lessonIds.length > 0
              ? Math.round((completedInIsland / island.lessonIds.length) * 100)
              : 0;
            
            return (
              <div key={island.id} className="p-4 rounded-lg bg-[var(--color-teacher-bg-light)]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{island.icon || '🏝️'}</span>
                    <div>
                      <div className="font-medium text-[var(--color-teacher-text)]">
                        {island.title}
                        {progressPercent === 100 && <span className="ml-2 text-green-500">✅</span>}
                      </div>
                      <div className="text-xs text-[var(--color-teacher-text)] opacity-70">
                        {completedInIsland}/{island.lessonIds.length} lessons completed
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className={`text-xs px-2 py-1 rounded-full ${
                        island.unlocked 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {island.unlocked ? '🔓 Unlocked' : '🔒 Locked'}
                    </span>
                    <span className="text-sm font-medium text-[var(--color-teacher-text)]">
                      {progressPercent}%
                    </span>
                  </div>
                </div>
                <ProgressBar 
                  progress={progressPercent} 
                  variant="teacher"
                  height="sm"
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Activity - spans 2 columns */}
      <Card variant="teacher" padding="lg" className="md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-teacher-text)]">
            Recent Activity
          </h2>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 border-b border-[var(--color-teacher-border)] last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: actionColors[activity.action] }}
                />
                <div>
                  <span className="font-medium text-[var(--color-teacher-text)]">
                    {activity.student}
                  </span>
                  <span className="text-[var(--color-teacher-text)] opacity-70">
                    {' '}
                    {activity.action}{' '}
                  </span>
                  <span className="text-[var(--color-teacher-text)]">
                    {activity.lesson}
                  </span>
                </div>
              </div>
              <span className="text-xs text-[var(--color-teacher-text)] opacity-50">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions - spans full width */}
      <Card variant="teacher" padding="lg" className="md:col-span-3">
        <h2 className="text-lg font-semibold text-[var(--color-teacher-text)] mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="secondary" size="md" className="w-full">
            📝 Create Lesson
          </Button>
          <Button variant="secondary" size="md" className="w-full">
            🏝️ Manage Islands
          </Button>
          <Button variant="secondary" size="md" className="w-full">
            📊 View Reports
          </Button>
          <Button variant="secondary" size="md" className="w-full">
            ⚙️ Settings
          </Button>
        </div>
      </Card>
    </>
  );
}