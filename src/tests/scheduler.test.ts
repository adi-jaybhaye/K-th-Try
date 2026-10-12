import { describe, it, expect } from 'vitest';
import { ScheduleEngine } from '../services/scheduleEngine';

describe('Personal Timeline & Scheduling Engine', () => {
  it('should respect prerequisites in topological ordering', () => {
    const modules = ScheduleEngine.getOrderedModules('core-first');
    const indexMap = new Map(modules.map((m, idx) => [m.id, idx]));

    // Check that for any module with prerequisites, all prerequisites come before it
    for (const mod of modules) {
      const modIndex = indexMap.get(mod.id)!;
      for (const prereqId of mod.prerequisites) {
        if (indexMap.has(prereqId)) {
          const prereqIndex = indexMap.get(prereqId)!;
          expect(prereqIndex).toBeLessThan(modIndex);
        }
      }
    }
  });

  it('should analyze feasibility correctly and trigger warnings when hours are insufficient', () => {
    // 2 weeks with 1 hour/week is impossible for a 200+ hour syllabus
    const tightAnalysis = ScheduleEngine.analyzeWorkload({
      startDate: '2026-01-01',
      targetDate: '2026-01-14',
      planDurationWeeks: 2,
      activeDays: ['Mon'],
      hoursPerDay: { Mon: 1 },
      priorityMode: 'all',
    });

    expect(tightAnalysis.isFeasible).toBe(false);
    expect(tightAnalysis.warningMessage).toBeDefined();
    expect(tightAnalysis.recommendations.length).toBeGreaterThan(0);
  });

  it('should detect feasible workload when hours comfortably cover curriculum', () => {
    // 24 weeks with 20 hours/week = 480 hours available, comfortably exceeds ~260 hours
    const comfortableAnalysis = ScheduleEngine.analyzeWorkload({
      startDate: '2026-01-01',
      targetDate: '2026-06-30',
      planDurationWeeks: 26,
      activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      hoursPerDay: { Mon: 3, Tue: 3, Wed: 3, Thu: 3, Fri: 3, Sat: 4, Sun: 0 },
      priorityMode: 'core-first',
    });

    expect(comfortableAnalysis.isFeasible).toBe(true);
  });

  it('should generate lesson, practice, revision, and buffer tasks on active days', () => {
    const tasks = ScheduleEngine.generateSchedule({
      startDate: '2026-01-01',
      targetDate: '2026-04-01',
      planDurationWeeks: 12,
      activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      hoursPerDay: { Mon: 2, Tue: 2, Wed: 2, Thu: 2, Fri: 2 },
      priorityMode: 'core-first',
    });

    expect(tasks.length).toBeGreaterThan(20);

    const taskTypes = new Set(tasks.map((t) => t.taskType));
    expect(taskTypes.has('lesson')).toBe(true);
    expect(taskTypes.has('practice')).toBe(true);
    expect(taskTypes.has('revision')).toBe(true);
    expect(taskTypes.has('buffer')).toBe(true);
  });
});
