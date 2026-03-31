import React from 'react';
import { Container } from '@/components/ui/Container';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-admin-bg)]">
      {/* Dense header bar for admin system */}
      <header className="sticky top-0 z-50 bg-[var(--color-admin-bg-light)] border-b border-[var(--color-admin-border)]">
        <Container maxWidth="xl">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[var(--color-admin-primary)] rounded-full animate-pulse" />
              <span className="text-[var(--color-admin-text)] font-semibold text-base">
                System Administration
              </span>
            </div>
            <div className="flex items-center gap-4 text-[var(--color-admin-text)] text-xs opacity-80">
              <span>Status: Online</span>
              <span>|</span>
              <span>Admin Access</span>
            </div>
          </div>
        </Container>
      </header>

      {/* Main content area with dense, compact layout */}
      <main className="py-4 md:py-6">
        <Container maxWidth="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {children}
          </div>
        </Container>
      </main>

      {/* Dense footer with system info */}
      <footer className="py-3 border-t border-[var(--color-admin-border)] bg-[var(--color-admin-bg-light)]">
        <Container maxWidth="xl">
          <div className="flex items-center justify-between text-[var(--color-admin-text)] text-xs opacity-60">
            <span>Dao-Yu-101 Admin Console v1.0</span>
            <span>System Control Panel</span>
          </div>
        </Container>
      </footer>
    </div>
  );
}