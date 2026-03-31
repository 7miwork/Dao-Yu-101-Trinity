import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  useLearning,
  useTotalStepsCompleted,
  useTotalPossibleSteps,
  useIslands,
  useCompletedIslandsCount,
  useUnlockedIslandsCount
} from '@/features/learning/store/useLearning';
import { ProgressBar } from '@/features/learning/components/ProgressBar';
import { clearState } from '@/features/learning/utils/storage';

interface SystemMetric {
  id: number;
  label: string;
  value: string;
  status: 'healthy' | 'warning' | 'critical';
  icon: string;
}

interface SystemLog {
  id: number;
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

const systemLogs: SystemLog[] = [
  {
    id: 1,
    type: 'info',
    message: 'User authentication successful for admin@dao-yu-101.com',
    timestamp: '10:45:23',
  },
  {
    id: 2,
    type: 'info',
    message: 'Database backup completed successfully',
    timestamp: '10:30:15',
  },
  {
    id: 3,
    type: 'warning',
    message: 'Memory usage exceeded 70% threshold',
    timestamp: '10:15:42',
  },
  {
    id: 4,
    type: 'info',
    message: 'New lesson created: Advanced Grammar Patterns',
    timestamp: '09:58:11',
  },
  {
    id: 5,
    type: 'error',
    message: 'Failed login attempt from IP 192.168.1.100',
    timestamp: '09:45:33',
  },
  {
    id: 6,
    type: 'info',
    message: 'System cache cleared successfully',
    timestamp: '09:30:00',
  },
];

const statusColors: Record<string, string> = {
  healthy: 'var(--color-admin-primary)',
  warning: 'var(--color-admin-secondary)',
  critical: '#ef4444',
};

const logColors: Record<string, string> = {
  info: 'var(--color-admin-primary)',
  warning: 'var(--color-admin-secondary)',
  error: '#ef4444',
};

export function AdminPage() {
  const { state } = useLearning();
  const { lessons, progress, totalXP, islands } = state;

  // Use derived hooks
  const totalStepsCompleted = useTotalStepsCompleted();
  const totalPossibleSteps = useTotalPossibleSteps();
  const completedIslands = useCompletedIslandsCount();
  const unlockedIslands = useUnlockedIslandsCount();

  // Calculate system metrics based on learning state
  const totalLessons = lessons.length;
  const totalProgressEntries = Object.keys(progress).length;

  // Create dynamic system metrics
  const systemMetrics: SystemMetric[] = [
    {
      id: 1,
      label: 'Server Status',
      value: 'Online',
      status: 'healthy',
      icon: '🟢',
    },
    {
      id: 2,
      label: 'Database',
      value: 'Connected',
      status: 'healthy',
      icon: '💾',
    },
    {
      id: 3,
      label: 'API Response',
      value: '45ms',
      status: 'healthy',
      icon: '⚡',
    },
    {
      id: 4,
      label: 'Memory Usage',
      value: '72%',
      status: 'warning',
      icon: '📊',
    },
    {
      id: 5,
      label: 'CPU Load',
      value: '34%',
      status: 'healthy',
      icon: '🖥️',
    },
    {
      id: 6,
      label: 'Storage',
      value: '156GB / 500GB',
      status: 'healthy',
      icon: '💿',
    },
    {
      id: 7,
      label: 'Active Users',
      value: '1,247',
      status: 'healthy',
      icon: '👥',
    },
    {
      id: 8,
      label: 'Error Rate',
      value: '0.02%',
      status: 'healthy',
      icon: '📈',
    },
  ];

  return (
    <>
      {/* System Metrics - 4 columns on large screens */}
      {systemMetrics.map((metric) => (
        <Card key={metric.id} variant="admin" padding="sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg">{metric.icon}</span>
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: statusColors[metric.status] }}
            />
          </div>
          <div className="text-xl font-bold text-[var(--color-admin-text)] mb-1">
            {metric.value}
          </div>
          <div className="text-xs text-[var(--color-admin-text)] opacity-70">
            {metric.label}
          </div>
        </Card>
      ))}

