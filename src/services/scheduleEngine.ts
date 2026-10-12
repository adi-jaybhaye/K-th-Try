// ====================================================================
// KthTry — Personal Timeline & Scheduling Engine
// Generates realistic, dependency-aware DSA preparation plans
// ====================================================================

import { curriculumModules } from '../data/curriculumData';
import { TimelineTask, UserPreferences } from '../types/userData';

export interface PlanGenerationInput {
  startDate: string; // YYYY-MM-DD
  targetDate: string; // YYYY-MM-DD
  planDurationWeeks: number;
  activeDays: string[]; // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  hoursPerDay: Record<string, number>;
  priorityMode: 'all' | 'core-first' | 'weak-first' | 'custom';
  selectedTopicIds?: string[];
  weakTopicIds?: string[];
}

export interface WorkloadAnalysis {
  totalEstimatedHours: number;
  totalAvailableHours: number;
  isFeasible: boolean;
  feasibilityRatio: number; // available / estimated
  warningMessage?: string;
  recommendations: string[];
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export class ScheduleEngine {
  /**
   * Topological sorting of modules taking into account prerequisite relationships
   */
  static getOrderedModules(
    priorityMode: 'all' | 'core-first' | 'weak-first' | 'custom',
    selectedIds?: string[],
    weakIds: string[] = []
  ) {
    let pool = curriculumModules;

    if (selectedIds && selectedIds.length > 0) {
      pool = pool.filter((m) => selectedIds.includes(m.id));
    }

    // Sort pool based on priority mode
    const sorted = [...pool].sort((a, b) => {
      if (priorityMode === 'core-first') {
        const pOrder = { CORE: 1, 'HIGH VALUE': 2, STRETCH: 3 };
        const pDiff = pOrder[a.priority] - pOrder[b.priority];
        if (pDiff !== 0) return pDiff;
      } else if (priorityMode === 'weak-first') {
        const aWeak = weakIds.includes(a.id) ? 0 : 1;
        const bWeak = weakIds.includes(b.id) ? 0 : 1;
        if (aWeak !== bWeak) return aWeak - bWeak;
      }
      return a.moduleNumber - b.moduleNumber;
    });

    // Enforce dependency constraints (Prerequisites must precede dependent modules)
    const result: typeof sorted = [];
    const added = new Set<string>();

    const addWithPrereqs = (mod: (typeof sorted)[0]) => {
      if (added.has(mod.id)) return;
      for (const prereqId of mod.prerequisites) {
        if (!added.has(prereqId)) {
          const prereqMod = pool.find((m) => m.id === prereqId);
          if (prereqMod) {
            addWithPrereqs(prereqMod);
          }
        }
      }
      result.push(mod);
      added.add(mod.id);
    };

    for (const mod of sorted) {
      addWithPrereqs(mod);
    }

    return result;
  }

  /**
   * Analyzes available study time vs curriculum workload
   */
  static analyzeWorkload(input: PlanGenerationInput): WorkloadAnalysis {
    const modules = this.getOrderedModules(input.priorityMode, input.selectedTopicIds, input.weakTopicIds);
    const totalEstimatedHours = modules.reduce((sum, m) => sum + m.estimatedHours, 0);

    // Calculate total available hours between startDate and targetDate
    const start = new Date(input.startDate);
    const target = new Date(input.targetDate);
    const diffDays = Math.max(1, Math.round((target.getTime() - start.getTime()) / 86400000));

    let totalAvailableHours = 0;
    const curr = new Date(start);

    for (let i = 0; i < diffDays; i++) {
      const dayName = DAY_NAMES[curr.getDay()];
      if (input.activeDays.includes(dayName)) {
        totalAvailableHours += input.hoursPerDay[dayName] || 0;
      }
      curr.setDate(curr.getDate() + 1);
    }

    const feasibilityRatio = totalAvailableHours > 0 ? totalAvailableHours / totalEstimatedHours : 0;
    const isFeasible = feasibilityRatio >= 1.0;

    const recommendations: string[] = [];
    let warningMessage: string | undefined = undefined;

    if (!isFeasible) {
      warningMessage = `Workload Warning: You need approx ${totalEstimatedHours} hours of preparation, but only have ${totalAvailableHours} hours available in this timeframe.`;
      recommendations.push(`Increase your daily study duration by ${Math.ceil((totalEstimatedHours - totalAvailableHours) / (diffDays * 0.7))} hours per active day.`);
      recommendations.push('Switch to "Core Topics First" mode to cover foundational placement patterns before optional stretch topics.');
      recommendations.push('Extend your target preparation date by 2–4 weeks to prevent burnout.');
    } else {
      recommendations.push('Your timeline accommodates all selected topics comfortably with dedicated revision buffer sessions.');
    }

    return {
      totalEstimatedHours,
      totalAvailableHours,
      isFeasible,
      feasibilityRatio,
      warningMessage,
      recommendations,
    };
  }

  /**
   * Generates a concrete timeline task schedule
   */
  static generateSchedule(input: PlanGenerationInput, planId: string = 'plan_default'): TimelineTask[] {
    const modules = this.getOrderedModules(input.priorityMode, input.selectedTopicIds, input.weakTopicIds);
    const tasks: TimelineTask[] = [];

    const start = new Date(input.startDate);
    const target = new Date(input.targetDate);
    let curr = new Date(start);
    let taskCounter = 0;
    let daysElapsed = 0;

    for (const mod of modules) {
      // 1. Concept Lesson Task
      while (!input.activeDays.includes(DAY_NAMES[curr.getDay()]) || curr > target) {
        curr.setDate(curr.getDate() + 1);
        daysElapsed++;
      }
      const lessonDate = curr.toISOString().split('T')[0];
      tasks.push({
        id: `task_${++taskCounter}`,
        studyPlanId: planId,
        title: `Learn: ${mod.title}`,
        topicId: mod.id,
        scheduledDate: lessonDate,
        durationMinutes: 90,
        taskType: 'lesson',
        status: 'pending',
        orderIndex: taskCounter,
      });

      // Advance to next active study session
      curr.setDate(curr.getDate() + 1);
      daysElapsed++;

      // 2. Practice Problems Task
      while (!input.activeDays.includes(DAY_NAMES[curr.getDay()]) || curr > target) {
        curr.setDate(curr.getDate() + 1);
        daysElapsed++;
      }
      const practiceDate = curr.toISOString().split('T')[0];
      tasks.push({
        id: `task_${++taskCounter}`,
        studyPlanId: planId,
        title: `Practice Problems: ${mod.title}`,
        topicId: mod.id,
        scheduledDate: practiceDate,
        durationMinutes: 120,
        taskType: 'practice',
        status: 'pending',
        orderIndex: taskCounter,
      });

      // 3. Periodic Revision or Mock Interview Every ~2 modules
      if (mod.moduleNumber % 2 === 0) {
        curr.setDate(curr.getDate() + 1);
        while (!input.activeDays.includes(DAY_NAMES[curr.getDay()]) || curr > target) {
          curr.setDate(curr.getDate() + 1);
        }
        const isMock = mod.moduleNumber % 4 === 0;
        tasks.push({
          id: `task_${++taskCounter}`,
          studyPlanId: planId,
          title: isMock ? `Mock Interview: ${mod.title}` : `Active Recall Revision: ${mod.title}`,
          topicId: mod.id,
          scheduledDate: curr.toISOString().split('T')[0],
          durationMinutes: isMock ? 45 : 60,
          taskType: isMock ? 'mock' : 'revision',
          status: 'pending',
          orderIndex: taskCounter,
        });
      }

      // 4. Periodic Buffer session every 3 modules
      if (mod.moduleNumber % 3 === 0) {
        curr.setDate(curr.getDate() + 1);
        while (!input.activeDays.includes(DAY_NAMES[curr.getDay()]) || curr > target) {
          curr.setDate(curr.getDate() + 1);
        }
        tasks.push({
          id: `task_${++taskCounter}`,
          studyPlanId: planId,
          title: `Buffer Day: Catch up & Re-solve Weak Problems`,
          topicId: mod.id,
          scheduledDate: curr.toISOString().split('T')[0],
          durationMinutes: 60,
          taskType: 'buffer',
          status: 'pending',
          orderIndex: taskCounter,
        });
      }

      curr.setDate(curr.getDate() + 1);
    }

    return tasks;
  }
}
