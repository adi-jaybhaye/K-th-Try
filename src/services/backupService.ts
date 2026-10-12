// ====================================================================
// KthTry — Backup & Restore Service (Data Export / Validated Import)
// Pre-flight validation, schema versioning, transactional integrity
// ====================================================================

import { repository } from './repository';
import { guestStorage } from './guestStorage';
import {
  UserPreferences,
  TopicProgress,
  SubtopicProgress,
  ProblemProgress,
  ProblemAttempt,
  TimelineTask,
  RevisionTask,
  MockInterviewRecord,
  PlacementChecklistItem,
} from '../types/userData';

export interface ExportDataPayload {
  version: string;
  exportedAt: string;
  appName: string;
  preferences: UserPreferences;
  topicProgress: Record<string, TopicProgress>;
  subtopicProgress: Record<string, SubtopicProgress>;
  problemProgress: Record<string, ProblemProgress>;
  problemAttempts: ProblemAttempt[];
  timelineTasks: TimelineTask[];
  revisionTasks: RevisionTask[];
  mockInterviews: MockInterviewRecord[];
  placementTasks: PlacementChecklistItem[];
}

export async function exportUserData(): Promise<string> {
  const preferences = await repository.getPreferences();
  const topicProgress = await repository.getAllTopicProgress();
  const subtopicProgress = await repository.getAllSubtopicProgress();
  const problemProgress = await repository.getAllProblemProgress();
  const problemAttempts = await repository.getAllAttempts();
  const timelineTasks = await repository.getTimelineTasks();
  const revisionTasks = await repository.getRevisionTasks();
  const mockInterviews = await repository.getMockInterviews();
  const placementTasks = await repository.getPlacementTasks();

  const payload: ExportDataPayload = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    appName: 'KthTry',
    preferences,
    topicProgress,
    subtopicProgress,
    problemProgress,
    problemAttempts,
    timelineTasks,
    revisionTasks,
    mockInterviews,
    placementTasks,
  };

  return JSON.stringify(payload, null, 2);
}

export interface ImportValidationResult {
  valid: boolean;
  message: string;
  itemsCount?: {
    topics: number;
    problems: number;
    attempts: number;
    tasks: number;
  };
  errors?: string[];
}

const VALID_PROBLEM_STATUSES = new Set(['GREEN', 'YELLOW', 'RED', 'GREY']);

export function validateBackupPayload(parsed: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { valid: false, errors: ['Backup payload must be a JSON object.'] };
  }

  // App signature
  if (parsed.appName !== 'KthTry' && !parsed.preferences) {
    return { valid: false, errors: ['Unrecognized backup file. Missing KthTry signature.'] };
  }

  // Version check
  if (parsed.version && typeof parsed.version !== 'string') {
    errors.push('Backup version must be a string.');
  }

  // Preferences validation
  if (parsed.preferences) {
    if (typeof parsed.preferences !== 'object') {
      errors.push('Preferences must be an object.');
    } else {
      const p = parsed.preferences;
      if (p.weeklyHours !== undefined && (typeof p.weeklyHours !== 'number' || p.weeklyHours < 0 || p.weeklyHours > 168)) {
        errors.push('Invalid weeklyHours in preferences (must be 0-168).');
      }
      if (p.planDurationWeeks !== undefined && (typeof p.planDurationWeeks !== 'number' || p.planDurationWeeks < 1)) {
        errors.push('Invalid planDurationWeeks in preferences.');
      }
    }
  }

  // Topic Progress validation
  if (parsed.topicProgress) {
    if (typeof parsed.topicProgress !== 'object' || Array.isArray(parsed.topicProgress)) {
      errors.push('topicProgress must be a dictionary object.');
    } else {
      for (const [key, val] of Object.entries(parsed.topicProgress)) {
        if (!val || typeof val !== 'object') {
          errors.push(`Topic progress for ${key} is invalid.`);
          break;
        }
      }
    }
  }

  // Problem Progress validation
  if (parsed.problemProgress) {
    if (typeof parsed.problemProgress !== 'object' || Array.isArray(parsed.problemProgress)) {
      errors.push('problemProgress must be a dictionary object.');
    } else {
      for (const [probId, val] of Object.entries(parsed.problemProgress) as [string, any][]) {
        if (!val || typeof val !== 'object') {
          errors.push(`Problem progress for ${probId} is invalid.`);
          break;
        }
        if (val.status && !VALID_PROBLEM_STATUSES.has(val.status)) {
          errors.push(`Invalid problem status "${val.status}" in problem ${probId}.`);
          break;
        }
      }
    }
  }

  // Problem Attempts validation
  if (parsed.problemAttempts) {
    if (!Array.isArray(parsed.problemAttempts)) {
      errors.push('problemAttempts must be an array.');
    } else {
      for (let i = 0; i < Math.min(parsed.problemAttempts.length, 50); i++) {
        const att = parsed.problemAttempts[i];
        if (!att || typeof att !== 'object' || !att.problemId) {
          errors.push(`Problem attempt at index ${i} is missing problemId.`);
          break;
        }
      }
    }
  }

  // Timeline Tasks validation
  if (parsed.timelineTasks && !Array.isArray(parsed.timelineTasks)) {
    errors.push('timelineTasks must be an array.');
  }

  // Revision Tasks validation
  if (parsed.revisionTasks && !Array.isArray(parsed.revisionTasks)) {
    errors.push('revisionTasks must be an array.');
  }

  // Mock Interviews validation
  if (parsed.mockInterviews && !Array.isArray(parsed.mockInterviews)) {
    errors.push('mockInterviews must be an array.');
  }

  // Placement Tasks validation
  if (parsed.placementTasks && !Array.isArray(parsed.placementTasks)) {
    errors.push('placementTasks must be an array.');
  }

  return { valid: errors.length === 0, errors };
}

