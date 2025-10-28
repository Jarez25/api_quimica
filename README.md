# 🔬 API de Elementos Químicos

Esta es una API RESTful desarrollada con **Node.js**, **Express** y **MongoDB** que permite consultar información sobre elementos químicos.  
Además, incluye una interfaz **frontend en React + Vite** integrada dentro del proyecto para visualizar y consumir los datos de forma interactiva.  
Toda la API está documentada con **Swagger** para facilitar su uso y prueba.

---

## 📦 Tecnologías utilizadas

### Backend
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Swagger (OpenAPI 3.0)

### Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM

---

## 🚀 Instalación y ejecución

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu_usuario/elementos-api.git
cd elementos-api
```

### 2️⃣ Instalar dependencias del backend

```bash
npm install
```

### 3️⃣ Crear archivo `.env`

```env
MONGO_URI=tu_uri_de_mongodb_atlas
PORT=3000
```

### 4️⃣ Ejecutar el servidor

```bash
npm start
```

> También puedes usar `nodemon` si lo tienes instalado:
> ```bash
> npx nodemon index.js
> ```

---

## 🧩 Documentación Swagger

Una vez iniciado el servidor, abre:

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

## 🖥️ Frontend (React + Vite)

El proyecto incluye una interfaz web en la carpeta **`fronted/`**.  
Esta aplicación consume la API (`http://localhost:3000`) y ofrece funcionalidades como:

- 🔎 Buscador por símbolo, número atómico o nombre  
- 📊 Visualización de detalles de cada elemento  
- 📚 Documentación integrada  
- ⚗️ Ejemplos de mezclas químicas simuladas  

### 📂 Estructura del proyecto

```
elementos-api/
├─ fronted/                 # Frontend (React + Vite)
│  ├─ imagen1.png
│  ├─ imagen2.png
│  ├─ index.html
│  ├─ vite.config.js
│  └─ src/
│     ├─ main.jsx
│     ├─ App.jsx
│     └─ components/
├─ src/                     # Backend (Node/Express)
├─ .env
├─ package.json
└─ README.md
```

---

### ▶️ Ejecutar el frontend en desarrollo

```bash
cd fronted
npm install
npm run dev
```

Por defecto se abre en:  
👉 [http://localhost:5173](http://localhost:5173)

Asegúrate de tener la API corriendo en `http://localhost:3000`.

---

### ⚙️ Configurar CORS o Proxy

#### Opción 1 – Habilitar CORS en Express
```bash
npm i cors
```

```js
// src/index.js
import cors from 'cors';
app.use(cors());
```

#### Opción 2 – Configurar proxy en Vite
```js
// fronted/vite.config.js
export default {
  server: {
    proxy: {
      '/elementos': 'http://localhost:3000'
    }
  }
};
```

---

### 🧠 Variables de entorno (opcional)

```bash
# fronted/.env
VITE_API_BASE=http://localhost:3000
```

Uso en React:
```js
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
fetch(`${API_BASE}/elementos`);
```

---

### 📦 Build de producción

```bash
cd fronted
npm run build
```

Esto genera la carpeta `fronted/dist/`.

Para servir la app desde Express:

```js
// src/index.js
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '..', 'fronted', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'fronted', 'dist', 'index.html'));
});
```

---

## 🖼️ Capturas de pantalla

### Pantalla principal
![Vista principal](./fronted/imagen1.png)

### Documentación y búsqueda
![Documentación y búsqueda](./fronted/imagen2.png)

---

## ✅ Estado del proyecto

- [x] CRUD básico (solo lectura)
- [x] Documentación con Swagger
- [x] Conexión con MongoDB Atlas
- [x] Frontend con React + Vite
- [x] Búsqueda dinámica (símbolo, número, nombre)
- [ ] Tests automatizados (próximamente)
- [ ] Creación, edición y eliminación (opcional)

---

## ✍️ Autor

**Jairo José Medina Suárez**  
Proyecto educativo para practicar **Node.js**, **Express**, **MongoDB** y **React**.  
Inspirado en la tabla periódica de los elementos.

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**.
