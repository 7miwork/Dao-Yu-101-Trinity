/**
 * Date Utility Functions
 * 
 * Helper functions for date comparisons used in streak tracking.
 */

/**
 * Check if two dates are on the same day
 * @param a - First date
 * @param b - Second date
 * @returns true if both dates are on the same calendar day
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Check if a date was yesterday relative to another date
 * @param date - The date to check
 * @param reference - The reference date (defaults to today)
 * @returns true if date was the day before reference
 */
export function isYesterday(date: Date, reference: Date = new Date()): boolean {
  const yesterday = new Date(reference);
  yesterday.setDate(yesterday.getDate() - 1);
  
  return isSameDay(date, yesterday);
}

/**
 * Check if a date is today
 * @param date - The date to check
 * @returns true if the date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Get the start of today (midnight)
 * @returns Date object set to midnight today
 */
export function getStartOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Format a date as ISO string (YYYY-MM-DD)
 * @param date - The date to format
 * @returns ISO date string
 */
export function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parse an ISO date string to a Date object
 * @param isoString - ISO date string (YYYY-MM-DD)
 * @returns Date object
 */
export function fromISODateString(isoString: string): Date {
  return new Date(isoString + 'T00:00:00');
}