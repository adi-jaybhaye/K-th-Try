// ====================================================================
// KthTry — Guest IndexedDB Storage Engine
// Provides full persistence for guests without cloud authentication
// ====================================================================

const DB_NAME = 'kthtry_guest_db';
const DB_VERSION = 1;

interface DBStores {
  preferences: string;
  topic_progress: string;
  subtopic_progress: string;
  problem_progress: string;
  problem_attempts: string;
  study_plans: string;
  timeline_tasks: string;
  revision_tasks: string;
  mock_interviews: string;
  placement_tasks: string;
}

class GuestStorageEngine {
  private db: IDBDatabase | null = null;
  private isAvailable: boolean = typeof window !== 'undefined' && 'indexedDB' in window;

  private async openDB(): Promise<IDBDatabase | null> {
    if (!this.isAvailable) return null;
    if (this.db) return this.db;

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const stores: (keyof DBStores)[] = [
            'preferences',
            'topic_progress',
            'subtopic_progress',
            'problem_progress',
            'problem_attempts',
            'study_plans',
            'timeline_tasks',
            'revision_tasks',
            'mock_interviews',
            'placement_tasks',
          ];

          stores.forEach((storeName) => {
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName, { keyPath: 'id' });
            }
          });
        };

        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          resolve(this.db);
        };

        request.onerror = () => {
          console.warn('Could not open IndexedDB, falling back to in-memory/localStorage');
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB error:', err);
        resolve(null);
      }
    });
  }

  // Generic Get All
  async getAll<T>(storeName: keyof DBStores): Promise<T[]> {
    const db = await this.openDB();
    if (!db) {
      return this.fallbackGetAll<T>(storeName);
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve(this.fallbackGetAll<T>(storeName));
      } catch {
        resolve(this.fallbackGetAll<T>(storeName));
      }
    });
  }

  // Generic Get One by ID
  async get<T>(storeName: keyof DBStores, id: string): Promise<T | null> {
    const db = await this.openDB();
    if (!db) {
      return this.fallbackGet<T>(storeName, id);
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(this.fallbackGet<T>(storeName, id));
      } catch {
        resolve(this.fallbackGet<T>(storeName, id));
      }
    });
  }

  // Generic Put (Insert / Update)
  async put<T extends { id: string }>(storeName: keyof DBStores, data: T): Promise<void> {
    const db = await this.openDB();
    if (!db) {
      this.fallbackPut(storeName, data);
      return;
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.put(data);

        request.onsuccess = () => resolve();
        request.onerror = () => {
          this.fallbackPut(storeName, data);
          resolve();
        };
      } catch {
        this.fallbackPut(storeName, data);
        resolve();
      }
    });
  }

  // Generic Delete
  async delete(storeName: keyof DBStores, id: string): Promise<void> {
    const db = await this.openDB();
    if (!db) {
      this.fallbackDelete(storeName, id);
      return;
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  // Clear all stores (for reset)
  async clearAll(): Promise<void> {
    const db = await this.openDB();
    const stores: (keyof DBStores)[] = [
      'preferences',
      'topic_progress',
      'subtopic_progress',
      'problem_progress',
      'problem_attempts',
      'study_plans',
      'timeline_tasks',
      'revision_tasks',
      'mock_interviews',
      'placement_tasks',
    ];

    if (db) {
      for (const storeName of stores) {
        try {
          const tx = db.transaction(storeName, 'readwrite');
          tx.objectStore(storeName).clear();
        } catch {
          // ignore
        }
      }
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      for (const storeName of stores) {
        window.localStorage.removeItem(`kthtry_${storeName}`);
      }
    }
  }

  // Fallbacks using localStorage
  private fallbackGetAll<T>(storeName: keyof DBStores): T[] {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    try {
      const raw = window.localStorage.getItem(`kthtry_${storeName}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private fallbackGet<T>(storeName: keyof DBStores, id: string): T | null {
    const items = this.fallbackGetAll<T>(storeName) as any[];
    return items.find((i) => i.id === id) || null;
  }

  private fallbackPut<T extends { id: string }>(storeName: keyof DBStores, data: T): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const items = this.fallbackGetAll<T>(storeName) as any[];
      const idx = items.findIndex((i) => i.id === data.id);
      if (idx >= 0) {
        items[idx] = data;
      } else {
        items.push(data);
      }
      window.localStorage.setItem(`kthtry_${storeName}`, JSON.stringify(items));
    } catch (e) {
      console.warn('localStorage put error:', e);
    }
  }

  private fallbackDelete(storeName: keyof DBStores, id: string): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const items = this.fallbackGetAll<any>(storeName);
      const filtered = items.filter((i) => i.id !== id);
      window.localStorage.setItem(`kthtry_${storeName}`, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  }
}

export const guestStorage = new GuestStorageEngine();
