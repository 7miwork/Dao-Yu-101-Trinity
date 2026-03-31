/**
 * User Model
 * 
 * Defines the user interface and default user for the learning system.
 * This is a foundation for future backend integration.
 */

/**
 * User Interface
 * 
 * Basic user model for the learning system.
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  
  /** Display name for the user */
  name: string;
}

/**
 * Default User
 * 
 * Temporary hardcoded user for development.
 * Will be replaced with proper authentication in the future.
 */
export const defaultUser: User = {
  id: '1',
  name: 'Player',
};