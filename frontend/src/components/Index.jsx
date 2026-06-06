import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const IndexDocumentacion = () => {
  const [modo, setModo] = useState('symbol');
  const [query, setQuery] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);

  const API_BASE = 'http://localhost:3000/elementos';

  const endpoint = useMemo(() => {
    if (!query?.trim()) return null;

    const value = encodeURIComponent(query.trim());

    if (modo === 'symbol') return `${API_BASE}/symbol/${value}`;
    if (modo === 'atomic_number') return `${API_BASE}/atomic_number/${value}`;
    return `${API_BASE}/name/${value}`;
  }, [modo, query]);

  const buscar = async (e) => {
    e?.preventDefault?.();

    setError(null);
    setResultado(null);

    if (!endpoint) return;

    if (modo === 'atomic_number' && !/^\d+$/.test(query.trim())) {
      setError('Para buscar por número atómico, ingresa solo números.');
      return;
    }

    try {
      setCargando(true);

      const res = await fetch(endpoint);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

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
      if (ev.key === 'Enter' && document.activeElement?.id === 'input-busqueda') {
        buscar();
      }
    };

    window.addEventListener('keydown', handler);

    return () => window.removeEventListener('keydown', handler);
  }, [endpoint, query, modo]);

  const getBlockStyle = (block) => {
    switch (block) {
      case 's':
        return {
          bg: 'bg-rose-100',
          text: 'text-rose-950',
          badge: 'bg-rose-500',
          border: 'border-rose-300',
        };
      case 'p':
        return {
          bg: 'bg-sky-100',
          text: 'text-sky-950',
          badge: 'bg-sky-500',
          border: 'border-sky-300',
        };
      case 'd':
        return {
          bg: 'bg-emerald-100',
          text: 'text-emerald-950',
          badge: 'bg-emerald-500',
          border: 'border-emerald-300',
        };
      case 'f':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-950',
          badge: 'bg-amber-500',
          border: 'border-amber-300',
        };
      default:
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-950',
          badge: 'bg-slate-500',
          border: 'border-slate-300',
        };
    }
  };

  const limpiarBusqueda = () => {
    setQuery('');
    setResultado(null);
    setError(null);
  };

  const ResultadoCard = ({ data }) => {
    if (!data) return null;

    const items = Array.isArray(data) ? data : [data];

    return (
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((el, idx) => {
          const color = getBlockStyle(el.block);

          return (
            <article
              key={`${el._id || el.symbol || el.atomic_number || idx}-${idx}`}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20 backdrop-blur"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
                      Resultado
                    </p>

                    <h4 className="mt-2 text-xl font-black text-white">
                      {el.name || 'Elemento'}
                    </h4>

                    <p className="text-sm text-slate-400">
                      Símbolo químico: {el.symbol || 'N/D'}
                    </p>
                  </div>

                  <div
                    className={`flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl border ${color.bg} ${color.text} ${color.border}`}
                  >
                    <span className="text-[11px] font-bold opacity-70">
                      {el.atomic_number || 'N/D'}
                    </span>
                    <span className="text-3xl font-black leading-none">
                      {el.symbol || '?'}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-slate-400">Bloque</p>
                    <p className="mt-1 font-bold uppercase text-white">
                      {el.block || 'N/D'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-slate-400">Grupo</p>
                    <p className="mt-1 font-bold text-white">
                      {el.group ?? 'N/D'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-slate-400">Periodo</p>
                    <p className="mt-1 font-bold text-white">
                      {el.period ?? 'N/D'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-slate-400">Estado</p>
                    <p className="mt-1 font-bold text-white">
                      {el.phase || 'N/D'}
                    </p>
                  </div>
                </div>

                {el.atomic_mass && (
                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
                    <p className="text-xs text-slate-400">Masa atómica</p>
                    <p className="mt-1 font-bold text-white">{el.atomic_mass}</p>
                  </div>
                )}

                <Link
                  to={`/elementos/${el.atomic_number}`}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-400"
                >
                  Ver detalle del elemento
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/elementos',
      desc: 'Lista todos los elementos químicos registrados.',
      ejemplo: 'http://localhost:3000/elementos',
    },
    {
      method: 'GET',
      path: '/elementos/:id',
      desc: 'Consulta un elemento por ID de MongoDB.',
      ejemplo: 'http://localhost:3000/elementos/64c2fa0e93a2d7cf0a9c1234',
    },
    {
      method: 'GET',
      path: '/elementos/atomic_number/:atomic_number',
      desc: 'Busca un elemento por número atómico.',
      ejemplo: 'http://localhost:3000/elementos/atomic_number/1',
    },
    {
      method: 'GET',
      path: '/elementos/symbol/:symbol',
      desc: 'Busca un elemento por símbolo químico.',
      ejemplo: 'http://localhost:3000/elementos/symbol/He',
    },
    {
      method: 'GET',
      path: '/elementos/name/:name',
      desc: 'Busca un elemento por nombre.',
      ejemplo: 'http://localhost:3000/elementos/name/Helio',
    },
    {
      method: 'GET',
      path: '/elementos/grupo/:grupo',
      desc: 'Filtra elementos por grupo o categoría.',
      ejemplo: 'http://localhost:3000/elementos/grupo/alcalinos',
    },
  ];

  const ejemplosBusqueda = [
    {
      label: 'Hidrógeno',
      modo: 'symbol',
      value: 'H',
    },
    {
      label: 'Helio',
      modo: 'symbol',
      value: 'He',
    },
    {
      label: 'Oxígeno',
      modo: 'symbol',
      value: 'O',
    },
    {
      label: 'Sodio',
      modo: 'symbol',
      value: 'Na',
    },
  ];

  return (
    <main className="min-h-screen bg-[#07111f] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
              Química API
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Documentación de Elementos Químicos
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Consulta elementos de la tabla periódica, revisa endpoints de tu API
              y prueba búsquedas conectadas con MongoDB.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/tabla"
              className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-400"
            >
              Ver tabla periódica
            </Link>

            <a
              href="http://localhost:3000/api-docs"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
            >
              Swagger UI
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 backdrop-blur">
                <h2 className="text-sm font-black uppercase tracking-[0.25em] text-slate-400">
                  Secciones
                </h2>

                <nav className="mt-4 space-y-2 text-sm">
                  {[
                    ['#inicio', 'Inicio'],
                    ['#buscador', 'Buscador'],
                    ['#endpoints', 'Consultas API'],
                    ['#mezclas', 'Simulador'],
                    ['#recursos', 'Recursos'],
                  ].map(([href, label]) => (
                    <a
                      key={href}
                      href={href}
                      className="block rounded-xl px-3 py-2 font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      {label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm text-cyan-100">
                <p className="font-bold">Estado del proyecto</p>
                <p className="mt-1 text-cyan-100/80">
                  Conectado a MongoDB y usando rutas REST para consultar elementos.
                </p>
              </div>
            </div>
          </aside>

          <section className="space-y-8">
            <section
              id="inicio"
              className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
                <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                  API + Tabla Periódica
                </div>

                <h2 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                  Explora elementos químicos desde una API moderna.
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                  Esta página funciona como panel principal para probar búsquedas,
                  consultar endpoints y navegar hacia la tabla periódica interactiva.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-3xl font-black text-white">118</p>
                    <p className="mt-1 text-sm text-slate-400">Elementos</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-3xl font-black text-white">18</p>
                    <p className="mt-1 text-sm text-slate-400">Grupos</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-3xl font-black text-white">7</p>
                    <p className="mt-1 text-sm text-slate-400">Periodos</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="grid grid-cols-4 gap-2">
                  {[
                    ['1', 'H', 's'],
                    ['2', 'He', 'p'],
                    ['3', 'Li', 's'],
                    ['6', 'C', 'p'],
                    ['8', 'O', 'p'],
                    ['11', 'Na', 's'],
                    ['26', 'Fe', 'd'],
                    ['29', 'Cu', 'd'],
                    ['47', 'Ag', 'd'],
                    ['79', 'Au', 'd'],
                    ['92', 'U', 'f'],
                    ['118', 'Og', 'p'],
                  ].map(([num, sym, block]) => {
                    const color = getBlockStyle(block);

                    return (
                      <div
                        key={`${num}-${sym}`}
                        className={`flex aspect-square flex-col justify-between rounded-2xl border p-3 shadow-lg ${color.bg} ${color.text} ${color.border}`}
                      >
                        <span className="text-xs font-bold opacity-70">{num}</span>
                        <span className="text-center text-2xl font-black">{sym}</span>
                        <span className="text-right text-[10px] font-black uppercase opacity-70">
                          {block}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p className="mt-4 text-center text-sm text-slate-400">
                  Vista previa visual de elementos por bloque químico.
                </p>
              </div>
            </section>

            <section
              id="buscador"
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                    Buscador
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-white">
                    Consulta rápida de elementos
                  </h2>

                  <p className="mt-2 text-sm text-slate-300">
                    Busca por símbolo, número atómico o nombre.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ejemplosBusqueda.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setModo(item.modo);
                        setQuery(item.value);
                        setResultado(null);
                        setError(null);
                      }}
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-200 transition hover:bg-white/15"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={buscar} className="mt-6 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { v: 'symbol', label: 'Símbolo', helper: 'H, He, Na' },
                    { v: 'atomic_number', label: 'Número atómico', helper: '1, 2, 11' },
                    { v: 'name', label: 'Nombre', helper: 'Hidrógeno' },
                  ].map(({ v, label, helper }) => (
                    <label
                      key={v}
                      className={[
                        'cursor-pointer rounded-2xl border px-4 py-3 text-sm transition',
                        modo === v
                          ? 'border-cyan-400 bg-cyan-400/15 text-cyan-100'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10',
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name="modo"
                        value={v}
                        checked={modo === v}
                        onChange={() => setModo(v)}
                        className="sr-only"
                      />

                      <span className="block font-black">{label}</span>
                      <span className="block text-xs opacity-70">{helper}</span>
                    </label>
                  ))}
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                  <input
                    id="input-busqueda"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                      modo === 'symbol'
                        ? 'Ejemplo: H, He, Na'
                        : modo === 'atomic_number'
                          ? 'Ejemplo: 1, 2, 11'
                          : 'Ejemplo: Hidrógeno, Helio, Sodio'
                    }
                    className="min-h-[54px] flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                    autoComplete="off"
                  />

                  <button
                    type="submit"
                    disabled={cargando || !query.trim()}
                    className="min-h-[54px] rounded-2xl bg-cyan-500 px-6 font-black text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {cargando ? 'Buscando...' : 'Buscar'}
                  </button>

                  <button
                    type="button"
                    onClick={limpiarBusqueda}
                    className="min-h-[54px] rounded-2xl border border-white/10 bg-white/10 px-6 font-bold text-white transition hover:bg-white/15"
                  >
                    Limpiar
                  </button>
                </div>
              </form>

              {cargando && (
                <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm font-semibold text-cyan-100">
                  Buscando información en la API...
                </div>
              )}

              {error && (
                <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-semibold text-red-200">
                  {error}
                </div>
              )}

              {!cargando && !error && resultado && <ResultadoCard data={resultado} />}
            </section>

            <section
              id="endpoints"
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
                    Endpoints
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-white">
                    Consultas disponibles en la API
                  </h2>
                </div>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                  REST API
                </span>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                <div className="grid grid-cols-[90px_1fr] bg-white/10 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400 md:grid-cols-[90px_1fr_1.2fr]">
                  <div>Método</div>
                  <div>Ruta</div>
                  <div className="hidden md:block">Descripción</div>
                </div>

                <div className="divide-y divide-white/10">
                  {endpoints.map(({ method, path, desc, ejemplo }) => (
                    <div
                      key={path}
                      className="grid gap-3 px-4 py-4 text-sm transition hover:bg-white/[0.03] md:grid-cols-[90px_1fr_1.2fr]"
                    >
                      <div>
                        <span className="rounded-lg bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-300">
                          {method}
                        </span>
                      </div>

                      <div>
                        <code className="break-all text-cyan-300">{path}</code>

                        <a
                          href={ejemplo}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block break-all text-xs text-slate-500 transition hover:text-cyan-300"
                        >
                          {ejemplo}
                        </a>
                      </div>

                      <p className="text-slate-300">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section
              id="mezclas"
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8"
            >
              <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">
                Simulador
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                Ejemplos de mezclas químicas
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                Esta sección puede crecer luego para conectarse con una ruta real de la API.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  ['H', 'O', 'H₂O', 'Agua'],
                  ['Na', 'Cl', 'NaCl', 'Sal común'],
                  ['C', 'O', 'CO₂', 'Dióxido de carbono'],
                ].map(([a, b, formula, nombre]) => (
                  <div
                    key={formula}
                    className="rounded-3xl border border-white/10 bg-slate-950/60 p-5"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span className="rounded-2xl bg-cyan-400/10 px-4 py-3 text-xl font-black text-cyan-300">
                        {a}
                      </span>

                      <span className="text-slate-500">+</span>

                      <span className="rounded-2xl bg-cyan-400/10 px-4 py-3 text-xl font-black text-cyan-300">
                        {b}
                      </span>
                    </div>

                    <div className="mt-5 text-center">
                      <p className="text-3xl font-black text-white">{formula}</p>
                      <p className="mt-1 text-sm text-slate-400">{nombre}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              id="recursos"
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8"
            >
              <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-300">
                Recursos
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                Accesos rápidos
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <a
                  href="http://localhost:3000/api-docs"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                >
                  <p className="text-lg font-black text-white">Swagger UI</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Ver documentación técnica generada para tu API.
                  </p>
                </a>

                <Link
                  to="/tabla"
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                >
                  <p className="text-lg font-black text-white">
                    Tabla periódica interactiva
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Abrir la vista visual con periodos, grupos y bloques.
                  </p>
                </Link>
              </div>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
};

export default IndexDocumentacion;