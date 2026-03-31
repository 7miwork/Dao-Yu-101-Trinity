import React, { useState, useEffect } from 'react';
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
  const { lessons, totalXP, islands, user } = state;
  
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

  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  // Handle lesson click - simulate completing a step
  const handleLessonClick = (lessonId: string) => {
    dispatch({ type: 'COMPLETE_STEP', payload: { lessonId } });
    // Update missions progress
    dispatch({ type: 'UPDATE_MISSIONS', payload: { stepsCompleted: 1 } });
    
    // Show XP popup feedback
    setCelebrationMessage('+10 XP');
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1000);
  };

  // Find next goal
  const getNextGoal = () => {
    const nextIsland = islands.find(i => !i.unlocked);
    if (nextIsland) {
      const targetValue = nextIsland.unlockConditions?.[0]?.target;
      const lessonsNeeded = typeof targetValue === 'number' ? targetValue : 0;
      return {
        type: 'island',
        name: nextIsland.title,
        target: lessonsNeeded,
        current: completedLessons,
      };
    }
    return null;
  };

  const nextGoal = getNextGoal();

  return (
    <div className="w-full max-w-5xl">
      {/* Hero Dashboard Section */}
      <Card variant="student" padding="lg" className="mb-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* User Avatar & Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-3xl shadow-lg">
              🧙
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-student-text)]">
                {user.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                  Level {xpProgress.currentLevel}
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
                {totalXP} / {xpProgress.nextLevelXP}
              </span>
            </div>
            <ProgressBar 
              progress={xpProgress.progressPercent} 
              variant="student"
              height="md"
            />
            <div className="text-xs text-gray-500 mt-1 text-center">
              {xpProgress.xpNeeded} XP to Level {xpProgress.currentLevel + 1}
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

      {/* Engagement & Goals Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Today's Stats */}
        <Card variant="student" padding="lg" className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">📊 Today's Progress</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Lessons completed</span>
              <span className="font-bold text-indigo-600">{completedLessons}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">XP gained</span>
              <span className="font-bold text-indigo-600">+{totalXP}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Steps taken</span>
              <span className="font-bold text-indigo-600">{totalStepsCompleted}</span>
            </div>
          </div>
        </Card>

        {/* Next Goal */}
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

        {/* Streak Warning / Motivation */}
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

      {/* Celebration Popup */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-2xl transform animate-bounce"
            style={{
              animation: 'celebrationPop 0.5s ease-out'
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="text-xl font-bold">{celebrationMessage}</span>
            </div>
          </div>
        </div>
      )}

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

      {/* Celebration Animation Styles */}
      <style>{`
        @keyframes celebrationPop {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}