// ====================================================================
// KthTry — Unified Data Repository
// Transparently handles both Supabase (Cloud) and IndexedDB (Guest)
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
  PlacementChecklistItem,
} from '../types/userData';

const DEFAULT_PREFERENCES: UserPreferences = {
  id: 'current-user-prefs',
  goal: 'campus-placements',
  level: 'comfortable-easy',
  weeklyHours: 15,
  startDate: new Date().toISOString().split('T')[0],
  targetDate: new Date(Date.now() + 84 * 86400000).toISOString().split('T')[0], // 12 weeks
  planDurationWeeks: 12,
  activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  hoursPerDay: { Mon: 2, Tue: 2, Wed: 2, Thu: 2, Fri: 2, Sat: 3, Sun: 0 },
  learningPriorities: 'core-first',
  reviewIntervals: [1, 7, 21],
  preferredLanguage: 'Java',
  theme: 'light',
  isOnboarded: false,
};

export class Repository {
  private async getAuthUserId(): Promise<string | null> {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      const { data } = await supabase.auth.getSession();
      return data?.session?.user?.id || null;
    } catch {
      return null;
    }
  }

  // 1. USER PREFERENCES
  async getPreferences(): Promise<UserPreferences> {
    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!error && data) {
        return {
          id: data.user_id,
          goal: data.goal,
          level: data.level,
          weeklyHours: data.weekly_hours,
          startDate: data.start_date || DEFAULT_PREFERENCES.startDate,
          targetDate: data.target_date || DEFAULT_PREFERENCES.targetDate,
          planDurationWeeks: data.plan_duration_weeks || 12,
          activeDays: data.active_days || DEFAULT_PREFERENCES.activeDays,
          hoursPerDay: data.hours_per_day || DEFAULT_PREFERENCES.hoursPerDay,
          learningPriorities: data.learning_priorities || 'core-first',
          reviewIntervals: data.review_intervals || [1, 7, 21],
          preferredLanguage: data.preferred_language || 'Java',
          theme: data.theme || 'light',
          isOnboarded: true,
        };
      }
    }

    // Guest fallback
    const guestPrefs = await guestStorage.get<UserPreferences>('preferences', 'current-user-prefs');
    return guestPrefs || DEFAULT_PREFERENCES;
  }

  async savePreferences(prefs: UserPreferences): Promise<void> {
    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      await supabase.from('user_preferences').upsert({
        user_id: userId,
        goal: prefs.goal,
        level: prefs.level,
        weekly_hours: prefs.weeklyHours,
        start_date: prefs.startDate,
        target_date: prefs.targetDate,
        plan_duration_weeks: prefs.planDurationWeeks,
        active_days: prefs.activeDays,
        hours_per_day: prefs.hoursPerDay,
        learning_priorities: prefs.learningPriorities,
        review_intervals: prefs.reviewIntervals,
        preferred_language: prefs.preferredLanguage,
        theme: prefs.theme,
        updated_at: new Date().toISOString(),
      });
    }

    // Always mirror to guest storage as well
    await guestStorage.put('preferences', { ...prefs, id: 'current-user-prefs' });
  }

  // 2. TOPIC PROGRESS
  async getAllTopicProgress(): Promise<Record<string, TopicProgress>> {
    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      const { data } = await supabase.from('user_topic_progress').select('*').eq('user_id', userId);
      const map: Record<string, TopicProgress> = {};
      data?.forEach((row) => {
        map[row.topic_id] = {
          id: row.topic_id,
          topicId: row.topic_id,
          isCompleted: row.is_completed,
          masteryPercentage: row.mastery_percentage,
          lastStudiedAt: row.last_studied_at,
          notes: row.notes,
        };
      });
      return map;
    }

    const items = await guestStorage.getAll<TopicProgress>('topic_progress');
    const map: Record<string, TopicProgress> = {};
    items.forEach((item) => {
      map[item.topicId] = item;
    });
    return map;
  }

  async saveTopicProgress(progress: TopicProgress): Promise<void> {
    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      await supabase.from('user_topic_progress').upsert({
        user_id: userId,
        topic_id: progress.topicId,
        is_completed: progress.isCompleted,
        mastery_percentage: progress.masteryPercentage,
        last_studied_at: new Date().toISOString(),
        notes: progress.notes,
        updated_at: new Date().toISOString(),
      });
    }

    await guestStorage.put('topic_progress', { ...progress, id: progress.topicId });
  }

  // 3. SUBTOPIC PROGRESS (Checklists)
  async getAllSubtopicProgress(): Promise<Record<string, SubtopicProgress>> {
    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      const { data } = await supabase.from('user_subtopic_progress').select('*').eq('user_id', userId);
      const map: Record<string, SubtopicProgress> = {};
      data?.forEach((row) => {
        map[row.subtopic_id] = {
          id: row.subtopic_id,
          subtopicId: row.subtopic_id,
          checklistCompleted: row.checklist_completed || [],
          isCompleted: row.is_completed,
        };
      });
      return map;
    }

    const items = await guestStorage.getAll<SubtopicProgress>('subtopic_progress');
    const map: Record<string, SubtopicProgress> = {};
    items.forEach((item) => {
      map[item.subtopicId] = item;
    });
    return map;
  }

  async saveSubtopicProgress(subtopicId: string, checklistCompleted: string[], isCompleted: boolean): Promise<void> {
    const payload: SubtopicProgress = {
      id: subtopicId,
      subtopicId,
      checklistCompleted,
      isCompleted,
    };

    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      await supabase.from('user_subtopic_progress').upsert({
        user_id: userId,
        subtopic_id: subtopicId,
        checklist_completed: checklistCompleted,
        is_completed: isCompleted,
        updated_at: new Date().toISOString(),
      });
    }

    await guestStorage.put('subtopic_progress', payload);
  }

  // 4. PROBLEMS & ATTEMPTS
  async getAllProblemProgress(): Promise<Record<string, ProblemProgress>> {
    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      const { data } = await supabase.from('user_problem_progress').select('*').eq('user_id', userId);
      const map: Record<string, ProblemProgress> = {};
      data?.forEach((row) => {
        map[row.problem_id] = {
          id: row.problem_id,
          problemId: row.problem_id,
          status: row.status,
          notes: row.notes,
          nextReviewDate: row.next_review_date,
          reviewCount: row.review_count,
        };
      });
      return map;
    }

    const items = await guestStorage.getAll<ProblemProgress>('problem_progress');
    const map: Record<string, ProblemProgress> = {};
    items.forEach((item) => {
      map[item.problemId] = item;
    });
    return map;
  }

  async saveProblemProgress(progress: ProblemProgress): Promise<void> {
    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      await supabase.from('user_problem_progress').upsert({
        user_id: userId,
        problem_id: progress.problemId,
        status: progress.status,
        notes: progress.notes,
        next_review_date: progress.nextReviewDate,
        review_count: progress.reviewCount,
        updated_at: new Date().toISOString(),
      });
    }

    await guestStorage.put('problem_progress', { ...progress, id: progress.problemId });
  }

  async getAllAttempts(): Promise<ProblemAttempt[]> {
    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      const { data } = await supabase
        .from('problem_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('attempted_at', { ascending: false });

      if (data) {
        return data.map((row) => ({
          id: row.id,
          problemId: row.problem_id,
          attemptStatus: row.attempt_status,
          timeSpentMinutes: row.time_spent_minutes,
          hintsUsed: row.hints_used,
          editorialUsed: row.editorial_used,
          approachNotes: row.approach_notes,
          mistakesEncountered: row.mistakes_encountered,
          attemptedAt: row.attempted_at,
        }));
      }
    }

    return await guestStorage.getAll<ProblemAttempt>('problem_attempts');
  }

  async recordAttempt(attempt: Omit<ProblemAttempt, 'id' | 'attemptedAt'>): Promise<ProblemAttempt> {
    const newAttempt: ProblemAttempt = {
      ...attempt,
      id: 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      attemptedAt: new Date().toISOString(),
    };

    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      await supabase.from('problem_attempts').insert({
        user_id: userId,
        problem_id: newAttempt.problemId,
        attempt_status: newAttempt.attemptStatus,
        time_spent_minutes: newAttempt.timeSpentMinutes,
        hints_used: newAttempt.hintsUsed,
        editorial_used: newAttempt.editorialUsed,
        approach_notes: newAttempt.approachNotes,
        mistakes_encountered: newAttempt.mistakesEncountered,
        attempted_at: newAttempt.attemptedAt,
      });
    }

    await guestStorage.put('problem_attempts', newAttempt);

    // Automatically update problem progress and schedule revision based on status
    const currentProgress = (await this.getAllProblemProgress())[newAttempt.problemId] || {
      id: newAttempt.problemId,
      problemId: newAttempt.problemId,
      status: newAttempt.attemptStatus,
      reviewCount: 0,
    };

    const reviewIntervalDays =
      newAttempt.attemptStatus === 'GREEN'
        ? currentProgress.reviewCount === 0 ? 3 : 14
        : newAttempt.attemptStatus === 'YELLOW' ? 1 : 1;

    const nextReview = new Date(Date.now() + reviewIntervalDays * 86400000).toISOString().split('T')[0];

    const updatedProgress: ProblemProgress = {
      ...currentProgress,
      status: newAttempt.attemptStatus,
      reviewCount: (currentProgress.reviewCount || 0) + 1,
      nextReviewDate: nextReview,
      lastAttemptedAt: newAttempt.attemptedAt,
    };

    await this.saveProblemProgress(updatedProgress);

    // Schedule revision task
    await this.scheduleRevision(newAttempt.problemId, nextReview, reviewIntervalDays);

    return newAttempt;
  }

  // 5. TIMELINE TASKS
  async getTimelineTasks(): Promise<TimelineTask[]> {
    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      const { data } = await supabase
        .from('timeline_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('scheduled_date', { ascending: true });

      if (data) {
        return data.map((row) => ({
          id: row.id,
          studyPlanId: row.study_plan_id,
          title: row.title,
          topicId: row.topic_id,
          scheduledDate: row.scheduled_date,
          durationMinutes: row.duration_minutes,
          taskType: row.task_type,
          status: row.status,
          orderIndex: row.order_index,
          notes: row.notes,
        }));
      }
    }

    return await guestStorage.getAll<TimelineTask>('timeline_tasks');
  }

  async saveTimelineTasks(tasks: TimelineTask[]): Promise<void> {
    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      // Upsert batch in Supabase
      const payload = tasks.map((t) => ({
        id: t.id.startsWith('task_') ? undefined : t.id,
        user_id: userId,
        title: t.title,
        topic_id: t.topicId,
        scheduled_date: t.scheduledDate,
        duration_minutes: t.durationMinutes,
        task_type: t.taskType,
        status: t.status,
        order_index: t.orderIndex,
      }));
      await supabase.from('timeline_tasks').upsert(payload);
    }

    for (const t of tasks) {
      await guestStorage.put('timeline_tasks', t);
    }
  }

  async updateTimelineTask(taskId: string, updates: Partial<TimelineTask>): Promise<void> {
    const tasks = await this.getTimelineTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updated = { ...task, ...updates };

    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      await supabase.from('timeline_tasks').update({
        scheduled_date: updated.scheduledDate,
        status: updated.status,
        duration_minutes: updated.durationMinutes,
        order_index: updated.orderIndex,
        updated_at: new Date().toISOString(),
      }).eq('id', taskId).eq('user_id', userId);
    }

    await guestStorage.put('timeline_tasks', updated);
  }

  // 6. REVISION TASKS
  async getRevisionTasks(): Promise<RevisionTask[]> {
    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      const { data } = await supabase
        .from('revision_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });

      if (data) {
        return data.map((r) => ({
          id: r.id,
          problemId: r.problem_id,
          dueDate: r.due_date,
          intervalDays: r.interval_days,
          status: r.status,
          completedAt: r.completed_at,
        }));
      }
    }

    return await guestStorage.getAll<RevisionTask>('revision_tasks');
  }

  async scheduleRevision(problemId: string, dueDate: string, intervalDays: number): Promise<void> {
    const id = 'rev_' + problemId + '_' + Date.now();
    const task: RevisionTask = {
      id,
      problemId,
      dueDate,
      intervalDays,
      status: 'due',
    };

    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      await supabase.from('revision_tasks').insert({
        user_id: userId,
        problem_id: problemId,
        due_date: dueDate,
        interval_days: intervalDays,
        status: 'due',
      });
    }

    await guestStorage.put('revision_tasks', task);
  }

  async completeRevision(revisionId: string): Promise<void> {
    const revisions = await this.getRevisionTasks();
    const rev = revisions.find((r) => r.id === revisionId);
    if (!rev) return;

    const updated: RevisionTask = {
      ...rev,
      status: 'completed',
      completedAt: new Date().toISOString(),
    };

    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      await supabase
        .from('revision_tasks')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', revisionId)
        .eq('user_id', userId);
    }

    await guestStorage.put('revision_tasks', updated);
  }

  // 7. MOCK INTERVIEWS
  async getMockInterviews(): Promise<MockInterviewRecord[]> {
    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      const { data } = await supabase
        .from('mock_interviews')
        .select('*')
        .eq('user_id', userId)
        .order('conducted_at', { ascending: false });

      if (data) {
        return data.map((m) => ({
          id: m.id,
          topic: m.topic,
          durationMinutes: m.duration_minutes,
          outcome: m.outcome,
          problemTitle: m.problem_title,
          codeContent: m.code_content,
          feedbackNotes: m.feedback_notes,
          communicationScore: m.communication_score,
          problemSolvingScore: m.problem_solving_score,
          codeQualityScore: m.code_quality_score,
          conductedAt: m.conducted_at,
        }));
      }
    }

    return await guestStorage.getAll<MockInterviewRecord>('mock_interviews');
  }

  async saveMockInterview(interview: Omit<MockInterviewRecord, 'id' | 'conductedAt'>): Promise<MockInterviewRecord> {
    const record: MockInterviewRecord = {
      ...interview,
      id: 'mock_' + Date.now(),
      conductedAt: new Date().toISOString(),
    };

    const userId = await this.getAuthUserId();
    if (userId && supabase) {
      await supabase.from('mock_interviews').insert({
        user_id: userId,
        topic: record.topic,
        duration_minutes: record.durationMinutes,
        outcome: record.outcome,
        problem_title: record.problemTitle,
        code_content: record.codeContent,
        feedback_notes: record.feedbackNotes,
        communication_score: record.communicationScore,
        problem_solving_score: record.problemSolvingScore,
        code_quality_score: record.codeQualityScore,
        conducted_at: record.conductedAt,
      });
    }

    await guestStorage.put('mock_interviews', record);
    return record;
  }

  // 8. PLACEMENT PREPARATION CHECKLISTS
  async getPlacementTasks(): Promise<PlacementChecklistItem[]> {
    const items = await guestStorage.getAll<PlacementChecklistItem>('placement_tasks');
    if (items.length > 0) return items;

    // Seed defaults for placement prep
    const defaults: PlacementChecklistItem[] = [
      { id: 'p-oop-1', category: 'oop', taskName: '4 Pillars of OOP (Encapsulation, Abstraction, Inheritance, Polymorphism)', isCompleted: false },
      { id: 'p-oop-2', category: 'oop', taskName: 'Method Overloading vs Overriding & Runtime Dynamic Dispatch', isCompleted: false },
      { id: 'p-oop-3', category: 'oop', taskName: 'Interfaces vs Abstract Classes in Java (Default & Static methods)', isCompleted: false },
      { id: 'p-oop-4', category: 'oop', taskName: 'SOLID Principles with practical code examples', isCompleted: false },
      { id: 'p-dbms-1', category: 'dbms', taskName: 'ACID Properties and Transaction Isolation Levels', isCompleted: false },
      { id: 'p-dbms-2', category: 'dbms', taskName: 'SQL Joins (INNER, LEFT, RIGHT, FULL) & Group By Having queries', isCompleted: false },
      { id: 'p-dbms-3', category: 'dbms', taskName: 'Database Indexing: B+ Tree internals & Composite Index leftmost prefix', isCompleted: false },
      { id: 'p-dbms-4', category: 'dbms', taskName: 'Normalization (1NF, 2NF, 3NF, BCNF) and Denormalization trade-offs', isCompleted: false },
      { id: 'p-os-1', category: 'os', taskName: 'Process vs Thread, Context Switching, PCB', isCompleted: false },
      { id: 'p-os-2', category: 'os', taskName: 'CPU Scheduling Algorithms (Round Robin, SJF, Priority)', isCompleted: false },
      { id: 'p-os-3', category: 'os', taskName: 'Deadlock 4 Coffman conditions and Prevention/Banker algorithm', isCompleted: false },
      { id: 'p-os-4', category: 'os', taskName: 'Virtual Memory, Paging, Page Faults, LRU Page Replacement', isCompleted: false },
      { id: 'p-cn-1', category: 'cn', taskName: 'OSI 7 Layers vs TCP/IP 4-Layer Model', isCompleted: false },
      { id: 'p-cn-2', category: 'cn', taskName: 'TCP 3-Way Handshake, 4-Way Termination, Flow & Congestion Control', isCompleted: false },
      { id: 'p-cn-3', category: 'cn', taskName: 'DNS Resolution lifecycle & HTTP vs HTTPS (TLS/SSL Handshake)', isCompleted: false },
      { id: 'p-cn-4', category: 'cn', taskName: 'REST APIs, HTTP Status codes (200, 201, 400, 401, 403, 404, 500)', isCompleted: false },
      { id: 'p-apt-1', category: 'aptitude', taskName: 'Percentages, Profit & Loss, Simple/Compound Interest speed formulas', isCompleted: false },
      { id: 'p-apt-2', category: 'aptitude', taskName: 'Time, Speed, Distance, Trains & Relative Velocity calculations', isCompleted: false },
      { id: 'p-apt-3', category: 'aptitude', taskName: 'Permutations, Combinations & Probability distributions', isCompleted: false },
      { id: 'p-beh-1', category: 'behavioral', taskName: 'STAR Method framework for technical behavioral questions', isCompleted: false },
      { id: 'p-beh-2', category: 'behavioral', taskName: '"Tell me about a difficult bug or trade-off you resolved" story', isCompleted: false },
      { id: 'p-beh-3', category: 'behavioral', taskName: '"Why this company / engineering team?" personalized answer', isCompleted: false },
    ];

    for (const d of defaults) {
      await guestStorage.put('placement_tasks', d);
    }
    return defaults;
  }

  async togglePlacementTask(taskId: string, isCompleted: boolean): Promise<void> {
    const tasks = await this.getPlacementTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updated = { ...task, isCompleted };
    await guestStorage.put('placement_tasks', updated);
  }

  // Clear / Reset All Data
  async clearAllData(): Promise<void> {
    await guestStorage.clearAll();
  }
}

export const repository = new Repository();