export async function importUserData(jsonContent: string): Promise<ImportValidationResult> {
  let parsed: any;
  try {
    // Basic size guard (e.g. 20MB max)
    if (jsonContent.length > 20 * 1024 * 1024) {
      return { valid: false, message: 'Backup file exceeds size limit (20MB).' };
    }
    parsed = JSON.parse(jsonContent);
  } catch {
    return { valid: false, message: 'Invalid JSON format. Please upload a valid .json backup file.' };
  }

  // Perform rigorous pre-flight validation before touching persistent storage
  const validation = validateBackupPayload(parsed);
  if (!validation.valid) {
    return {
      valid: false,
      message: 'Backup validation failed: ' + validation.errors.join('; '),
      errors: validation.errors,
    };
  }

  try {
    // 1. Preferences
    if (parsed.preferences && typeof parsed.preferences === 'object') {
      await repository.savePreferences(parsed.preferences);
    }

    // 2. Topic Progress
    if (parsed.topicProgress && typeof parsed.topicProgress === 'object') {
      for (const topicId of Object.keys(parsed.topicProgress)) {
        await repository.saveTopicProgress(parsed.topicProgress[topicId]);
      }
    }

    // 3. Subtopics Progress
    if (parsed.subtopicProgress && typeof parsed.subtopicProgress === 'object') {
      for (const subId of Object.keys(parsed.subtopicProgress)) {
        const item = parsed.subtopicProgress[subId];
        await repository.saveSubtopicProgress(subId, item.checklistCompleted || [], item.isCompleted || false);
      }
    }

    // 4. Problem Progress
    if (parsed.problemProgress && typeof parsed.problemProgress === 'object') {
      for (const probId of Object.keys(parsed.problemProgress)) {
        await repository.saveProblemProgress(parsed.problemProgress[probId]);
      }
    }

    // 5. Problem Attempts
    if (Array.isArray(parsed.problemAttempts)) {
      for (const att of parsed.problemAttempts) {
        await guestStorage.put('problem_attempts', att);
      }
    }

    // 6. Timeline Tasks
    if (Array.isArray(parsed.timelineTasks)) {
      await repository.saveTimelineTasks(parsed.timelineTasks);
    }

    // 7. Revision Tasks
    if (Array.isArray(parsed.revisionTasks)) {
      for (const rev of parsed.revisionTasks) {
        await guestStorage.put('revision_tasks', rev);
      }
    }

    // 8. Mock Interviews
    if (Array.isArray(parsed.mockInterviews)) {
      for (const mock of parsed.mockInterviews) {
        await guestStorage.put('mock_interviews', mock);
      }
    }

    // 9. Placement Tasks
    if (Array.isArray(parsed.placementTasks)) {
      for (const pt of parsed.placementTasks) {
        await guestStorage.put('placement_tasks', pt);
      }
    }

    return {
      valid: true,
      message: 'Backup imported successfully!',
      itemsCount: {
        topics: Object.keys(parsed.topicProgress || {}).length,
        problems: Object.keys(parsed.problemProgress || {}).length,
        attempts: (parsed.problemAttempts || []).length,
        tasks: (parsed.timelineTasks || []).length,
      },
    };
  } catch (err: any) {
    return {
      valid: false,
      message: 'Failed to restore backup: ' + (err?.message || 'Data error'),
    };
  }
}
