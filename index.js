import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import elementosRoutes from './routes/elementosRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Ruta raíz con lista de endpoints (opcional)
app.get('/', (req, res) => {
  const baseURL = `http://localhost:${PORT}`;

  const endpoints = [
    { path: '/', description: 'Lista de endpoints disponibles' },
    { path: '/elementos', description: 'Obtener todos los elementos' },
    { path: '/elementos/:id', description: 'Obtener elemento por ID MongoDB (reemplaza :id)' },
    { path: '/elementos/atomic_number/:atomic_number', description: 'Obtener elemento por número atómico (reemplaza :atomic_number)' },
    { path: '/elementos/symbol/:symbol', description: 'Obtener elemento por símbolo químico (reemplaza :symbol)' },
    { path: '/elementos/name/:name', description: 'Obtener elemento por nombre (reemplaza :name)' },
    { path: '/elementos/grupo/:grupo', description: 'Obtener elementos por grupo y nombre de familia (reemplaza :grupo)' }
  ];

  const html = `
    <h1>API de Química - Endpoints disponibles</h1>
    <ul>
      ${endpoints.map(ep => `
        <li>
          <a href="${baseURL}${ep.path.replace(/:.*$/, '')}" target="_blank">${ep.path}</a> - ${ep.description}
        </li>
      `).join('')}
    </ul>
    <p>Nota: Para endpoints con parámetros (ejemplo, :id), reemplaza el parámetro en la URL antes de probar.</p>
  `;

  res.send(html);
});

// Usar rutas separadas para /elementos
app.use('/elementos', elementosRoutes);

// ** Montar Swagger UI para documentación **
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📄 Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});
