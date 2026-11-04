import http from 'node:http';

const PORT = Number(process.env.MOCK_API_PORT || 4010);
const HOST = '127.0.0.1';
const KNOWN_EMAIL = 'eve.holt@reqres.in';

const users = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  email: `user${index + 1}@example.com`,
  first_name: `First${index + 1}`,
  last_name: `Last${index + 1}`,
  avatar: `https://reqres.in/img/faces/${index + 1}-image.jpg`,
}));

const resources = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: `Resource ${index + 1}`,
  year: 2000 + index,
  color: `#${(0xc74375 + index).toString(16).slice(-6).toUpperCase()}`,
  pantone_value: `17-${2031 + index}`,
}));

const sendJson = (res, status, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
};

const sendEmpty = (res, status) => {
  res.writeHead(status);
  res.end();
};

const readBody = (req) =>
  new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });

const paginate = (items, url) => {
  const page = Math.max(1, Number(url.searchParams.get('page') || 1));
  const perPage = Math.max(1, Number(url.searchParams.get('per_page') || 6));
  const start = (page - 1) * perPage;

  return {
    page,
    per_page: perPage,
    total: items.length,
    total_pages: Math.ceil(items.length / perPage),
    data: items.slice(start, start + perPage),
  };
};

const login = async (req, res) => {
  const body = await readBody(req);

  if (!body.email) return sendJson(res, 400, { error: 'Missing email or username' });
  if (!body.password) return sendJson(res, 400, { error: 'Missing password' });
  if (body.email !== KNOWN_EMAIL) return sendJson(res, 400, { error: 'user not found' });

  return sendJson(res, 200, { token: 'QpwL5tke4Pnpja7X4' });
};

const register = async (req, res) => {
  const body = await readBody(req);

  if (!body.email) return sendJson(res, 400, { error: 'Missing email or username' });
  if (!body.password) return sendJson(res, 400, { error: 'Missing password' });
  if (body.email !== KNOWN_EMAIL) {
    return sendJson(res, 400, { error: 'Note: Only defined users succeed registration' });
  }

  return sendJson(res, 200, { id: 4, token: 'QpwL5tke4Pnpja7X4' });
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  const { pathname } = url;
  const method = req.method || 'GET';

  // Mirror ReqRes: bearer-only calls to /api/* are rejected without an API key.
  if (pathname.startsWith('/api/') && req.headers.authorization && !req.headers['x-api-key']) {
    return sendJson(res, 401, { error: 'missing_api_key' });
  }

  if (method === 'POST' && pathname === '/api/login') return login(req, res);
  if (method === 'POST' && pathname === '/api/register') return register(req, res);

  if (method === 'GET' && pathname === '/api/users') {
    return sendJson(res, 200, paginate(users, url));
  }

  if (method === 'POST' && pathname === '/api/users') {
    const body = await readBody(req);
    return sendJson(res, 201, {
      id: '101',
      name: body.name,
      job: body.job,
      createdAt: new Date().toISOString(),
    });
  }

  const userMatch = /^\/api\/users\/(\d+)$/.exec(pathname);
  if (userMatch) {
    const id = Number(userMatch[1]);
    const user = users.find((entry) => entry.id === id);

    if (method === 'GET') {
      return user ? sendJson(res, 200, { data: user }) : sendJson(res, 404, {});
    }

    if (method === 'PUT' || method === 'PATCH') {
      const body = await readBody(req);
      return sendJson(res, 200, {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.job !== undefined ? { job: body.job } : {}),
        updatedAt: new Date().toISOString(),
      });
    }

    if (method === 'DELETE') return sendEmpty(res, 204);
  }

  if (method === 'GET' && pathname === '/api/unknown') {
    return sendJson(res, 200, paginate(resources, url));
  }

  const resourceMatch = /^\/api\/unknown\/(\d+)$/.exec(pathname);
  if (method === 'GET' && resourceMatch) {
    const id = Number(resourceMatch[1]);
    const resource = resources.find((entry) => entry.id === id);
    return resource ? sendJson(res, 200, { data: resource }) : sendJson(res, 404, {});
  }

  return sendJson(res, 404, { error: 'not found' });
});

server.listen(PORT, HOST, () => {
  // Playwright's webServer waits for this port before starting tests.
  console.log(`Mock API listening on http://${HOST}:${PORT}`);
});

const shutdown = () => server.close(() => process.exit(0));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
