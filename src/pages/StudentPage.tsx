import React, { useState } from 'react';
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
import { HeroSection } from '@/features/dashboard/components/HeroSection';
import { ProgressCards } from '@/features/dashboard/components/ProgressCards';
import { NextGoalCard } from '@/features/dashboard/components/NextGoalCard';
import { StreakWidget } from '@/features/dashboard/components/StreakWidget';

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
      <HeroSection
        userName={user.name}
        currentLevel={xpProgress.currentLevel}
        totalXP={totalXP}
        nextLevelXP={xpProgress.nextLevelXP}
        xpNeeded={xpProgress.xpNeeded}
        progressPercent={xpProgress.progressPercent}
        streak={streak}
      />

      {/* Stats Dashboard */}
      <ProgressCards
        currentLevel={xpProgress.currentLevel}
        totalXP={totalXP}
        xpNeeded={xpProgress.xpNeeded}
        progressPercent={xpProgress.progressPercent}
        totalProgress={totalProgress}
        completedIslands={completedIslands}
        totalIslands={islands.length}
        totalStepsCompleted={totalStepsCompleted}
      />

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
        <NextGoalCard nextGoal={nextGoal} />

        {/* Streak Widget */}
        <StreakWidget streak={streak} />
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