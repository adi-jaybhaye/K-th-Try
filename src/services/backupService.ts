// ====================================================================
// KthTry — Backup & Restore Service (Data Export / Validated Import)
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
}

export async function importUserData(jsonContent: string): Promise<ImportValidationResult> {
  let parsed: any;
  try {
    parsed = JSON.parse(jsonContent);
  } catch {
    return { valid: false, message: 'Invalid JSON format. Please upload a valid .json backup file.' };
  }

  // Schema validation
  if (!parsed || typeof parsed !== 'object') {
    return { valid: false, message: 'Invalid backup structure.' };
  }

  if (parsed.appName !== 'KthTry' && !parsed.preferences) {
    return { valid: false, message: 'Unrecognized backup file. Missing KthTry signature.' };
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
