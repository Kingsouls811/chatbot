// GUION DE LA CONVERSACIÓN
// --------------------------------------------------------------
// Todos los textos que manda el bot están aquí. Es una conversación
// estándar de prueba: el equipo de guion puede reemplazar estos textos
// sin tocar la lógica (src/conversacion.js).
//
// Formato de WhatsApp: *negritas*, _cursivas_, ~tachado~.

const LINEA_ATENCION = '800 813 8500';

const mensajes = {
  bienvenida:
    '¡Hola! 👋 Soy el asistente del *Botiquín para la calma* de LiFE Bienestar Estudiantil.\n\n' +
    'Estoy aquí para darte un ejercicio rápido según cómo te sientas.\n' +
    '_No sustituyo la atención de un profesional._',

  menu:
    '¿Cómo te sientes hoy? Responde con el número o cuéntame con tus palabras:\n\n' +
    '1️⃣ Estoy estresado/a\n' +
    '2️⃣ Me siento ansioso/a\n' +
    '3️⃣ Hoy me siento triste\n' +
    '4️⃣ No he dormido bien\n' +
    '5️⃣ Necesito una pausa\n' +
    '6️⃣ Me siento solo/a',

  // Se manda justo antes del ejercicio. {titulo} = nombre de la carta.
  introEjercicio: 'Gracias por contarme. Para "{titulo}" te comparto este ejercicio 💙',

  preguntaSeguimiento:
    'Tómate tu tiempo para hacerlo. Cuando termines, cuéntame:\n\n' +
    '*¿Cómo te sientes ahora?*\n' +
    '1️⃣ Mejor\n' +
    '2️⃣ Igual\n' +
    '3️⃣ Peor\n\n' +
    'Escribe *otro* para ver otro ejercicio o *menú* para volver al inicio.',

  respuestaMejor:
    '¡Qué bueno! 🙌 Recuerda que puedes volver al botiquín cuando lo necesites.\n\n' +
    'Escribe *menú* si quieres otro ejercicio.',

  respuestaIgual: 'Está bien, a veces toma un poco más de tiempo. Probemos con otro ejercicio:',

  respuestaPeor:
    'Gracias por decírmelo. Lo que sientes es importante y no tienes que pasarlo solo/a. 💙\n\n' +
    `📞 Llama al número de atención *T Queremos*: *${LINEA_ATENCION}*\n` +
    '🏫 O acércate a un punto de apoyo emocional en tu campus.\n\n' +
    'Si quieres, escribe *otro* para intentar otro ejercicio o *menú* para volver al inicio.',

  sinMasEjercicios:
    'Ya vimos todos los ejercicios de esta carta. Escribe *menú* para elegir otra.',

  noEntendi:
    'Perdón, no te entendí bien. 😅',

  // Se manda si detectamos palabras de riesgo (ver PALABRAS_CRISIS en conversacion.js).
  crisis:
    '💙 Lo que estás sintiendo es muy importante y mereces apoyo ahora mismo.\n\n' +
    `📞 Número de atención *T Queremos*: *${LINEA_ATENCION}*\n` +
    '📞 Línea de la Vida (24 h): *800 911 2000*\n' +
    '🚨 Si estás en peligro inmediato, llama al *911*.\n\n' +
    'No estás solo/a. Si quieres, sigo aquí contigo: escribe *menú* para hacer un ejercicio.',

  despedida:
    'Gracias por cuidarte hoy. 💙 Aquí estaré cuando me necesites, solo escribe *hola*.',
};

module.exports = { mensajes, LINEA_ATENCION };
