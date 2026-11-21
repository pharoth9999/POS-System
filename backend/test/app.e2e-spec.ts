import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/app.setup.js';

// Requires the migrated + seeded database: npm run db:up && npm run migration:run && npm run seed.
// These tests only read from the database.
describe('App (e2e)', () => {
  let app: INestApplication<App>;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    // Same HTTP setup as main.ts: prefix, CORS, validation, error filter, serializer.
    app = configureApp(moduleFixture.createNestApplication());
    await app.init();

    const { body } = await request(app.getHttpServer()).get('/api/users?limit=1');
    const first = (body as { items?: Array<{ id: string }> }).items?.[0];
    if (!first) throw new Error('No users found; run npm run seed');
    userId = first.id;
  });

  afterAll(async () => {
    await app.close();
  });

  const http = () => request(app.getHttpServer());

  it('GET /api/health answers', () => {
    return http().get('/api/health').expect(200);
  });

  it('sends helmet security headers and hides X-Powered-By', async () => {
    const res = await http().get('/api/health').expect(200);
    expect(res.headers['content-security-policy']).toContain("default-src 'self'");
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('has no auth: /api/auth/login is gone and /api/users needs no token', async () => {
    await http().post('/api/auth/login').send({}).expect(404);
    const res = await http().get('/api/users?page=1&limit=5').expect(200);
    expect(res.body.meta).toMatchObject({ page: 1, limit: 5 });
    expect(JSON.stringify(res.body)).not.toContain('passwordHash');
  });

  it('answers unknown routes with the standard error shape', async () => {
    const res = await http().get('/api/nope').expect(404);
    expect(res.body).toMatchObject({ statusCode: 404, path: '/api/nope' });
  });

  it('PATCH /api/users/:id rejects null fields with 400, not 500', async () => {
    for (const field of ['fullName', 'password', 'role', 'isActive']) {
      const res = await http()
        .patch(`/api/users/${userId}`)
        .send({ [field]: null })
        .expect(400);
      expect(JSON.stringify(res.body.message)).toContain(field);
    }
  });

  describe('CORS', () => {
    it('allows a configured origin', async () => {
      const res = await http()
        .options('/api/users')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'GET')
        .expect(204);
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });

    it('does not allow other origins', async () => {
      const res = await http()
        .options('/api/users')
        .set('Origin', 'https://evil.example.com')
        .set('Access-Control-Request-Method', 'GET');
      expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });
  });
});
