import React from 'react';
import { Link } from 'react-router-dom';

const IndexDocumentacion = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-cyan-300 font-mono flex overflow-hidden">
      {/* Panel lateral izquierdo */}
      <aside className="w-64 bg-slate-900 p-4 border-r border-cyan-400 shadow-inner">
        <h2 className="text-md font-bold mb-4 text-cyan-200">🧪 Reacciones</h2>
        <nav className="space-y-2 text-sm">
          <a href="#intro" className="block hover:text-cyan-100 transition-all">⚗️ Introducción</a>
          <a href="#endpoints" className="block hover:text-cyan-100 transition-all">🧬 Consultas API</a>
          <a href="#mezclas" className="block hover:text-cyan-100 transition-all">🧫 Simulador de Mezclas</a>
          <a href="#estructura-molecular" className="block hover:text-cyan-100 transition-all">🔬 Moléculas</a>
          <a href="#recursos" className="block hover:text-cyan-100 transition-all">📚 Recursos</a>
        </nav>
      </aside>

      {/* Sección principal */}
      <section className="flex-1 p-6 max-h-screen overflow-y-auto space-y-12 animate-fade-in">

        {/* Introducción */}
        <div id="intro" className="space-y-4">
          <h1 className="text-3xl border-b border-cyan-600 pb-2">🧪 API de Elementos Químicos</h1>
          <p className="text-cyan-200 leading-relaxed">
            Bienvenido al laboratorio interactivo de química. Aquí puedes consultar elementos de la tabla periódica, explorar estructuras moleculares y simular mezclas químicas con comandos API.
          </p>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Periodic_table_large.svg"
            alt="Tabla periódica"
            className="w-full rounded-md shadow-lg border border-cyan-700"
          />
        </div>

        {/* Endpoints */}
        <div id="endpoints">
          <h2 className="text-2xl text-cyan-300">🧬 Consultas API</h2>
          <div className="space-y-4 p-4 bg-slate-900 rounded border border-cyan-700">
            {[
              {
                path: '/elementos',
                desc: 'Lista todos los elementos.',
                ejemplo: 'http://localhost:3000/elementos',
              },
              {
                path: '/elementos/:id',
                desc: 'Busca por ID de MongoDB.',
                ejemplo: 'http://localhost:3000/elementos/64c2fa0e93a2d7cf0a9c1234',
              },
              {
                path: '/elementos/atomic_number/:atomic_number',
                desc: 'Por número atómico.',
                ejemplo: 'http://localhost:3000/elementos/atomic_number/1',
              },
              {
                path: '/elementos/symbol/:symbol',
                desc: 'Por símbolo químico.',
                ejemplo: 'http://localhost:3000/elementos/symbol/He',
              },
              {
                path: '/elementos/name/:name',
                desc: 'Por nombre (case-insensitive).',
                ejemplo: 'http://localhost:3000/elementos/name/Helio',
              },
              {
                path: '/elementos/grupo/:grupo',
                desc: 'Por grupo o tipo.',
                ejemplo: 'http://localhost:3000/elementos/grupo/alcalinos',
              },
            ].map(({ path, desc, ejemplo }) => (
              <div key={path} className="bg-slate-800 p-2 rounded hover:bg-slate-700 transition">
                <p><span className="text-green-400">GET</span> <code className="text-blue-300">{path}</code></p>
                <p className="text-cyan-200 text-sm ml-2"># {desc}</p>
                <a href={ejemplo} target="_blank" rel="noreferrer" className="ml-2 text-blue-400 underline text-xs">
                  {ejemplo}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Mezclas */}
        <div id="mezclas">
          <h2 className="text-2xl text-cyan-300">🧫 Simulador de Mezclas</h2>
          <p className="text-cyan-200 text-sm mb-4">
            Experimenta combinando símbolos químicos para ver posibles compuestos.
          </p>
          <div className="bg-slate-800 p-4 rounded shadow-inner space-y-2 text-sm">
            <code className="text-lime-400">mezclar("H", "O")</code> → <span className="text-pink-300">H₂O (Agua)</span><br />
            <code className="text-lime-400">mezclar("Na", "Cl")</code> → <span className="text-pink-300">NaCl (Sal común)</span><br />
            <code className="text-lime-400">mezclar("C", "O")</code> → <span className="text-pink-300">CO₂ (Dióxido de carbono)</span>
          </div>
        </div>

        {/* Recursos */}
        <div id="recursos">
          <h2 className="text-2xl text-cyan-300">📚 Recursos</h2>
          <ul className="list-disc pl-6 text-cyan-200 text-sm">
            <li>
              <a href="http://localhost:3000/api-docs" target="_blank" rel="noreferrer" className="hover:text-cyan-100 transition">Swagger UI</a>
            </li>
            <li>
              <Link to="/" className="hover:text-cyan-100 transition">Volver al inicio</Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default IndexDocumentacion;
