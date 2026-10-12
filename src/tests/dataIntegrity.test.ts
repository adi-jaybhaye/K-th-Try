import { describe, it, expect } from 'vitest';
import { validateBackupPayload, importUserData } from '../services/backupService';
import { generateUUID } from '../services/repository';

describe('Data Integrity & Backup Validation', () => {
  it('generates compliant RFC4122 v4 UUIDs', () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    const uuid2 = generateUUID();
    expect(uuid).not.toEqual(uuid2);
  });

  it('rejects backup with invalid problem status', () => {
    const invalidPayload = {
      appName: 'KthTry',
      version: '1.0.0',
      preferences: {
        id: 'test',
        weeklyHours: 10,
      },
      problemProgress: {
        'two-sum': {
          id: 'two-sum',
          status: 'INVALID_STATUS',
        },
      },
    };
    const result = validateBackupPayload(invalidPayload);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Invalid problem status'))).toBe(true);
  });

  it('rejects backup with impossible weekly study hours', () => {
    const invalidPayload = {
      appName: 'KthTry',
      version: '1.0.0',
      preferences: {
        id: 'test',
        weeklyHours: 200, // Impossible (only 168 hours in a week)
      },
    };
    const result = validateBackupPayload(invalidPayload);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('weeklyHours'))).toBe(true);
  });

  it('validates correct KthTry export payload without errors', () => {
    const validPayload = {
      appName: 'KthTry',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      preferences: {
        id: 'current-user-prefs',
        weeklyHours: 15,
        planDurationWeeks: 12,
        preferredLanguage: 'Java',
      },
      topicProgress: {
        'm1-foundations-complexity': {
          id: 'm1-foundations-complexity',
          topicId: 'm1-foundations-complexity',
          isCompleted: true,
          masteryPercentage: 100,
        },
      },
      problemProgress: {
        'two-sum': {
          id: 'two-sum',
          problemId: 'two-sum',
          status: 'GREEN',
          reviewCount: 1,
        },
      },
      problemAttempts: [
        {
          id: 'c1234567-89ab-4cde-8f01-23456789abcd',
          problemId: 'two-sum',
          attemptStatus: 'GREEN',
          timeSpentMinutes: 15,
          hintsUsed: false,
          editorialUsed: false,
          attemptedAt: new Date().toISOString(),
          language: 'Java',
        },
      ],
      timelineTasks: [],
      revisionTasks: [],
      mockInterviews: [],
      placementTasks: [],
    };
    const result = validateBackupPayload(validPayload);
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });
});
