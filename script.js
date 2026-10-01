/* =========================================================
   EduBot - Lógica del chatbot
   Proyecto SENA - RAP3: Codificar el software
   ========================================================= */

// -------- Base de preguntas y respuestas --------
// Cada "nodo" tiene un mensaje del bot y una lista de opciones.
// Cada opción indica a qué nodo se debe ir si el usuario la elige.
var preguntas = {
  inicio: {
    mensaje:
      "¡Hola! 👋 Soy EduBot, tu asistente virtual. ¿Sobre qué tema necesitas información?",
    opciones: [
      { texto: "📅 Inicio de clases", siguiente: "inicioClases" },
      { texto: "⏰ Horario de clases", siguiente: "horario" },
      { texto: "📚 Programas de formación", siguiente: "programas" },
      { texto: "🗓️ Días de formación", siguiente: "dias" },
      { texto: "📝 Proceso de evaluación", siguiente: "evaluacion" },
      { texto: "🎓 Requisitos para graduarme", siguiente: "graduacion" },
      { texto: "✏️ Proceso de matrícula", siguiente: "matricula" },
    ],
  },

  inicioClases: {
    mensaje:
      "Las clases impartidas por el SENA constan de 3 trimestres, inician en febrero y culminan en noviembre.",
    opciones: [{ texto: "⬅️ Volver al menú principal", siguiente: "inicio" }],
  },

  horario: {
    mensaje:
      "La formación es impartida en contra jornada, de 7:30 am - 11:30 am para quienes estudian en la tarde y de 1:30 pm - 5:30 pm para los que estudian en la mañana.",
    opciones: [{ texto: "⬅️ Volver al menú principal", siguiente: "inicio" }],
  },

  programas: {
    mensaje:
      "La Institución Educativa Nuevo Bosque tiene articulados tres (3 )programas de formación: Sistemas Teleinformáticos, Programación de Software, Asistencia Administrativa y Operaciones Logísticas, entre otros.",
    opciones: [{ texto: "⬅️ Volver al menú principal", siguiente: "inicio" }],
  },

  dias: {
    mensaje: "La formación es impartida dos veces por semana.",
    opciones: [{ texto: "⬅️ Volver al menú principal", siguiente: "inicio" }],
  },

  evaluacion: {
    mensaje:
      "El SENA posee una serie de competencias, cada una de ellas posee unos resultados de aprendizajes, el conjunto de resultados de aprendizajes evaluados permiten aprobar la competencia.",
    opciones: [{ texto: "⬅️ Volver al menú principal", siguiente: "inicio" }],
  },

  graduacion: {
    mensaje:
      "Para obtener la certificación técnica debes tener la documentación al dia, tales como: certificados de eps, pruebas ICFES, documento de identificación y cualquier otro tipo de documento requerido por tu instructor.",
    opciones: [{ texto: "⬅️ Volver al menú principal", siguiente: "inicio" }],
  },

  matricula: {
    mensaje:
      "El proceso de matrícula se realiza en la plataforma institucional: debes cargar tus documentos y confirmar el cupo asignado.",
    opciones: [{ texto: "⬅️ Volver al menú principal", siguiente: "inicio" }],
  },

  noEncontrado: {
    mensaje:
      "No logré identificar tu pregunta 😅. Puedes intentar con otras palabras o elegir una opción del menú.",
    opciones: [{ texto: "⬅️ Volver al menú principal", siguiente: "inicio" }],
  },
};

// -------- Variables generales --------
var idActual = "inicio"; // nodo que se está mostrando actualmente
var historial = []; // pila para la función "Atrás"

// -------- Elementos del DOM --------
var chatWindow = document.getElementById("chatWindow");
var listaOpciones = document.getElementById("opciones");
var entradaUsuario = document.getElementById("entradaUsuario");
var btnEnviar = document.getElementById("btnEnviar");
var btnAtras = document.getElementById("btnAtras");
var btnInicio = document.getElementById("btnInicio");

