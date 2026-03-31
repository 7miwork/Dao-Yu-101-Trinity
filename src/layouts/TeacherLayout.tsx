import React from 'react';
import { Container } from '@/components/ui/Container';

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export function TeacherLayout({ children }: TeacherLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-teacher-bg)]">
      {/* Header bar for teacher dashboard */}
      <header className="sticky top-0 z-50 bg-[var(--color-teacher-bg-light)] border-b border-[var(--color-teacher-border)] backdrop-blur-sm">
        <Container maxWidth="xl">
          <div className="flex items-center justify-between h-14">
            <div className="text-[var(--color-teacher-text)] font-semibold text-lg">
              Teacher Dashboard
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[var(--color-teacher-text)] text-sm opacity-80">
                Welcome back
              </span>
            </div>
          </div>
        </Container>
      </header>

      {/* Main content area with dashboard grid layout */}
      <main className="py-6 md:py-8">
        <Container maxWidth="xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {children}
          </div>
        </Container>
      </main>

      {/* Footer with teacher theme */}
      <footer className="py-4 border-t border-[var(--color-teacher-border)] bg-[var(--color-teacher-bg-light)]">
        <Container maxWidth="xl">
          <div className="flex items-center justify-between text-[var(--color-teacher-text)] text-sm opacity-70">
            <span>Dao-Yu-101 Teacher Portal</span>
            <span>Empowering Educators</span>
          </div>
        </Container>
      </footer>
    </div>
  );
}