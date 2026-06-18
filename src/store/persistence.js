import { STORAGE_KEY } from '../data/seed';

/**
 * Client-side persistence for "Save my system for later".
 *
 * We persist only the configuration the shopper built — not derived values like
 * totals, which are always recomputed from the catalog on load.
 */
export function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    // Corrupt JSON or storage disabled (private mode, quota, etc.) — start fresh.
    return null;
  }
}

export function saveState(state) {
  try {
    const payload = { ...state, savedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return payload.savedAt;
  } catch {
    return null;
  }
}

export function clearSavedState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* no-op */
  }
}
