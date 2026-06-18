import { createContext, useCallback, useMemo, useRef, useState } from 'react';
import { seedState } from '../data/seed';
import { lineKey } from '../lib/keys';
import { loadSavedState, saveState, clearSavedState } from './persistence';

const MAX_QTY = 99;

export const SystemContext = createContext(null);

function clampQty(qty) {
  return Math.max(0, Math.min(MAX_QTY, Math.trunc(qty)));
}

function getInitialState() {
  const saved = loadSavedState();
  return saved ? { ...seedState, ...saved } : { ...seedState };
}

export function SystemProvider({ children }) {
  const [state, setState] = useState(getInitialState);
  const wasRestored = useRef(state.savedAt != null).current;

  const actions = useMemo(
    () => ({
      toggleStep: (stepId) => {
        setState((current) => ({
          ...current,
          openStepId: current.openStepId === stepId ? null : stepId,
        }));
      },

      openStep: (stepId) => {
        setState((current) => ({ ...current, openStepId: stepId }));
      },

      selectVariant: (productId, variantId) => {
        setState((current) => ({
          ...current,
          selectedVariant: {
            ...current.selectedVariant,
            [productId]: variantId,
          },
        }));
      },

      setQty: (productId, variantId, nextQty) => {
        setState((current) => {
          const key = lineKey(productId, variantId);
          const qty = clampQty(nextQty);
          const quantities = { ...current.quantities };

          if (qty === 0) {
            delete quantities[key];
          } else {
            quantities[key] = qty;
          }

          return { ...current, quantities };
        });
      },

      selectPlan: (planId) => {
        setState((current) => ({ ...current, selectedPlanId: planId }));
      },

      reset: () => {
        clearSavedState();
        setState({ ...seedState });
      },
    }),
    [],
  );

  const save = useCallback(() => saveState(state), [state]);

  const value = useMemo(
    () => ({ state, actions, save, wasRestored }),
    [state, actions, save, wasRestored],
  );

  return (
    <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
  );
}
