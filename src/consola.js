// Modo consola: prueba la conversación sin WhatsApp.
//   npm run consola

require('dotenv').config();
const readline = require('readline');
const path = require('path');
const { responder } = require('./conversacion');
const ollama = require('./ollama');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log('Botiquín para la calma — modo consola');
console.log(ollama.OLLAMA_ACTIVO ? `IA local: Ollama (${ollama.OLLAMA_MODEL})` : 'IA local desactivada (solo menú)');
console.log('Escribe un mensaje como si fuera WhatsApp. Ctrl+C para salir.\n');

function preguntar() {
  rl.question('Tú: ', async (mensaje) => {
    const respuestas = await responder('consola', mensaje);
    for (const r of respuestas) {
      if (r.tipo === 'imagen') console.log(`\nBot: [imagen: ${path.basename(r.archivo)}]\n${r.texto}`);
      else console.log(`\nBot: ${r.texto}`);
    }
    console.log('');
    preguntar();
  });
}

preguntar();
