// Modo consola: prueba la conversación sin WhatsApp.
//   npm run consola

require('dotenv').config();
const readline = require('readline');
const path = require('path');
const { responder } = require('./conversacion');
const ollama = require('./ollama');

async function main() {
  console.log('Botiquín para la calma — modo consola');
  console.log(ollama.OLLAMA_ACTIVO ? `IA local: Ollama (${ollama.OLLAMA_MODEL})` : 'IA local desactivada (solo menú)');
  await ollama.precalentar();
  console.log('Escribe un mensaje como si fuera WhatsApp. Ctrl+C para salir.\n');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: 'Tú: ' });
  rl.prompt();
  for await (const mensaje of rl) {
    const respuestas = await responder('consola', mensaje);
    for (const r of respuestas) {
      if (r.tipo === 'imagen') console.log(`\nBot: [imagen: ${path.basename(r.archivo)}]\n${r.texto}`);
      else console.log(`\nBot: ${r.texto}`);
    }
    console.log('');
    if (!rl.closed) rl.prompt();
  }
}

main();
