import React, { useState, useEffect } from 'react';
import { 
  Server, Cpu, HardDrive, Wifi, Activity, Terminal as TerminalIcon, 
  Settings, LogOut, Play, Square, RotateCw, Download, Trash2, 
  ExternalLink, Shield, Cloud, Home, Film, Key, Folder, Tv, Zap, 
  Search, Plus, X, Maximize2, Minimize2, Compass, Layers, Globe, MessageSquare, Users, AlertTriangle, CheckCircle, Star,
  Moon, Bell, Bluetooth, Sun, Volume2, Lock, Power, Edit3, Image as ImageIcon, RefreshCw, Eye, WifiOff, Upload, FileText, Image, Check, Monitor,
  ChevronLeft, ChevronRight, Clock, User
} from 'lucide-react';

interface SystemStats {
  cpu: { load: number; cores: number; temperature: number };
  memory: { total: number; used: number; free: number; percentage: number };
  disk: { total: number; used: number; free: number; percentage: number };
  network: { rx_sec: number; tx_sec: number };
  os: { distro: string; release: string; hostname: string; uptime: number };
}

const WALLPAPERS = [
  { id: 'w1', name: 'Gradient Noise Color 1', url: '/public/assets/aistudio/colir_1600x900_noise-1_feather-18_colors-e1ceb5-140514-431337-196f8f-0eba27-4366a9-8a3bd2-fbae60-d1fb04-2b72f1-030509_x-0.01_0.50_0.99_y-0.01_0.44_1.00_4299c38c.png' },
  { id: 'w2', name: 'Gradient Noise Color 2', url: '/public/assets/aistudio/colir_1600x900_noise-4_feather-18_colors-ffffff-e87e95-f05dae-5f24d5-110956_x-0.00_0.30_0.35_0.39_0.99_y-0.01_0.69_0.83_0.99__1__ff4720d8.png' },
  { id: 'w3', name: 'Gradientool Blue 1', url: '/public/assets/aistudio/gradientool-de0af7f9_ff9a9281.png' },
  { id: 'w4', name: 'Gradientool Blue 2', url: '/public/assets/aistudio/gradientool-9d21533e_092c528e.png' },
  { id: 'w5', name: 'Pixel Game Controller', url: '/public/assets/aistudio/27490_d9345d94.png' },
];

const INITIAL_SERVER_APPS = [
  { id: 'openclaw', name: 'OpenClaw AI', category: 'AI & Agents', icon: '/public/assets/aistudio/images__21__e43ffd61.jpg', url: 'http://inovecloudos.local:9000', installed: true, port: 9000, version: '2.4.0', screenshot: '/public/assets/aistudio/images__16__eec94e0f.png', description: 'A IA que realmente faz coisas. Integração com WhatsApp, Telegram e automações locais.' },
  { id: 'penpot', name: 'Penpot Design', category: 'Design', icon: '/public/assets/aistudio/images__19__6c308360.png', url: 'http://inovecloudos.local:9001', installed: true, port: 9001, version: '1.19.0', screenshot: '/public/assets/aistudio/PenpotUI-flexlayout_fc09d3ba.png', description: 'Plataforma de design e prototipagem colaborativa open-source baseada em padrões web.' },
  { id: 'emby', name: 'Emby Media Server', category: 'Media', icon: '/public/assets/aistudio/images__21__ea5586f3.png', url: 'http://inovecloudos.local:8090', installed: true, port: 8090, version: '4.8.3', screenshot: '/public/assets/aistudio/screenshot-1__2__a637e2be.webp', description: 'Your media. Everywhere. Emby organizes and streams your own videos, music, photos, and live TV.' },
  { id: 'nodered', name: 'Node-RED Workflow', category: 'Automation', icon: '/public/assets/aistudio/images__25__c7574d97.png', url: 'http://inovecloudos.local:1880', installed: true, port: 1880, version: '3.1.3', screenshot: '/public/assets/aistudio/Captura_de_tela_2026-11-02_104739_c12d72f1.png', description: 'Node based workflow creation. Low-code programming for event-driven applications and automation.' },
  { id: 'adguard', name: 'AdGuard Home', category: 'Security', icon: '/public/assets/aistudio/images__22__a8df87a4.png', url: 'http://inovecloudos.local:3053', installed: true, port: 3053, version: '0.107.43', screenshot: '/public/assets/aistudio/screenshot-1_c8c741c9.webp', description: 'Network-wide ad and tracker blocking software for your home network and servers.' },
  { id: 'jellyfin', name: 'Jellyfin Media', category: 'Media', icon: '/public/assets/aistudio/unnamed_23a9d905.png', url: 'http://inovecloudos.local:8096', installed: true, port: 8096, version: '10.8.13', screenshot: '/public/assets/aistudio/jellyfin-self-hosted-media-server-guide.BRjd1q73_ZBFNzD_f5a85c59.webp', description: 'Customized media library. Free Software Media System for streaming to any device.' },
  { id: 'firefox', name: 'Firefox (VNC)', category: 'Browser', icon: '/public/assets/aistudio/images__26__0bc4991e.jpg', url: 'http://inovecloudos.local:5800', installed: true, port: 5800, version: '124.0', screenshot: '/public/assets/aistudio/ef922f7f7815f222f0889cff4f890ca9_fgraphic_9e81d7c1.jpg', description: 'Navegador Firefox rodando em container Docker com acesso VNC direto no navegador.' },
  { id: 'immich', name: 'Immich Photos', category: 'Media', icon: '/public/assets/aistudio/images__17__b660534f.png', url: 'http://inovecloudos.local:2283', installed: true, port: 2283, version: '1.100.0', screenshot: '/public/assets/aistudio/host-your-photos-immich-setup-guide-on-zimaos-2032381_f716ed61.webp', description: 'Solução self-hosted de gerenciamento e backup automático de fotos e vídeos.' },
  { id: 'homeassistant', name: 'Home Assistant', category: 'Automation', icon: '/public/assets/aistudio/images__11__9584e723.png', url: 'http://inovecloudos.local:8123', installed: true, port: 8123, version: '2024.3.1', screenshot: '/public/assets/aistudio/Captura_de_tela_2026-11-01_115455_dbcf4c22.png', description: 'Automação residencial inteligente com controle local e privacidade.' },
  { id: 'plex', name: 'Plex Media Server', category: 'Media', icon: '/public/assets/aistudio/images__20__0ea0ca22.jpg', url: 'http://inovecloudos.local:32400', installed: true, port: 32400, version: '1.40.0', screenshot: '/public/assets/aistudio/Captura_de_tela_2026-11-01_120256_b8815012.png', description: 'Streaming de filmes, séries e coleções de mídia para qualquer dispositivo.' },
  { id: 'nextcloud', name: 'Nextcloud', category: 'Storage', icon: '/public/assets/aistudio/images__10__15754696.png', url: 'http://inovecloudos.local:8080', installed: true, port: 8080, version: '28.0.2', screenshot: '/public/assets/aistudio/Captura_de_tela_2026-11-01_115551_8d87df87.png', description: 'Sua nuvem pessoal de arquivos, sincronização e colaboração segura.' },
  { id: 'ollama', name: 'Ollama AI (Local)', category: 'AI', icon: '/public/assets/aistudio/download__1__ba98c536.png', url: 'http://inovecloudos.local:11434', installed: true, port: 11434, version: '0.1.48', screenshot: '/public/assets/aistudio/Captura_de_tela_2026-11-01_115515_d0adf8f0.png', description: 'Modelos de linguagem privados (Llama 3, DeepSeek) rodando localmente.' },
  { id: 'romm', name: 'RomM (Game Library)', category: 'Gaming', icon: '/public/assets/aistudio/images__27__ef861017.jpg', url: 'http://inovecloudos.local:8085', installed: true, port: 8085, version: '3.2.0', screenshot: '/public/assets/aistudio/romm_fd92dfee.png', description: 'O gerenciador e biblioteca all-in-one mais poderoso para suas coleções de jogos e ROMs retrô.' },
];

