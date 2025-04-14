const btn = document.getElementById('vozBtn');
const estado = document.getElementById('estado');
const modal = document.getElementById('modalAlerta');
const modalMensaje = document.getElementById('modalMensaje');
const btnCerrarModal = document.getElementById('btnCerrarModal');

// Comandos reconocidos para navegar entre secciones
const comandosNavegacion = {
  'inicio': 'inicio',
  'acerca de': 'acerca',
  'contacto': 'contacto'
};


// Comandos reconocidos para interactuar con botones
const comandosBotones = {
  'saludar': () => mostrarModal('¡Hola, usuario por voz!'),
  'mostrar información': () => mostrarModal('Esta es una app con control por voz.'),
  'enviar': () => mostrarModal('Mensaje enviado correctamente.')
};

// Funcion para mostrar la ventana emergente
function mostrarModal(mensaje) {
  modalMensaje.textContent = mensaje;
  modal.style.display = 'flex';
}

// Funcion para cerrar la ventana emergente
function cerrarModal() {
  modal.style.display = 'none';
}

// evento sobre el boton btnCerrarmodal
btnCerrarModal.onclick = cerrarModal;


// Inicializa el reconocimiento de voz
const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
reconocimiento.lang = 'es-ES';
reconocimiento.interimResults = false;
reconocimiento.continuous = true;

// Procesa el comando recibido
reconocimiento.onresult = function(event) {
  const resultado = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
  estado.textContent = 'Comando reconocido: ' + resultado;

  // Cerrar el modal por voz
  if (resultado.includes('cerrar') || resultado.includes('aceptar') || resultado.includes('cerrar alerta')) {
    cerrarModal();
    estado.textContent += ' ➜ Modal cerrado.';
    return;
  }

  // Detener escucha por comando
  if (resultado.includes('detener escucha') || resultado.includes('parar')) {
    reconocimiento.stop();
    estado.textContent += ' 🛑 Escucha detenida.';
    btn.disabled = false;
    btn.textContent = '🎤 Reanudar Escucha';
    return;
  }

  // Navegación por voz
  for (const clave in comandosNavegacion) {
    if (resultado.includes(clave)) {
      const id = comandosNavegacion[clave];
      const seccion = document.getElementById(id);
      if (seccion) {
        seccion.scrollIntoView({ behavior: 'smooth' });
        estado.textContent += ' ➜ Navegando a: ' + clave;
      }
    }
  }

  // Comandos personalizados
  for (const comando in comandosBotones) {
    if (resultado.includes(comando)) {
      comandosBotones[comando]();
      estado.textContent += ' ➜ Ejecutando: ' + comando;
    }
  }
};

// Funcion para reconocer errores en el proceso de escucha de comandos 
reconocimiento.onerror = function(event) {
  estado.textContent = 'Error: ' + event.error;
};

// funcion para iniciar la escucha de comandos
function iniciarReconocimiento() {
  reconocimiento.start();
  estado.textContent = '🎧 Escuchando comandos...';
  btn.disabled = true;
  btn.textContent = '🎧 Escuchando...';
}

// Iniciar automáticamente al cargar
window.onload = () => {
  iniciarReconocimiento();
};
