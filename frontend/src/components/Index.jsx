import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const IndexDocumentacion = () => {
  // =============================
  // Estado del buscador (se mantiene)
  // =============================
  const [modo, setModo] = useState('symbol'); // 'symbol' | 'atomic_number' | 'name'
  const [query, setQuery] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);

  const endpoint = useMemo(() => {
    const base = 'http://localhost:3000/elementos';
    if (!query?.trim()) return null;
    if (modo === 'symbol') return `${base}/symbol/${encodeURIComponent(query.trim())}`;
    if (modo === 'atomic_number') return `${base}/atomic_number/${encodeURIComponent(query.trim())}`;
    return `${base}/name/${encodeURIComponent(query.trim())}`;
  }, [modo, query]);

  const buscar = async (e) => {
    e?.preventDefault?.();
    setError(null);
    setResultado(null);
    if (!endpoint) return;

    if (modo === 'atomic_number' && !/^\d+$/.test(query.trim())) {
      setError('Para buscar por número atómico, ingresa solo dígitos.');
      return;
    }

    try {
      setCargando(true);
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResultado(data);
    } catch (err) {
      console.error(err);
      setError('No se encontró información para la búsqueda o ocurrió un error.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const handler = (ev) => {
      if (ev.key === 'Enter' && document.activeElement?.id === 'input-busqueda') buscar();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [endpoint, query, modo]);

  // Tarjetas de resultado (modo oscuro)
  const ResultadoCard = ({ data }) => {
    if (!data) return null;
    const items = Array.isArray(data) ? data : [data];
    return (
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((el, idx) => (
          <div
            key={`${el._id || el.symbol || el.atomic_number || idx}-${idx}`}
            className="rounded-lg border border-slate-700/60 bg-white/5 backdrop-blur-sm p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-base font-semibold text-slate-100">
                {el.name} <span className="text-slate-300">({el.symbol})</span>
              </h4>
              {typeof el.atomic_number !== 'undefined' && (
                <span className="text-xxs px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                  Nº {el.atomic_number}
                </span>
              )}
            </div>
            <ul className="text-sm text-slate-200/90 space-y-1 mt-2">
              {el.block && <li><span className="text-slate-400">Bloque: </span>{el.block}</li>}
              {el.group != null && <li><span className="text-slate-400">Grupo: </span>{el.group}</li>}
              {el.period != null && <li><span className="text-slate-400">Periodo: </span>{el.period}</li>}
              {el.atomic_mass && <li><span className="text-slate-400">Peso atómico: </span>{el.atomic_mass}</li>}
              {el.phase && <li><span className="text-slate-400">Estado: </span>{el.phase}</li>}
              {el.category && <li><span className="text-slate-400">Categoría: </span>{el.category}</li>}
            </ul>
            <Link
              to={`/elementos/${el.atomic_number}`}
              className="inline-block mt-3 text-sm font-medium text-sky-300 hover:text-sky-200"
            >
              Ver detalle
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      {/* Contenedor centrado */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Layout: sidebar + contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          
          {/* Sidebar (oscuro, simple) */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 rounded-lg border border-slate-800 bg-slate-900/80 backdrop-blur-sm p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-200 mb-3">Secciones</h2>
              <nav className="space-y-1 text-sm">
                <a href="#intro" className="block text-slate-300 hover:text-white">Introducción</a>
                <a href="#buscador" className="block text-slate-300 hover:text-white">Buscador</a>
                <a href="#endpoints" className="block text-slate-300 hover:text-white">Consultas API</a>
                <a href="#mezclas" className="block text-slate-300 hover:text-white">Simulador de mezclas</a>
                <a href="#recursos" className="block text-slate-300 hover:text-white">Recursos</a>
              </nav>
            </div>
          </aside>

          {/* Contenido principal */}
          <section className="space-y-10">
            {/* Encabezado */}
            <header id="intro" className="space-y-3">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                API de Elementos Químicos
              </h1>
              <p className="text-slate-300">
                Documentación para consultar elementos de la tabla periódica, explorar datos y realizar búsquedas rápidas.
              </p>
              <div className="rounded-lg border border-slate-800 bg-white/5 p-3 shadow-sm">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Periodic_table_large.svg"
                  alt="Tabla periódica"
                  className="w-full rounded-md"
                />
              </div>
            </header>

            {/* Buscador */}
            <section id="buscador" className="rounded-lg border border-slate-800 bg-white/5 backdrop-blur-sm p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-white">Buscador</h2>
              <p className="text-sm text-slate-300 mt-1">
                Busca por símbolo (H, He, Na), número atómico (1, 2, 11) o nombre (Hidrógeno, Helio, Sodio).
              </p>

              {/* Controles */}
              <form onSubmit={buscar} className="mt-4 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { v: 'symbol', label: 'Símbolo' },
                    { v: 'atomic_number', label: 'Número atómico' },
                    { v: 'name', label: 'Nombre' },
                  ].map(({ v, label }) => (
                    <label
                      key={v}
                      className={`px-3 py-1.5 rounded-md border text-sm cursor-pointer
                        ${modo === v ? 'bg-sky-600 text-white border-sky-500' : 'bg-slate-900/60 border-slate-700 text-slate-200 hover:bg-slate-800'}
                      `}
                    >
                      <input
                        type="radio"
                        name="modo"
                        value={v}
                        checked={modo === v}
                        onChange={() => setModo(v)}
                        className="sr-only"
                      />
                      {label}
                    </label>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="input-busqueda"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                      modo === 'symbol'
                        ? 'Ej: H, He, Na'
                        : modo === 'atomic_number'
                        ? 'Ej: 1, 2, 11'
                        : 'Ej: Hidrógeno, Helio, Sodio'
                    }
                    className="flex-1 px-3 py-2 rounded-md border border-slate-700 bg-slate-900 placeholder:text-slate-500 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-600"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={cargando || !query.trim()}
                    className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buscar
                  </button>
                  <button
                    type="button"
                    onClick={() => { setQuery(''); setResultado(null); setError(null); }}
                    className="px-4 py-2 rounded-md border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-100"
                  >
                    Limpiar
                  </button>
                </div>
              </form>

              {/* Estados */}
              {cargando && <p className="mt-3 text-sm text-slate-300">Buscando…</p>}
              {error && (
                <div className="mt-3 rounded-md border border-red-500/40 bg-red-500/10 text-red-200 text-sm p-3">
                  {error}
                </div>
              )}
              {!cargando && !error && resultado && <ResultadoCard data={resultado} />}
            </section>

            {/* Endpoints */}
            <section id="endpoints" className="rounded-lg border border-slate-800 bg-white/5 backdrop-blur-sm p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-white">Consultas API</h2>
              <div className="mt-3 space-y-3">
                {[
                  { path: '/elementos', desc: 'Lista todos los elementos.', ejemplo: 'http://localhost:3000/elementos' },
                  { path: '/elementos/:id', desc: 'Busca por ID de MongoDB.', ejemplo: 'http://localhost:3000/elementos/64c2fa0e93a2d7cf0a9c1234' },
                  { path: '/elementos/atomic_number/:atomic_number', desc: 'Por número atómico.', ejemplo: 'http://localhost:3000/elementos/atomic_number/1' },
                  { path: '/elementos/symbol/:symbol', desc: 'Por símbolo químico.', ejemplo: 'http://localhost:3000/elementos/symbol/He' },
                  { path: '/elementos/name/:name', desc: 'Por nombre (case-insensitive).', ejemplo: 'http://localhost:3000/elementos/name/Helio' },
                  { path: '/elementos/grupo/:grupo', desc: 'Por grupo o tipo.', ejemplo: 'http://localhost:3000/elementos/grupo/alcalinos' },
                ].map(({ path, desc, ejemplo }) => (
                  <div key={path} className="rounded border border-slate-800 bg-slate-900/60 p-3">
                    <p className="text-sm">
                      <span className="font-semibold text-emerald-300">GET</span>{' '}
                      <code className="text-sky-300">{path}</code>
                    </p>
                    <p className="text-xs text-slate-300 mt-1">{desc}</p>
                    <a href={ejemplo} target="_blank" rel="noreferrer" className="text-xs text-sky-300 hover:text-sky-200 underline">
                      {ejemplo}
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* Mezclas */}
            <section id="mezclas" className="rounded-lg border border-slate-800 bg-white/5 backdrop-blur-sm p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-white">Simulador de mezclas</h2>
              <p className="text-sm text-slate-300 mt-1">
                Combina símbolos químicos para ver posibles compuestos.
              </p>
              <div className="mt-3 rounded border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-100 space-y-1">
                <div><code className="text-emerald-300">mezclar("H", "O")</code> → H₂O (Agua)</div>
                <div><code className="text-emerald-300">mezclar("Na", "Cl")</code> → NaCl (Sal común)</div>
                <div><code className="text-emerald-300">mezclar("C", "O")</code> → CO₂ (Dióxido de carbono)</div>
              </div>
            </section>

            {/* Recursos */}
            <section id="recursos" className="rounded-lg border border-slate-800 bg-white/5 backdrop-blur-sm p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-white">Recursos</h2>
              <ul className="mt-2 list-disc pl-6 text-sm text-slate-200">
                <li>
                  <a href="http://localhost:3000/api-docs" target="_blank" rel="noreferrer" className="text-sky-300 hover:text-sky-200">
                    Swagger UI
                  </a>
                </li>
                <li>
                  <Link to="/" className="text-sky-300 hover:text-sky-200">Volver al inicio</Link>
                </li>
              </ul>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
};

export default IndexDocumentacion;