const INITIAL_WEB_SHORTCUTS = [
  { id: 'sh1', name: 'GitHub Workspace', url: 'https://github.com', icon: '/public/assets/aistudio/images__13__ca52ddfa.png', screenshot: '/public/assets/aistudio/images__24__477b5807.jpg', category: 'Dev', description: 'Ambiente de desenvolvimento, repositórios e issues com IA.' },
  { id: 'sh2', name: 'Notion', url: 'https://www.notion.so', icon: '/public/assets/aistudio/images__14__238f7cec.png', screenshot: '/public/assets/aistudio/images__15__528d5fc9.png', category: 'Tools', description: 'Espaço de trabalho all-in-one para notas, wiki e tarefas.' },
  { id: 'sh3', name: 'WhatsApp Web', url: 'https://web.whatsapp.com', icon: '/public/assets/aistudio/images__12__65b6cc22.png', screenshot: '/public/assets/aistudio/images__22__e3d75bb8.jpg', category: 'Chat', description: 'Mensagens instantâneas e comunicações.' },
  { id: 'sh4', name: 'Monica Code', url: 'https://monica.im/pt_BR/code', icon: '/public/assets/aistudio/monica_aed11cb1.webp', screenshot: '/public/assets/aistudio/Captura_de_tela_2026-11-01_140540_8b01a158.png', category: 'AI & Dev', description: 'Assistente de Codificação AI tudo-em-um para seu editor de código favorito (GPT-4o & Claude 3.5 Sonnet).' },
  { id: 'sh5', name: 'Design Minis', url: 'https://www.designminis.com/', icon: '/public/assets/aistudio/images__28__242d517b.jpg', screenshot: '/public/assets/aistudio/Captura_de_tela_2026-11-01_142106_0986f5e1.png', category: 'Design', description: 'The design tools you keep bookmarking. Color pickers, type scales, easing curves, shadow generators.' },
  { id: 'sh6', name: 'OpenCut Video', url: 'https://opencut.app/', icon: '/public/assets/aistudio/e3ec499e9c4b00d702f1618d6f64ecea4604620f9923c582f37390575755629c_600_875f5a77.webp', screenshot: '/public/assets/aistudio/Captura_de_tela_2026-11-01_142434_76b71771.png', category: 'Video & Design', description: 'Editor de vídeo profissional com interface escura e recursos modernos (opencut.app).' },
  { id: 'sh7', name: 'AudioCN', url: 'https://www.audiocn.dev/?ref=productrally', icon: '/public/assets/aistudio/images__20__ece33b49.png', screenshot: '/public/assets/aistudio/2_90ef43fa.png', category: 'Audio & UI', description: 'Audio UI, mixed and mastered. Audio components for React & shadcn/ui.' },
  { id: 'sh8', name: 'Headless UI', url: 'https://headlessui.com/', icon: '/public/assets/aistudio/images__24__5c7b1725.png', screenshot: '/public/assets/aistudio/screenshot-1__1__470849d2.webp', category: 'UI & Design', description: 'Completely unstyled, fully accessible UI components, designed to integrate with Tailwind CSS.' },
  { id: 'sh9', name: 'Cursor Lab UI', url: 'https://cursor-lab-ui.vercel.app/?ref=productrally', icon: '/public/assets/aistudio/43a1930d4870476c9ad7320dbd1b0e4c1c7d3366_2_1024x990_8bd31fc6.jpeg', screenshot: '/public/assets/aistudio/images__20__591e7158.png', category: 'Design & Lab', description: 'Figma cursor and animated multiplayer cursor lab for web design and interactive apps.' },
  { id: 'sh10', name: 'Diffusion Editor', url: 'https://opencut.app/', icon: '/public/assets/aistudio/images__23__1f7f8bdc.png', screenshot: '/public/assets/aistudio/social-card.46834755_65e90fe5.jpg', category: 'Video & AI', description: 'Turn your agent into a video editor. Professional AI-powered video editing and rendering suite.' },
];

interface ServerFile {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'document' | 'video' | 'code' | 'archive' | 'data';
  size: string;
  date: string;
  path: string;
  url?: string;
}

const INITIAL_SERVER_FILES: ServerFile[] = [
  { id: 'f1', name: 'Appimage', type: 'folder', size: '48.2 MB', date: '01/11/2026', path: '/home/satoshi/Appimage' },
  { id: 'f2', name: 'Área de trabalho', type: 'folder', size: '12.4 KB', date: '01/11/2026', path: '/home/satoshi/Área de trabalho' },
  { id: 'f3', name: 'Documentos', type: 'folder', size: '156 MB', date: '31/10/2026', path: '/home/satoshi/Documentos' },
  { id: 'f4', name: 'Downloads', type: 'folder', size: '2.4 GB', date: '01/11/2026', path: '/home/satoshi/Downloads' },
  { id: 'f5', name: 'Imagens', type: 'folder', size: '850 MB', date: '01/11/2026', path: '/home/satoshi/Imagens' },
  { id: 'f6', name: 'Modelos', type: 'folder', size: '4.1 KB', date: '25/10/2026', path: '/home/satoshi/Modelos' },
  { id: 'f7', name: 'Músicas', type: 'folder', size: '1.2 GB', date: '28/10/2026', path: '/home/satoshi/Músicas' },
  { id: 'f8', name: 'Backup_Google_Studio', type: 'folder', size: '3.2 GB', date: '01/11/2026', path: '/home/satoshi/Backup_Google_Studio' },
  { id: 'f9', name: 'snap', type: 'folder', size: '4.8 GB', date: '01/11/2026', path: '/home/satoshi/snap' },
  { id: 'f10', name: 'Emus_Projetos', type: 'folder', size: '840 MB', date: '01/11/2026', path: '/home/satoshi/Emus_Projetos' },
  { id: 'f11', name: 'dados_comportamento_emus.csv', type: 'data', size: '14.2 MB', date: '01/11/2026', path: '/home/satoshi/dados_comportamento_emus.csv' },
  { id: 'f12', name: 'fotos_emus_servidor.zip', type: 'archive', size: '450 MB', date: '01/11/2026', path: '/home/satoshi/fotos_emus_servidor.zip' },
  { id: 'f13', name: 'script_rastreio_emus.py', type: 'code', size: '12 KB', date: '01/11/2026', path: '/home/satoshi/script_rastreio_emus.py' },
  { id: 'f14', name: 'recuperacao_studio.txt', type: 'document', size: '4 KB', date: '01/11/2026', path: '/home/satoshi/recuperacao_studio.txt' },
  { id: 'f15', name: 'studio_servidor_perda.log', type: 'document', size: '1.2 MB', date: '01/11/2026', path: '/home/satoshi/studio_servidor_perda.log' },
  { id: 'f16', name: 'config_backup.json', type: 'code', size: '2.5 KB', date: '01/11/2026', path: '/home/satoshi/config_backup.json' },
];

