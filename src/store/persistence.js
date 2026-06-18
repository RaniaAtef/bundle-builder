import { STORAGE_KEY } from '../data/seed';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

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

export async function saveBundle(state) {
  const savedAt = saveState(state);
  const payload = { ...state, savedAt: savedAt ?? Date.now() };
  const response = await fetch(`${API_BASE_URL}/api/bundles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: payload }),
  });

  if (!response.ok) {
    throw new Error('Backend save failed.');
  }

  return response.json();
}

export async function loadBundle(id) {
  const response = await fetch(`${API_BASE_URL}/api/bundles/${encodeURIComponent(id)}`);

  if (!response.ok) {
    throw new Error('Saved bundle was not found.');
  }

  const bundle = await response.json();
  return bundle.data;
}
