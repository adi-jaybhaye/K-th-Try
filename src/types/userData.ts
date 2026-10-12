import { ProblemStatus, PriorityLevel } from './curriculum';

export interface UserPreferences {
  id: string; // 'current-user-prefs' for guest
  goal: 'foundations' | 'internships' | 'campus-placements' | 'general-sde';
  level: 'beginner' | 'java-foundations' | 'basic-problems' | 'comfortable-easy' | 'solving-medium';
  weeklyHours: number;
  startDate: string; // ISO date YYYY-MM-DD
  targetDate: string; // ISO date YYYY-MM-DD
  planDurationWeeks: number;
  activeDays: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  hoursPerDay: Record<string, number>;
  learningPriorities: 'all' | 'core-first' | 'weak-first' | 'custom';
  reviewIntervals: number[]; // [1, 7, 21]
  preferredLanguage: string;
  theme: 'light' | 'dark';
  isOnboarded: boolean;
}

export interface TopicProgress {
  id: string; // topicId
  topicId: string;
  isCompleted: boolean;
  masteryPercentage: number;
  lastStudiedAt?: string;
  notes?: string;
}

export interface SubtopicProgress {
  id: string; // subtopicId
  subtopicId: string;
  checklistCompleted: string[];
  isCompleted: boolean;
}

export interface ProblemProgress {
  id: string; // problemId
  problemId: string;
  status: ProblemStatus;
  notes?: string;
  nextReviewDate?: string; // YYYY-MM-DD
  reviewCount: number;
  lastAttemptedAt?: string;
  tags?: string[];
  language?: string;
}

export interface ProblemAttempt {
  id: string;
  problemId: string;
  attemptStatus: ProblemStatus;
  timeSpentMinutes: number;
  hintsUsed: boolean;
  editorialUsed: boolean;
  approachNotes?: string;
  mistakesEncountered?: string;
  complexityExplained?: string;
  attemptedAt: string; // ISO timestamp
  language?: string;
  clientId?: string;
}

export type TaskType = 'lesson' | 'practice' | 'revision' | 'mock' | 'buffer' | 'milestone';
export type TaskStatus = 'pending' | 'completed' | 'skipped' | 'rescheduled';

export interface TimelineTask {
  id: string;
  studyPlanId?: string;
  title: string;
  topicId?: string;
  scheduledDate: string; // YYYY-MM-DD
  durationMinutes: number;
  taskType: TaskType;
  status: TaskStatus;
  orderIndex: number;
  notes?: string;
  clientId?: string;
}

export interface RevisionTask {
  id: string;
  problemId: string;
  dueDate: string; // YYYY-MM-DD
  intervalDays: number;
  status: 'due' | 'completed' | 'postponed';
  completedAt?: string;
}

export interface MockInterviewRecord {
  id: string;
  topic: string;
  durationMinutes: number;
  outcome: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Leaning No Hire' | 'No Hire';
  problemTitle: string;
  codeContent: string;
  feedbackNotes: string;
  communicationScore: number;
  problemSolvingScore: number;
  codeQualityScore: number;
  conductedAt: string;
}

export interface PlacementChecklistItem {
  id: string;
  category: 'oop' | 'dbms' | 'os' | 'cn' | 'aptitude' | 'behavioral' | 'tracks' | 'resume';
  taskName: string;
  description?: string;
  isCompleted: boolean;
  notes?: string;
}