export default function App() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [serverApps, setServerApps] = useState(INITIAL_SERVER_APPS);
  const [webShortcuts, setWebShortcuts] = useState(INITIAL_WEB_SHORTCUTS);
  const [storeTab, setStoreTab] = useState<'server' | 'shortcuts'>('server');
  const [activeWindow, setActiveWindow] = useState<{ title: string; url: string; isVnc?: boolean } | null>(null);
  const [activeModal, setActiveModal] = useState<'settings' | 'store' | 'monitor' | 'terminal' | 'files' | 'editUser' | 'editWidget' | 'linuxConfig' | null>(null);
  const [selectedAppPreview, setSelectedAppPreview] = useState<any | null>(null);
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0].url);
  const [newShortcutForm, setNewShortcutForm] = useState({ name: '', url: '', category: 'Tools', description: '' });
  
  // User Profile & Language States
  const [userName, setUserName] = useState('Administrador');
  const [userEmail, setUserEmail] = useState('admin@inovecloudos.local');
  const [userAvatar, setUserAvatar] = useState('/public/assets/aistudio/images__13__ca52ddfa.png');
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');

  const [widgetsConfig, setWidgetsConfig] = useState({ 
    showFiles: true, 
    showStorage: true, 
    showSystem: true,
    showMonitorWidget: true 
  });

  // VNC Firefox Browser Simulator State
  const [vncUrlInput, setVncUrlInput] = useState('https://www.google.com');

  // File Manager State
  const [serverFiles, setServerFiles] = useState<ServerFile[]>(INITIAL_SERVER_FILES);
  const [currentPath, setCurrentPath] = useState('/home/satoshi/Início');
  const [selectedFile, setSelectedFile] = useState<ServerFile | null>(null);

  // Linux Server Config State
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [selectedWifi, setSelectedWifi] = useState('InoveCloud-5G (Conectado)');
  const [dhcpEnabled, setDhcpEnabled] = useState(true);
  const [ipAddress, setIpAddress] = useState('192.168.1.150');
  const [gateway, setGateway] = useState('192.168.1.1');
  const [dnsServer, setDnsServer] = useState('1.1.1.1, 8.8.8.8');
  const [sshEnabled, setSshEnabled] = useState(true);
  const [firewallUfw, setFirewallUfw] = useState(true);

  // Terminal state
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Welcome to Ubuntu 24.04.1 LTS (GNU/Linux 6.8.0-31-generic x86_64)',
    ' * Documentation:  https://help.ubuntu.com',
    ' * Management:     https://landscape.canonical.com',
    ' * Support:        https://ubuntu.com/pro',
    '',
    'System loaded. Type "help" or "docker ps" to inspect services.'
  ]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/system/stats');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setStats(data);
      } else {
        setStats({
          cpu: { load: 14.2, cores: 4, temperature: 43.5 },
          memory: { total: 16106127360, used: 6153960755, free: 9952166605, percentage: 38 },
          disk: { total: 1000204886016, used: 320057368084, free: 680147517932, percentage: 32 },
          network: { rx_sec: 450000, tx_sec: 212000 },
          os: { distro: 'Ubuntu 24.04 LTS', release: '6.8.0-31-generic', hostname: 'inovecloudos.local', uptime: 453200 }
        });
      }
    } catch (e) {
      setStats({
        cpu: { load: 14.2, cores: 4, temperature: 43.5 },
        memory: { total: 16106127360, used: 6153960755, free: 9952166605, percentage: 38 },
        disk: { total: 1000204886016, used: 320057368084, free: 680147517932, percentage: 32 },
        network: { rx_sec: 450000, tx_sec: 212000 },
        os: { distro: 'Ubuntu 24.04 LTS', release: '6.8.0-31-generic', hostname: 'inovecloudos.local', uptime: 453200 }
      });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'en') {
      if (hour < 12) return `Good morning, ${userName}.`;
      if (hour < 18) return `Good afternoon, ${userName}.`;
      return `Good evening, ${userName}.`;
    }
    if (hour < 12) return `Bom dia, ${userName}.`;
    if (hour < 18) return `Boa tarde, ${userName}.`;
    return `Boa noite, ${userName}.`;
  };

  const handleToggleServerApp = (appId: string) => {
    setServerApps(prev => prev.map(a => a.id === appId ? { ...a, installed: !a.installed } : a));
  };

  const handleAddWebShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShortcutForm.name || !newShortcutForm.url) return;
    const newS = {
      id: 'sh_' + Math.random().toString(36).substring(7),
      name: newShortcutForm.name,
      url: newShortcutForm.url,
      category: newShortcutForm.category,
      description: newShortcutForm.description || (language === 'en' ? 'Custom web shortcut.' : 'Atalho web personalizado.'),
      icon: '/public/assets/aistudio/images__13__ca52ddfa.png',
      screenshot: '/public/assets/aistudio/images__24__477b5807.jpg'
    };
    setWebShortcuts(prev => [...prev, newS]);
    setNewShortcutForm({ name: '', url: '', category: 'Tools', description: '' });
    alert(language === 'en' ? 'Shortcut successfully added to home screen!' : 'Atalho web adicionado com sucesso à tela inicial!');
  };

  const handleRemoveShortcut = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(language === 'en' ? 'Remove this shortcut from home screen?' : 'Remover este atalho da tela inicial?')) {
      setWebShortcuts(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const newFile: ServerFile = {
      id: 'file_' + Math.random().toString(36).substring(7),
      name: file.name,
      type: file.type.includes('image') ? 'image' : 'document',
      size: `${(file.size / (1024*1024)).toFixed(1)} MB`,
      date: new Date().toLocaleDateString(),
      path: `${currentPath}/${file.name}`,
      url: URL.createObjectURL(file)
    };
    setServerFiles(prev => [...prev, newFile]);
    alert(language === 'en' ? `File "${file.name}" uploaded successfully to Linux server!` : `Arquivo "${file.name}" salvo com sucesso no Servidor Linux Ubuntu!`);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    const cmd = terminalInput.trim();
    let response = '';

    if (cmd === 'help') {
      response = 'Available commands: docker ps, htop, ip a, ping, uptime, clear, reboot, wifi status';
    } else if (cmd === 'docker ps') {
      response = 'CONTAINER ID   IMAGE                 COMMAND                  CREATED         STATUS         PORTS\n4a8f9b2c1d3e   openclaw/ai:latest    "node server.js"        2 days ago      Up 2 days      0.0.0.0:9000->9000/tcp\nb1a2c3d4e5f6   firefox:vnc           "/init"                  3 days ago      Up 3 days      0.0.0.0:5800->5800/tcp\n7c8b9a1e2f3d   penpot:latest         "/entrypoint.sh"         1 week ago      Up 1 week      0.0.0.0:9001->9001/tcp\n9a8b7c6d5e4f   immich:latest         "immich-server"         5 days ago      Up 5 days      0.0.0.0:2283->2283/tcp';
    } else if (cmd === 'htop' || cmd === 'top') {
      response = 'Tasks: 148 total, 1 running. CPU: 16.5% usr. Mem: 7.1GB/16GB used. Swap: 0B.';
    } else if (cmd === 'ip a') {
      response = '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP\n    inet ' + ipAddress + '/24 brd 192.168.1.255 scope global eth0\n3: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP SSID: InoveCloud-5G';
    } else if (cmd === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else if (cmd === 'reboot') {
      response = 'Rebooting Ubuntu Server LTS... System restarting.';
    } else {
      response = `bash: ${cmd}: command not found. Type "help" for valid commands.`;
    }

    setTerminalLogs(prev => [...prev, `root@inovecloudos:~# ${cmd}`, response]);
    setTerminalInput('');
  };

  const openApp = (app: any) => {
    if (app.id === 'firefox') {
      setActiveWindow({ title: 'Firefox (VNC Remote Browser)', url: 'https://www.google.com', isVnc: true });
    } else {
      setActiveWindow({ title: app.name, url: app.url });
    }
  };

  return (
    <div 
      className="min-h-screen text-slate-100 flex flex-col font-sans relative overflow-hidden select-none bg-cover bg-center transition-all duration-700"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      {/* Glassmorphism Dark Vignette / Scrim */}
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px] pointer-events-none z-0" />

      {/* Top Glass Header */}
      <div className="h-12 bg-slate-950/70 backdrop-blur-2xl border-b border-white/15 px-6 flex items-center justify-between z-40 text-xs text-slate-300 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500 hover:opacity-80 cursor-pointer shadow-md"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500 hover:opacity-80 cursor-pointer shadow-md"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500 hover:opacity-80 cursor-pointer shadow-md"></div>
        </div>

        <div className="px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white font-mono text-[11px] flex items-center gap-2 shadow-inner">
          <Shield className="w-3.5 h-3.5 text-emerald-400" /> inovecloudos.local
        </div>

        <div className="flex items-center gap-2.5">
          {/* User Profile Quick Button */}
          <button 
            onClick={() => setActiveModal('editUser')}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xs font-medium text-white flex items-center gap-1.5 transition-all shadow-md"
            title={language === 'en' ? 'Edit User Profile & Language' : 'Editar Usuário & Idioma'}
          >
            <div className="w-5 h-5 rounded-full bg-purple-600 overflow-hidden flex items-center justify-center border border-white/30">
              <img src={userAvatar} className="w-full h-full object-cover" alt="avatar" />
            </div>
            <span className="max-w-[100px] truncate">{userName}</span>
          </button>

          <button 
            onClick={() => setActiveModal('monitor')}
            className="px-3.5 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 rounded-full text-xs font-semibold text-purple-200 flex items-center gap-1.5 transition-all shadow-xl backdrop-blur-xl"
            title="Monitor de Sistema (RAM, SSD, CPU)"
          >
            <Activity className="w-3.5 h-3.5 text-purple-400" /> {language === 'en' ? 'Monitor' : 'Monitor'}
          </button>
          <button 
            onClick={() => setActiveModal('files')}
            className="px-3.5 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 rounded-full text-xs font-semibold text-blue-200 flex items-center gap-1.5 transition-all shadow-xl backdrop-blur-xl"
            title="Gerenciador de Arquivos & Imagens do Servidor"
          >
            <Folder className="w-3.5 h-3.5 text-blue-400" /> {language === 'en' ? 'Files' : 'Meus Arquivos'}
          </button>
          <button 
            onClick={() => setActiveModal('linuxConfig')}
            className="px-3.5 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 rounded-full text-xs font-semibold text-emerald-200 flex items-center gap-1.5 transition-all shadow-xl backdrop-blur-xl"
            title="Configurações Servidor Linux"
          >
            <Wifi className="w-3.5 h-3.5 text-emerald-400" /> {language === 'en' ? 'Linux' : 'Servidor Linux'}
          </button>
          <button 
            onClick={() => setActiveModal('terminal')}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-xl backdrop-blur-xl"
            title="Terminal SSH"
          >
            <TerminalIcon className="w-3.5 h-3.5 text-amber-400" /> Terminal
          </button>
          <button 
            onClick={() => setActiveModal('store')}
            className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xl border border-white/20"
          >
            <Cloud className="w-3.5 h-3.5" /> {language === 'en' ? 'App Store' : 'Loja de Apps'}
          </button>
        </div>
      </div>

      {/* MAIN DESKTOP WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col items-center relative z-10 pb-36">
        
        {/* Greeting */}
        <div className="text-center my-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-3xl bg-white/15 backdrop-blur-2xl border border-white/30 flex items-center justify-center shadow-2xl overflow-hidden cursor-pointer" onClick={() => setActiveModal('editUser')}>
            <img src={userAvatar} className="w-full h-full object-cover" alt="User Avatar" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg font-sans">
            {getGreeting()}
          </h1>
          <p className="text-sm text-slate-200 mt-1 font-medium drop-shadow">
            {language === 'en' ? 'InoveCloud OS Workspace • Emby, Node-RED, AdGuard, AudioCN, Headless UI & OpenCut Ready' : 'InoveCloud OS Workspace • Emby, Node-RED, AdGuard, AudioCN, Headless UI & OpenCut Prontos'}
          </p>
        </div>

        {/* TOP GLASS WIDGETS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 max-w-6xl w-full mb-10">
          
          {/* Widget 1: Files */}
          {widgetsConfig.showFiles && (
            <div className="bg-white/10 backdrop-blur-2xl border border-white/25 rounded-3xl p-5 shadow-2xl flex flex-col justify-between hover:bg-white/15 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/90">{language === 'en' ? 'Files & Dirs' : 'Files & Diretórios'}</span>
                <span className="text-[10px] text-purple-300 font-mono">ZFS Storage</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div onClick={() => setActiveModal('files')} className="bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all shadow-inner">
                  <Folder className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-medium text-white">Downloads</span>
                </div>
                <div onClick={() => setActiveModal('files')} className="bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all shadow-inner">
                  <Folder className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-medium text-white">Documents</span>
                </div>
                <div onClick={() => setActiveModal('files')} className="bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all shadow-inner">
                  <Folder className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-medium text-white">Photos</span>
                </div>
                <div onClick={() => setActiveModal('files')} className="bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all shadow-inner">
                  <Folder className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-medium text-white">Videos</span>
                </div>
              </div>
            </div>
          )}

          {/* Widget 2: Storage */}
          {widgetsConfig.showStorage && (
            <div onClick={() => setActiveModal('monitor')} className="bg-white/10 backdrop-blur-2xl border border-white/25 rounded-3xl p-5 shadow-2xl flex flex-col justify-between hover:bg-white/15 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/90">{language === 'en' ? 'Storage (SSD)' : 'Armazenamento (SSD)'}</span>
                <span className="text-[10px] text-emerald-300 font-mono">NVMe RAID 1</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight my-2">
                4.2 TB <span className="text-xs font-normal text-white/70">/ 16 TB</span>
              </div>
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden my-2 shadow-inner">
                <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full" style={{ width: '26%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-white/80 font-mono">
                <span>{language === 'en' ? 'Used: 26%' : 'Usado: 26%'}</span>
                <span>106.2 GiB free</span>
              </div>
            </div>
          )}

          {/* Widget 3: System Hardware */}
          {widgetsConfig.showSystem && (
            <div onClick={() => setActiveModal('monitor')} className="bg-white/10 backdrop-blur-2xl border border-white/25 rounded-3xl p-5 shadow-2xl flex flex-col justify-between hover:bg-white/15 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/90">{language === 'en' ? 'Server Hardware' : 'Hardware do Servidor'}</span>
                <span className="text-[10px] text-sky-300 font-mono">Ubuntu 24.04</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/10 border border-white/15 rounded-2xl p-3 shadow-inner">
                  <Cpu className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                  <div className="text-xs font-bold text-white">CPU</div>
                  <div className="text-xs font-mono text-white/90">{stats ? stats.cpu.load : 18}%</div>
                </div>
                <div className="bg-white/10 border border-white/15 rounded-2xl p-3 shadow-inner">
                  <HardDrive className="w-5 h-5 mx-auto mb-1 text-sky-400" />
                  <div className="text-xs font-bold text-white">RAM</div>
                  <div className="text-xs font-mono text-white/90">{stats ? `${(stats.memory.used / (1024*1024*1024)).toFixed(1)} GB` : '6.2 GB'}</div>
                </div>
                <div className="bg-white/10 border border-white/15 rounded-2xl p-3 shadow-inner">
                  <Activity className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                  <div className="text-xs font-bold text-white">Temp</div>
                  <div className="text-xs font-mono text-white/90">{stats ? stats.cpu.temperature : 44}°C</div>
                </div>
              </div>
            </div>
          )}

          {/* Widget 4: Home Screen Monitor Widget */}
          {widgetsConfig.showMonitorWidget && (
            <div onClick={() => setActiveModal('monitor')} className="bg-white/10 backdrop-blur-2xl border border-white/25 rounded-3xl p-5 shadow-2xl flex flex-col justify-between hover:bg-white/15 transition-all cursor-pointer relative group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/90">Monitor Telemetria</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div className="flex items-center justify-center my-1">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="8" className="text-white/10" fill="none" />
                    <circle cx="50" cy="50" r="38" stroke="#a855f7" strokeWidth="8" strokeDasharray="238.7" strokeDashoffset={238.7 * (1 - 0.78)} strokeLinecap="round" fill="none" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-extrabold text-white font-mono">78%</span>
                    <span className="text-[9px] text-purple-300 font-mono">Optimal</span>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-center text-white/80 font-medium">
                Clique para ver os 4 dials em tempo real
              </div>
            </div>
          )}

        </div>

        {/* INSTALLED SERVER APPS & WEB SHORTCUTS GRID */}
        <div className="w-full max-w-6xl px-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/95">
              {language === 'en' ? 'Emby, Node-RED, AdGuard, AudioCN, Headless UI & Servidores' : 'Emby, Node-RED, AdGuard, AudioCN, Headless UI & Servidores'}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveModal('editWidget')} className="text-xs text-slate-200 hover:text-white font-medium flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 backdrop-blur-md">
                <Settings className="w-3.5 h-3.5" /> {language === 'en' ? 'Widgets' : 'Editar Widgets'}
              </button>
              <button onClick={() => setActiveModal('store')} className="text-xs text-purple-200 hover:text-white font-medium underline flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 backdrop-blur-md">
                <Plus className="w-3.5 h-3.5" /> {language === 'en' ? 'Add/Remove Apps' : 'Adicionar / Remover na Loja'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
            {/* Server Apps installed */}
            {serverApps.filter(a => a.installed).map(app => (
              <div 
                key={app.id}
                onClick={() => openApp(app)}
                className="group flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/20 transition-all cursor-pointer relative bg-white/5 backdrop-blur-xl border border-white/15 shadow-xl"
              >
                <div className="absolute top-1 right-1 bg-emerald-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow">Server</div>
                
                <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity z-20">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedAppPreview(app); }}
                    className="bg-purple-600 text-white rounded-full p-1 shadow hover:bg-purple-500"
                    title="Ver Demo & Screenshot"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleToggleServerApp(app.id); }}
                    className="bg-rose-600 text-white rounded-full p-1 shadow hover:bg-rose-500"
                    title="Remover da Tela Inicial"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform overflow-hidden">
                  <img src={app.icon} className="w-full h-full object-cover" alt={app.name} />
                </div>
                <span className="text-xs font-medium text-white text-center truncate w-full drop-shadow">{app.name}</span>
              </div>
            ))}

            {/* Web Shortcuts */}
            {webShortcuts.map(shortcut => (
              <div 
                key={shortcut.id}
                onClick={() => setActiveWindow({ title: shortcut.name, url: shortcut.url })}
                className="group flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/20 transition-all cursor-pointer relative bg-white/5 backdrop-blur-xl border border-white/15 shadow-xl"
              >
                <div className="absolute top-1 left-1 bg-sky-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow">Web</div>

                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity z-20">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedAppPreview(shortcut); }}
                    className="bg-purple-600 text-white rounded-full p-1 shadow hover:bg-purple-500"
                    title="Ver Demo"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={(e) => handleRemoveShortcut(shortcut.id, e)}
                    className="bg-rose-600 text-white rounded-full p-1 shadow hover:bg-rose-500"
                    title="Remover atalho"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform overflow-hidden">
                  <img src={shortcut.icon} className="w-full h-full object-cover" alt={shortcut.name} />
                </div>
                <span className="text-xs font-medium text-white text-center truncate w-full drop-shadow">{shortcut.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-6">
          <div className="px-6 py-2.5 bg-slate-950/70 backdrop-blur-2xl border border-white/25 rounded-full flex items-center gap-3 text-xs text-white/90 shadow-2xl">
            <Search className="w-4 h-4 text-white/60" />
            <input 
              type="text" 
              placeholder={language === 'en' ? 'Search Emby, Node-RED, AdGuard, AudioCN, Headless UI...' : 'Buscar Emby, Node-RED, AdGuard, AudioCN, Headless UI...'} 
              className="bg-transparent border-0 text-white placeholder-white/50 focus:outline-none w-64 md:w-80 text-xs"
            />
            <span className="px-1.5 py-0.5 rounded bg-white/25 text-[10px] font-mono shadow-inner">⌘K</span>
          </div>
        </div>

      </main>

      {/* FLOATING MAC-LIKE GLASS DOCK */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-3 px-6 py-3 bg-slate-950/75 backdrop-blur-3xl border border-white/30 rounded-3xl shadow-2xl">
          <button onClick={() => setActiveModal('monitor')} className="w-12 h-12 rounded-2xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xl" title="Monitor de Sistema (RAM, SSD, CPU)">
            <Activity className="w-6 h-6 text-purple-400" />
          </button>
          <button onClick={() => setActiveModal('files')} className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform border border-white/20" title="Gerenciador de Arquivos & Imagens">
            <Folder className="w-6 h-6" />
          </button>
          <button onClick={() => setActiveModal('linuxConfig')} className="w-12 h-12 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xl" title="Configuração Servidor Linux (Wi-Fi, Rede)">
            <Wifi className="w-6 h-6 text-emerald-400" />
          </button>
          <button onClick={() => setActiveModal('store')} className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xl" title="Loja de Apps & Servidor">
            <Cloud className="w-6 h-6 text-sky-400" />
          </button>
          <button onClick={() => setActiveModal('terminal')} className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xl" title="Terminal SSH">
            <TerminalIcon className="w-6 h-6 text-amber-400" />
          </button>
          <button onClick={() => setActiveModal('editUser')} className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xl overflow-hidden" title="Editar Usuário & Idioma">
            <img src={userAvatar} className="w-full h-full object-cover" alt="User" />
          </button>
          <button onClick={() => setActiveModal('settings')} className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xl" title="Configurações & Wallpaper">
            <Settings className="w-6 h-6 text-slate-200" />
          </button>
        </div>
      </div>

      {/* WINDOW VIEWER MODAL */}
      {activeWindow && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 animate-fadeIn">
          <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/30 rounded-3xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="h-14 bg-slate-950/90 px-6 flex items-center justify-between border-b border-white/15">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-rose-500 cursor-pointer shadow-md" onClick={() => setActiveWindow(null)}></div>
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-md"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-md"></div>
                <span className="text-xs font-semibold text-white ml-3">{activeWindow.title}</span>
                <span className="text-[11px] font-mono text-slate-300 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15">{activeWindow.url}</span>
              </div>
              <button onClick={() => setActiveWindow(null)} className="p-1 text-slate-300 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* If VNC Firefox mode */}
            {activeWindow.isVnc ? (
              <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
                <div className="h-12 bg-slate-900/90 px-4 flex items-center gap-3 border-b border-white/15">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <button className="p-1.5 hover:bg-white/15 rounded-lg"><RotateCw className="w-4 h-4" /></button>
                  </div>
                  <div className="flex-1 bg-slate-950 px-4 py-1.5 rounded-xl border border-white/20 flex items-center gap-2 text-xs font-mono text-white shadow-inner">
                    <Globe className="w-3.5 h-3.5 text-orange-400" />
                    <input 
                      type="text" 
                      value={vncUrlInput}
                      onChange={e => setVncUrlInput(e.target.value)}
                      className="bg-transparent border-0 w-full focus:outline-none text-white"
                    />
                  </div>
                  <span className="text-[10px] px-2.5 py-1 bg-orange-500/20 text-orange-300 font-mono rounded-lg border border-orange-500/30">VNC Stream Active</span>
                </div>
                <div className="flex-1 relative bg-slate-900">
                  <iframe src={vncUrlInput} title="Firefox VNC Session" className="w-full h-full border-0 bg-white" />
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-slate-950 relative flex items-center justify-center">
                <div className="text-center p-8 max-w-md space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-purple-600/20 border border-purple-500/30 mx-auto flex items-center justify-center text-purple-400 shadow-xl">
                    <ExternalLink className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Conectando ao Serviço: {activeWindow.title}</h3>
                  <p className="text-xs text-slate-300 font-mono">{activeWindow.url}</p>
                  <div className="pt-2 flex gap-3 justify-center">
                    <a 
                      href={activeWindow.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-semibold transition-all shadow-xl inline-flex items-center gap-2 border border-white/20"
                    >
                      Abrir em Nova Aba <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button 
                      onClick={() => setActiveWindow(null)}
                      className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-all border border-white/20"
                    >
                      Fechar Janela
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* SYSTEM MONITOR MODAL */}
      {activeModal === 'monitor' && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 animate-fadeIn">
          <div className="bg-slate-950/95 backdrop-blur-3xl border border-white/30 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="h-16 px-8 bg-slate-900/90 flex items-center justify-between border-b border-white/15">
              <div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-purple-400">InoveCloud OS · Q4 2026 Telemetry</div>
                <h2 className="text-lg font-extrabold text-white tracking-tight">System Resource & Hardware Monitor</h2>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 text-slate-300 hover:text-white rounded-xl bg-white/10 border border-white/15">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-slate-950/90">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Server status is optimal, all nodes running</h3>
                  <p className="text-xs text-slate-400 mt-1">Real-time metrics for CPU, RAM, NVMe SSD Storage and Network throughput.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs shadow-inner">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Live Telemetry Active
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 flex flex-col items-center justify-between text-center relative shadow-2xl group hover:border-purple-500/50 transition-all">
                  <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest">RAM Usage</div>
                  
                  <div className="relative w-40 h-40 my-6 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-slate-800" fill="none" />
                      <circle cx="50" cy="50" r="40" stroke="url(#ramGradient)" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.44)} strokeLinecap="round" fill="none" className="transition-all duration-1000" />
                      <defs>
                        <linearGradient id="ramGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="50%" stopColor="#818cf8" />
                          <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-white font-mono tracking-tighter">44%</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">7.1 / 16 GB</span>
                    </div>
                  </div>

                  <div className="w-full text-center">
                    <div className="text-sm font-bold text-white">Memory Allocation</div>
                    <div className="text-xs text-emerald-400 font-mono mt-1">+2.4 GB free buffer</div>
                  </div>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 flex flex-col items-center justify-between text-center relative shadow-2xl group hover:border-purple-500/50 transition-all">
                  <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest">SSD Storage</div>
                  
                  <div className="relative w-40 h-40 my-6 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-slate-800" fill="none" />
                      <circle cx="50" cy="50" r="40" stroke="url(#ssdGradient)" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.26)} strokeLinecap="round" fill="none" className="transition-all duration-1000" />
                      <defs>
                        <linearGradient id="ssdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="50%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#fbbf24" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-white font-mono tracking-tighter">26%</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">4.2 / 16 TB</span>
                    </div>
                  </div>

                  <div className="w-full text-center">
                    <div className="text-sm font-bold text-white">NVMe RAID 1 Pool</div>
                    <div className="text-xs text-sky-400 font-mono mt-1">106.2 GiB free space</div>
                  </div>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 flex flex-col items-center justify-between text-center relative shadow-2xl group hover:border-purple-500/50 transition-all">
                  <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest">CPU Cores</div>
                  
                  <div className="relative w-40 h-40 my-6 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-slate-800" fill="none" />
                      <circle cx="50" cy="50" r="40" stroke="url(#cpuGradient)" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.18)} strokeLinecap="round" fill="none" className="transition-all duration-1000" />
                      <defs>
                        <linearGradient id="cpuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#22c55e" />
                          <stop offset="50%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-white font-mono tracking-tighter">{stats ? stats.cpu.load : 18}%</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">{stats ? stats.cpu.temperature : 44}°C Temp</span>
                    </div>
                  </div>

                  <div className="w-full text-center">
                    <div className="text-sm font-bold text-white">Processor Load</div>
                    <div className="text-xs text-emerald-400 font-mono mt-1">8 Cores @ 3.4GHz</div>
                  </div>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 flex flex-col items-center justify-between text-center relative shadow-2xl group hover:border-purple-500/50 transition-all">
                  <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest">Network IO</div>
                  
                  <div className="relative w-40 h-40 my-6 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-slate-800" fill="none" />
                      <circle cx="50" cy="50" r="40" stroke="url(#netGradient)" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.82)} strokeLinecap="round" fill="none" className="transition-all duration-1000" />
                      <defs>
                        <linearGradient id="netGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fb7185" />
                          <stop offset="50%" stopColor="#e879f9" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-white font-mono tracking-tighter">82%</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">1 Gbps Fiber</span>
                    </div>
                  </div>

                  <div className="w-full text-center">
                    <div className="text-sm font-bold text-white">Bandwidth Speed</div>
                    <div className="text-xs text-purple-300 font-mono mt-1">940 Mbps down / 850 up</div>
                  </div>
                </div>

              </div>

            </div>

            <div className="h-16 px-8 bg-slate-900/90 border-t border-white/15 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Ubuntu 24.04.1 LTS Kernel 6.8.0-31-generic</span>
              <button 
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-semibold shadow-xl border border-white/20"
              >
                Fechar Monitor
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EDIT USER PROFILE & LANGUAGE MODAL */}
      {activeModal === 'editUser' && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/30 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-white/15 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" /> {language === 'en' ? 'Edit User & Language' : 'Editar Usuário & Idioma'}
              </h2>
              <button onClick={() => setActiveModal(null)} className="text-slate-300 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">{language === 'en' ? 'User Name' : 'Nome do Usuário'}</label>
                <input 
                  type="text" 
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 shadow-inner"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-medium">{language === 'en' ? 'Email Address' : 'Endereço de E-mail'}</label>
                <input 
                  type="email" 
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 shadow-inner"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-medium">{language === 'en' ? 'Language / Idioma' : 'Idioma do Sistema'}</label>
                <select 
                  value={language}
                  onChange={e => setLanguage(e.target.value as 'pt' | 'en')}
                  className="w-full bg-slate-950 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 shadow-inner"
                >
                  <option value="pt">Português (Brasil)</option>
                  <option value="en">English (US)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-medium">{language === 'en' ? 'Avatar URL' : 'URL do Avatar'}</label>
                <input 
                  type="text" 
                  value={userAvatar}
                  onChange={e => setUserAvatar(e.target.value)}
                  className="w-full bg-slate-950 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 shadow-inner"
                />
              </div>
            </div>

            <button 
              onClick={() => setActiveModal(null)} 
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl font-semibold text-xs transition-colors shadow-xl border border-white/20"
            >
              {language === 'en' ? 'Save Changes' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      )}

      {/* MAC / DOLPHIN FILE MANAGER MODAL */}
      {activeModal === 'files' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-fadeIn">
          <div className="bg-[#18181b] border border-neutral-700/80 rounded-2xl w-full max-w-6xl h-[88vh] flex flex-col shadow-2xl overflow-hidden font-sans text-neutral-200">
            
            <div className="h-11 bg-[#1e1e22] px-4 flex items-center justify-between border-b border-neutral-800 select-none">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer hover:opacity-80" onClick={() => setActiveModal(null)}></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer hover:opacity-80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer hover:opacity-80"></div>
                </div>
                <div className="flex items-center gap-1 text-neutral-400">
                  <button className="p-1 hover:bg-white/10 rounded"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="p-1 hover:bg-white/10 rounded"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-[#121214] rounded-md text-xs text-neutral-300 border border-neutral-800 ml-2">
                  <span className="text-neutral-500">/</span>
                  <span>Início</span>
                </div>
              </div>

              <div className="text-xs font-medium text-neutral-300">Servidor — Dolphin</div>

              <div className="flex items-center gap-2">
                <label className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow">
                  <Upload className="w-3.5 h-3.5" /> Enviar Arquivo
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
                <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              <div className="w-60 bg-[#141416] border-r border-neutral-800 p-3 space-y-6 text-xs overflow-y-auto">
                <div className="space-y-1">
                  <div className="text-[10px] font-semibold text-neutral-500 uppercase px-2 mb-1">Locais</div>
                  <div onClick={() => setCurrentPath('/home/satoshi/Início')} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 font-medium cursor-pointer">
                    <Home className="w-4 h-4" /> Início
                  </div>
                  <div onClick={() => setCurrentPath('/home/satoshi/Documentos')} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-neutral-300 cursor-pointer">
                    <FileText className="w-4 h-4 text-amber-400" /> Documentos
                  </div>
                  <div onClick={() => setCurrentPath('/home/satoshi/Downloads')} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-neutral-300 cursor-pointer">
                    <Download className="w-4 h-4 text-sky-400" /> Downloads
                  </div>
                  <div onClick={() => setCurrentPath('/home/satoshi/Imagens')} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-neutral-300 cursor-pointer">
                    <Image className="w-4 h-4 text-purple-400" /> Imagens
                  </div>
                  <div onClick={() => setCurrentPath('/home/satoshi/Músicas')} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-neutral-300 cursor-pointer">
                    <Film className="w-4 h-4 text-rose-400" /> Músicas
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-semibold text-neutral-500 uppercase px-2 mb-1">Dispositivos</div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-white flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-emerald-400" /> NVMe SSD</span>
                      <span className="text-neutral-400">4.2 / 16 TB</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '26%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-[#18181b] flex flex-col overflow-hidden">
                <div className="p-3 border-b border-neutral-800 bg-[#1c1c20] flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-mono">{currentPath}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400">{serverFiles.length} itens no total</span>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 content-start">
                  {serverFiles.map(file => (
                    <div 
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      onDoubleClick={() => {
                        if (file.url) {
                          setActiveWindow({ title: file.name, url: file.url });
                        }
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all group ${selectedFile?.id === file.id ? 'bg-blue-600/20 border-blue-500 shadow-md' : 'bg-[#202024]/70 border-neutral-800 hover:bg-[#25252a] hover:border-neutral-700'}`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#141416] border border-neutral-800 flex items-center justify-center mb-2 shadow group-hover:scale-105 transition-transform">
                        {file.type === 'folder' && <Folder className="w-6 h-6 text-amber-400" />}
                        {file.type === 'image' && <Image className="w-6 h-6 text-purple-400" />}
                        {file.type === 'document' && <FileText className="w-6 h-6 text-sky-400" />}
                        {file.type === 'code' && <TerminalIcon className="w-6 h-6 text-emerald-400" />}
                        {file.type === 'archive' && <Download className="w-6 h-6 text-rose-400" />}
                        {file.type === 'data' && <Activity className="w-6 h-6 text-amber-300" />}
                      </div>
                      <span className="text-xs font-medium text-neutral-200 truncate w-full">{file.name}</span>
                      <span className="text-[10px] text-neutral-500 mt-0.5">{file.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-10 bg-[#1c1c20] border-t border-neutral-800 px-4 flex items-center justify-between text-xs text-neutral-400">
              <span>{selectedFile ? `Selecionado: ${selectedFile.name} (${selectedFile.size})` : 'Nenhum arquivo selecionado'}</span>
              <button onClick={() => setActiveModal(null)} className="px-4 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md text-xs">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LINUX CONFIG MODAL */}
      {activeModal === 'linuxConfig' && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 animate-fadeIn">
          <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/30 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="h-16 px-6 bg-slate-950/90 flex items-center justify-between border-b border-white/15">
              <div className="flex items-center gap-3">
                <Wifi className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-white text-base">Configurações de Rede & Servidor Linux Ubuntu</h3>
                  <p className="text-xs text-slate-400">Gerencie Wi-Fi, endereços IP, UFW firewall e daemons do sistema.</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 text-slate-300 hover:text-white rounded-xl bg-white/10 border border-white/15">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-950/80 text-xs">
              
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/25 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-sky-400" /> Conexão Wi-Fi (wlan0)
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={wifiEnabled} onChange={e => setWifiEnabled(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1">Rede Wi-Fi Selecionada</label>
                    <select value={selectedWifi} onChange={e => setSelectedWifi(e.target.value)} className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none">
                      <option>InoveCloud-5G (Conectado)</option>
                      <option>InoveCloud-2.4G (Sinal Forte)</option>
                      <option>RedeConvidado (Desconectado)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-900/90 p-4 rounded-xl border border-white/20 shadow-inner">
                  <div className="flex justify-between font-mono text-slate-200">
                    <span>Status da Internet:</span>
                    <span className="text-emerald-400 font-bold">ONLINE (1 Gbps Fiber)</span>
                  </div>
                  <div className="flex justify-between font-mono text-slate-200">
                    <span>Endereço IP Local:</span>
                    <span className="text-sky-300">{ipAddress}</span>
                  </div>
                  <div className="flex justify-between font-mono text-slate-200">
                    <span>Gateway Padrão:</span>
                    <span className="text-slate-300">{gateway}</span>
                  </div>
                  <div className="flex justify-between font-mono text-slate-200">
                    <span>Servidor DNS:</span>
                    <span className="text-slate-300">{dnsServer}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/20 space-y-4 shadow-xl">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" /> Serviços & Segurança (UFW & SSH)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center justify-between p-3.5 bg-slate-900/90 rounded-xl border border-white/15 cursor-pointer shadow-inner">
                    <div>
                      <div className="font-medium text-white">Serviço SSH (Acesso Remoto)</div>
                      <div className="text-[11px] text-slate-400">Porta 22 ativa para administração</div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={sshEnabled} 
                      onChange={e => setSshEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-slate-900/90 rounded-xl border border-white/15 cursor-pointer shadow-inner">
                    <div>
                      <div className="font-medium text-white">UFW Firewall Ativo</div>
                      <div className="text-[11px] text-slate-400">Proteção contra ataques e DDoS</div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={firewallUfw} 
                      onChange={e => setFirewallUfw(e.target.checked)}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                  </label>
                </div>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/20 space-y-4 shadow-xl">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-sky-400" /> Plano de Fundo (Wallpaper do Servidor OS)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {WALLPAPERS.map(w => (
                    <div 
                      key={w.id}
                      onClick={() => setWallpaper(w.url)}
                      className={`rounded-xl overflow-hidden border-2 cursor-pointer transition-all shadow-lg ${wallpaper === w.url ? 'border-purple-500 scale-105 shadow-2xl' : 'border-white/20 hover:border-white/50'}`}
                    >
                      <img src={w.url} className="w-full h-20 object-cover" alt={w.name} />
                      <div className="p-2 bg-slate-900 text-[10px] text-center font-medium truncate text-white">{w.name}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TERMINAL MODAL */}
      {activeModal === 'terminal' && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 animate-fadeIn">
          <div className="bg-slate-950/95 backdrop-blur-3xl border border-white/30 rounded-3xl w-full max-w-4xl h-[75vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
            <div className="h-12 bg-slate-900/90 px-6 flex items-center justify-between border-b border-white/15">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer shadow-md" onClick={() => setActiveModal(null)}></div>
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-md"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-md"></div>
                <span className="text-slate-200 ml-2 font-bold">root@inovecloudos: ~ (SSH Terminal)</span>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-2 text-emerald-400 bg-slate-950/95 selection:bg-purple-600 selection:text-white">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="whitespace-pre-wrap leading-relaxed">{log}</div>
              ))}
            </div>

            <form onSubmit={handleTerminalSubmit} className="p-3 bg-slate-900/90 border-t border-white/15 flex items-center gap-2">
              <span className="text-emerald-400 font-bold">root@inovecloudos:~#</span>
              <input 
                type="text" 
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
                placeholder="Digite um comando (ex: docker ps, htop, ip a, help)..."
                className="flex-1 bg-transparent border-0 text-white focus:outline-none font-mono text-xs"
                autoFocus 
              />
            </form>
          </div>
        </div>
      )}

      {/* STORE MODAL */}
      {activeModal === 'store' && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 animate-fadeIn">
          <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/30 rounded-3xl w-full max-w-6xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="h-16 px-6 bg-slate-950/90 flex items-center justify-between border-b border-white/15">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setStoreTab('server')}
                  className={`text-xs md:text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-md ${storeTab === 'server' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl border border-white/20' : 'text-slate-300 hover:text-white bg-white/10 border border-white/15'}`}
                >
                  Loja de Servidor (Emby, Node-RED, AdGuard, Jellyfin & Docker)
                </button>
                <button 
                  onClick={() => setStoreTab('shortcuts')}
                  className={`text-xs md:text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-md ${storeTab === 'shortcuts' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl border border-white/20' : 'text-slate-300 hover:text-white bg-white/10 border border-white/15'}`}
                >
                  Loja de Atalhos Web (AudioCN, Headless UI, Cursor Lab & OpenCut)
                </button>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 text-slate-300 hover:text-white rounded-xl bg-white/10 border border-white/15">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              {storeTab === 'server' ? (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Aplicativos de Servidor (Emby, Node-RED, AdGuard, Jellyfin & Docker)</h3>
                      <p className="text-xs text-slate-300">Instale ou remova serviços robustos em seu Ubuntu Server com 1 clique (Adicione ou retire da tela inicial).</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30 shadow-inner">Docker Daemon Ativo</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {serverApps.map(app => (
                      <div key={app.id} className="bg-slate-950/80 backdrop-blur-xl border border-white/20 rounded-2xl p-5 flex flex-col justify-between group hover:border-white/30 transition-all shadow-xl">
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/20 flex items-center justify-center overflow-hidden shadow-lg">
                              <img src={app.icon} className="w-full h-full object-cover" alt={app.name} />
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono shadow-inner ${app.installed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                              {app.installed ? 'Na Tela Inicial' : 'Disponível'}
                            </span>
                          </div>
                          <h3 className="font-bold text-white text-base">{app.name}</h3>
                          <div className="text-[11px] font-mono text-purple-300 mt-0.5">Porta: {app.port} • Versão {app.version}</div>
                          <p className="text-xs text-slate-300 mt-2 line-clamp-2">{app.description}</p>
                          
                          {app.screenshot && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-white/20 shadow-lg relative group/img cursor-pointer" onClick={() => setSelectedAppPreview(app)}>
                              <img src={app.screenshot} className="w-full h-32 object-cover group-hover/img:scale-105 transition-transform" alt="demo screenshot" />
                              <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <span className="text-xs font-semibold text-white bg-black/70 px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5 shadow-lg border border-white/20">
                                  <Eye className="w-4 h-4 text-purple-300" /> Ver Demo (Screens)
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 mt-4 border-t border-white/15 flex items-center justify-between">
                          <button 
                            onClick={() => setSelectedAppPreview(app)}
                            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors border border-white/20"
                          >
                            <Eye className="w-3.5 h-3.5" /> Demo
                          </button>
                          <button 
                            onClick={() => handleToggleServerApp(app.id)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors shadow-lg ${app.installed ? 'bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-white/20'}`}
                          >
                            {app.installed ? 'Remover da Tela' : 'Adicionar à Tela'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="bg-slate-950/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 max-w-xl mx-auto shadow-2xl">
                    <h3 className="text-sm font-bold text-white mb-3">Adicionar Novo Atalho Web (AudioCN, Headless UI, Cursor Lab, etc.)</h3>
                    <form onSubmit={handleAddWebShortcut} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-300 mb-1">Nome do Aplicativo / Atalho</label>
                        <input 
                          type="text" 
                          placeholder="Ex: AudioCN, Headless UI, Cursor Lab" 
                          value={newShortcutForm.name}
                          onChange={e => setNewShortcutForm({...newShortcutForm, name: e.target.value})}
                          className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 shadow-inner"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1">URL Completa</label>
                        <input 
                          type="url" 
                          placeholder="https://www.audiocn.dev/" 
                          value={newShortcutForm.url}
                          onChange={e => setNewShortcutForm({...newShortcutForm, url: e.target.value})}
                          className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 shadow-inner"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1">Descrição</label>
                        <input 
                          type="text" 
                          placeholder="Breve descrição do app..." 
                          value={newShortcutForm.description}
                          onChange={e => setNewShortcutForm({...newShortcutForm, description: e.target.value})}
                          className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 shadow-inner"
                        />
                      </div>
                      <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl font-semibold transition-colors shadow-xl border border-white/20">
                        Adicionar Atalho à Tela Inicial
                      </button>
                    </form>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Atalhos Web Cadastrados (AudioCN, Headless UI, Cursor Lab & OpenCut)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {webShortcuts.map(s => (
                        <div key={s.id} className="bg-slate-950/80 backdrop-blur-xl border border-white/20 rounded-2xl p-5 flex flex-col justify-between group shadow-xl">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <img src={s.icon} className="w-10 h-10 rounded-xl object-cover shadow-lg border border-white/15" alt="icon" />
                              <button onClick={(e) => handleRemoveShortcut(s.id, e)} className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-500/30">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <h3 className="font-bold text-white text-base">{s.name}</h3>
                            <p className="text-[11px] font-mono text-sky-300 mt-0.5 truncate">{s.url}</p>
                            <p className="text-xs text-slate-300 mt-2">{s.description}</p>
                            
                            {s.screenshot && (
                              <div className="mt-4 rounded-xl overflow-hidden border border-white/20 shadow-lg cursor-pointer relative group/img" onClick={() => setSelectedAppPreview(s)}>
                                <img src={s.screenshot} className="w-full h-32 object-cover group-hover/img:scale-105 transition-transform" alt="screenshot preview" />
                                <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                  <span className="text-xs font-semibold text-white bg-black/70 px-2.5 py-1 rounded-lg border border-white/20">Ver Preview</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT WIDGETS MODAL */}
      {activeModal === 'editWidget' && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/30 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-white/15 pb-3">
              <h2 className="text-base font-bold text-white">Personalizar Widgets da Tela Inicial</h2>
              <button onClick={() => setActiveModal(null)} className="text-slate-300 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3.5 bg-slate-950/90 rounded-2xl border border-white/20 cursor-pointer shadow-inner">
                <span className="font-medium text-white">Widget de Files & Diretórios</span>
                <input 
                  type="checkbox" 
                  checked={widgetsConfig.showFiles} 
                  onChange={e => setWidgetsConfig({...widgetsConfig, showFiles: e.target.checked})}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
              </label>
              <label className="flex items-center justify-between p-3.5 bg-slate-950/90 rounded-2xl border border-white/20 cursor-pointer shadow-inner">
                <span className="font-medium text-white">Widget de Armazenamento (Storage)</span>
                <input 
                  type="checkbox" 
                  checked={widgetsConfig.showStorage} 
                  onChange={e => setWidgetsConfig({...widgetsConfig, showStorage: e.target.checked})}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
              </label>
              <label className="flex items-center justify-between p-3.5 bg-slate-950/90 rounded-2xl border border-white/20 cursor-pointer shadow-inner">
                <span className="font-medium text-white">Widget de Hardware do Servidor (CPU/RAM/Temp)</span>
                <input 
                  type="checkbox" 
                  checked={widgetsConfig.showSystem} 
                  onChange={e => setWidgetsConfig({...widgetsConfig, showSystem: e.target.checked})}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
              </label>
              <label className="flex items-center justify-between p-3.5 bg-slate-950/90 rounded-2xl border border-white/20 cursor-pointer shadow-inner">
                <span className="font-medium text-white">Widget de Telemetria / Monitor (Circular)</span>
                <input 
                  type="checkbox" 
                  checked={widgetsConfig.showMonitorWidget} 
                  onChange={e => setWidgetsConfig({...widgetsConfig, showMonitorWidget: e.target.checked})}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
              </label>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl font-semibold text-xs transition-colors shadow-xl border border-white/20">
              Salvar Alterações
            </button>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/30 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/15 pb-3">
              <h2 className="text-base font-bold text-white">Configurações & Wallpaper</h2>
              <button onClick={() => setActiveModal(null)} className="text-slate-300 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 bg-slate-950/90 rounded-xl border border-white/20 flex justify-between shadow-inner">
                <span>Versão do Sistema</span>
                <span className="font-mono text-purple-300">InoveCloud OS v1.1.2 LTS</span>
              </div>
              <div className="p-3.5 bg-slate-950/90 rounded-xl border border-white/20 flex justify-between shadow-inner">
                <span>Kernel do Servidor</span>
                <span className="font-mono text-emerald-300">Ubuntu Linux 6.8.0-31</span>
              </div>
              <button 
                onClick={() => { setActiveModal('editUser'); }} 
                className="w-full py-2.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <User className="w-4 h-4" /> Editar Usuário & Idioma ({language.toUpperCase()})
              </button>
              <button 
                onClick={() => { setActiveModal('linuxConfig'); }} 
                className="w-full py-2.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Wifi className="w-4 h-4" /> Configurar Wi-Fi, Rede e Wallpaper
              </button>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl font-semibold text-xs transition-colors shadow-xl border border-white/20">
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* APP PREVIEW MODAL */}
      {selectedAppPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 animate-fadeIn">
          <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/30 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="h-16 px-6 bg-slate-950/90 flex items-center justify-between border-b border-white/15">
              <div className="flex items-center gap-3">
                <img src={selectedAppPreview.icon} className="w-10 h-10 rounded-xl object-cover shadow-lg border border-white/20" alt="icon" />
                <div>
                  <h3 className="font-bold text-white text-base">{selectedAppPreview.name}</h3>
                  <div className="text-[11px] font-mono text-purple-300">{selectedAppPreview.category} • {selectedAppPreview.url || 'Web App'}</div>
                </div>
              </div>
              <button onClick={() => setSelectedAppPreview(null)} className="p-1.5 text-slate-300 hover:text-white rounded-xl bg-white/10 border border-white/15">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-950/80">
              <p className="text-sm text-slate-200 font-medium">{selectedAppPreview.description}</p>
              
              {selectedAppPreview.screenshot && (
                <div className="rounded-2xl overflow-hidden border border-white/25 shadow-2xl bg-slate-950">
                  <div className="px-4 py-2 bg-slate-900/90 border-b border-white/15 text-xs font-mono text-slate-300 flex items-center justify-between">
                    <span>Visualização Oficial / Screenshot</span>
                    <span className="text-emerald-400">Pronto para Uso</span>
                  </div>
                  <img src={selectedAppPreview.screenshot} className="w-full max-h-[500px] object-cover" alt="Screenshot preview" />
                </div>
              )}
            </div>

            <div className="h-16 px-6 bg-slate-950/90 border-t border-white/15 flex items-center justify-between">
              <button 
                onClick={() => setSelectedAppPreview(null)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20"
              >
                Fechar
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    const app = selectedAppPreview;
                    setSelectedAppPreview(null);
                    openApp(app);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-semibold shadow-xl flex items-center gap-2 border border-white/20"
                >
                  Abrir Aplicativo <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
