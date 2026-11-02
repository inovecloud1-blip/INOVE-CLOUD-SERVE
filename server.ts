import express from 'express';
import { createServer as createViteServer } from 'vite';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import si from 'systeminformation';
import Docker from 'dockerode';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import db from './server/db.ts';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Docker client setup
let docker: Docker | null = null;
try {
  docker = new Docker({ socketPath: '/var/run/docker.sock' });
} catch (e) {
  console.warn('Docker socket not accessible; running in simulation mode.');
}

// In-memory session store (simple token map)
const sessions = new Map<string, { userId: string; username: string; role: string; email: string; avatar: string }>();

// API Routes

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', os: 'InoveCloud OS Workspace v1.0.0 (Ubuntu Server LTS)', timestamp: new Date().toISOString() });
});

// Auth Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
  
  if (!user) {
    return res.status(401).json({ success: false, error: 'Usuário ou senha inválidos' });
  }

  const [salt, storedHash] = user.password_hash.split(':');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');

  if (hash !== storedHash) {
    return res.status(401).json({ success: false, error: 'Usuário ou senha inválidos' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const sessionData = { userId: user.id, username: user.username, role: user.role, email: user.email, avatar: user.avatar };
  sessions.set(token, sessionData);

  res.cookie('inove_session', token, { httpOnly: true, secure: false, maxAge: 86400000 });
  res.json({ success: true, user: sessionData, token });
});

// Auth Session check
app.get('/api/auth/session', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || req.headers.cookie?.split('inove_session=')[1]?.split(';')[0];
  
  if (token && sessions.has(token)) {
    return res.json({ authenticated: true, user: sessions.get(token) });
  }

  // Fallback default session for satoshi
  const defaultUser = db.prepare('SELECT * FROM users WHERE username = ?').get('satoshi') as any;
  if (defaultUser) {
    const sessionData = { userId: defaultUser.id, username: defaultUser.username, role: defaultUser.role, email: defaultUser.email, avatar: defaultUser.avatar };
    return res.json({ authenticated: true, user: sessionData });
  }

  res.json({ authenticated: false });
});

