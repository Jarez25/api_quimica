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

// Estado de proveedores de IA disponibles
const hasAIKey = !!(process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY);
if (!hasAIKey) {
  console.warn('⚠️ No se detectó ninguna API Key de IA (GEMINI_API_KEY, GROQ_API_KEY, etc.). Se usará el catálogo estequiométrico calibrado local.');
}

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((o) => o.trim()) : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*') || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

// Conexión MongoDB persistente con caché para entornos Serverless (Vercel) y Node local
let cachedDbPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('Variable de entorno MONGO_URI no definida.');
  }

  if (!cachedDbPromise) {
    cachedDbPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    });
  }

  return await cachedDbPromise;
};

// Middleware para asegurar conexión a la base de datos en cada petición
app.use(async (req, res, next) => {
  // Omitir en health checks para diagnóstico rápido
  if (req.path === '/health' || req.path === '/api/health') {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    res.status(500).json({
      error: 'Error de conexión a la base de datos de laboratorio.',
      detalle: err.message,
    });
  }
});

// Health check para monitoreo y CI/CD
const healthHandler = (req, res) => {
  res.json({
    status: 'ok',
    servicio: 'API Química - Laboratorio Avanzado',
    uptime: process.uptime(),
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    aiProviders: {
      gemini_free: !!process.env.GEMINI_API_KEY,
      groq_free: !!process.env.GROQ_API_KEY,
      openrouter: !!process.env.OPENROUTER_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
    },
    catalogo_local: 'Activo (10 especies calibradas)',
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

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

// Rutas principales (con y sin prefijo /api para compatibilidad universal en Vercel y Local)
app.use('/elementos', elementosRoutes);
app.use('/api/elementos', elementosRoutes);

app.use('/mezclar', mezclarRoutes);
app.use('/api/mezclar', mezclarRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Servidor: se inicia solo en desarrollo local o servidor dedicado (NO en Vercel Serverless)
if (!process.env.VERCEL) {
  connectDB()
    .then(() => {
      console.log('✅ Conectado a MongoDB Atlas exitosamente');
    })
    .catch((err) => {
      console.error('❌ Error de conexión inicial a MongoDB:', err.message);
    });

  app.listen(PORT, () => {
    console.log(`🚀 Servidor de laboratorio químico activo en http://localhost:${PORT}`);
    console.log(`📄 Swagger UI disponible en http://localhost:${PORT}/api-docs`);
  });
}

export default app;