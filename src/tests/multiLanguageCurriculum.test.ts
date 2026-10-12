import { describe, it, expect } from 'vitest';
import { curriculumModules } from '../data/curriculumData';
import { cppEssentialsData } from '../data/cppEssentialsData';
import { pythonEssentialsData } from '../data/pythonEssentialsData';
import { javaEssentialsData } from '../data/javaEssentialsData';
import { verifiedMultiLangResources } from '../data/multiLangResourcesData';

describe('Multi-Language Curriculum Integrity (Java, C++, Python)', () => {
  it('all 16 modules must have authentic implementation notes for Java, C++, and Python', () => {
    expect(curriculumModules.length).toBe(16);

    for (const mod of curriculumModules) {
      // 1. Java
      expect(mod.javaImplementationNotes).toBeDefined();
      expect(mod.javaImplementationNotes.codeTemplate.length).toBeGreaterThan(0);
      expect(mod.javaImplementationNotes.tricks.length).toBeGreaterThan(0);
      expect(mod.javaImplementationNotes.gotchas.length).toBeGreaterThan(0);

      // 2. C++
      expect(mod.cppImplementationNotes).toBeDefined();
      expect(mod.cppImplementationNotes?.language).toBe('C++');
      expect(mod.cppImplementationNotes?.codeTemplate.length).toBeGreaterThan(0);
      expect(mod.cppImplementationNotes?.tricks.length).toBeGreaterThan(0);
      expect(mod.cppImplementationNotes?.gotchas.length).toBeGreaterThan(0);

      // 3. Python
      expect(mod.pythonImplementationNotes).toBeDefined();
      expect(mod.pythonImplementationNotes?.language).toBe('Python');
      expect(mod.pythonImplementationNotes?.codeTemplate.length).toBeGreaterThan(0);
      expect(mod.pythonImplementationNotes?.tricks.length).toBeGreaterThan(0);
      expect(mod.pythonImplementationNotes?.gotchas.length).toBeGreaterThan(0);
    }
  });

  it('C++ Essentials track covers STL, pointers/references, pitfalls, and comparators', () => {
    expect(cppEssentialsData.length).toBeGreaterThanOrEqual(7);

    const categories = new Set(cppEssentialsData.map((d) => d.category));
    expect(categories.has('Primitives & Memory')).toBe(true);
    expect(categories.has('Containers & Collections')).toBe(true);
    expect(categories.has('Algorithms & Modern C++')).toBe(true);

    for (const guide of cppEssentialsData) {
      expect(guide.language).toBe('C++');
      expect(guide.codeExample.length).toBeGreaterThan(0);
      expect(guide.keyRules.length).toBeGreaterThan(0);
      expect(guide.complexityCost.length).toBeGreaterThan(0);
    }
  });

  it('Python Essentials track covers slicing costs, collections, heapq, bisect, and recursion depth', () => {
    expect(pythonEssentialsData.length).toBeGreaterThanOrEqual(6);

    const categories = new Set(pythonEssentialsData.map((d) => d.category));
    expect(categories.has('Sequences & Complexity')).toBe(true);
    expect(categories.has('Dictionaries & Sets')).toBe(true);
    expect(categories.has('Priority Queues & Heaps')).toBe(true);

    for (const guide of pythonEssentialsData) {
      expect(guide.language).toBe('Python');
      expect(guide.codeExample.length).toBeGreaterThan(0);
      expect(guide.keyRules.length).toBeGreaterThan(0);
      expect(guide.complexityCost.length).toBeGreaterThan(0);
    }
  });

  it('verified multi-language resources contain authentic URLs and language attributes', () => {
    expect(verifiedMultiLangResources.length).toBeGreaterThanOrEqual(10);

    const languages = new Set(verifiedMultiLangResources.map((r) => r.language));
    expect(languages.has('java')).toBe(true);
    expect(languages.has('cpp')).toBe(true);
    expect(languages.has('python')).toBe(true);

    for (const res of verifiedMultiLangResources) {
      expect(res.url.startsWith('https://')).toBe(true);
      expect(res.verified).toBe(true);
      expect(res.provider.length).toBeGreaterThan(0);
    }
  });
});
