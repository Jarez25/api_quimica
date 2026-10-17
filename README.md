# 🔬 API de Química & Laboratorio Estequiométrico Avanzado

Plataforma científica empresarial para el análisis interactivo de la Tabla Periódica, modelado atómico cuántico (Modelo de Bohr, diamante NFPA 704) y simulación estequiométrica de síntesis molecular potenciada por **Inteligencia Artificial (con opciones 100% gratuitas)** y catálogo calibrado de alta precisión.

---

## 🏗️ Arquitectura del Sistema

El proyecto está diseñado como un **Monorepo Unificado** optimizado tanto para desarrollo local como para despliegue automatizado en la nube:

```
api_quimica/
├── .github/workflows/deploy.yml   # Pipeline CI/CD automatizado con GitHub Actions
├── api/
│   └── index.js                   # Serverless Function Adapter para Vercel
├── controllers/
│   ├── elementosController.js     # Controlador CRUD y consultas a MongoDB Atlas
│   └── mezclarController.js       # Motor estequiométrico multi-proveedor de IA
├── data/
│   └── compuestosDatabase.js      # Catálogo estequiométrico calibrado (0 costo / instantáneo)
├── frontend/                      # SPA React 19 + Vite + Tailwind CSS + Lucide
│   ├── src/
│   │   ├── components/            # Tabla periódica, Detalle cuántico, Laboratorio estequiométrico
│   │   ├── config/api.js          # Adaptador dinámico de URL (Local vs Vercel sin CORS)
│   │   └── utils/chemistry.js     # Modelado de Bohr, cálculo de valencias y diamantes NFPA
│   └── package.json
├── models/
│   └── elementoModel.js           # Esquema Mongoose de elementos químicos
├── routes/                        # Enrutadores Express (/elementos, /mezclar)
├── index.js                       # Servidor Express principal con pool de conexiones cached
├── vercel.json                    # Reglas de enrutamiento y compilación unificada en Vercel
├── .env.example                   # Plantilla de variables de entorno y proveedores de IA
└── package.json                   # Scripts raíz y dependencias
```

---

## 🤖 Integración de Inteligencia Artificial Gratuita (Zero Cost)

La ruta `/mezclar` soporta proporciones atómicas arbitrarias ($H_2O$, $HO^\bullet$, $H_3O^+$, $H_2O_2$, $CO$, $CO_2$, etc.). El sistema utiliza una estrategia en dos capas:

1. **Capa 1: Motor Calibrado Local (0 tokens, 0 costo)**:
   - Resuelve instantáneamente combinaciones y proporciones estándar con análisis termodinámico y de estabilidad.
