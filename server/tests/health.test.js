const request = require('supertest');
const { app } = require('../index');

describe('Server basic endpoints', () => {
  test('/health responds 200 and json', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'OK');
    expect(res.body).toHaveProperty('mongoStatus');
  });

  test('/diag responds 200 and has expected fields', async () => {
    const res = await request(app).get('/diag');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('server', 'ok');
    expect(res.body).toHaveProperty('dbConnected');
    expect(res.body).toHaveProperty('endpoints');
  });

  test('/api/prompts/public responds 200 and returns prompts array', async () => {
    const res = await request(app).get('/api/prompts/public');
    expect(res.statusCode).toBe(200);
    // Should be an array of prompts
    expect(Array.isArray(res.body)).toBe(true);
  });
});
