import { describe, it, expect, beforeEach } from 'vitest';
import { repository } from '../services/repository';
import { TopicProgress, ProblemProgress } from '../types/userData';

describe('Language Switching & Progress Isolation', () => {
  beforeEach(async () => {
    await repository.clearGuestData();
  });

  it('preserves shared conceptual topic mastery when switching languages', async () => {
    // 1. Initial state: Java learner masters Module 1 (Foundations & Complexity)
    const initialTopicProgress: TopicProgress = {
      id: 'm1-foundations-complexity',
      topicId: 'm1-foundations-complexity',
      isCompleted: true,
      masteryPercentage: 100,
      notes: 'Understood asymptotic limits and loop invariants.',
    };
    await repository.saveTopicProgress(initialTopicProgress);

    // 2. Set preferred language to Java
    const prefs = await repository.getPreferences();
    await repository.savePreferences({
      ...prefs,
      preferredLanguage: 'Java',
    });

    // 3. User switches track to C++
    const updatedPrefs = await repository.getPreferences();
    expect(updatedPrefs.preferredLanguage).toBe('Java');

    await repository.savePreferences({
      ...updatedPrefs,
      preferredLanguage: 'C++',
    });

    const cppPrefs = await repository.getPreferences();
    expect(cppPrefs.preferredLanguage).toBe('C++');

    // 4. Verify topic conceptual mastery is preserved
    const allTopics = await repository.getAllTopicProgress();
    expect(allTopics['m1-foundations-complexity']).toBeDefined();
    expect(allTopics['m1-foundations-complexity'].isCompleted).toBe(true);
    expect(allTopics['m1-foundations-complexity'].masteryPercentage).toBe(100);
    expect(allTopics['m1-foundations-complexity'].notes).toBe('Understood asymptotic limits and loop invariants.');
  });

  it('records attempts with language track attribution', async () => {
    // Record a Java attempt
    const javaAttempt = await repository.recordAttempt({
      problemId: 'two-sum',
      attemptStatus: 'GREEN',
      timeSpentMinutes: 15,
      hintsUsed: false,
      editorialUsed: false,
      language: 'Java',
      approachNotes: 'Used HashMap for O(N) complement lookup.',
    });

    expect(javaAttempt.language).toBe('Java');
    expect(javaAttempt.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

    // Record a C++ attempt on the same problem
    const cppAttempt = await repository.recordAttempt({
      problemId: 'two-sum',
      attemptStatus: 'GREEN',
      timeSpentMinutes: 12,
      hintsUsed: false,
      editorialUsed: false,
      language: 'C++',
      approachNotes: 'Used std::unordered_map with reserve(n).',
    });

    expect(cppAttempt.language).toBe('C++');

    // Verify all attempts are preserved chronologically
    const allAttempts = await repository.getAllAttempts();
    expect(allAttempts.length).toBe(2);
    expect(allAttempts.some((a) => a.language === 'Java')).toBe(true);
    expect(allAttempts.some((a) => a.language === 'C++')).toBe(true);
  });
});