      {/* Learning System Stats - spans 2 columns */}
      <Card variant="admin" padding="md" className="md:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--color-admin-text)]">
            Learning System
          </h2>
          <Button variant="ghost" size="sm">
            Details
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-[var(--color-admin-bg-light)]">
            <div className="text-2xl font-bold text-[var(--color-admin-primary)]">
              {totalLessons}
            </div>
            <div className="text-xs text-[var(--color-admin-text)] opacity-70">
              Total Lessons
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--color-admin-bg-light)]">
            <div className="text-2xl font-bold text-[var(--color-admin-secondary)]">
              {totalProgressEntries}
            </div>
            <div className="text-xs text-[var(--color-admin-text)] opacity-70">
              Progress Entries
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--color-admin-bg-light)]">
            <div className="text-2xl font-bold text-[var(--color-admin-accent)]">
              {totalStepsCompleted}
            </div>
            <div className="text-xs text-[var(--color-admin-text)] opacity-70">
              Steps Completed
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--color-admin-bg-light)]">
            <div className="text-2xl font-bold text-yellow-500">
              ⭐ {totalXP}
            </div>
            <div className="text-xs text-[var(--color-admin-text)] opacity-70">
              Total XP Generated
            </div>
          </div>
        </div>
      </Card>

      {/* Island Stats - spans 2 columns */}
      <Card variant="admin" padding="md" className="md:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--color-admin-text)]">
            🏝️ Island Progression Funnel
          </h2>
          <Button variant="ghost" size="sm">
            Manage
          </Button>
        </div>
        <div className="space-y-3">
          {islands.map((island, index) => {
            const completedInIsland = island.lessonIds.filter(
              id => progress[id]?.completed
            ).length;
            const progressPercent = island.lessonIds.length > 0
              ? Math.round((completedInIsland / island.lessonIds.length) * 100)
              : 0;
            
            return (
              <div key={island.id} className="p-3 rounded-lg bg-[var(--color-admin-bg-light)]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{island.icon || '🏝️'}</span>
                    <div>
                      <div className="text-sm font-medium text-[var(--color-admin-text)]">
                        {island.title}
                      </div>
                      <div className="text-xs text-[var(--color-admin-text)] opacity-70">
                        {completedInIsland}/{island.lessonIds.length} lessons
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
                      {island.unlocked ? '🔓' : '🔒'}
                    </span>
                    <span className="text-sm font-medium text-[var(--color-admin-text)]">
                      {progressPercent}%
                    </span>
                  </div>
                </div>
                <ProgressBar 
                  progress={progressPercent} 
                  variant="admin"
                  height="sm"
                />
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-3 border-t border-[var(--color-admin-border)]">
          <div className="flex justify-between text-xs text-[var(--color-admin-text)] opacity-70">
            <span>Unlocked: {unlockedIslands}/{islands.length}</span>
            <span>Completed: {completedIslands}/{islands.length}</span>
          </div>
        </div>
      </Card>

      {/* System Logs - spans 2 columns */}
      <Card variant="admin" padding="md" className="md:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--color-admin-text)]">
            System Logs
          </h2>
          <Button variant="ghost" size="sm">
            Export
          </Button>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {systemLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2 py-2 border-b border-[var(--color-admin-border)] last:border-0 text-xs"
            >
              <div
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: logColors[log.type] }}
              />
              <div className="flex-1 min-w-0">
                <span className="text-[var(--color-admin-text)] opacity-90">
                  {log.message}
                </span>
              </div>
              <span className="text-[var(--color-admin-text)] opacity-50 flex-shrink-0">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Controls - spans 2 columns */}
      <Card variant="admin" padding="md" className="md:col-span-2">
        <h2 className="text-sm font-semibold text-[var(--color-admin-text)] mb-3">
          System Controls
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" className="w-full text-xs">
            🔄 Restart Services
          </Button>
          <Button variant="secondary" size="sm" className="w-full text-xs">
            🗄️ Backup DB
          </Button>
          <Button variant="secondary" size="sm" className="w-full text-xs">
            🧹 Clear Cache
          </Button>
          <Button variant="secondary" size="sm" className="w-full text-xs">
            📋 View All Logs
          </Button>
          <Button variant="secondary" size="sm" className="w-full text-xs">
            👥 Manage Users
          </Button>
          <Button variant="secondary" size="sm" className="w-full text-xs">
            🏝️ Manage Islands
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            className="w-full text-xs col-span-2"
            onClick={() => {
              clearState();
              window.location.reload();
            }}
          >
            🗑️ Reset Progress
          </Button>
        </div>
      </Card>
    </>
  );
}