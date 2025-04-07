const btn = document.getElementById('vozBtn');
const estado = document.getElementById('estado');
const modal = document.getElementById('modalAlerta');
const modalMensaje = document.getElementById('modalMensaje');
const btnCerrarModal = document.getElementById('btnCerrarModal');

const comandosNavegacion = {
  'inicio': 'inicio',
  'acerca de': 'acerca',
  'contacto': 'contacto'
};

const comandosBotones = {
  'saludar': () => mostrarModal('¡Hola, usuario por voz!'),
  'mostrar información': () => mostrarModal('Esta es una app con control por voz.'),
  'enviar': () => mostrarModal('Mensaje enviado correctamente.')
};

function mostrarModal(mensaje) {
  modalMensaje.textContent = mensaje;
  modal.style.display = 'flex';
}

function cerrarModal() {
  modal.style.display = 'none';
}

btnCerrarModal.onclick = cerrarModal;

const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
reconocimiento.lang = 'es-ES';
reconocimiento.interimResults = false;
reconocimiento.continuous = true;

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

reconocimiento.onerror = function(event) {
  estado.textContent = 'Error: ' + event.error;
};

btn.onclick = () => {
  reconocimiento.start();
  estado.textContent = '🎧 Escuchando comandos...';
  btn.disabled = true;
  btn.textContent = '🎧 Escuchando...';
};