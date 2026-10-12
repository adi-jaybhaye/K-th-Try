import { describe, it, expect, beforeEach } from 'vitest';
import { repository } from '../services/repository';

describe('Placement Preparation Tasks Persistence', () => {
  beforeEach(async () => {
    await repository.clearGuestData();
  });

  it('initializes and seeds default placement tasks if none exist', async () => {
    const tasks = await repository.getPlacementTasks();
    expect(tasks.length).toBeGreaterThanOrEqual(20);

    const categories = new Set(tasks.map((t) => t.category));
    expect(categories.has('oop')).toBe(true);
    expect(categories.has('dbms')).toBe(true);
    expect(categories.has('os')).toBe(true);
    expect(categories.has('cn')).toBe(true);
    expect(categories.has('aptitude')).toBe(true);
    expect(categories.has('behavioral')).toBe(true);

    const oopTask = tasks.find((t) => t.id === 'p-oop-1');
    expect(oopTask).toBeDefined();
    expect(oopTask?.isCompleted).toBe(false);
  });

  it('toggles placement task completion status and retains state', async () => {
    const tasks = await repository.getPlacementTasks();
    const firstTask = tasks[0];
    expect(firstTask.isCompleted).toBe(false);

    // Toggle to completed
    await repository.togglePlacementTask(firstTask.id, true);

    const updatedTasks = await repository.getPlacementTasks();
    const updated = updatedTasks.find((t) => t.id === firstTask.id);
    expect(updated?.isCompleted).toBe(true);

    // Toggle back to incomplete
    await repository.togglePlacementTask(firstTask.id, false);
    const revertedTasks = await repository.getPlacementTasks();
    const reverted = revertedTasks.find((t) => t.id === firstTask.id);
    expect(reverted?.isCompleted).toBe(false);
  });
});
