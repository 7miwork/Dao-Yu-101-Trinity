import React from 'react';

export interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  center?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Container({
  maxWidth = 'xl',
  center = true,
  children,
  className = '',
}: ContainerProps) {
  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  };

  const centerStyles = center ? 'mx-auto' : '';

  return (
    <div
      className={`w-full px-4 sm:px-6 lg:px-8 ${maxWidthStyles[maxWidth]} ${centerStyles} ${className}`}
    >
      {children}
    </div>
  );
}