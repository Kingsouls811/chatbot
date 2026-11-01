// Conexión con Ollama (IA local). Si Ollama no está corriendo, el bot
// sigue funcionando solo con el menú.

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';
const OLLAMA_ACTIVO = (process.env.OLLAMA_ACTIVO || 'true').toLowerCase() === 'true';
const TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS || 30000);

const CATEGORIAS = ['estres', 'ansiedad', 'tristeza', 'sueno', 'pausa', 'soledad'];

const PROMPT_SISTEMA = `Eres el asistente del "Botiquín para la calma" de LiFE Bienestar Estudiantil del Tec.
Hablas con estudiantes universitarios por WhatsApp, en español de México, con calidez y respeto.

Tu tarea: leer el mensaje del estudiante y responder SOLO con un JSON así:
{"categoria": "<una de: estres, ansiedad, tristeza, sueno, pausa, soledad, ninguna>", "respuesta": "<1 o 2 frases empáticas>"}

Reglas:
- "categoria" es el estado que mejor describe el mensaje. Usa "ninguna" si no habla de cómo se siente.
- "respuesta" valida la emoción en máximo 2 frases cortas. No hagas preguntas.
- No diagnostiques, no recetes medicamentos y no des consejos médicos.
- No inventes ejercicios: el sistema enviará uno del botiquín después de tu respuesta.`;

async function interpretar(texto) {
  if (!OLLAMA_ACTIVO) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        format: 'json',
        options: { temperature: 0.3 },
        messages: [
          { role: 'system', content: PROMPT_SISTEMA },
          { role: 'user', content: texto },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Ollama respondió ${res.status}`);

    const data = await res.json();
    const json = JSON.parse(data.message.content);
    const categoria = CATEGORIAS.includes(json.categoria) ? json.categoria : null;
    const respuesta = typeof json.respuesta === 'string' ? json.respuesta.trim() : '';
    return { categoria, respuesta };
  } catch (err) {
    console.warn(`[ollama] sin respuesta (${err.message}). Se usa el menú.`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { interpretar, OLLAMA_ACTIVO, OLLAMA_MODEL };
