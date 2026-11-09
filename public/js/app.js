// app.js — Lógica del lado del cliente (se ejecuta en el navegador)

// 1. Referencias a elementos del DOM
const form = document.querySelector('#form-libro');
const lista = document.querySelector('#lista');
const filtro = document.querySelector('#filtro');
const contador = document.querySelector('#contador');
const mensaje = document.querySelector('#mensaje');
const btnTema = document.querySelector('#btn-tema');

// 2. Estado de la aplicación: un array de objetos (estructura de datos)
let libros = [];

// Imagen local que se usa cuando el libro no tiene portada por URL
const PORTADA_LOCAL = 'img/sin-portada.svg';

// 3. Dibujar la lista en pantalla a partir del array
function mostrarLibros() {
  const texto = filtro.value.toLowerCase();

  // filter: nos quedamos solo con los libros que coinciden con la búsqueda
  const visibles = libros.filter(
    (l) => l.titulo.toLowerCase().includes(texto) || l.autor.toLowerCase().includes(texto)
  );

  lista.innerHTML = ''; // vaciamos la lista (aquí no hay datos del usuario)

  visibles.forEach((libro) => {
    const li = document.createElement('li');
    li.className = 'tarjeta';

    const img = document.createElement('img');
    img.src = libro.portada || PORTADA_LOCAL;
    img.alt = 'Portada de ' + libro.titulo;
    img.onerror = () => { img.src = PORTADA_LOCAL; }; // si la URL falla

    const cuerpo = document.createElement('div');
    cuerpo.className = 'cuerpo';

    const h3 = document.createElement('h3');
    h3.textContent = libro.titulo; // textContent, NO innerHTML: evita XSS

    const autor = document.createElement('p');
    autor.textContent = libro.autor;

    const comentario = document.createElement('p');
    comentario.textContent = libro.comentario || '';

    const btnBorrar = document.createElement('button');
    btnBorrar.type = 'button';
    btnBorrar.textContent = 'Borrar';
    btnBorrar.addEventListener('click', () => borrarLibro(libro.id));

    cuerpo.append(h3, autor, comentario);
    li.append(img, cuerpo, btnBorrar);
    lista.append(li);
  });

  contador.textContent = visibles.length;
}

// 4. Comunicación con el servidor usando fetch (peticiones HTTP)
async function cargarLibros() {
  try {
    const respuesta = await fetch('/api/libros'); // GET
    libros = await respuesta.json();
    mostrarLibros();
  } catch (error) {
    mensaje.textContent = 'No se pudo conectar con el servidor.';
  }
}

async function guardarLibro(evento) {
  evento.preventDefault(); // evita que el formulario recargue la página

  // Armamos un objeto con los datos del formulario
  const datos = {
    titulo: form.titulo.value,
    autor: form.autor.value,
    portada: form.portada.value,
    comentario: form.comentario.value,
  };

  const respuesta = await fetch('/api/libros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos), // objeto -> texto JSON
  });

  if (respuesta.ok) {
    const nuevo = await respuesta.json();
    libros.unshift(nuevo); // lo agregamos al principio del array
    mostrarLibros();
    form.reset();
    mensaje.textContent = 'Libro guardado ✔';
  } else {
    const error = await respuesta.json();
    mensaje.textContent = error.error;
  }
}

async function borrarLibro(id) {
  if (!confirm('¿Borrar este libro?')) return;
  const respuesta = await fetch('/api/libros/' + id, { method: 'DELETE' });
  if (respuesta.ok) {
    libros = libros.filter((l) => l.id !== id);
    mostrarLibros();
  }
}

// 5. Modo oscuro: se recuerda en el navegador con localStorage
function aplicarTema(oscuro) {
  document.body.classList.toggle('oscuro', oscuro);
  btnTema.textContent = oscuro ? 'Modo claro' : 'Modo oscuro';
  btnTema.setAttribute('aria-pressed', oscuro);
}

btnTema.addEventListener('click', () => {
  const oscuro = !document.body.classList.contains('oscuro');
  aplicarTema(oscuro);
  localStorage.setItem('tema-oscuro', oscuro);
});

// 6. Eventos
form.addEventListener('submit', guardarLibro);
filtro.addEventListener('input', mostrarLibros); // filtra mientras se escribe

// 7. Inicio
aplicarTema(localStorage.getItem('tema-oscuro') === 'true');
cargarLibros();
