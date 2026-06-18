import { useContext } from 'react';
import { SystemContext } from '../store/SystemContext';

/** Access the system store. Throws if used outside <SystemProvider>. */
export function useSystem() {
  const ctx = useContext(SystemContext);
  if (!ctx) {
    throw new Error('useSystem must be used inside <SystemProvider>');
  }
  return ctx;
}
