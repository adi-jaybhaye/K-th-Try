import { describe, it, expect } from 'vitest';
import { importUserData, exportUserData } from '../services/backupService';

describe('Data Management & Validated Import/Export', () => {
  it('should reject invalid non-JSON strings', async () => {
    const res = await importUserData('this is not json');
    expect(res.valid).toBe(false);
    expect(res.message).toContain('Invalid JSON');
  });

  it('should reject unrecognized payloads missing app signature', async () => {
    const res = await importUserData(JSON.stringify({ randomKey: 'randomValue' }));
    expect(res.valid).toBe(false);
    expect(res.message).toContain('Unrecognized backup file');
  });

  it('should accept valid KthTry backup structure', async () => {
    const validMock = {
      version: '1.0.0',
      appName: 'KthTry',
      exportedAt: new Date().toISOString(),
      preferences: {
        id: 'current-user-prefs',
        goal: 'campus-placements',
        level: 'comfortable-easy',
        weeklyHours: 15,
        startDate: '2026-01-01',
        targetDate: '2026-04-01',
        planDurationWeeks: 12,
        activeDays: ['Mon', 'Tue', 'Wed'],
        hoursPerDay: { Mon: 2, Tue: 2, Wed: 2 },
        learningPriorities: 'core-first',
        reviewIntervals: [1, 7, 21],
        preferredLanguage: 'Java',
        theme: 'light',
        isOnboarded: true,
      },
      topicProgress: {},
      subtopicProgress: {},
      problemProgress: {},
      problemAttempts: [],
      timelineTasks: [],
      revisionTasks: [],
      mockInterviews: [],
      placementTasks: [],
    };

    const res = await importUserData(JSON.stringify(validMock));
    expect(res.valid).toBe(true);
    expect(res.message).toContain('Backup imported successfully');
  });
});
