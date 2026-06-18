import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { createBundleStore } from './store.js';

const PORT = Number(process.env.PORT ?? 4000);
const store = createBundleStore();

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Request body is too large'));
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

function bundleIdFromUrl(url) {
  const match = url.pathname.match(/^\/api\/bundles\/([^/]+)$/);
  return match?.[1] ?? null;
}

async function createBundle(data) {
  let id;
  do {
    id = randomUUID().slice(0, 8);
  } while (await store.get(id));

  return store.save(id, data);
}

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/bundles') {
    const body = await readBody(req);
    const data = body.data ?? body;

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      sendJson(res, 400, { error: 'Bundle data must be an object.' });
      return;
    }

    sendJson(res, 201, await createBundle(data));
    return;
  }

  const id = bundleIdFromUrl(url);

  if (req.method === 'GET' && id) {
    const bundle = await store.get(id);
    sendJson(res, bundle ? 200 : 404, bundle ?? { error: 'Bundle not found.' });
    return;
  }

  if (req.method === 'PUT' && id) {
    const body = await readBody(req);
    const data = body.data ?? body;

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      sendJson(res, 400, { error: 'Bundle data must be an object.' });
      return;
    }

    sendJson(res, 200, await store.save(id, data));
    return;
  }

  sendJson(res, 404, { error: 'Not found.' });
}

const server = createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    sendJson(res, error.message === 'Invalid JSON' ? 400 : 500, { error: error.message });
  });
});

server.listen(PORT, () => {
  console.log(`Bundle API running on http://localhost:${PORT}`);
});
