import { lineKey } from '../lib/keys';

/** Bump the version suffix if the persisted shape ever changes. */
export const STORAGE_KEY = 'bundle-builder:v3';

/**
 * The starting configuration. Seeded so the app loads looking like the design:
 * cameras chosen, a plan selected, sensors and an accessory already in the
 * system. This is also what "Reset" returns to.
 */
export const seedState = {
  openStepId: 'cameras',

  selectedVariant: {
    'wyze-cam-v4': 'white',
    'wyze-cam-pan-v3': 'white',
    'wyze-cam-floodlight-v2': 'white',
    'wyze-battery-cam-pro': 'white',
  },

  quantities: {
    [lineKey('wyze-cam-v4', 'white')]: 1,
    [lineKey('wyze-cam-pan-v3', 'white')]: 2,
    [lineKey('wyze-sense-motion-sensor')]: 2,
    [lineKey('wyze-sense-hub')]: 1,
    [lineKey('wyze-microsd-256')]: 2,
  },

  selectedPlanId: 'cam-unlimited',

  savedAt: null,
};