// Update User Profile
app.post('/api/user/update', (req, res) => {
  const { username, email, avatar } = req.body;
  try {
    db.prepare('UPDATE users SET username = ?, email = ?, avatar = ? WHERE id = ?').run(username, email, avatar, 'usr_admin');
    const updated = db.prepare('SELECT * FROM users WHERE id = ?').get('usr_admin') as any;
    res.json({ success: true, user: { userId: updated.id, username: updated.username, role: updated.role, email: updated.email, avatar: updated.avatar } });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// System Stats
app.get('/api/system/stats', async (req, res) => {
  try {
    const [cpuLoad, memData, diskData, netStats, osInfo, tempdata] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      si.osInfo(),
      si.cpuTemperature()
    ]);

    const primaryDisk = diskData[0] || { size: 1000000000000, used: 300000000000, use: 30 };
    const netRx = netStats[0] ? netStats[0].rx_bytes : 1545000;
    const netTx = netStats[0] ? netStats[0].tx_bytes : 956000;

    res.json({
      cpu: {
        load: Math.round(cpuLoad.currentLoad * 10) / 10,
        cores: cpuLoad.cpus ? cpuLoad.cpus.length : 4,
        temperature: tempdata.main || 44.2
      },
      memory: {
        total: memData.total,
        used: memData.used,
        free: memData.free,
        percentage: Math.round((memData.used / memData.total) * 100)
      },
      disk: {
        total: primaryDisk.size,
        used: primaryDisk.used,
        free: primaryDisk.size - primaryDisk.used,
        percentage: Math.round(primaryDisk.use || (primaryDisk.used / primaryDisk.size) * 100)
      },
      network: { rx_sec: netRx, tx_sec: netTx },
      os: {
        platform: osInfo.platform,
        distro: osInfo.distro || 'Ubuntu 24.04.1 LTS',
        release: osInfo.release || '6.8.0-31-generic',
        hostname: osInfo.hostname || 'inovecloudos.local',
        uptime: os.uptime()
      }
    });
  } catch (err) {
    res.json({
      cpu: { load: 12.4, cores: 4, temperature: 43.1 },
      memory: { total: 16106127360, used: 6153960755, free: 9952166605, percentage: 38 },
      disk: { total: 1000204886016, used: 320057368084, free: 680147517932, percentage: 32 },
      network: { rx_sec: 450000, tx_sec: 212000 },
      os: { platform: 'linux', distro: 'Ubuntu 24.04 LTS (Headless)', release: '6.8.0-31-generic', hostname: 'inovecloudos.local', uptime: 453200 }
    });
  }
});

// Shortcuts API (SQLite)
app.get('/api/shortcuts', (req, res) => {
  const shortcuts = db.prepare('SELECT * FROM shortcuts').all();
  res.json(shortcuts);
});

app.post('/api/shortcuts', (req, res) => {
  const { id, name, url, icon, category, pinned_desktop, pinned_dock, open_mode } = req.body;
  const sId = id || 'sh_' + Math.random().toString(36).substring(7);
  try {
    db.prepare(`
      INSERT OR REPLACE INTO shortcuts (id, name, url, icon, category, pinned_desktop, pinned_dock, open_mode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(sId, name, url, icon || 'Globe', category || 'General', pinned_desktop ? 1 : 0, pinned_dock ? 1 : 0, open_mode || 'iframe');
    res.json({ success: true, id: sId });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/shortcuts/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM shortcuts WHERE id = ?').run(id);
  res.json({ success: true });
});

// Apps API (SQLite)
app.get('/api/apps', (req, res) => {
  const apps = db.prepare('SELECT * FROM apps').all();
  res.json(apps);
});

app.post('/api/apps/:id/toggle', async (req, res) => {
  const { id } = req.params;
  const appItem = db.prepare('SELECT * FROM apps WHERE id = ?').get(id) as any;
  if (!appItem) {
    return res.status(404).json({ success: false, error: 'App not found' });
  }

  const newInstalled = appItem.installed === 1 ? 0 : 1;
  db.prepare('UPDATE apps SET installed = ? WHERE id = ?').run(newInstalled, id);

  // If Docker is available, start or stop corresponding container
  if (docker) {
    try {
      const containers = await docker.listContainers({ all: true });
      const containerName = `inove-${id}`;
      const found = containers.find(c => c.Names.some(n => n.includes(containerName) || n.includes(id)));
      if (found) {
        const container = docker.getContainer(found.Id);
        if (newInstalled === 1) {
          await container.start();
        } else {
          await container.stop();
        }
      }
    } catch (e) {
      console.warn('Docker container toggle action warning:', e);
    }
  }

  res.json({ success: true, installed: newInstalled === 1 });
});

// Docker Containers API
app.get('/api/docker/containers', async (req, res) => {
  if (docker) {
    try {
      const containers = await docker.listContainers({ all: true });
      const formatted = containers.map(c => ({
        id: c.Id.substring(0, 12),
        names: c.Names,
        image: c.Image,
        state: c.State,
        status: c.Status,
        ports: c.Ports,
        appName: c.Names[0]?.replace('/', '').replace('inove-', '') || c.Image
      }));
      return res.json(formatted);
    } catch (e) {
      console.warn('Docker daemon query failed, returning mock');
    }
  }
  res.json([
    { id: 'c1', names: ['/inove-nextcloud'], image: 'nextcloud:latest', state: 'running', status: 'Up 2 days', ports: [{'PublicPort': 8080, 'PrivatePort': 80}], appName: 'Nextcloud' },
    { id: 'c2', names: ['/inove-homeassistant'], image: 'homeassistant/home-assistant:stable', state: 'running', status: 'Up 5 days', ports: [{'PublicPort': 8123, 'PrivatePort': 8123}], appName: 'Home Assistant' },
    { id: 'c3', names: ['/inove-pihole'], image: 'pihole/pihole:latest', state: 'running', status: 'Up 10 days', ports: [{'PublicPort': 8053, 'PrivatePort': 80}], appName: 'Pi-hole' },
    { id: 'c4', names: ['/inove-ollama'], image: 'ollama/ollama:latest', state: 'running', status: 'Up 1 day', ports: [{'PublicPort': 11434, 'PrivatePort': 11434}], appName: 'Ollama AI' },
  ]);
});

// WebSocket telemetry
wss.on('connection', (ws: WebSocket) => {
  const interval = setInterval(async () => {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        const cpuLoad = await si.currentLoad();
        const mem = await si.mem();
        ws.send(JSON.stringify({
          type: 'telemetry',
          timestamp: new Date().toISOString(),
          cpu: Math.round(cpuLoad.currentLoad * 10) / 10,
          memory: Math.round((mem.used / mem.total) * 100),
          uptime: os.uptime()
        }));
      } catch {
        ws.send(JSON.stringify({
          type: 'telemetry',
          timestamp: new Date().toISOString(),
          cpu: +(Math.random() * 15 + 10).toFixed(1),
          memory: 38,
          uptime: 453200
        }));
      }
    }
  }, 2000);

  ws.on('close', () => clearInterval(interval));
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true }
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
  }

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`🚀 InoveCloud OS Workspace backend running on http://localhost:${PORT}`);
  });
}

startServer();
