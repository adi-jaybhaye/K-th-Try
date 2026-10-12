// ====================================================================
// KthTry — Guest to Cloud Migration Service
// Safely merges IndexedDB guest data into Supabase account upon auth
// Idempotent retries, stable UUIDs, complete persistence coverage
// ====================================================================

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { guestStorage } from './guestStorage';
import { generateUUID } from './repository';
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

export interface MigrationResult {
  success: boolean;
  topicsMigrated: number;
  subtopicsMigrated: number;
  problemsMigrated: number;
  attemptsMigrated: number;
  tasksMigrated: number;
  revisionsMigrated: number;
  mockInterviewsMigrated: number;
  placementTasksMigrated: number;
  partialFailures: string[];
  error?: string;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function migrateGuestDataToAccount(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    topicsMigrated: 0,
    subtopicsMigrated: 0,
    problemsMigrated: 0,
    attemptsMigrated: 0,
    tasksMigrated: 0,
    revisionsMigrated: 0,
    mockInterviewsMigrated: 0,
    placementTasksMigrated: 0,
    partialFailures: [],
  };

  if (!isSupabaseConfigured() || !supabase) {
    result.error = 'Supabase is not configured';
    return result;
  }

  const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr || !sessionData?.session?.user?.id) {
    result.error = sessionErr?.message || 'No active authenticated session';
    return result;
  }

  const userId = sessionData.session.user.id;

  // 1. Preferences
  try {
    const guestPrefs = await guestStorage.get<UserPreferences>('preferences', 'current-user-prefs');
    if (guestPrefs) {
      const { error } = await supabase.from('user_preferences').upsert({
        user_id: userId,
        goal: guestPrefs.goal,
        level: guestPrefs.level,
        weekly_hours: guestPrefs.weeklyHours,
        start_date: guestPrefs.startDate,
        target_date: guestPrefs.targetDate,
        plan_duration_weeks: guestPrefs.planDurationWeeks,
        active_days: guestPrefs.activeDays,
        hours_per_day: guestPrefs.hoursPerDay,
        learning_priorities: guestPrefs.learningPriorities,
        review_intervals: guestPrefs.reviewIntervals,
        preferred_language: guestPrefs.preferredLanguage,
        theme: guestPrefs.theme,
        is_onboarded: guestPrefs.isOnboarded,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        result.partialFailures.push(`Preferences: ${error.message}`);
      }
    }
  } catch (err: any) {
    result.partialFailures.push(`Preferences: ${err?.message}`);
  }

  // 2. Topics Progress
  try {
    const topicItems = await guestStorage.getAll<TopicProgress>('topic_progress');
    if (topicItems.length > 0) {
      const topicPayload = topicItems.map((t) => ({
        user_id: userId,
        topic_id: t.topicId,
        is_completed: t.isCompleted,
        mastery_percentage: t.masteryPercentage,
        notes: t.notes,
        last_studied_at: t.lastStudiedAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from('user_topic_progress').upsert(topicPayload, {
        onConflict: 'user_id,topic_id',
      });
      if (error) {
        result.partialFailures.push(`Topics: ${error.message}`);
      } else {
        result.topicsMigrated = topicItems.length;
      }
    }
  } catch (err: any) {
    result.partialFailures.push(`Topics: ${err?.message}`);
  }

  // 3. Subtopics Progress
  try {
    const subtopicItems = await guestStorage.getAll<SubtopicProgress>('subtopic_progress');
    if (subtopicItems.length > 0) {
      const subtopicPayload = subtopicItems.map((s) => ({
        user_id: userId,
        subtopic_id: s.subtopicId,
        checklist_completed: s.checklistCompleted,
        is_completed: s.isCompleted,
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from('user_subtopic_progress').upsert(subtopicPayload, {
        onConflict: 'user_id,subtopic_id',
      });
      if (error) {
        result.partialFailures.push(`Subtopics: ${error.message}`);
      } else {
        result.subtopicsMigrated = subtopicItems.length;
      }
    }
  } catch (err: any) {
    result.partialFailures.push(`Subtopics: ${err?.message}`);
  }

  // 4. Problem Progress
  try {
    const problemItems = await guestStorage.getAll<ProblemProgress>('problem_progress');
    if (problemItems.length > 0) {
      const problemPayload = problemItems.map((p) => ({
        user_id: userId,
        problem_id: p.problemId,
        status: p.status,
        notes: p.notes,
        next_review_date: p.nextReviewDate,
        review_count: p.reviewCount,
        language: p.language || 'Java',
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from('user_problem_progress').upsert(problemPayload, {
        onConflict: 'user_id,problem_id',
      });
      if (error) {
        result.partialFailures.push(`Problems: ${error.message}`);
      } else {
        result.problemsMigrated = problemItems.length;
      }
    }
  } catch (err: any) {
    result.partialFailures.push(`Problems: ${err?.message}`);
  }

  // 5. Problem Attempts (Idempotent via stable UUID / client_id)
  try {
    const attemptItems = await guestStorage.getAll<ProblemAttempt>('problem_attempts');
    if (attemptItems.length > 0) {
      const attemptPayload = attemptItems.map((a) => {
        const isValidUUID = UUID_REGEX.test(a.id);
        const stableId = isValidUUID ? a.id : generateUUID();
        return {
          id: stableId,
          user_id: userId,
          problem_id: a.problemId,
          attempt_status: a.attemptStatus,
          time_spent_minutes: a.timeSpentMinutes,
          hints_used: a.hintsUsed,
          editorial_used: a.editorialUsed,
          approach_notes: a.approachNotes,
          mistakes_encountered: a.mistakesEncountered,
          language: a.language || 'Java',
          client_id: a.clientId || a.id,
          attempted_at: a.attemptedAt,
        };
      });

      const { error } = await supabase.from('problem_attempts').upsert(attemptPayload, {
        onConflict: 'id',
      });
      if (error) {
        result.partialFailures.push(`Attempts: ${error.message}`);
      } else {
        result.attemptsMigrated = attemptItems.length;
      }
    }
  } catch (err: any) {
    result.partialFailures.push(`Attempts: ${err?.message}`);
  }

  // 6. Timeline Tasks
  try {
    const taskItems = await guestStorage.getAll<TimelineTask>('timeline_tasks');
    if (taskItems.length > 0) {
      const taskPayload = taskItems.map((t) => {
        const isValidUUID = UUID_REGEX.test(t.id);
        const stableId = isValidUUID ? t.id : generateUUID();
        return {
          id: stableId,
          user_id: userId,
          title: t.title,
          topic_id: t.topicId,
          scheduled_date: t.scheduledDate,
          duration_minutes: t.durationMinutes,
          task_type: t.taskType,
          status: t.status,
          order_index: t.orderIndex,
          client_id: t.clientId || t.id,
          updated_at: new Date().toISOString(),
        };
      });

      const { error } = await supabase.from('timeline_tasks').upsert(taskPayload, {
        onConflict: 'id',
      });
      if (error) {
        result.partialFailures.push(`Timeline: ${error.message}`);
      } else {
        result.tasksMigrated = taskItems.length;
      }
    }
  } catch (err: any) {
    result.partialFailures.push(`Timeline: ${err?.message}`);
  }

  // 7. Revision Tasks
  try {
    const revItems = await guestStorage.getAll<RevisionTask>('revision_tasks');
    if (revItems.length > 0) {
      const revPayload = revItems.map((r) => {
        const isValidUUID = UUID_REGEX.test(r.id);
        const stableId = isValidUUID ? r.id : generateUUID();
        return {
          id: stableId,
          user_id: userId,
          problem_id: r.problemId,
          due_date: r.dueDate,
          interval_days: r.intervalDays,
          status: r.status,
          completed_at: r.completedAt,
        };
      });

      const { error } = await supabase.from('revision_tasks').upsert(revPayload, {
        onConflict: 'id',
      });
      if (error) {
        result.partialFailures.push(`Revisions: ${error.message}`);
      } else {
        result.revisionsMigrated = revItems.length;
      }
    }
  } catch (err: any) {
    result.partialFailures.push(`Revisions: ${err?.message}`);
  }

  // 8. Mock Interviews
  try {
    const mockItems = await guestStorage.getAll<MockInterviewRecord>('mock_interviews');
    if (mockItems.length > 0) {
      const mockPayload = mockItems.map((m) => {
        const isValidUUID = UUID_REGEX.test(m.id);
        const stableId = isValidUUID ? m.id : generateUUID();
        return {
          id: stableId,
          user_id: userId,
          topic: m.topic,
          duration_minutes: m.durationMinutes,
          outcome: m.outcome,
          problem_title: m.problemTitle,
          code_content: m.codeContent,
          feedback_notes: m.feedbackNotes,
          communication_score: m.communicationScore,
          problem_solving_score: m.problemSolvingScore,
          code_quality_score: m.codeQualityScore,
          conducted_at: m.conductedAt,
        };
      });

      const { error } = await supabase.from('mock_interviews').upsert(mockPayload, {
        onConflict: 'id',
      });
      if (error) {
        result.partialFailures.push(`Mock Interviews: ${error.message}`);
      } else {
        result.mockInterviewsMigrated = mockItems.length;
      }
    }
  } catch (err: any) {
    result.partialFailures.push(`Mock Interviews: ${err?.message}`);
  }

  // 9. Placement Tasks
  try {
    const placementItems = await guestStorage.getAll<PlacementChecklistItem>('placement_tasks');
    if (placementItems.length > 0) {
      const placementPayload = placementItems.map((p) => {
        const isValidUUID = UUID_REGEX.test(p.id);
        const stableId = isValidUUID ? p.id : generateUUID();
        return {
          id: stableId,
          user_id: userId,
          category: p.category,
          task_name: p.taskName,
          is_completed: p.isCompleted,
          notes: p.notes || ('seed_id:' + p.id),
          updated_at: new Date().toISOString(),
        };
      });

      const { error } = await supabase.from('placement_tasks').upsert(placementPayload, {
        onConflict: 'id',
      });
      if (error) {
        result.partialFailures.push(`Placement Tasks: ${error.message}`);
      } else {
        result.placementTasksMigrated = placementItems.length;
      }
    }
  } catch (err: any) {
    result.partialFailures.push(`Placement Tasks: ${err?.message}`);
  }

  result.success = result.partialFailures.length === 0;
  return result;
}
