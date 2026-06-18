import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const DEFAULT_STORE_PATH = resolve('server/data/bundles.json');

export function createBundleStore(filePath = process.env.BUNDLE_STORE_PATH ?? DEFAULT_STORE_PATH) {
  async function readStore() {
    try {
      const raw = await readFile(filePath, 'utf8');
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      if (error.code === 'ENOENT') return {};
      throw error;
    }
  }

  async function writeStore(store) {
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, `${JSON.stringify(store, null, 2)}\n`);
  }

  return {
    async get(id) {
      const store = await readStore();
      return store[id] ?? null;
    },

    async save(id, data) {
      const store = await readStore();
      const bundle = {
        id,
        data,
        savedAt: Date.now(),
      };

      store[id] = bundle;
      await writeStore(store);
      return bundle;
    },
  };
}