2. **Capa 2: Proveedores de IA Gratuitos (Compatibles con API OpenAI)**:
   - **Google Gemini 1.5/2.0 Flash (Recomendado)**: 100% gratuito sin costo de tarjeta de crédito (15 peticiones por minuto, 1 millón de tokens por minuto).
     - Consigue tu API Key en: [Google AI Studio](https://aistudio.google.com/app/apikey)
     - Variable: `GEMINI_API_KEY`
   - **Groq Cloud (Llama 3.3 70B)**: Inferencia ultrarrápida gratuita.
     - Consigue tu API Key en: [Groq Console](https://console.groq.com/keys)
     - Variable: `GROQ_API_KEY`
   - **OpenRouter Free Tier**:
     - Variable: `OPENROUTER_API_KEY`
   - **OpenAI (Opcional de pago)**:
     - Variable: `OPENAI_API_KEY`

---

## 🚀 Despliegue Continuo con GitHub Actions (CI/CD a Vercel)

Cada vez que realizas un `git push origin main`, GitHub Actions compila automáticamente el frontend y despliega la versión de producción a Vercel.

### 📋 Pasos para Configurar el Pipeline:

1. **Crear o Vincular el Proyecto en Vercel**:
   - En tu consola de Vercel ([vercel.com](https://vercel.com)), crea un nuevo proyecto importando el repositorio o ejecuta localmente:
     ```bash
     npm run deploy:vercel
     ```
2. **Obtener tus Credenciales en Vercel**:
   - **`VERCEL_TOKEN`**: Genera un token personal en [Vercel Account Tokens](https://vercel.com/account/tokens).
   - **`VERCEL_ORG_ID`** y **`VERCEL_PROJECT_ID`**: Si el proyecto está vinculado, se encuentran en `.vercel/project.json` o en los Settings del proyecto en Vercel.
3. **Configurar los Secrets en GitHub**:
   - Ve a tu repositorio en GitHub: `https://github.com/Jarez25/api_quimica/settings/secrets/actions`
   - Haz clic en **New repository secret** y añade:
     - `VERCEL_TOKEN`: Tu token de Vercel.
     - `VERCEL_ORG_ID`: El ID de tu organización/cuenta en Vercel.
     - `VERCEL_PROJECT_ID`: El ID de tu proyecto en Vercel.
4. **Configurar Variables de Entorno en Vercel Dashboard**:
   - En `Project Settings -> Environment Variables`, añade:
     - `MONGO_URI`: `mongodb+srv://jarez:RJHhFarWsCuGSH8f@cluster0.9w7rc.mongodb.net/quimica?retryWrites=true&w=majority`
     - `GEMINI_API_KEY`: Tu API Key gratuita de Google AI Studio (o `GROQ_API_KEY`).
5. **¡Listo!**: Al hacer `git push origin main`, el workflow `.github/workflows/deploy.yml` se disparará automáticamente y publicará los cambios.

---

## 💻 Ejecución en Desarrollo Local

### 1. Variables de Entorno:
Copia `.env.example` a `.env` y configura tus claves:
```env
PORT=3000
MONGO_URI=mongodb+srv://jarez:RJHhFarWsCuGSH8f@cluster0.9w7rc.mongodb.net/quimica?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=tu_api_key_de_google_ai_studio
```

### 2. Iniciar Backend:
```bash
npm install
npm run dev
```
Servidor disponible en: `http://localhost:3000`  
Swagger UI interactivo: `http://localhost:3000/api-docs`  
Health check: `http://localhost:3000/health`

### 3. Iniciar Frontend:
En otra terminal:
```bash
cd frontend
npm install
npm run dev
```
Aplicación disponible en: `http://localhost:5173`

---

## 📡 Endpoints de la API

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/health` | Diagnóstico de salud, base de datos y estado de proveedores de IA |
| `GET` | `/elementos` | Catálogo completo de los 118 elementos químicos |
| `GET` | `/elementos/:id` | Búsqueda por ID MongoDB |
| `GET` | `/elementos/atomic_number/:n` | Búsqueda por número atómico (1 a 118) |
| `GET` | `/elementos/symbol/:symbol` | Búsqueda por símbolo químico (ej: `H`, `Au`, `U`) |
| `GET` | `/elementos/grupo/:grupo` | Filtrado por familia química |
| `POST` | `/mezclar` | Síntesis estequiométrica asistida por IA y catálogo calibrado |

---

## 🧪 Ejemplo de Consulta Estequiométrica (`POST /mezclar`)

```json
{
  "reactivos": [
    { "elemento": "H", "cantidad": 3 },
    { "elemento": "O", "cantidad": 1 }
  ]
}
```

**Respuesta**:
```json
{
  "origen_datos": "catalogo_estequiometrico_calibrado",
  "resultado": "H3O+",
  "nombre": "Ion Hidronio (Catión Oxonio)",
  "tipo_especie": "Catión poliatómico hidratado",
  "geometria_molecular": "Piramidal trigonal (ángulo ~113°)",
  "estabilidad": "Especie termodinámicamente fundamental en soluciones ácidas acuosas",
  "nivel_peligro": "alto"
}
```
