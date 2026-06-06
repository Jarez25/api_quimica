import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import elementosRoutes from './routes/elementosRoutes.js';
import mezclarRoutes from './routes/mezclarRoutes.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

// Validaciones importantes
if (!mongoURI) {
  console.error('❌ Falta MONGO_URI en el archivo .env');
  process.exit(1);
}

if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️ Falta OPENAI_API_KEY en el archivo .env. La ruta /mezclar no funcionará correctamente.');
}

// Middlewares
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

// Conexión MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => {
    console.error('❌ Error al conectar a MongoDB:', err.message);
  });

// Ruta raíz
app.get('/', (req, res) => {
  const baseURL = `http://localhost:${PORT}`;

  const endpoints = [
    { method: 'GET', path: '/', description: 'Lista de endpoints disponibles' },
    { method: 'GET', path: '/elementos', description: 'Obtener todos los elementos' },
    { method: 'GET', path: '/elementos/:id', description: 'Obtener elemento por ID MongoDB' },
    { method: 'GET', path: '/elementos/atomic_number/:atomic_number', description: 'Obtener elemento por número atómico' },
    { method: 'GET', path: '/elementos/symbol/:symbol', description: 'Obtener elemento por símbolo químico' },
    { method: 'GET', path: '/elementos/name/:name', description: 'Obtener elemento por nombre' },
    { method: 'GET', path: '/elementos/grupo/:grupo', description: 'Obtener elementos por grupo o familia' },
    { method: 'POST', path: '/mezclar', description: 'Mezclar elementos químicos con IA' },
  ];

  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>API de Química</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #07111f;
            color: #e2e8f0;
            padding: 40px;
          }

          h1 {
            color: #67e8f9;
          }

          ul {
            list-style: none;
            padding: 0;
          }

          li {
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 14px;
            border-radius: 12px;
            margin-bottom: 12px;
          }

          a {
            color: #38bdf8;
            font-weight: bold;
            text-decoration: none;
          }

          .method {
            display: inline-block;
            min-width: 55px;
            color: #34d399;
            font-weight: bold;
          }

          .note {
            margin-top: 24px;
            color: #cbd5e1;
          }
        </style>
      </head>
      <body>
        <h1>API de Química - Endpoints disponibles</h1>

        <ul>
          ${endpoints
            .map((ep) => {
              const cleanPath = ep.path.includes(':')
                ? ep.path
                : `<a href="${baseURL}${ep.path}" target="_blank">${ep.path}</a>`;

              return `
                <li>
                  <span class="method">${ep.method}</span>
                  ${cleanPath}
                  <br />
                  <small>${ep.description}</small>
                </li>
              `;
            })
            .join('')}
        </ul>

        <p class="note">
          Nota: los endpoints con parámetros como <strong>:id</strong> o <strong>:symbol</strong>
          deben probarse reemplazando el valor en la URL.
        </p>

        <p>
          <a href="${baseURL}/api-docs" target="_blank">Abrir Swagger UI</a>
        </p>
      </body>
    </html>
  `;

  res.send(html);
});

// Rutas principales
app.use('/elementos', elementosRoutes);
app.use('/mezclar', mezclarRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📄 Swagger disponible en http://localhost:${PORT}/api-docs`);
});