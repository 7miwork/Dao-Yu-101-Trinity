/**
 * School Model
 * 
 * SaaS foundation for multi-school support.
 * This model defines the structure for schools in the system.
 */

// ============================================
// Types
// ============================================

export interface School {
  id: string;
  name: string;
  slug: string;
  students: string[];
  teachers: string[];
  admins: string[];
  settings: SchoolSettings;
  metadata: SchoolMetadata;
}

export interface SchoolSettings {
  theme: SchoolTheme;
  features: SchoolFeatures;
  limits: SchoolLimits;
}

export interface SchoolTheme {
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  faviconUrl?: string;
}

export interface SchoolFeatures {
  enableMissions: boolean;
  enableStreaks: boolean;
  enableLeaderboard: boolean;
  enableCertificates: boolean;
  enableAnalytics: boolean;
}

export interface SchoolLimits {
  maxStudents: number;
  maxTeachers: number;
  maxCourses: number;
  storageGB: number;
}

export interface SchoolMetadata {
  createdAt: string;
  updatedAt: string;
  plan: SchoolPlan;
  status: SchoolStatus;
  domain?: string;
  contactEmail: string;
}

export type SchoolPlan = 'free' | 'starter' | 'professional' | 'enterprise';
export type SchoolStatus = 'active' | 'suspended' | 'trial' | 'cancelled';

// ============================================
// Default Configurations
// ============================================

export const DEFAULT_SCHOOL_SETTINGS: SchoolSettings = {
  theme: {
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
  },
  features: {
    enableMissions: true,
    enableStreaks: true,
    enableLeaderboard: true,
    enableCertificates: false,
    enableAnalytics: false,
  },
  limits: {
    maxStudents: 50,
    maxTeachers: 5,
    maxCourses: 10,
    storageGB: 1,
  },
};

export const PLAN_LIMITS: Record<SchoolPlan, SchoolLimits> = {
  free: {
    maxStudents: 50,
    maxTeachers: 5,
    maxCourses: 10,
    storageGB: 1,
  },
  starter: {
    maxStudents: 200,
    maxTeachers: 20,
    maxCourses: 50,
    storageGB: 10,
  },
  professional: {
    maxStudents: 1000,
    maxTeachers: 100,
    maxCourses: 200,
    storageGB: 50,
  },
  enterprise: {
    maxStudents: Infinity,
    maxTeachers: Infinity,
    maxCourses: Infinity,
    storageGB: 500,
  },
};

export const PLAN_FEATURES: Record<SchoolPlan, SchoolFeatures> = {
  free: {
    enableMissions: true,
    enableStreaks: true,
    enableLeaderboard: false,
    enableCertificates: false,
    enableAnalytics: false,
  },
  starter: {
    enableMissions: true,
    enableStreaks: true,
    enableLeaderboard: true,
    enableCertificates: false,
    enableAnalytics: true,
  },
  professional: {
    enableMissions: true,
    enableStreaks: true,
    enableLeaderboard: true,
    enableCertificates: true,
    enableAnalytics: true,
  },
  enterprise: {
    enableMissions: true,
    enableStreaks: true,
    enableLeaderboard: true,
    enableCertificates: true,
    enableAnalytics: true,
  },
};

// ============================================
// Factory Functions
// ============================================

/**
 * Create a new school with default settings
 * 
 * @param name - School name
 * @param contactEmail - Contact email
 * @param plan - Subscription plan (default: 'free')
 * @returns New school object
 */
export function createSchool(
  name: string,
  contactEmail: string,
  plan: SchoolPlan = 'free'
): Omit<School, 'id'> {
  const slug = generateSlug(name);
  const now = new Date().toISOString();

  return {
    name,
    slug,
    students: [],
    teachers: [],
    admins: [],
    settings: {
      ...DEFAULT_SCHOOL_SETTINGS,
      features: PLAN_FEATURES[plan],
      limits: PLAN_LIMITS[plan],
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
      plan,
      status: 'trial',
      contactEmail,
    },
  };
}

/**
 * Generate URL-friendly slug from school name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ============================================
// Validation Functions
// ============================================

/**
 * Check if school can add more students
 */
export function canAddStudent(school: School): boolean {
  return school.students.length < school.settings.limits.maxStudents;
}

/**
 * Check if school can add more teachers
 */
export function canAddTeacher(school: School): boolean {
  return school.teachers.length < school.settings.limits.maxTeachers;
}

/**
 * Check if school has a specific feature enabled
 */
export function hasFeature(school: School, feature: keyof SchoolFeatures): boolean {
  return school.settings.features[feature];
}

/**
 * Check if school is active
 */
export function isSchoolActive(school: School): boolean {
  return school.metadata.status === 'active' || school.metadata.status === 'trial';
}

// ============================================
// Update Functions
// ============================================

/**
 * Upgrade school plan
 */
export function upgradePlan(school: School, newPlan: SchoolPlan): Partial<School> {
  return {
    settings: {
      ...school.settings,
      features: PLAN_FEATURES[newPlan],
      limits: PLAN_LIMITS[newPlan],
    },
    metadata: {
      ...school.metadata,
      plan: newPlan,
      updatedAt: new Date().toISOString(),
    },
  };
}

/**
 * Add student to school
 */
export function addStudent(school: School, studentId: string): Partial<School> | null {
  if (!canAddStudent(school)) {
    return null;
  }
  
  if (school.students.includes(studentId)) {
    return null;
  }

  return {
    students: [...school.students, studentId],
    metadata: {
      ...school.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}

/**
 * Remove student from school
 */
export function removeStudent(school: School, studentId: string): Partial<School> {
  return {
    students: school.students.filter(id => id !== studentId),
    metadata: {
      ...school.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}

// ============================================
// Exports
// ============================================

export const schoolModel = {
  createSchool,
  canAddStudent,
  canAddTeacher,
  hasFeature,
  isSchoolActive,
  upgradePlan,
  addStudent,
  removeStudent,
  defaults: DEFAULT_SCHOOL_SETTINGS,
  planLimits: PLAN_LIMITS,
  planFeatures: PLAN_FEATURES,
};

export default schoolModel;