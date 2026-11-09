// server.js — Servidor web con Express.
// Cumple dos funciones:
//   a) Sirve los archivos estáticos (HTML, CSS, JS e imágenes) de la carpeta /public
//   b) Expone una API REST en /api/libros que lee y escribe en SQLite
const express = require('express');
const path = require('node:path');
const libros = require('./db');

const app = express();
// El hosting (Render, Railway, etc.) indica el puerto en la variable PORT.
const PORT = process.env.PORT || 3000;

app.use(express.json()); // permite leer el cuerpo de las peticiones en formato JSON
app.use(express.static(path.join(__dirname, 'public'))); // sirve /public

// GET /api/libros -> devuelve todos los libros (200 OK)
app.get('/api/libros', (req, res) => {
  res.json(libros.listar.all());
});

// POST /api/libros -> crea un libro (201 Created) o informa error (400 Bad Request)
app.post('/api/libros', (req, res) => {
  const titulo = String(req.body.titulo || '').trim();
  const autor = String(req.body.autor || '').trim();
  const portada = String(req.body.portada || '').trim();
  const comentario = String(req.body.comentario || '').trim();

  // Validación en el servidor: nunca confiar solo en la del navegador
  if (!titulo || !autor) {
    return res.status(400).json({ error: 'Título y autor son obligatorios' });
  }
  if (portada && !/^https?:\/\//i.test(portada)) {
    return res.status(400).json({ error: 'La portada debe ser una URL http(s)' });
  }

  const resultado = libros.insertar.run(titulo, autor, portada, comentario);
  const nuevo = libros.obtener.get(resultado.lastInsertRowid);
  res.status(201).json(nuevo);
});

// DELETE /api/libros/:id -> borra un libro (204 No Content) o 404 si no existe
app.delete('/api/libros/:id', (req, res) => {
  const resultado = libros.borrar.run(Number(req.params.id));
  if (resultado.changes === 0) {
    return res.status(404).json({ error: 'No existe ese libro' });
  }
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
