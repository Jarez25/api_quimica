// URL base de la API configurable mediante variable de entorno Vite
// En desarrollo local apunta a http://localhost:3000 si no se especifica.
// En despliegues unificados en Vercel, utiliza rutas relativas sin CORS.
const defaultApiUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:3000'
  : '';

export const API_BASE_URL = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== ''
  ? import.meta.env.VITE_API_URL
  : defaultApiUrl).replace(/\/+$/, '');

export const API_ELEMENTOS = `${API_BASE_URL}/elementos`;
export const API_MEZCLAR = `${API_BASE_URL}/mezclar`;
export const API_DOCS = `${API_BASE_URL}/api-docs`;
