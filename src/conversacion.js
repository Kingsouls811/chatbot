// Lógica de la conversación estándar.
// No depende de WhatsApp: recibe un texto y regresa la lista de respuestas,
// así se puede probar en consola (src/consola.js) o conectar a otro canal.
//
// Flujo:
//   saludo -> menú (6 cartas) -> ejercicio -> "¿cómo te sientes?" -> mejor / igual / peor
//   En cualquier momento: "menú", "otro", despedida, y detección de crisis.

const path = require('path');
const { botiquin } = require('./botiquin');
const { mensajes } = require('./mensajes');
const ollama = require('./ollama');

const CARPETA_IMAGENES = path.join(__dirname, '..', 'assets', 'cartas');
const MINUTOS_SESION = 30;

const PALABRAS_CRISIS = [
  'suicid', 'matarme', 'quitarme la vida', 'morirme', 'quiero morir', 'no quiero vivir',
  'hacerme dano', 'lastimarme', 'cortarme', 'no vale la pena vivir', 'desaparecer para siempre',
];
const SALUDOS = ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'que tal', 'inicio', 'empezar'];
const MENU = ['menu', 'volver', 'regresar'];
const DESPEDIDAS = ['adios', 'bye', 'chao', 'hasta luego', 'nos vemos', 'salir'];
const OTRO = ['otro', 'otra', 'otro ejercicio', 'siguiente'];

// Sesiones en memoria: { estado, categoriaId, vistos, ultimaActividad }
const sesiones = new Map();

function normalizar(texto) {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[¡!¿?.,]/g, '')
    .trim();
}

function contiene(texto, lista) {
  const palabras = texto.split(/\s+/);
  return lista.some((clave) =>
    clave.includes(' ') ? texto.includes(clave) : palabras.some((p) => p.startsWith(clave)),
  );
}

function esExacto(texto, lista) {
  return lista.includes(texto);
}

function obtenerSesion(usuario) {
  const ahora = Date.now();
  let sesion = sesiones.get(usuario);
  const expirada = sesion && ahora - sesion.ultimaActividad > MINUTOS_SESION * 60 * 1000;
  const nueva = !sesion || expirada;
  if (nueva) {
    sesion = { estado: 'menu', categoriaId: null, vistos: new Set() };
    sesiones.set(usuario, sesion);
  }
  sesion.ultimaActividad = ahora;
  return { sesion, nueva };
}

function texto(t) {
  return { tipo: 'texto', texto: t };
}

function formatearEjercicio(ej) {
  let t = `*${ej.titulo}*\n\n${ej.pasos.join('\n')}`;
  if (ej.cierre) t += `\n\n_${ej.cierre}_`;
  return t;
}

function detectarCategoria(t) {
  const numero = t.match(/^([1-6])(\D|$)/);
  if (numero) return botiquin.find((c) => c.numero === Number(numero[1]));
  return botiquin.find((c) => contiene(t, c.palabrasClave)) || null;
}

function enviarEjercicio(sesion, categoria) {
  const respuestas = [];
  const cambioDeCarta = sesion.categoriaId !== categoria.id;
  if (cambioDeCarta) {
    sesion.categoriaId = categoria.id;
    sesion.vistos = new Set();
    respuestas.push({
      tipo: 'imagen',
      archivo: path.join(CARPETA_IMAGENES, categoria.imagen),
      texto: mensajes.introEjercicio.replace('{titulo}', categoria.titulo),
    });
  }

  const pendientes = categoria.ejercicios.map((_, i) => i).filter((i) => !sesion.vistos.has(i));
  if (pendientes.length === 0) {
    sesion.estado = 'menu';
    respuestas.push(texto(mensajes.sinMasEjercicios));
    return respuestas;
  }

  const indice = pendientes[Math.floor(Math.random() * pendientes.length)];
  sesion.vistos.add(indice);
  sesion.estado = 'ejercicio';
  respuestas.push(texto(formatearEjercicio(categoria.ejercicios[indice])));
  respuestas.push(texto(mensajes.preguntaSeguimiento));
  return respuestas;
}

async function responder(usuario, mensaje) {
  const t = normalizar(mensaje);
  const { sesion, nueva } = obtenerSesion(usuario);

  // 1. Seguridad primero: palabras de riesgo.
  if (contiene(t, PALABRAS_CRISIS)) {
    sesion.estado = 'menu';
    return [texto(mensajes.crisis)];
  }

  const inicio = nueva ? [texto(mensajes.bienvenida)] : [];

  // 2. Comandos generales.
  if (esExacto(t, MENU)) {
    sesion.estado = 'menu';
    sesion.categoriaId = null;
    return [...inicio, texto(mensajes.menu)];
  }
  if (contiene(t, DESPEDIDAS)) {
    sesion.estado = 'menu';
    sesion.categoriaId = null;
    return [texto(mensajes.despedida)];
  }

  // 3. Seguimiento después de un ejercicio.
  if (sesion.estado === 'ejercicio' && !nueva) {
    const categoria = botiquin.find((c) => c.id === sesion.categoriaId);
    if (t.startsWith('1') || t.includes('mejor')) {
      sesion.estado = 'menu';
      return [texto(mensajes.respuestaMejor)];
    }
    if (t.startsWith('2') || t.includes('igual')) {
      return [texto(mensajes.respuestaIgual), ...enviarEjercicio(sesion, categoria)];
    }
    if (t.startsWith('3') || t.includes('peor')) {
      return [texto(mensajes.respuestaPeor)];
    }
    if (esExacto(t, OTRO)) {
      return enviarEjercicio(sesion, categoria);
    }
    // Si escribe otra cosa, se interpreta como un estado de ánimo nuevo (abajo).
  }

  // 4. Elegir carta: número, palabras clave o IA local.
  let categoria = detectarCategoria(t);
  if (!categoria && (t === '' || contiene(t, SALUDOS))) {
    sesion.estado = 'menu';
    sesion.categoriaId = null;
    return [...inicio, texto(mensajes.menu)];
  }

  let empatia = null;
  if (!categoria) {
    const ia = await ollama.interpretar(mensaje);
    if (ia) {
      empatia = ia.respuesta || null;
      if (ia.categoria) categoria = botiquin.find((c) => c.id === ia.categoria);
    }
  }

  if (categoria) {
    return [...inicio, ...(empatia ? [texto(empatia)] : []), ...enviarEjercicio(sesion, categoria)];
  }

  sesion.estado = 'menu';
  return [...inicio, texto(empatia || mensajes.noEntendi), texto(mensajes.menu)];
}

module.exports = { responder, normalizar };
