import { describe, it, expect } from 'vitest';
import { curriculumModules } from '../data/curriculumData';
import { javaEssentialsData } from '../data/javaEssentialsData';

describe('Curriculum Catalog Integrity', () => {
  it('should contain all 16 curriculum modules', () => {
    expect(curriculumModules.length).toBe(16);
    const moduleNumbers = curriculumModules.map((m) => m.moduleNumber).sort((a, b) => a - b);
    expect(moduleNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  });

  it('should have valid priorities matching specification', () => {
    const coreModules = curriculumModules.filter((m) => m.priority === 'CORE');
    const highValModules = curriculumModules.filter((m) => m.priority === 'HIGH VALUE');
    const stretchModules = curriculumModules.filter((m) => m.priority === 'STRETCH');

    expect(coreModules.length).toBe(13); // Modules 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
    expect(highValModules.length).toBe(2); // Modules 2, 15
    expect(stretchModules.length).toBe(1); // Module 16
  });

  it('every module should contain subtopics, Java notes, and practice problems', () => {
    for (const mod of curriculumModules) {
      expect(mod.title.length).toBeGreaterThan(0);
      expect(mod.slug.length).toBeGreaterThan(0);
      expect(mod.subtopics.length).toBeGreaterThan(0);
      expect(mod.practiceProblems.length).toBeGreaterThan(0);
      expect(mod.learningObjectives.length).toBeGreaterThan(0);
      expect(mod.complexityNotes.time.length).toBeGreaterThan(0);
      expect(mod.javaImplementationNotes.codeTemplate.length).toBeGreaterThan(0);

      // Verify subtopics checklist items
      for (const sub of mod.subtopics) {
        expect(sub.checklistItems.length).toBeGreaterThan(0);
      }
    }
  });

  it('all prerequisite references should map to existing module IDs', () => {
    const allIds = new Set(curriculumModules.map((m) => m.id));
    for (const mod of curriculumModules) {
      for (const prereq of mod.prerequisites) {
        expect(allIds.has(prereq)).toBe(true);
      }
    }
  });

  it('should include all Java Essentials guide topics', () => {
    expect(javaEssentialsData.length).toBeGreaterThanOrEqual(6);
    for (const guide of javaEssentialsData) {
      expect(guide.codeExample.length).toBeGreaterThan(0);
      expect(guide.keyRules.length).toBeGreaterThan(0);
    }
  });
});
