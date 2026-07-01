import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from './server';

describe('Express REST API', () => {
  beforeEach(async () => {
    // Reset players database to initial state before each test
    await request(app).post('/api/reset').send();
  });

  it('GET /api/players should return list of players', async () => {
    const res = await request(app).get('/api/players');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(9); // Initial seed length
    expect(res.body[0].name).toBe('Yuta Okkotsu');
  });

  it('POST /api/players should register a new player', async () => {
    const newPlayer = {
      name: 'Panda',
      colony: 'Tokyo Colony No. 2',
      technique: 'Abrupt Cursed Corpse',
      points: 0,
      status: 'Alive'
    };

    const res = await request(app)
      .post('/api/players')
      .send(newPlayer);

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Panda');

    // Verify it is prepended/added
    const getRes = await request(app).get('/api/players');
    expect(getRes.body.length).toBe(10);
    expect(getRes.body[0].name).toBe('Panda');
  });

  it('POST /api/players should return 400 if Name or Colony is missing', async () => {
    const invalidPlayer = {
      technique: 'None',
      points: 0,
      status: 'Alive'
    };

    const res = await request(app)
      .post('/api/players')
      .send(invalidPlayer);

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('PUT /api/players/:id/points should update points', async () => {
    const res = await request(app)
      .put('/api/players/1/points')
      .send({ points: 250 });

    expect(res.status).toBe(200);
    expect(res.body.points).toBe(250);

    // Verify change in GET
    const getRes = await request(app).get('/api/players');
    const yuta = getRes.body.find((p: any) => p.id === '1');
    expect(yuta.points).toBe(250);
  });

  it('PUT /api/players/:id/points should return 400 for invalid points', async () => {
    const res = await request(app)
      .put('/api/players/1/points')
      .send({ points: -5 });

    expect(res.status).toBe(400);
  });

  it('PUT /api/players/:id/status should toggle life status', async () => {
    const res = await request(app)
      .put('/api/players/1/status')
      .send({ status: 'Deceased' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Deceased');
  });

  it('DELETE /api/players/:id should remove player', async () => {
    const res = await request(app).delete('/api/players/1');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Yuta Okkotsu');

    const getRes = await request(app).get('/api/players');
    expect(getRes.body.length).toBe(8);
    expect(getRes.body.find((p: any) => p.id === '1')).toBeUndefined();
  });
});
