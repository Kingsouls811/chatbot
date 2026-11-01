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

Categorías:
- estres: presión por tareas, exámenes, entregas, falta de tiempo, sentirse abrumado.
- ansiedad: nervios, miedo, preocupación intensa, corazón acelerado, sentir que algo malo va a pasar.
- tristeza: desánimo, ganas de llorar, rupturas, pérdidas, no tener ganas de nada.
- sueno: no poder dormir, desvelos, insomnio, cansancio por falta de sueño.
- pausa: saturación, llevar muchas horas estudiando o trabajando, necesitar un descanso.
- soledad: sentirse solo, sin amigos, aislado, lejos de casa, no conocer a nadie.
- ninguna: el mensaje no habla de cómo se siente (preguntas generales, horarios, saludos).

Ejemplos:
Mensaje: "no he pegado el ojo en toda la noche"
{"categoria": "sueno", "respuesta": "Pasar la noche sin dormir es agotador. Vamos a ayudarte a recuperar un poco de energía."}
Mensaje: "llevo todo el día frente a la compu y ya no rindo"
{"categoria": "pausa", "respuesta": "Has trabajado mucho hoy. Tu mente también necesita un respiro."}
Mensaje: "¿dónde queda la biblioteca?"
{"categoria": "ninguna", "respuesta": ""}

Reglas:
- "categoria" es el estado que mejor describe el mensaje.
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
        keep_alive: '60m',
        options: { temperature: 0 },
        messages: [
          { role: 'system', content: PROMPT_SISTEMA },
          { role: 'user', content: texto },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Ollama respondió ${res.status}`);

    const data = await res.json();
    const json = JSON.parse(data.message.content);
    // El modelo a veces escribe "sueño" o "Estrés": se quitan acentos y mayúsculas.
    const crudo = String(json.categoria || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
    const categoria = CATEGORIAS.includes(crudo) ? crudo : null;
    // Si no es sobre emociones no se usa su respuesta: el modelo podría inventar datos.
    const respuesta = categoria && typeof json.respuesta === 'string' ? json.respuesta.trim() : '';
    return { categoria, respuesta };
  } catch (err) {
    console.warn(`[ollama] sin respuesta (${err.message}). Se usa el menú.`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Carga el modelo en memoria al arrancar para que el primer mensaje no tarde.
async function precalentar() {
  if (!OLLAMA_ACTIVO) return;
  try {
    await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: OLLAMA_MODEL, prompt: 'hola', keep_alive: '60m', options: { num_predict: 1 } }),
    });
    console.log('🤖 Modelo de IA cargado.');
  } catch (err) {
    console.warn(`[ollama] no está disponible (${err.message}). El bot funcionará solo con menú.`);
  }
}

module.exports = { interpretar, precalentar, OLLAMA_ACTIVO, OLLAMA_MODEL };
