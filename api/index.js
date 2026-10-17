import app from '../index.js';

export default function handler(req, res) {
  // En Vercel Serverless, si el rewrite altera req.url a '/api' o '/api/index.js',
  // restauramos la ruta invocada original presente en x-matched-path
  const matchedPath = req.headers['x-matched-path'];
  if (matchedPath && (req.url === '/api' || req.url === '/api/index' || req.url === '/api/index.js')) {
    req.url = matchedPath;
  }
  return app(req, res);
}
