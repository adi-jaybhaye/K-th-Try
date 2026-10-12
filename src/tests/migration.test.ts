import { describe, it, expect, beforeEach } from 'vitest';
import { migrateGuestDataToAccount } from '../services/migrationService';
import { repository } from '../services/repository';

describe('Guest-to-Account Migration Safety', () => {
  beforeEach(async () => {
    await repository.clearGuestData();
  });

  it('safely handles unconfigured Supabase or missing session without data loss', async () => {
    // Populate some sample guest data
    await repository.savePreferences({
      id: 'current-user-prefs',
      goal: 'campus-placements',
      level: 'comfortable-easy',
      weeklyHours: 15,
      startDate: '2026-01-01',
      targetDate: '2026-04-01',
      planDurationWeeks: 12,
      activeDays: ['Mon', 'Tue'],
      hoursPerDay: { Mon: 2, Tue: 2 },
      learningPriorities: 'core-first',
      reviewIntervals: [1, 7, 21],
      preferredLanguage: 'C++',
      theme: 'light',
      isOnboarded: true,
    });

    const res = await migrateGuestDataToAccount();
    // Since local test environment has no live cloud session, it must safely report status
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();

    // Guest data must remain 100% intact and uncorrupted!
    const prefs = await repository.getPreferences();
    expect(prefs.preferredLanguage).toBe('C++');
    expect(prefs.weeklyHours).toBe(15);
  });
});
