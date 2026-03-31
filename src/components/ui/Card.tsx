import React from 'react';

export interface CardProps {
  variant?: 'default' | 'student' | 'teacher' | 'admin';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  children,
  onClick,
  className = '',
}: CardProps) {
  const baseStyles = 'rounded-xl border transition-all duration-200';

  const variantStyles = {
    default: 'bg-[var(--color-bg-surface)] border-[var(--color-border)]',
    student: 'bg-[var(--color-student-bg)] border-[var(--color-student-border)]',
    teacher: 'bg-[var(--color-teacher-bg)] border-[var(--color-teacher-border)]',
    admin: 'bg-[var(--color-admin-bg)] border-[var(--color-admin-border)]',
  };

  const paddingStyles = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  const hoverStyles = hover
    ? 'hover:shadow-lg hover:scale-[1.02] hover:border-opacity-80'
    : '';

  const clickableStyles = clickable
    ? 'cursor-pointer active:scale-[0.98]'
    : '';

  return (
    <div
      onClick={clickable ? onClick : undefined}
      {...(clickable ? { role: 'button', tabIndex: 0 } : {})}
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${clickableStyles} ${className}`}
    >
      {children}
    </div>
  );
}