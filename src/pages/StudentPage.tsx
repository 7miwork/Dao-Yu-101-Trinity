import React from 'react';
import { Card } from '@/components/ui/Card';
import { 
  useLearning,
  useCompletedLessonsCount,
  useTotalStepsCompleted,
  useIslands,
  useUnlockedIslandsCount,
  useCompletedIslandsCount,
  useXPProgress,
  useStreak,
  useMissions
} from '@/features/learning/store/useLearning';
import { IslandCard } from '@/features/learning/components/IslandCard';
import { ProgressBar } from '@/features/learning/components/ProgressBar';

export function StudentPage() {
  const { state, dispatch } = useLearning();
  const { lessons, totalXP, islands } = state;
  
  // Use derived hooks
  const completedLessons = useCompletedLessonsCount();
  const totalStepsCompleted = useTotalStepsCompleted();
  const unlockedIslands = useUnlockedIslandsCount();
  const completedIslands = useCompletedIslandsCount();
  const xpProgress = useXPProgress();
  const streak = useStreak();
  const missions = useMissions();

  // Calculate overall progress
  const totalProgress = lessons.length > 0
    ? Math.round((completedLessons / lessons.length) * 100)
    : 0;

  // Handle lesson click - simulate completing a step
  const handleLessonClick = (lessonId: string) => {
    dispatch({ type: 'COMPLETE_STEP', payload: { lessonId } });
    // Update missions progress
    dispatch({ type: 'UPDATE_MISSIONS', payload: { stepsCompleted: 1 } });
  };

  return (
    <div className="w-full max-w-5xl">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[var(--color-student-text)] mb-3">
          🎮 Your Learning Adventure
        </h1>
        <p className="text-[var(--color-student-text)] opacity-80 text-lg">
          Complete islands to unlock new challenges!
        </p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {/* Level Card */}
        <Card variant="student" padding="md" className="text-center">
          <div className="text-3xl mb-2">🎖️</div>
          <div className="text-3xl font-bold text-[var(--color-student-primary)]">
            {xpProgress.currentLevel}
          </div>
          <div className="text-sm text-[var(--color-student-text)] opacity-70">
            Level
          </div>
          <div className="mt-2">
            <ProgressBar 
              progress={xpProgress.progressPercent} 
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
            {xpProgress.xpNeeded} to Lv.{xpProgress.currentLevel + 1}
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
            {completedIslands}/{islands.length}
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

      {/* Streak & Missions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Streak Card */}
        <Card variant="student" padding="lg" className="bg-gradient-to-br from-orange-50 to-red-50">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🔥</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[var(--color-student-text)] mb-1">
                Daily Streak
              </h2>
              <div className="text-4xl font-bold text-orange-500 mb-1">
                {streak} {streak === 1 ? 'day' : 'days'}
              </div>
              <p className="text-sm text-[var(--color-student-text)] opacity-70">
                {streak > 0 
                  ? 'Keep it up! Come back tomorrow to continue your streak!'
                  : 'Start learning today to begin your streak!'}
              </p>
            </div>
          </div>
        </Card>

        {/* Missions Summary Card */}
        <Card variant="student" padding="lg" className="bg-gradient-to-br from-green-50 to-teal-50">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🎯</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[var(--color-student-text)] mb-1">
                Daily Missions
              </h2>
              <div className="text-4xl font-bold text-green-500 mb-1">
                {missions.filter(m => m.completed).length}/{missions.length}
              </div>
              <p className="text-sm text-[var(--color-student-text)] opacity-70">
                {missions.filter(m => m.completed).length === missions.length
                  ? 'All missions completed! Great job!'
                  : 'Complete missions to earn bonus XP!'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Missions List */}
      <Card variant="student" padding="lg" className="mb-8">
        <h2 className="text-lg font-semibold text-[var(--color-student-text)] mb-4 flex items-center gap-2">
          🎯 Daily Missions
        </h2>
        <div className="space-y-3">
          {missions.map((mission) => (
            <div 
              key={mission.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                mission.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200 hover:border-[var(--color-student-primary)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{mission.icon}</span>
                  <div>
                    <div className={`font-medium ${mission.completed ? 'text-green-700' : 'text-[var(--color-student-text)]'}`}>
                      {mission.title}
                      {mission.completed && <span className="ml-2">✅</span>}
                    </div>
                    <div className="text-sm text-[var(--color-student-text)] opacity-70">
                      Reward: +{mission.rewardXP} XP
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${mission.completed ? 'text-green-500' : 'text-[var(--color-student-primary)]'}`}>
                    {mission.progress}/{mission.target}
                  </div>
                </div>
              </div>
              <ProgressBar 
                progress={(mission.progress / mission.target) * 100} 
                variant="student"
                height="sm"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Overall Progress Bar */}
      <Card variant="student" padding="lg" className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-student-text)]">
              Overall Journey Progress
            </h2>
            <p className="text-sm text-[var(--color-student-text)] opacity-70">
              {completedLessons} of {lessons.length} lessons completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[var(--color-student-primary)]">
              {totalProgress}%
            </div>
          </div>
        </div>
        <ProgressBar 
          progress={totalProgress} 
          variant="student"
          height="lg"
        />
      </Card>

      {/* Island Map Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--color-student-text)] mb-2 flex items-center gap-2">
          🗺️ Learning Islands
        </h2>
        <p className="text-[var(--color-student-text)] opacity-70 mb-6">
          Complete all lessons in an island to unlock the next one!
        </p>
      </div>

      {/* Islands Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {islands.map((island) => (
          <IslandCard
            key={island.id}
            island={island}
            lessons={lessons}
            onLessonClick={handleLessonClick}
          />
        ))}
      </div>

      {/* Quick Tips */}
      <Card variant="student" padding="md" className="bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="font-semibold text-[var(--color-student-text)] mb-1">
              Pro Tip
            </h3>
            <p className="text-sm text-[var(--color-student-text)] opacity-80">
              Click on lesson nodes to complete steps and earn XP! Complete all lessons in an island to unlock the next adventure.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}