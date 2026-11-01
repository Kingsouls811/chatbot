// Bot de WhatsApp (whatsapp-web.js). Al arrancar muestra un código QR:
// escanéalo desde WhatsApp > Dispositivos vinculados con el número del bot.

require('dotenv').config();
const fs = require('fs');
const os = require('os');
const path = require('path');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { responder } = require('./conversacion');
const ollama = require('./ollama');

const PAUSA_ENTRE_MENSAJES_MS = 700;
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// Usa el Chrome/Edge ya instalado (CHROME_PATH en .env o se busca solo).
// Si no encuentra ninguno, usa el Chrome que descarga puppeteer.
function buscarNavegador() {
  const candidatos = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA && `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];
  return candidatos.find((ruta) => ruta && fs.existsSync(ruta));
}

// La sesión de WhatsApp se guarda en una ruta corta: en Windows, si la ruta
// del perfil del navegador es muy larga, WhatsApp Web se recarga y el bot truena.
const CARPETA_SESION = process.env.SESION_PATH || path.join(os.homedir(), '.botiquin-bot');

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: CARPETA_SESION }),
  puppeteer: {
    executablePath: buscarNavegador(),
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.on('qr', (qr) => {
  console.log('Escanea este código QR con WhatsApp (Dispositivos vinculados):');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Bot del Botiquín para la calma conectado a WhatsApp.');
  console.log(ollama.OLLAMA_ACTIVO ? `🤖 IA local: Ollama (${ollama.OLLAMA_MODEL})` : '🤖 IA local desactivada (solo menú)');
});

client.on('auth_failure', (msg) => console.error('❌ Error de autenticación:', msg));
client.on('disconnected', (razon) => console.warn('⚠️ WhatsApp desconectado:', razon));

client.on('message', async (msg) => {
  // Solo chats individuales: ignora grupos, estados y mensajes sin texto.
  if (msg.fromMe || msg.from.endsWith('@g.us') || msg.from === 'status@broadcast') return;
  if (msg.type !== 'chat') return;

  try {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    const respuestas = await responder(msg.from, msg.body);
    for (const r of respuestas) {
      if (r.tipo === 'imagen') {
        const media = MessageMedia.fromFilePath(r.archivo);
        await client.sendMessage(msg.from, media, { caption: r.texto });
      } else {
        await client.sendMessage(msg.from, r.texto);
      }
      await esperar(PAUSA_ENTRE_MENSAJES_MS);
    }
  } catch (err) {
    console.error('Error al responder:', err);
  }
});

ollama.precalentar();
client.initialize().catch((err) => {
  console.error('❌ No se pudo iniciar WhatsApp:', err.message || err);
  process.exit(1);
});
