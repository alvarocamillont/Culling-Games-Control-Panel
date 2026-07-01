import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

import { Sorcerer } from './app/models';

const browserDistFolder = join(import.meta.dirname, '../browser');

export const app = express();
app.use(express.json());

let angularApp: AngularNodeAppEngine | null = null;
function getAngularApp() {
  if (!angularApp) {
    angularApp = new AngularNodeAppEngine();
  }
  return angularApp;
}

const initialPlayers: Sorcerer[] = [
  { id: '1', name: 'Yuta Okkotsu', colony: 'Sendai Colony', technique: 'Copy / Rika Manifestation', points: 190, status: 'Alive' },
  { id: '2', name: 'Hajime Kashimo', colony: 'Tokyo Colony No. 2', technique: 'Phantom Beast Amber (Electrification)', points: 200, status: 'Alive' },
  { id: '3', name: 'Hiromi Higuruma', colony: 'Tokyo Colony No. 1', technique: 'Deadly Sentencing (Domain Expansion)', points: 100, status: 'Alive' },
  { id: '4', name: 'Megumi Fushiguro', colony: 'Tokyo Colony No. 1', technique: 'Ten Shadows Technique', points: 40, status: 'Alive' },
  { id: '5', name: 'Yuji Itadori', colony: 'Tokyo Colony No. 1', technique: 'Divergent Fist / Shrine', points: 1, status: 'Alive' },
  { id: '6', name: 'Reggie Star', colony: 'Tokyo Colony No. 1', technique: 'Contract Re-creation', points: 41, status: 'Deceased' },
  { id: '7', name: 'Ryu Ishigori', colony: 'Sendai Colony', technique: 'Granite Blast (Cursed Energy Discharge)', points: 77, status: 'Deceased' },
  { id: '8', name: 'Takako Uro', colony: 'Sendai Colony', technique: 'Sky Manipulation', points: 70, status: 'Alive' },
  { id: '9', name: 'Kurourushi', colony: 'Sendai Colony', technique: 'Parthenogenesis / Earth-Buster Cockroach', points: 54, status: 'Deceased' }
];

let players: Sorcerer[] = [...initialPlayers];

// REST API Endpoints
app.get('/api/players', (req, res) => {
  res.json(players);
});

app.post('/api/players', (req, res) => {
  const newPlayer: Sorcerer = req.body;
  if (!newPlayer.id) {
    newPlayer.id = Date.now().toString();
  }
  if (!newPlayer.name || !newPlayer.colony) {
    res.status(400).json({ error: 'Name and Colony are required.' });
    return;
  }
  players.unshift(newPlayer);
  res.status(201).json(newPlayer);
});

app.put('/api/players/:id/points', (req, res) => {
  const { id } = req.params;
  const { points } = req.body;
  const player = players.find(p => p.id === id);
  if (!player) {
    res.status(404).json({ error: 'Player not found.' });
    return;
  }
  if (typeof points !== 'number' || points < 0) {
    res.status(400).json({ error: 'Points must be a non-negative number.' });
    return;
  }
  player.points = points;
  res.json(player);
});

app.put('/api/players/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const player = players.find(p => p.id === id);
  if (!player) {
    res.status(404).json({ error: 'Player not found.' });
    return;
  }
  if (status !== 'Alive' && status !== 'Deceased') {
    res.status(400).json({ error: 'Status must be Alive or Deceased.' });
    return;
  }
  player.status = status;
  res.json(player);
});

app.delete('/api/players/:id', (req, res) => {
  const { id } = req.params;
  const index = players.findIndex(p => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Player not found.' });
    return;
  }
  const deleted = players.splice(index, 1)[0];
  res.json(deleted);
});

app.post('/api/reset', (req, res) => {
  players = [...initialPlayers];
  res.json(players);
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  getAngularApp()
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
