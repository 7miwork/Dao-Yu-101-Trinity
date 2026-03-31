import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Container } from '@/components/ui/Container';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Navigation bar */}
      <Navbar />

      {/* Main content area */}
      <main className="py-8 md:py-12">
        <Container maxWidth="lg">
          {children}
        </Container>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--color-border)] mt-auto">
        <Container maxWidth="lg">
          <div className="text-center text-[var(--color-text-secondary)] text-sm">
            <p className="mb-2">Dao-Yu-101 Trinity — Learning Management System</p>
            <p className="opacity-60">Empowering education through technology</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}