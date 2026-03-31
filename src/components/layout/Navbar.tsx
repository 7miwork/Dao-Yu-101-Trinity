import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container } from '@/components/ui/Container';

export function Navbar() {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/student', label: 'Student' },
    { path: '/teacher', label: 'Teacher' },
    { path: '/admin', label: 'Admin' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-bg-surface)] border-b border-[var(--color-border)] backdrop-blur-sm bg-opacity-90">
      <Container maxWidth="xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
          >
            Dao-Yu-101
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </nav>
  );
}