import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const dbPath = path.resolve(process.cwd(), 'inovecloud.db');
const db = new Database(dbPath);

// Initialize Database Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password_hash TEXT,
    email TEXT,
    role TEXT,
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS shortcuts (
    id TEXT PRIMARY KEY,
    name TEXT,
    url TEXT,
    icon TEXT,
    category TEXT,
    pinned_desktop INTEGER,
    pinned_dock INTEGER,
    open_mode TEXT
  );

  CREATE TABLE IF NOT EXISTS apps (
    id TEXT PRIMARY KEY,
    name TEXT,
    category TEXT,
    description TEXT,
    version TEXT,
    icon TEXT,
    installed INTEGER,
    port INTEGER,
    rating REAL,
    screenshot TEXT
  );
`);

// Seed default user if not exists (satoshi / admin123)
const adminExists = db.prepare('SELECT * FROM users WHERE username = ?').get('satoshi');
if (!adminExists) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync('admin123', salt, 64).toString('hex');
  const passwordHash = `${salt}:${hash}`;
  
  db.prepare(`
    INSERT INTO users (id, username, password_hash, email, role, avatar)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    'usr_admin',
    'satoshi',
    passwordHash,
    'inovecloud1@gmail.com',
    'administrator',
    '/public/assets/aistudio/images__13__ca52ddfa.png'
  );
}

// Seed default apps if empty
const appCount = db.prepare('SELECT COUNT(*) as count FROM apps').get() as { count: number };
if (appCount.count === 0) {
  const initialApps = [
    { id: 'openclaw', name: 'OpenClaw AI', category: 'AI & Agents', description: 'A IA que realmente faz coisas. Integração com WhatsApp, Telegram e automações locais.', version: '2.4.0', icon: '/public/assets/aistudio/images__21__e43ffd61.jpg', installed: 1, port: 9000, rating: 4.9, screenshot: '/public/assets/aistudio/images__16__eec94e0f.png' },
    { id: 'penpot', name: 'Penpot Design', category: 'Design', description: 'Plataforma de design e prototipagem colaborativa open-source baseada em padrões web.', version: '1.19.0', icon: '/public/assets/aistudio/images__19__6c308360.png', installed: 1, port: 9001, rating: 4.9, screenshot: '/public/assets/aistudio/PenpotUI-flexlayout_fc09d3ba.png' },
    { id: 'emby', name: 'Emby Media Server', category: 'Media', description: 'Your media. Everywhere. Emby organizes and streams your own videos, music, photos, and live TV.', version: '4.8.3', icon: '/public/assets/aistudio/images__21__ea5586f3.png', installed: 1, port: 8090, rating: 4.7, screenshot: '/public/assets/aistudio/screenshot-1__2__a637e2be.webp' },
    { id: 'nodered', name: 'Node-RED Workflow', category: 'Automation', description: 'Node based workflow creation. Low-code programming for event-driven applications and automation.', version: '3.1.3', icon: '/public/assets/aistudio/images__25__c7574d97.png', installed: 1, port: 1880, rating: 4.8, screenshot: '/public/assets/aistudio/Captura_de_tela_2026-11-02_104739_c12d72f1.png' },
    { id: 'adguard', name: 'AdGuard Home', category: 'Security', description: 'Network-wide ad and tracker blocking software for your home network and servers.', version: '0.107.43', icon: '/public/assets/aistudio/images__22__a8df87a4.png', installed: 1, port: 3053, rating: 4.8, screenshot: '/public/assets/aistudio/screenshot-1_c8c741c9.webp' },
    { id: 'jellyfin', name: 'Jellyfin Media', category: 'Media', icon: '/public/assets/aistudio/unnamed_23a9d905.png', url: 'http://inovecloudos.local:8096', installed: 1, port: 8096, rating: 4.9, screenshot: '/public/assets/aistudio/jellyfin-self-hosted-media-server-guide.BRjd1q73_ZBFNzD_f5a85c59.webp' },
    { id: 'firefox', name: 'Firefox (VNC)', category: 'Browser', description: 'Navegador Firefox rodando em container Docker com acesso VNC direto no navegador.', version: '124.0', icon: '/public/assets/aistudio/images__26__0bc4991e.jpg', installed: 1, port: 5800, rating: 4.6, screenshot: '/public/assets/aistudio/ef922f7f7815f222f0889cff4f890ca9_fgraphic_9e81d7c1.jpg' },
    { id: 'immich', name: 'Immich Photos', category: 'Media', description: 'Solução self-hosted de gerenciamento e backup automático de fotos e vídeos.', version: '1.100.0', icon: '/public/assets/aistudio/images__17__b660534f.png', installed: 1, port: 2283, rating: 4.9, screenshot: '/public/assets/aistudio/host-your-photos-immich-setup-guide-on-zimaos-2032381_f716ed61.webp' },
  ];

  const insertApp = db.prepare(`
    INSERT INTO apps (id, name, category, description, version, icon, installed, port, rating, screenshot)
    VALUES (@id, @name, @category, @description, @version, @icon, @installed, @port, @rating, @screenshot)
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) insertApp.run(item);
  });
  insertMany(initialApps);
}

// Seed default shortcuts if empty
const scCount = db.prepare('SELECT COUNT(*) as count FROM shortcuts').get() as { count: number };
if (scCount.count === 0) {
  const initialShortcuts = [
    { id: 'nextcloud', name: 'Nextcloud', url: 'http://inovecloudos.local:8080', icon: '/public/assets/aistudio/images__10__15754696.png', category: 'Storage', pinned_desktop: 1, pinned_dock: 1, open_mode: 'iframe' },
    { id: 'homeassistant', name: 'Home Assistant', url: 'http://inovecloudos.local:8123', icon: '/public/assets/aistudio/images__11__9584e723.png', category: 'Automation', pinned_desktop: 1, pinned_dock: 1, open_mode: 'iframe' },
    { id: 'pihole', name: 'Pi-hole', url: 'http://inovecloudos.local:8053', icon: '/public/assets/aistudio/images__18__6b903573.jpg', category: 'Network', pinned_desktop: 1, pinned_dock: 0, open_mode: 'iframe' },
    { id: 'plex', name: 'Plex Media', url: 'http://inovecloudos.local:32400', icon: '/public/assets/aistudio/images__20__0ea0ca22.jpg', category: 'Media', pinned_desktop: 1, pinned_dock: 1, open_mode: 'iframe' },
    { id: 'ollama', name: 'Ollama AI', url: 'http://inovecloudos.local:11434', icon: '/public/assets/aistudio/download__1__ba98c536.png', category: 'AI', pinned_desktop: 1, pinned_dock: 1, open_mode: 'iframe' },
  ];

  const insertSc = db.prepare(`
    INSERT INTO shortcuts (id, name, url, icon, category, pinned_desktop, pinned_dock, open_mode)
    VALUES (@id, @name, @url, @icon, @category, @pinned_desktop, @pinned_dock, @open_mode)
  `);

  const insertManySc = db.transaction((items) => {
    for (const item of items) insertSc.run(item);
  });
  insertManySc(initialShortcuts);
}

export default db;
