// Contenido del "Botiquín para la calma" (LiFE Bienestar Estudiantil).
// Transcrito de las cartas: cada carta es un estado de ánimo con 5 ejercicios.

const botiquin = [
  {
    id: 'estres',
    numero: 1,
    titulo: 'Estoy estresado/a',
    imagen: 'estres.png',
    palabrasClave: ['estres', 'estresad', 'presion', 'agobiad', 'saturad', 'abrumad', 'tension', 'examen', 'entrega', 'tarea'],
    ejercicios: [
      {
        titulo: 'Pausa con tus sentidos',
        pasos: [
          'Haz esta pausa con tus sentidos. Nombra:',
          '5 cosas que puedas ver',
          '4 cosas que puedas oír',
          '3 cosas que puedas tocar',
          '2 cosas que puedas oler',
          '1 cosa que puedas saborear o imaginar saborear',
        ],
        cierre: 'Estás aquí. Estás a salvo. Estás respirando.',
      },
      {
        titulo: 'Haz esto ahora',
        pasos: [
          '1. Inhala por la nariz contando 1…2…3…4',
          '2. Sostén el aire: 1…2…3…4…5…6…7',
          '3. Exhala suave por la boca: 1…2…3…4…5…6…7…8',
          '4. Repite 3 veces',
        ],
        cierre: 'Tu respiración es tu botón de pausa. Úsalo cuando lo necesites.',
      },
      {
        titulo: 'Relaja tus músculos en 1 minuto',
        pasos: [
          '1. Siéntate o párate cómod@.',
          '2. *Tensa* hombros y nuca durante 5 segundos…',
          '3. *Suelta* y siente cómo se relajan.',
          '4. *Tensa* puños y antebrazos 5 segundos…',
          '5. *Suelta* y nota la diferencia.',
          '6. *Tensa* pantorrillas y muslos 5 segundos…',
          '7. *Suelta* y percibe el alivio.',
        ],
        cierre: 'Cuando tu cuerpo se relaja, tu mente te sigue.',
      },
      {
        titulo: 'Respira, estira y enfoca',
        pasos: [
          '1. Respira profundamente: inhala en 4 segundos, sostén en 4, exhala en 6. Hazlo 5 veces.',
          '2. Estira tus hombros y cuello suavemente.',
          '3. Escribe en una hoja qué es lo que más te preocupa en este momento.',
          '4. Piensa en una acción pequeña y concreta que puedes hacer ahora mismo para avanzar.',
        ],
        cierre: '',
      },
      {
        titulo: 'Ejercicio de respiración box breathing',
        pasos: [
          'Inhala contando 4 segundos.',
          'Mantén el aire 4 segundos.',
          'Exhala en 4 segundos.',
          'Quédate sin aire otros 4 segundos.',
          'Repite al menos 4 veces.',
        ],
        cierre: '',
      },
    ],
  },
  {
    id: 'ansiedad',
    numero: 2,
    titulo: 'Me siento ansioso/a',
    imagen: 'ansiedad.png',
    palabrasClave: ['ansie', 'ansios', 'nervio', 'preocupad', 'panico', 'miedo', 'angustia', 'inquiet'],
    ejercicios: [
      {
        titulo: 'Movimiento breve',
        pasos: [
          'Ponte de pie y sacude brazos y piernas durante 30 segundos.',
          'Camina un minuto prestando atención a cada paso.',
          'Regresa y nota cómo tu cuerpo se siente distinto.',
        ],
        cierre: '',
      },
      {
        titulo: 'Mini ejercicio de "enraizamiento"',
        pasos: [
          '1. Siéntate con los pies firmes en el suelo.',
          '2. Presiona suavemente los pies contra el piso.',
          '3. Coloca tus manos sobre tus piernas.',
          '4. Siente el contacto. Respira 3 veces profundamente.',
        ],
        cierre: 'Cuando todo se siente demasiado, vuelve a tus pies.',
      },
      {
        titulo: 'Mindfulness "anclaje al presente"',
        pasos: [
          'Siéntate con la espalda recta y nota tus pies tocando el suelo.',
          'Coloca una mano en tu pecho y otra en tu abdomen.',
          'Respira despacio, notando cómo sube y baja tu cuerpo.',
          'Repite mentalmente: "Estoy aquí, estoy a salvo, esto pasará".',
        ],
        cierre: '',
      },
      {
        titulo: 'Reencuadre rápido',
        pasos: [
          'Toma una hoja y escribe tu preocupación en una frase.',
          'Debajo, escribe una acción pequeña que sí está en tus manos.',
          'Guarda la hoja y actúa solo en eso que elegiste.',
        ],
        cierre: '',
      },
      {
        titulo: 'TIP (cambiar la reacción corporal rápidamente)',
        pasos: [
          '*Temperatura:* lava tu cara con agua fría, coloca un paño frío en tu frente o toma hielos en tus manos por un minuto.',
          '*Intensa actividad física:* haz 20 saltos, lagartijas o una caminata rápida.',
          '*Respiración pausada:* inhala profundo y exhala más largo que la inhalación.',
          '*Relajación muscular progresiva:* tensa y suelta hombros, manos y mandíbula.',
        ],
        cierre: '',
      },
    ],
  },
  {
    id: 'tristeza',
    numero: 3,
    titulo: 'Hoy me siento triste',
    imagen: 'tristeza.png',
    palabrasClave: ['triste', 'tristeza', 'deprimid', 'llorar', 'llorando', 'desanimad', 'bajonead', 'me siento mal'],
    ejercicios: [
      {
        titulo: 'Defusión cognitiva',
        pasos: [
          'Escribe en una hoja el pensamiento que acompaña tu tristeza.',
          'Ahora léelo agregando antes: "Estoy teniendo el pensamiento de que…".',
          'Nota cómo cambia la intensidad de la emoción al verlo como pensamiento, no como verdad absoluta.',
        ],
        cierre: '',
      },
      {
        titulo: 'Contacto con valores',
        pasos: [
          'Piensa en un valor importante para ti (ej. amistad, aprendizaje, familia).',
          'Haz una acción pequeña alineada a ese valor: escribe a un amigo, repasa algo que aprendiste o llama a alguien querido.',
        ],
        cierre: 'Aunque la tristeza siga, estarás actuando en congruencia con lo que importa.',
      },
      {
        titulo: 'Gratitud breve',
        pasos: [
          'Haz una lista de 3 cosas, aunque sean pequeñas, por las que hoy puedes agradecer.',
          'Lee la lista en voz alta o compártela con alguien.',
        ],
        cierre: 'La práctica regular de gratitud está comprobada como un protector frente a síntomas depresivos.',
      },
      {
        titulo: 'Opuesto a la emoción',
        pasos: [
          'La tristeza invita al aislamiento. Haz lo contrario:',
          '- Pon música animada.',
          '- Sonríe aunque no tengas ganas (sí cambia la química del cuerpo).',
          '- Haz algo activo: caminar, bailar o mover tu cuerpo por 5 minutos.',
        ],
        cierre: '',
      },
      {
        titulo: 'Mini rutina de cuidado propio',
        pasos: [
          '- Tómate algo calientito.',
          '- Ponte ropa suave o cómoda.',
          '- Mira algo que te dé calma (paisajes, una serie, un video corto).',
          '- Camina durante 5 minutos: elige un lugar tranquilo, camina despacio, sin prisa. Mientras caminas, respira profundo y observa 3 cosas a tu alrededor. Un paso a la vez también es avanzar.',
        ],
        cierre: 'No necesitas sentirte mejor de inmediato. Solo cuidarte hoy.',
      },
    ],
  },
  {
    id: 'sueno',
    numero: 4,
    titulo: 'No he dormido bien',
    imagen: 'sueno.png',
    palabrasClave: ['dormi', 'dormir', 'sueno', 'insomnio', 'desvel', 'cansad', 'agotad', 'desperte'],
    ejercicios: [
      {
        titulo: 'Técnica simple para la noche (en cama)',
        pasos: [
          'Inhala por la nariz en 4 tiempos.',
          'Retén el aire por 7 tiempos.',
          'Exhala por la boca lentamente en 8 tiempos.',
          'Repite de 3 a 4 veces con los ojos cerrados.',
        ],
        cierre: 'Respirar es la forma más suave de empezar a dormir.',
      },
      {
        titulo: 'Mini plan para sobrevivir el día',
        pasos: [
          '✅ Elige una sola cosa que sí necesitas hacer hoy.',
          '❌ Deja lo que puede esperar.',
          '🍎 Come algo ligero pero nutritivo.',
          '🕑 Programa una siesta (20 min) si es posible.',
        ],
        cierre: 'No es flojera. Es autorregulación.',
      },
      {
        titulo: 'Antes de dormir, haz esto',
        pasos: [
          'Evita pantallas brillantes al menos 30 min antes de dormir.',
          'Mantén horarios regulares para acostarte y levantarte, incluso en fines de semana.',
          'Usa la cama solo para dormir o descansar, no para estudiar ni comer.',
        ],
        cierre: '',
      },
      {
        titulo: 'Despiértate con este mini "reset"',
        pasos: [
          'Lava tu cara con agua fría.',
          'Estira brazos y espalda por 30 segundos.',
          'Inhala por la nariz y exhala por la boca 5 veces.',
        ],
        cierre: 'Si no puedes dormir, al menos puedes despertar bien.',
      },
      {
        titulo: 'Regulación fisiológica',
        pasos: [
          'Lava tu cara con agua fresca antes de dormir para "reiniciar" tu sistema nervioso.',
          'Practica respiración lenta (inhala 4, exhala 7).',
          'Haz un estiramiento suave de cuello y espalda antes de acostarte.',
        ],
        cierre: '',
      },
    ],
  },
  {
    id: 'pausa',
    numero: 5,
    titulo: 'Necesito una pausa',
    imagen: 'pausa.png',
    palabrasClave: ['pausa', 'descanso', 'descansar', 'break', 'harto', 'harta', 'fastidiad', 'quemad'],
    ejercicios: [
      {
        titulo: 'Escucha 1 canción que te dé calma o te inspire',
        pasos: [
          'Usa audífonos.',
          'Siéntate o recuéstate.',
          'Cierra los ojos y concéntrate solo en el sonido.',
        ],
        cierre: 'A veces solo necesitas 3 minutos y una buena canción.',
      },
      {
        titulo: 'Pausa guiada exprés',
        pasos: [
          '- Detente donde estés.',
          '- Inhala profundo por la nariz (3 segundos).',
          '- Exhala por la boca más lento (5 segundos).',
          '- Enfócate solo en tu respiración, nota cómo entra y sale el aire.',
          '- Repite 5 veces.',
          '- Estira cuello, hombros y brazos suavemente.',
        ],
        cierre: 'Una pausa breve puede cambiar el resto del día.',
      },
      {
        titulo: 'Técnica de microdescanso',
        pasos: [
          'Levántate de donde estás.',
          'Estira brazos y espalda durante 30 segundos.',
          'Da 10 pasos lentos y vuelve.',
          'Esto reduce tensión física y reactiva la concentración.',
        ],
        cierre: '',
      },
      {
        titulo: 'Microdescanso natural',
        pasos: [
          '1. Busca una banca, ventana o jardín.',
          '2. Observa algo verde o en movimiento (árboles, cielo, personas).',
          '3. Respira lento y sin prisa.',
          '4. Quédate solo observando.',
        ],
        cierre: 'Salir un momento también es avanzar.',
      },
      {
        titulo: 'Habilidad "STOP"',
        pasos: [
          '*S*top: detente un momento.',
          '*T*oma aire profundo.',
          '*O*bserva lo que sientes y piensas.',
          '*P*rocede con calma, eligiendo la mejor acción para ti.',
        ],
        cierre: '',
      },
    ],
  },
  {
    id: 'soledad',
    numero: 6,
    titulo: 'Me siento solo/a',
    imagen: 'soledad.png',
    palabrasClave: ['me siento sol', 'estoy sol', 'sin amigos', 'soledad', 'aislad', 'nadie', 'abandonad', 'extrano'],
    ejercicios: [
      {
        titulo: 'Apertura y contacto con valores',
        pasos: [
          'Pregúntate: "¿Qué valor quiero honrar ahora: amistad, amor, solidaridad?".',
          'Haz una acción alineada a ese valor: comparte algo positivo en redes, manda un audio corto o sonríe a alguien cercano.',
        ],
        cierre: '',
      },
      {
        titulo: 'Autocalmado con conexión simbólica',
        pasos: [
          '- Pon una canción que te recuerde a alguien querido.',
          '- Mira una foto de un momento especial.',
          '- Escríbele un mensaje breve a una persona de confianza, aunque solo sea un "hola".',
        ],
        cierre: '',
      },
      {
        titulo: 'Habilidad opuesto a la emoción',
        pasos: [
          'La soledad invita al aislamiento. Haz lo contrario:',
          '- Sal a un espacio común (cafetería, biblioteca, jardín).',
          '- Intercambia una palabra o saludo con alguien.',
          '- Eso rompe el ciclo de aislamiento.',
        ],
        cierre: '',
      },
      {
        titulo: 'Puedes hacer esto ahora mismo',
        pasos: [
          'Escribe o llama a alguien de confianza.',
          'Acércate a un punto de apoyo emocional en el campus.',
          'O escribe lo que sientes, aunque sea desordenado.',
        ],
        cierre: 'Hablar no es rendirse. Es respirar con alguien más.',
      },
      {
        titulo: 'Autocompasión breve',
        pasos: [
          'Coloca tu mano en el pecho y respira hondo. Repite en voz baja:',
          '"Es difícil sentirme así, pero no estoy solo/a en la experiencia de la soledad. Otros también la sienten y pasa".',
        ],
        cierre: 'Practicar autocompasión está ligado a mayor bienestar emocional.',
      },
    ],
  },
];

module.exports = { botiquin };
