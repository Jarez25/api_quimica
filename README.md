# 🔬 API de Elementos Químicos

Esta es una API RESTful desarrollada con **Node.js**, **Express** y **MongoDB** que permite consultar información sobre elementos químicos. Está documentada con **Swagger** para facilitar su uso y prueba.

---

## 📦 Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Swagger (OpenAPI 3.0)

---

## 🚀 Instalación y ejecución

1. **Clona el repositorio**

```bash
git clone https://github.com/tu_usuario/elementos-api.git
cd elementos-api
```

2. **Instala las dependencias**

```bash
npm install
```

3. **Crea un archivo `.env`**

```env
MONGO_URI=tu_uri_de_mongodb_atlas
PORT=3000
```

4. **Ejecuta el servidor**

```bash
npm start
```

> También puedes usar `nodemon` si lo tienes instalado:

```bash
npx nodemon index.js
```

---

## 📚 Documentación Swagger

Una vez iniciado el servidor, visita:

👉 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Desde ahí puedes probar los endpoints de forma interactiva.

---

## 🌐 Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/elementos` | Obtener todos los elementos |
| `GET`  | `/elementos/:id` | Obtener elemento por ID (MongoDB) |
| `GET`  | `/elementos/atomic_number/:atomic_number` | Obtener por número atómico |
| `GET`  | `/elementos/symbol/:symbol` | Obtener por símbolo químico |
| `GET`  | `/elementos/name/:name` | Obtener por nombre del elemento |
| `GET`  | `/elementos/grupo/:grupo` | Obtener elementos por grupo o familia |

---

## ✅ Estado del proyecto

- [x] CRUD básico (solo lectura)
- [x] Documentación con Swagger
- [x] Conexión con MongoDB Atlas
- [x] Middleware de manejo de errores
- [ ] Tests automatizados (próximamente)
- [ ] Funcionalidad de creación, edición y eliminación (opcional)

---

## ✍️ Autor

- **Jairo José Medina Suárez**  
- Proyecto educativo para practicar Express + MongoDB + Swagger  
- Inspirado en la tabla periódica de los elementos

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
