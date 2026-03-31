# STEP 001 — Trinity Design System + UI Foundation

## Overview
This document outlines the implementation of the Trinity Design System and UI Foundation for the Dao-Yu-101 Learning Management System.

## Architecture Decisions

### 1. Design Token System
**Location:** `src/styles/tokens.css`

**Rationale:**
- Centralized color, spacing, and typography management
- CSS custom properties for dynamic theming
- Role-based color system for visual differentiation
- Scalable foundation for future features

**Token Categories:**
- Base color palette (neutrals)
- Semantic colors (backgrounds, text, borders)
- Role-based colors (student, teacher, admin)
- Spacing scale
- Typography scale
- Border radius, shadows, transitions

### 2. Role-Based Color Strategy

**Student (Green/Cyan):**
- Conveys growth, learning, gamification
- Primary: `#10b981` (green)
- Secondary: `#06b6d4` (cyan)
- Background: `#064e3b` (dark green)

**Teacher (Blue):**
- Conveys trust, clarity, professionalism
- Primary: `#3b82f6` (blue)
- Secondary: `#60a5fa` (light blue)
- Background: `#1e3a8a` (dark blue)

**Admin (Amber/Gold):**
- Conveys authority, system control
- Primary: `#f59e0b` (amber)
- Secondary: `#fbbf24` (gold)
- Background: `#78350f` (dark amber)

### 3. Component Architecture

**Base Components (`src/components/ui/`):**
- `Button.tsx` — Standardized button with variants and sizes
- `Card.tsx` — Flexible card with role-based variants
- `Container.tsx` — Responsive container with max-width options

**Design Principles:**
- Token-based styling (no hardcoded colors)
- Consistent prop APIs across components
- TypeScript interfaces for type safety
- Tailwind CSS for utility-first styling

### 4. Layout System

**Structural Differentiation:**

**StudentLayout:**
- Playful, large spacing (py-8, gap-8)
- Decorative background blurs
- Centered, card-based content
- Footer with motivational text

**TeacherLayout:**
- Dashboard grid (md:grid-cols-3)
- Sticky header with navigation
- Stats-focused sections
- Professional footer

**AdminLayout:**
- Dense, compact spacing (py-4, gap-4)
- 4-column grid for metrics
- System status indicators
- Minimal, control-focused footer

**MainLayout:**
- Base layout with Navbar
- Standard content area
- Generic footer

### 5. Role System

**Location:** `src/app/role.ts`

**Features:**
- `getRoleFromPath()` — Extracts role from URL, defaults to 'student'
- Helper functions for role-specific CSS variables
- Type-safe Role type definition
- Preparation for future global state (Step 002)

**Design Decision:**
- Never returns null — defaults to 'student' for safety
- Path-based detection for simplicity
- Extensible for future authentication integration

### 6. Token Integration with Tailwind

**Pattern:**
```tsx
className="bg-[var(--color-student-primary)]"
```

**Benefits:**
- Dynamic theming without rebuilds
- Consistent visual language
- Easy role-based customization
- No default Tailwind colors used

## Component Design

### Button API
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}
```

### Card API
```typescript
interface CardProps {
  variant: 'default' | 'student' | 'teacher' | 'admin';
  padding: 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  children: React.ReactNode;
}
```

### Container API
```typescript
interface ContainerProps {
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  center?: boolean;
  children: React.ReactNode;
}
```

## Page Implementations

### StudentPage
**Features:**
- Welcome message with gamification feel
- Overall progress card with animated progress bar
- 5 lesson cards with:
  - Progress indicators
  - Difficulty badges
  - Step counters
  - Action buttons
- Quick stats (hours, XP, streak)

**Visual Style:**
- Green/cyan color scheme
- Rounded cards with hover effects
- Gradient progress bars
- Emoji icons for visual interest

### TeacherPage
**Features:**
- 4 stats cards (students, lessons, completion rate, avg score)
- Recent activity feed with color-coded actions
- Quick action buttons

**Visual Style:**
- Blue color scheme
- Dashboard grid layout
- Structured sections
- Professional appearance

### AdminPage
**Features:**
- 8 system metrics with status indicators
- System logs with timestamps
- Quick control buttons

**Visual Style:**
- Amber/gold color scheme
- Dense, compact layout
- Status indicators (healthy/warning/critical)
- System/control feeling

## Navbar Implementation

**Features:**
- Logo: "Dao-Yu-101"
- Navigation links: Home, Student, Teacher, Admin
- Active route highlighting
- Works with basename: `/Dao-Yu-101-Trinity`

**Active State Logic:**
- Home: exact match on `/`
- Other routes: pathname starts with route path

## Router Configuration

**Structure:**
```typescript
{
  path: '/student',
  element: (
    <StudentLayout>
      <StudentPage />
    </StudentLayout>
  ),
}
```

**Basename:** `/Dao-Yu-101-Trinity` (GitHub Pages compatibility)

## Visual Consistency Rules

1. **All colors reference tokens** — No hardcoded hex values in components
2. **Role-based theming** — Each role has distinct visual identity
3. **Structural differentiation** — Layouts differ in spacing, grid, and feel
4. **Token-based spacing** — Use `--spacing-*` variables
5. **Consistent component APIs** — Similar props across components

## File Structure
```
src/
├── app/
│   ├── role.ts              # Role system foundation
│   └── router.tsx           # Updated router with layouts
├── components/
│   ├── layout/
│   │   └── Navbar.tsx       # Navigation with active states
│   └── ui/
│       ├── Button.tsx       # Standardized button
│       ├── Card.tsx         # Role-variant card
│       └── Container.tsx    # Responsive container
├── layouts/
│   ├── MainLayout.tsx       # Base layout with navbar
│   ├── StudentLayout.tsx    # Playful, card-based
│   ├── TeacherLayout.tsx    # Dashboard grid
│   └── AdminLayout.tsx      # Dense, compact
├── pages/
│   ├── StudentPage.tsx      # Lesson cards + progress
│   ├── TeacherPage.tsx      # Stats + activity
│   └── AdminPage.tsx        # System metrics
└── styles/
    ├── tokens.css           # Design tokens
    └── index.css            # Global styles
```

## Verification Checklist

- [x] tokens.css exists with all design tokens
- [x] Components created (Button, Card, Container)
- [x] Layouts implemented (Main, Student, Teacher, Admin)
- [x] Navbar works with active route highlighting
- [x] Routes updated with layouts
- [x] UI visually different per role
- [x] Build works without errors
- [x] GitHub Pages config unchanged

## Future Considerations (Step 002)

- Global state management for authentication
- Role-based access control
- Dynamic theme switching
- Component library documentation
- Storybook integration
- Unit testing for components

## Conclusion

STEP 001 successfully establishes the Trinity Design System with:
- Scalable token-based theming
- Role-specific visual identities
- Reusable component library
- Structurally different layouts
- Foundation for future features

The system is production-ready and maintains GitHub Pages compatibility.