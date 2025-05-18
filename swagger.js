import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Elementos Químicos',
      version: '1.0.0',
      description: 'Documentación de la API para consultar elementos químicos',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ],
  },
  apis: ['./routes/*.js'], // Aquí Swagger leerá los comentarios en tus archivos de rutas
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
