/**
 * Role System Foundation
 * 
 * Provides role-based logic for the Trinity Design System.
 * Used for layout selection, color theming, and future global state.
 */

export type Role = 'student' | 'teacher' | 'admin';

/**
 * Extracts role from URL pathname.
 * NEVER returns null — defaults to 'student' as fallback.
 * 
 * @param pathname - The URL pathname to parse
 * @returns The detected role (student, teacher, or admin)
 */
export function getRoleFromPath(pathname: string): Role {
  if (pathname.includes('/teacher')) return 'teacher';
  if (pathname.includes('/admin')) return 'admin';
  return 'student'; // Default fallback — NEVER null
}

/**
 * Returns the CSS variable name for a role's primary color.
 * 
 * @param role - The role to get the color for
 * @returns CSS variable name (e.g., '--color-student-primary')
 */
export function getRolePrimaryColor(role: Role): string {
  const colorMap: Record<Role, string> = {
    student: '--color-student-primary',
    teacher: '--color-teacher-primary',
    admin: '--color-admin-primary',
  };
  return colorMap[role];
}

/**
 * Returns the CSS variable name for a role's secondary color.
 * 
 * @param role - The role to get the color for
 * @returns CSS variable name (e.g., '--color-student-secondary')
 */
export function getRoleSecondaryColor(role: Role): string {
  const colorMap: Record<Role, string> = {
    student: '--color-student-secondary',
    teacher: '--color-teacher-secondary',
    admin: '--color-admin-secondary',
  };
  return colorMap[role];
}

/**
 * Returns the CSS variable name for a role's background color.
 * 
 * @param role - The role to get the color for
 * @returns CSS variable name (e.g., '--color-student-bg')
 */
export function getRoleBgColor(role: Role): string {
  const colorMap: Record<Role, string> = {
    student: '--color-student-bg',
    teacher: '--color-teacher-bg',
    admin: '--color-admin-bg',
  };
  return colorMap[role];
}