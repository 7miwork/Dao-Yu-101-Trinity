import React from 'react';
import { Container } from '@/components/ui/Container';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-student-bg)]">
      {/* Decorative background elements for playful feel */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--color-student-primary)] opacity-10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--color-student-secondary)] opacity-10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-student-accent)] opacity-5 rounded-full blur-3xl" />
      </div>

      {/* Main content area with large spacing and centered layout */}
      <main className="relative z-10 py-8 md:py-12">
        <Container maxWidth="lg">
          <div className="flex flex-col items-center gap-8 md:gap-10">
            {children}
          </div>
        </Container>
      </main>

      {/* Footer with student theme */}
      <footer className="relative z-10 py-6 border-t border-[var(--color-student-border)]">
        <Container maxWidth="lg">
          <div className="text-center text-[var(--color-student-text)] text-sm opacity-70">
            Dao-Yu-101 Student Portal — Learn, Grow, Achieve
          </div>
        </Container>
      </footer>
    </div>
  );
}