import type { AppState } from '../types/domain';

export type DataMode = 'demo' | 'api';

const STORAGE_KEY = 'trama_ecosystem_mvp_state_v1';

export interface ITramaRepository {
  mode: DataMode;
  loadState(seedFactory: () => AppState): Promise<AppState>;
  saveState(state: AppState): Promise<void>;
  resetState(seedFactory: () => AppState): Promise<AppState>;
}

/**
 * Demo Repository: Persists full ecosystem CRUD interactions in browser localStorage.
 * Enables complete end-to-end demonstration without external database credentials.
 */
class DemoLocalStorageRepository implements ITramaRepository {
  mode: DataMode = 'demo';

  async loadState(seedFactory: () => AppState): Promise<AppState> {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = seedFactory();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      const parsed = JSON.parse(raw) as AppState;
      const seed = seedFactory();
      if (!parsed || parsed.schemaVersion !== seed.schemaVersion || !Array.isArray(parsed.companies)) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        return seed;
      }
      return parsed;
    } catch {
      return seedFactory();
    }
  }

  async saveState(state: AppState): Promise<void> {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors in restricted sandboxes
    }
  }

  async resetState(seedFactory: () => AppState): Promise<AppState> {
    const fresh = seedFactory();
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // Ignore storage errors
    }
    return fresh;
  }
}

/**
 * API Repository Adapter: Prepared for independent PHP/MySQL backend deployment on Bluehost.
 * Communicates through configurable VITE_API_BASE_URL using JSON REST + credentials.
 * Falls back safely to demo state if API is not yet provisioned.
 */
class BluehostPhpApiRepository implements ITramaRepository {
  mode: DataMode = 'api';
  private baseUrl: string;
  private fallbackRepo = new DemoLocalStorageRepository();

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async loadState(seedFactory: () => AppState): Promise<AppState> {
    if (!this.baseUrl) {
      return this.fallbackRepo.loadState(seedFactory);
    }
    try {
      const response = await fetch(`${this.baseUrl}/bootstrap`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`API bootstrap failed: ${response.status}`);
      }
      return (await response.json()) as AppState;
    } catch {
      return this.fallbackRepo.loadState(seedFactory);
    }
  }

  async saveState(state: AppState): Promise<void> {
    await this.fallbackRepo.saveState(state);
    // In production PHP/MySQL mode, individual entity mutations will invoke dedicated REST endpoints:
    // POST /companies, PUT /companies/:id, POST /matches, POST /messages, POST /opportunities, etc.
  }

  async resetState(seedFactory: () => AppState): Promise<AppState> {
    return this.fallbackRepo.resetState(seedFactory);
  }
}

export function createTramaRepository(): ITramaRepository {
  const configuredMode = (import.meta.env.VITE_DATA_MODE as DataMode | undefined) ?? 'demo';
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

  if (configuredMode === 'api' && apiBaseUrl.trim().length > 0) {
    return new BluehostPhpApiRepository(apiBaseUrl);
  }
  return new DemoLocalStorageRepository();
}
