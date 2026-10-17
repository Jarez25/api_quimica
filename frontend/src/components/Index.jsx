import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Atom,
  FlaskConical,
  Search,
  Database,
  FileCode2,
  ExternalLink,
  ChevronRight,
  Terminal,
  Activity,
  CheckCircle2,
  Copy,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { API_BASE_URL, API_ELEMENTOS, API_MEZCLAR, API_DOCS } from '../config/api';

const Index = () => {
  const [modo, setModo] = useState('symbol');
  const [query, setQuery] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Health and stats
  const [health, setHealth] = useState({ status: 'ok', uptime: 0, dbState: 'connected' });

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((r) => r.json())
      .then((data) => setHealth(data))
      .catch(() => setHealth({ status: 'offline', uptime: 0, dbState: 'disconnected' }));
  }, []);

  const endpoint = useMemo(() => {
    if (!query?.trim()) return null;
    const value = encodeURIComponent(query.trim());
    if (modo === 'symbol') return `${API_ELEMENTOS}/symbol/${value}`;
    if (modo === 'atomic_number') return `${API_ELEMENTOS}/atomic_number/${value}`;
    return `${API_ELEMENTOS}/name/${value}`;
  }, [modo, query]);

  const buscar = async (e) => {
    e?.preventDefault?.();
    setError(null);
    setResultado(null);

    if (!endpoint) return;

    if (modo === 'atomic_number' && !/^\d+$/.test(query.trim())) {
      setError('Para buscar por número atómico, introduce únicamente valores numéricos.');
      return;
    }

    try {
      setCargando(true);
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`Código HTTP ${res.status}`);
      }
      const data = await res.json();
      setResultado(data);
    } catch (err) {
      console.error(err);
      setError('No se encontraron registros químicos con el criterio especificado.');
    } finally {
      setCargando(false);
    }
  };

  const copiarAlPortapapeles = (texto) => {
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const getBlockMeta = (block) => {
    switch (block) {
      case 's':
        return {
          name: 'Bloque s (Metales reactivos / H / He)',
          color: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'p':
        return {
          name: 'Bloque p (No metales / Gases nobles)',
          color: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        };
      case 'd':
        return {
          name: 'Bloque d (Metales de transición)',
          color: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'f':
        return {
          name: 'Bloque f (Lantánidos y Actínidos)',
          color: 'text-rose-300 border-rose-500/30 bg-rose-500/10',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
      default:
        return {
          name: 'Bloque no asignado',
          color: 'text-slate-300 border-slate-700 bg-slate-800/40',
          badge: 'bg-slate-700 text-slate-300 border-slate-600',
        };
    }
  };

  const presets = [
    { label: 'Oro (Au)', modo: 'symbol', value: 'Au' },
    { label: 'Uranio (U)', modo: 'symbol', value: 'U' },
    { label: 'Carbono (C)', modo: 'symbol', value: 'C' },
    { label: 'Hierro (Fe)', modo: 'symbol', value: 'Fe' },
    { label: 'Helio (He)', modo: 'symbol', value: 'He' },
    { label: 'Elemento #79', modo: 'atomic_number', value: '79' },
  ];

  const endpointsList = [
    {
      method: 'GET',
      path: '/elementos',
      desc: 'Retorna los 118 elementos periódicos con metadatos y coordenadas.',
      ejemploUrl: `${API_ELEMENTOS}`,
      curl: `curl -X GET "${API_ELEMENTOS}"`,
    },
    {
      method: 'GET',
      path: '/elementos/symbol/:symbol',
      desc: 'Búsqueda por símbolo químico de la IUPAC (ej. Au, He, Fe).',
      ejemploUrl: `${API_ELEMENTOS}/symbol/Au`,
      curl: `curl -X GET "${API_ELEMENTOS}/symbol/Au"`,
    },
    {
      method: 'GET',
      path: '/elementos/atomic_number/:atomic_number',
      desc: 'Consulta por número atómico entero (1 a 118).',
      ejemploUrl: `${API_ELEMENTOS}/atomic_number/79`,
      curl: `curl -X GET "${API_ELEMENTOS}/atomic_number/79"`,
    },
    {
      method: 'GET',
      path: '/elementos/name/:name',
      desc: 'Búsqueda insensible a mayúsculas por nombre del elemento.',
      ejemploUrl: `${API_ELEMENTOS}/name/Gold`,
      curl: `curl -X GET "${API_ELEMENTOS}/name/Gold"`,
    },
    {
      method: 'GET',
      path: '/elementos/grupo/:grupo',
      desc: 'Filtra elementos por grupo periódico (1 al 18).',
      ejemploUrl: `${API_ELEMENTOS}/grupo/18`,
      curl: `curl -X GET "${API_ELEMENTOS}/grupo/18"`,
    },
    {
      method: 'POST',
      path: '/mezclar',
      desc: 'Sintetizador molecular estequiométrico asistido por IA.',
      ejemploUrl: `${API_MEZCLAR}`,
      curl: `curl -X POST "${API_MEZCLAR}" -H "Content-Type: application/json" -d '{"elementos":["H","O"]}'`,
    },
  ];

  return (
    <main className="min-h-screen bg-[#070d18] bg-lab-pattern bg-radial-gradient text-slate-100 pb-20">
      
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950/80 p-6 backdrop-blur-xl sm:p-10 shadow-2xl shadow-black/40">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
              <span className="font-mono text-xs font-semibold tracking-wider text-slate-400 uppercase">
                CHEMLAB PLATFORM // CORE API v2.0
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <span className="rounded bg-slate-800/80 px-2 py-0.5 border border-slate-700/60 text-cyan-300">
                DB: {health.dbState === 'connected' ? 'Atlas OK' : 'Offline'}
              </span>
              <span className="rounded bg-slate-800/80 px-2 py-0.5 border border-slate-700/60 text-slate-300">
                118 ELEMENTOS
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
                Plataforma de Datos Químicos & Sintetizador Molecular
              </h1>
              
              <p className="mt-4 text-base text-slate-300 leading-relaxed max-w-2xl">
                Acceso programático de alta precisión a la tabla periódica de elementos de la IUPAC,
                coordenadas orbitales espaciales, propiedades fisicoquímicas y análisis
                estequiométrico con inteligencia artificial.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/elementos"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <Atom className="h-4 w-4" />
                  <span>Tabla Periódica Interactiva</span>
                </Link>

                <Link
                  to="/mezclar"
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-950/30 px-5 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-950/60 hover:border-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <FlaskConical className="h-4 w-4" />
                  <span>Sintetizador con IA</span>
                </Link>

                <a
                  href={API_DOCS}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <FileCode2 className="h-4 w-4 text-slate-400" />
                  <span>Swagger OpenAPI</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </div>
            </div>

            {/* Scientific Telemetry Bento Cards */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-mono text-xs uppercase">Elementos</span>
                  <Atom className="h-4 w-4 text-cyan-400" />
                </div>
                <p className="mt-2 text-3xl font-black font-mono text-white">118</p>
                <p className="mt-1 text-xs text-slate-400">Catálogo IUPAC completo</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-mono text-xs uppercase">Grupos & Periodos</span>
                  <Layers className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="mt-2 text-3xl font-black font-mono text-white">18 / 7</p>
                <p className="mt-1 text-xs text-slate-400">Estructura atómica normalizada</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-mono text-xs uppercase">Cluster Base</span>
                  <Database className="h-4 w-4 text-amber-400" />
                </div>
                <p className="mt-2 text-base font-bold font-mono text-emerald-400">MongoDB Atlas</p>
                <p className="mt-1 text-xs text-slate-400">Colección element activa</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-mono text-xs uppercase">Respuesta API</span>
                  <Activity className="h-4 w-4 text-purple-400" />
                </div>
                <p className="mt-2 text-base font-bold font-mono text-cyan-300">&lt; 15 ms</p>
                <p className="mt-1 text-xs text-slate-400">Indexado por símbolo & Z</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Chemical Inspector / Instant Search */}
      <section className="mx-auto max-w-7xl px-4 mt-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl sm:p-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-cyan-400" />
                <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  TELEMETRÍA EN VIVO // INSPECTOR DE ELEMENTOS
                </span>
              </div>
              <h2 className="mt-1 text-2xl font-black text-white">
                Consulta Rápida de Elementos Químicos
              </h2>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-400 mr-1 font-mono">Presets:</span>
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => {
                    setModo(preset.modo);
                    setQuery(preset.value);
                    setResultado(null);
                    setError(null);
                  }}
                  className="rounded-lg border border-slate-700/60 bg-slate-800/60 px-2.5 py-1 text-xs font-mono font-medium text-slate-300 transition hover:bg-slate-700/80 hover:text-white"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Controls */}
          <form onSubmit={buscar} className="mt-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'symbol', label: 'Símbolo Químico', helper: 'ej. Au, Fe, H' },
                { id: 'atomic_number', label: 'Número Atómico (Z)', helper: 'ej. 79, 26, 1' },
                { id: 'name', label: 'Nombre en Español/Inglés', helper: 'ej. Oro, Gold, Hierro' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setModo(m.id);
                    setResultado(null);
                  }}
                  className={`flex flex-col items-start rounded-xl border px-3.5 py-2 text-left transition ${
                    modo === m.id
                      ? 'border-cyan-500/50 bg-cyan-950/30 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:bg-slate-900/60'
                  }`}
                >
                  <span className="text-xs font-bold">{m.label}</span>
                  <span className="text-[10px] opacity-60 font-mono">{m.helper}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    modo === 'symbol'
                      ? 'Introduce un símbolo químico (ej: Au, He, O)...'
                      : modo === 'atomic_number'
                      ? 'Introduce el número atómico (ej: 79, 1, 92)...'
                      : 'Introduce el nombre (ej: Oro, Oxígeno, Carbono)...'
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/90 px-4 py-3.5 text-sm font-mono text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={cargando || !query.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-md transition hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? <Activity className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span>{cargando ? 'Consultando...' : 'Inspeccionar'}</span>
              </button>
            </div>
          </form>

          {/* Error notice */}
          {error && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 text-xs font-mono text-rose-300">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Search Result Inspector Display */}
          {resultado && (
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-xl border font-mono font-black text-3xl shadow-inner ${getBlockMeta(resultado.block).color}`}>
                    {resultado.symbol}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-black text-white">{resultado.name}</h3>
                      <span className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${getBlockMeta(resultado.block).badge}`}>
                        Bloque {resultado.block}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      Número Atómico (Z): <strong className="text-white">{resultado.atomic_number}</strong> | Masa Atómica: <strong className="text-white">{resultado.atomic_mass} u</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/elementos/${resultado.atomic_number}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-3 py-2 text-xs font-bold text-cyan-300 transition hover:bg-cyan-900/40"
                  >
                    <span>Ficha Completa</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => copiarAlPortapapeles(JSON.stringify(resultado, null, 2))}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-mono text-slate-300 transition hover:bg-slate-800"
                  >
                    {copiado ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiado ? 'Copiado' : 'Copiar JSON'}</span>
                  </button>
                </div>
              </div>

              {/* Data Grid */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Grupo</span>
                  <p className="mt-1 font-mono font-bold text-slate-200">{resultado.group || 'N/D'}</p>
                </div>
                <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Periodo</span>
                  <p className="mt-1 font-mono font-bold text-slate-200">{resultado.period || 'N/D'}</p>
                </div>
                <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Fase Estándar</span>
                  <p className="mt-1 font-mono font-bold text-slate-200 uppercase">{resultado.standard_state || resultado.phase || 'N/D'}</p>
                </div>
                <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Punto Fusión</span>
                  <p className="mt-1 font-mono font-bold text-slate-200">{resultado.melting_point ? `${resultado.melting_point} K` : 'N/D'}</p>
                </div>
                <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Punto Ebullición</span>
                  <p className="mt-1 font-mono font-bold text-slate-200">{resultado.boiling_point ? `${resultado.boiling_point} K` : 'N/D'}</p>
                </div>
                <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Descubrimiento</span>
                  <p className="mt-1 font-mono font-bold text-slate-200">{resultado.year_discovered || 'Antigüedad'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive API Endpoints Workbench */}
      <section className="mx-auto max-w-7xl px-4 mt-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl sm:p-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  DOCUMENTACIÓN DE SERVICIOS REST
                </span>
              </div>
              <h2 className="mt-1 text-2xl font-black text-white">
                Endpoints & Matriz de Integración
              </h2>
            </div>

            <a
              href={API_DOCS}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
            >
              <FileCode2 className="h-4 w-4 text-cyan-400" />
              <span>Ver Especificación OpenAPI 3.0</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Endpoints Table */}
          <div className="mt-6 divide-y divide-slate-800/80 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70">
            {endpointsList.map((ep, idx) => (
              <div key={ep.path} className="p-4 transition hover:bg-slate-900/50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={`rounded-md px-2.5 py-1 font-mono text-xs font-bold ${
                      ep.method === 'GET' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {ep.method}
                    </span>
                    <div>
                      <code className="font-mono text-sm font-semibold text-cyan-300">{ep.path}</code>
                      <p className="mt-1 text-xs text-slate-400">{ep.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <a
                      href={ep.ejemploUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      Probar URL
                    </a>
                    <button
                      type="button"
                      onClick={() => copiarAlPortapapeles(ep.curl)}
                      className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                      title="Copiar cURL"
                    >
                      cURL
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Laboratory Quick Access Cards */}
      <section className="mx-auto max-w-7xl px-4 mt-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          
          <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950/80 p-6 sm:p-8 transition hover:border-cyan-500/40 shadow-xl">
            <div className="flex items-center justify-between text-cyan-400">
              <Atom className="h-8 w-8 transition-transform group-hover:rotate-45" />
              <span className="font-mono text-xs uppercase text-slate-500">Módulo 01</span>
            </div>
            <h3 className="mt-4 text-xl font-black text-white">
              Tabla Periódica Completa
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Explora visualmente los 118 elementos organizados por periodos, grupos, bloques orbitales y estados físicos con fichas técnicas descargables.
            </p>
            <div className="mt-6">
              <Link
                to="/elementos"
                className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 transition group-hover:text-cyan-300"
              >
                <span>Acceder a la cuadrícula</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950/80 p-6 sm:p-8 transition hover:border-cyan-500/40 shadow-xl">
            <div className="flex items-center justify-between text-cyan-400">
              <FlaskConical className="h-8 w-8 transition-transform group-hover:scale-110" />
              <span className="font-mono text-xs uppercase text-slate-500">Módulo 02</span>
            </div>
            <h3 className="mt-4 text-xl font-black text-white">
              Sintetizador & Simulador Molecular
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Combina hasta 5 elementos químicos de forma estequiométrica para deducir productos moleculares, factores de riesgo GHS y aplicaciones científicas con IA.
            </p>
            <div className="mt-6">
              <Link
                to="/mezclar"
                className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 transition group-hover:text-cyan-300"
              >
                <span>Entrar a la cámara de reacción</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
};

export default Index;