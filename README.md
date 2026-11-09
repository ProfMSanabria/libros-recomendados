# Libros recomendados — Proyecto modelo de examen (Desarrollo Web)

Aplicación web mínima que cumple los requisitos del examen:

| Requisito | Dónde está |
| --- | --- |
| Maquetación HTML a mano | `public/index.html` |
| Hoja de estilos CSS (flexbox, grid, media query) | `public/css/estilos.css` |
| Interactividad con JavaScript | `public/js/app.js` (agregar, borrar, filtrar, modo oscuro) |
| Persistencia en base de datos | SQLite: `db.js` crea `libros.db` |
| Imagen física en el repositorio | `public/img/logo.svg`, `public/img/sin-portada.svg` |
| Imagen por URL | campo "URL de la portada" (ej.: `https://picsum.photos/seed/x/320/360`) |
| Servidor web + API REST | `server.js` (Node.js + Express) |
| Topología | `docs/topologia.md` |

## Estructura de carpetas

```
proyecto-modelo/
├── server.js          ← servidor Express (API + archivos estáticos)
├── db.js              ← conexión y consultas a SQLite
├── package.json       ← dependencias y comando de arranque
├── .gitignore         ← lo que NO se sube a GitHub
├── docs/topologia.md  ← diagrama y explicación de la topología
└── public/            ← todo lo que recibe el navegador
    ├── index.html
    ├── css/estilos.css
    ├── js/app.js
    └── img/logo.svg, img/sin-portada.svg
```

## Ejecutar en la computadora

Requisito: **Node.js 22.13 o superior** (recomendado: la versión LTS de https://nodejs.org).
Comprobar con `node --version`.

```bash
npm install      # descarga Express en node_modules/
npm start        # inicia el servidor
```

Abrir http://localhost:3000. La base `libros.db` se crea sola la primera vez.

> Node muestra el aviso `ExperimentalWarning: SQLite is an experimental feature`. Es normal y no es un error.

## API REST

| Método | Ruta | Qué hace | Respuesta |
| --- | --- | --- | --- |
| GET | `/api/libros` | Lista todos los libros | 200 + JSON |
| POST | `/api/libros` | Crea un libro (`titulo`, `autor`, `portada`, `comentario`) | 201 + JSON, o 400 |
| DELETE | `/api/libros/:id` | Borra un libro | 204, o 404 |

## Subir a GitHub

```bash
git init
git add .
git commit -m "Primera versión"
git branch -M main
git remote add origin https://github.com/USUARIO/libros-recomendados.git
git push -u origin main
```

## Desplegar en Render (gratis)

1. Entrar a https://render.com con la cuenta de GitHub.
2. **New → Web Service** y elegir el repositorio.
3. Configurar:
   - Runtime: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free**
4. **Deploy**. Al terminar, Render da una URL pública del tipo `https://libros-recomendados.onrender.com`.

Limitaciones del plan gratuito (conviene decirlas en el examen):

- El servicio se "duerme" tras 15 minutos sin visitas; la primera visita tarda cerca de un minuto en despertarlo.
- El disco es efímero: `libros.db` se borra cuando el servicio se reinicia o se vuelve a desplegar. Por eso `db.js` vuelve a cargar los datos de ejemplo. Para datos permanentes habría que usar un disco persistente (pago) o una base externa.

Alternativa con disco persistente: PythonAnywhere (plan gratuito, con Python/Flask en lugar de Node).
