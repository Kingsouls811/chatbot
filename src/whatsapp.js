// Bot de WhatsApp (whatsapp-web.js). Al arrancar muestra un código QR:
// escanéalo desde WhatsApp > Dispositivos vinculados con el número del bot.

require('dotenv').config();
const fs = require('fs');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
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

// Opcional: vincular con un código de 8 letras en vez del QR (NUMERO_BOT en .env).
const NUMERO_BOT = (process.env.NUMERO_BOT || '').replace(/\D/g, '');

// En muchas terminales el QR de texto sale deformado y el celular no lo lee,
// así que también se guarda como página (qr.html) que se recarga sola.
const ARCHIVO_QR = path.join(__dirname, '..', 'qr.html');
let qrAbierto = false;

function paginaQR(contenido) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="3">
<title>QR del bot</title></head>
<body style="font-family:sans-serif;text-align:center;padding:24px">${contenido}</body></html>`;
}

async function guardarQR(qr) {
  const imagen = await QRCode.toDataURL(qr, { width: 360, margin: 2 });
  fs.writeFileSync(ARCHIVO_QR, paginaQR(`<h2>Escanea con WhatsApp</h2>
<p>WhatsApp → Dispositivos vinculados → Vincular un dispositivo</p>
<img src="${imagen}" alt="QR"><p>El código cambia cada ~20 s; esta página se actualiza sola.</p>`));
  if (!qrAbierto && process.platform === 'win32') {
    exec(`start "" "${ARCHIVO_QR}"`);
    qrAbierto = true;
  }
}

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: CARPETA_SESION }),
  puppeteer: {
    executablePath: buscarNavegador(),
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  ...(NUMERO_BOT && { pairWithPhoneNumber: { phoneNumber: NUMERO_BOT, showNotification: true } }),
});

client.on('qr', (qr) => {
  if (NUMERO_BOT) return;
  console.log('Escanea este código QR con WhatsApp (Dispositivos vinculados):');
  qrcode.generate(qr, { small: true });
  console.log(`Si no se lee, abre ${ARCHIVO_QR}`);
  guardarQR(qr).catch((err) => console.warn('[qr] no se pudo guardar:', err.message));
});

client.on('code', (codigo) => {
  console.log(`🔑 Código para vincular: ${codigo}`);
  console.log('En el celular del bot: WhatsApp → Dispositivos vinculados → Vincular un dispositivo →');
  console.log('"Vincular con el número de teléfono" y escribe el código.');
});

client.on('ready', () => {
  if (fs.existsSync(ARCHIVO_QR)) {
    fs.writeFileSync(ARCHIVO_QR, paginaQR('<h2>✅ Bot conectado a WhatsApp</h2><p>Ya puedes cerrar esta página.</p>'));
  }
  console.log('✅ Bot del Botiquín para la calma conectado a WhatsApp.');
  console.log(ollama.OLLAMA_ACTIVO ? `🤖 IA local: Ollama (${ollama.OLLAMA_MODEL})` : '🤖 IA local desactivada (solo menú)');
});

client.on('auth_failure', (msg) => console.error('❌ Error de autenticación:', msg));
client.on('disconnected', (razon) => console.warn('⚠️ WhatsApp desconectado:', razon));

// Con el WhatsApp Web actual, whatsapp-web.js 1.34.7 sí envía el mensaje pero después
// truena al buscarlo (el id ya no trae _serialized). Ese error se ignora para seguir
// mandando el resto de la respuesta. sendSeen: false porque marcar como visto también falla.
async function enviar(destino, contenido, opciones = {}) {
  try {
    await client.sendMessage(destino, contenido, { sendSeen: false, ...opciones });
  } catch (err) {
    if (!String(err.message).includes('must include an id property')) throw err;
  }
}

client.on('message', async (msg) => {
  // Solo chats individuales: ignora grupos, estados y mensajes sin texto.
  if (msg.fromMe || msg.from.endsWith('@g.us') || msg.from === 'status@broadcast') return;
  if (msg.type !== 'chat') return;

  console.log(`📩 ${msg.from}: ${msg.body}`);

  // "Escribiendo..." es opcional: con algunas versiones de WhatsApp Web getChat() falla
  // y no debe impedir que el bot conteste.
  msg.getChat().then((chat) => chat.sendStateTyping()).catch(() => {});

  try {
    const respuestas = await responder(msg.from, msg.body);
    for (const r of respuestas) {
      if (r.tipo === 'imagen') {
        await enviar(msg.from, MessageMedia.fromFilePath(r.archivo), { caption: r.texto });
      } else {
        await enviar(msg.from, r.texto);
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