// -------- Función para agregar un mensaje al chat --------
function agregarMensaje(texto, tipo) {
  var burbuja = document.createElement("div");
  burbuja.className =
    "mensaje " + (tipo === "usuario" ? "mensaje-usuario" : "mensaje-bot");

  var parrafo = document.createElement("p");
  parrafo.textContent = texto;

  burbuja.appendChild(parrafo);
  chatWindow.appendChild(burbuja);

  // Bajar el scroll automáticamente al último mensaje
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// -------- Función para dibujar las opciones (botones) --------
function mostrarOpciones(opciones) {
  listaOpciones.innerHTML = ""; // limpiar opciones anteriores

  for (var i = 0; i < opciones.length; i++) {
    var opcion = opciones[i];

    var item = document.createElement("li");
    var enlace = document.createElement("a");

    enlace.href = "#";
    enlace.textContent = opcion.texto;

    // función de callback ejecutada al hacer clic en la opción
    enlace.addEventListener(
      "click",
      crearManejadorClic(opcion.siguiente, opcion.texto),
    );

    item.appendChild(enlace);
    listaOpciones.appendChild(item);
  }
}

// -------- Genera el manejador (callback) para cada opción --------
function crearManejadorClic(idSiguiente, textoOpcion) {
  return function (evento) {
    evento.preventDefault();
    agregarMensaje(textoOpcion, "usuario");
    irANodo(idSiguiente);
  };
}

// -------- Muestra un nodo (pregunta) en el chat --------
function renderizarNodo(id) {
  var nodo = preguntas[id];

  if (!nodo) {
    nodo = preguntas.noEncontrado;
  }

  agregarMensaje(nodo.mensaje, "bot");
  mostrarOpciones(nodo.opciones);
}

// -------- Navega hacia un nuevo nodo (guardando historial) --------
function irANodo(idNuevo) {
  historial.push(idActual);
  idActual = idNuevo;
  renderizarNodo(idActual);
}

// -------- Función "Atrás" --------
function irAtras() {
  if (historial.length > 0) {
    var idAnterior = historial.pop();
    idActual = idAnterior;
    agregarMensaje("Volviendo a la pregunta anterior...", "bot");
    renderizarNodo(idActual);
  } else {
    agregarMensaje("No hay una pregunta anterior a la cual volver.", "bot");
  }
}

// -------- Función "Volver al inicio" --------
function irAlInicio() {
  historial = [];
  idActual = "inicio";
  agregarMensaje("Volviendo al menú principal...", "bot");
  renderizarNodo(idActual);
}

// -------- Búsqueda por texto libre usando palabras clave --------
// Recibe el texto escrito y una función de callback que se ejecuta
// con el resultado encontrado (o null si no se encontró nada).
function buscarPorTexto(texto, callback) {
  var palabra = texto.toLowerCase();
  var idEncontrado = null;

  if (palabra.indexOf("inicia") !== -1 || palabra.indexOf("empiezan") !== -1) {
    idEncontrado = "inicioClases";
  } else if (palabra.indexOf("horario") !== -1) {
    idEncontrado = "horario";
  } else if (palabra.indexOf("programa") !== -1) {
    idEncontrado = "programas";
  } else if (palabra.indexOf("dias") !== -1 || palabra.indexOf("días") !== -1) {
    idEncontrado = "dias";
  } else if (palabra.indexOf("evalua") !== -1) {
    idEncontrado = "evaluacion";
  } else if (palabra.indexOf("gradua") !== -1) {
    idEncontrado = "graduacion";
  } else if (
    palabra.indexOf("matricula") !== -1 ||
    palabra.indexOf("matrícula") !== -1
  ) {
    idEncontrado = "matricula";
  }

  callback(idEncontrado);
}

// -------- Manejo del botón "Enviar" (pregunta escrita) --------
function manejarEnvio() {
  var texto = entradaUsuario.value.trim();

  if (texto === "") {
    return;
  }

  agregarMensaje(texto, "usuario");

  buscarPorTexto(texto, function (resultado) {
    if (resultado) {
      irANodo(resultado);
    } else {
      irANodo("noEncontrado");
    }
  });

  entradaUsuario.value = "";
}

// -------- Eventos --------
btnEnviar.addEventListener("click", manejarEnvio);

entradaUsuario.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    manejarEnvio();
  }
});

btnAtras.addEventListener("click", irAtras);
btnInicio.addEventListener("click", irAlInicio);

// -------- Mensaje inicial al cargar la página --------
renderizarNodo(idActual);
