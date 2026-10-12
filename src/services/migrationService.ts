// ====================================================================
// KthTry — Guest to Cloud Migration Service
// Safely merges IndexedDB guest data into Supabase account upon auth
// ====================================================================

import { supabase, isSupabaseConfigured } from './supabaseClient';
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
} from '../types/userData';

export interface MigrationResult {
  success: boolean;
  topicsMigrated: number;
  subtopicsMigrated: number;
  problemsMigrated: number;
  attemptsMigrated: number;
  tasksMigrated: number;
  revisionsMigrated: number;
  error?: string;
}

export async function migrateGuestDataToAccount(): Promise<MigrationResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      topicsMigrated: 0,
      subtopicsMigrated: 0,
      problemsMigrated: 0,
      attemptsMigrated: 0,
      tasksMigrated: 0,
      revisionsMigrated: 0,
      error: 'Supabase is not configured',
    };
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) {
    return {
      success: false,
      topicsMigrated: 0,
      subtopicsMigrated: 0,
      problemsMigrated: 0,
      attemptsMigrated: 0,
      tasksMigrated: 0,
      revisionsMigrated: 0,
      error: 'No active authenticated session',
    };
  }

  try {
    // 1. Preferences
    const guestPrefs = await guestStorage.get<UserPreferences>('preferences', 'current-user-prefs');
    if (guestPrefs) {
      await supabase.from('user_preferences').upsert({
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
      });
    }

    // 2. Topics Progress
    const topicItems = await guestStorage.getAll<TopicProgress>('topic_progress');
    if (topicItems.length > 0) {
      const topicPayload = topicItems.map((t) => ({
        user_id: userId,
        topic_id: t.topicId,
        is_completed: t.isCompleted,
        mastery_percentage: t.masteryPercentage,
        notes: t.notes,
        last_studied_at: t.lastStudiedAt,
      }));
      await supabase.from('user_topic_progress').upsert(topicPayload);
    }

    // 3. Subtopics Progress
    const subtopicItems = await guestStorage.getAll<SubtopicProgress>('subtopic_progress');
    if (subtopicItems.length > 0) {
      const subtopicPayload = subtopicItems.map((s) => ({
        user_id: userId,
        subtopic_id: s.subtopicId,
        checklist_completed: s.checklistCompleted,
        is_completed: s.isCompleted,
      }));
      await supabase.from('user_subtopic_progress').upsert(subtopicPayload);
    }

    // 4. Problem Progress
    const problemItems = await guestStorage.getAll<ProblemProgress>('problem_progress');
    if (problemItems.length > 0) {
      const problemPayload = problemItems.map((p) => ({
        user_id: userId,
        problem_id: p.problemId,
        status: p.status,
        notes: p.notes,
        next_review_date: p.nextReviewDate,
        review_count: p.reviewCount,
      }));
      await supabase.from('user_problem_progress').upsert(problemPayload);
    }

    // 5. Attempts
    const attemptItems = await guestStorage.getAll<ProblemAttempt>('problem_attempts');
    if (attemptItems.length > 0) {
      const attemptPayload = attemptItems.map((a) => ({
        user_id: userId,
        problem_id: a.problemId,
        attempt_status: a.attemptStatus,
        time_spent_minutes: a.timeSpentMinutes,
        hints_used: a.hintsUsed,
        editorial_used: a.editorialUsed,
        approach_notes: a.approachNotes,
        mistakes_encountered: a.mistakesEncountered,
        attempted_at: a.attemptedAt,
      }));
      await supabase.from('problem_attempts').insert(attemptPayload);
    }

    // 6. Timeline Tasks
    const taskItems = await guestStorage.getAll<TimelineTask>('timeline_tasks');
    if (taskItems.length > 0) {
      const taskPayload = taskItems.map((t) => ({
        user_id: userId,
        title: t.title,
        topic_id: t.topicId,
        scheduled_date: t.scheduledDate,
        duration_minutes: t.durationMinutes,
        task_type: t.taskType,
        status: t.status,
        order_index: t.orderIndex,
      }));
      await supabase.from('timeline_tasks').upsert(taskPayload);
    }

    // 7. Revision Tasks
    const revItems = await guestStorage.getAll<RevisionTask>('revision_tasks');
    if (revItems.length > 0) {
      const revPayload = revItems.map((r) => ({
        user_id: userId,
        problem_id: r.problemId,
        due_date: r.dueDate,
        interval_days: r.intervalDays,
        status: r.status,
        completed_at: r.completedAt,
      }));
      await supabase.from('revision_tasks').upsert(revPayload);
    }

    return {
      success: true,
      topicsMigrated: topicItems.length,
      subtopicsMigrated: subtopicItems.length,
      problemsMigrated: problemItems.length,
      attemptsMigrated: attemptItems.length,
      tasksMigrated: taskItems.length,
      revisionsMigrated: revItems.length,
    };
  } catch (err: any) {
    return {
      success: false,
      topicsMigrated: 0,
      subtopicsMigrated: 0,
      problemsMigrated: 0,
      attemptsMigrated: 0,
      tasksMigrated: 0,
      revisionsMigrated: 0,
      error: err?.message || 'Migration encountered an unexpected error',
    };
  }
}
