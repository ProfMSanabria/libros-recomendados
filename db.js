// db.js — Capa de datos: abre (o crea) la base SQLite y define las consultas.
// Usa el módulo sqlite que ya viene incluido en Node.js 22.13 o superior,
// así no hay que instalar ni compilar nada extra.
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

// El archivo de la base se guarda junto al proyecto: libros.db
const db = new DatabaseSync(path.join(__dirname, 'libros.db'));

// 1) Crear la tabla si todavía no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS libros (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo     TEXT    NOT NULL,
    autor      TEXT    NOT NULL,
    portada    TEXT,                 -- URL de una imagen (opcional)
    comentario TEXT,
    creado     TEXT    DEFAULT (datetime('now'))
  )
`);

// 2) Datos iniciales: si la tabla está vacía cargamos dos libros de ejemplo.
//    (Útil en hostings gratuitos donde el disco se borra al reiniciar.)
const { total } = db.prepare('SELECT COUNT(*) AS total FROM libros').get();
if (total === 0) {
  const insertar = db.prepare(
    'INSERT INTO libros (titulo, autor, portada, comentario) VALUES (?, ?, ?, ?)'
  );
  insertar.run('Cuentos de la selva', 'Horacio Quiroga', '', 'Clásico rioplatense.');
  // Este segundo libro usa una imagen por URL externa (ejemplo con picsum.photos)
  insertar.run('El principito', 'Antoine de Saint-Exupéry', 'https://picsum.photos/seed/principito/320/360', 'Para releer cada tanto.');
}

// 3) Consultas preparadas. Los "?" evitan la inyección SQL:
//    los datos del usuario nunca se pegan dentro del texto SQL.
const consultas = {
  listar: db.prepare('SELECT * FROM libros ORDER BY id DESC'),
  obtener: db.prepare('SELECT * FROM libros WHERE id = ?'),
  insertar: db.prepare(
    'INSERT INTO libros (titulo, autor, portada, comentario) VALUES (?, ?, ?, ?)'
  ),
  borrar: db.prepare('DELETE FROM libros WHERE id = ?'),
};

module.exports = consultas;
