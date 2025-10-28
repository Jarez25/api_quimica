// ElementoDetalle.jsx
import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ElementoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [elemento, setElemento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const campos = useMemo(() => ([
    { key: 'atomic_number', label: 'Número atómico' },
    { key: 'symbol',        label: 'Símbolo' },
    { key: 'name',          label: 'Nombre' },
    { key: 'block',         label: 'Bloque' },
    { key: 'group',         label: 'Grupo' },
    { key: 'period',        label: 'Periodo' },
    { key: 'atomic_mass',   label: 'Peso atómico' },
    { key: 'phase',         label: 'Estado' },
    { key: 'electronegativity_pauling', label: 'Electronegatividad (Pauling)' },
    { key: 'appearance',    label: 'Apariencia' },
    { key: 'category',      label: 'Categoría' },
    { key: 'density',       label: 'Densidad (g/cm³)' },
    { key: 'melt',          label: 'Punto de fusión (K)' },
    { key: 'boil',          label: 'Punto de ebullición (K)' },
    { key: 'discovered_by', label: 'Descubierto por' },
    { key: 'named_by',      label: 'Nombrado por' },
  ]), []);

  useEffect(() => {
    const ac = new AbortController();
    setCargando(true);
    setError(null);

    fetch(`http://localhost:3000/elementos/atomic_number/${id}`, { signal: ac.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setElemento(data);
        setCargando(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('❌ Error al cargar el elemento:', err);
          setError('No se pudieron cargar los datos del elemento.');
          setCargando(false);
        }
      });

    return () => ac.abort();
  }, [id]);

  const imgSrc = useMemo(() => {
    const sym = elemento?.symbol?.toLowerCase?.();
    return sym ? `https://images-of-elements.com/${sym}.jpg` : null;
  }, [elemento]);

  const onImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = 'https://via.placeholder.com/240?text=Sin+Imagen';
  };

  const Badge = ({ children }) => (
    <span className="inline-flex items-center rounded-full bg-white/15 text-white px-3 py-1 text-xs font-semibold tracking-wide">
      {children}
    </span>
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header / Volver */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 transition"
            aria-label="Volver"
          >
            <span className="text-xl">←</span>
            <span className="font-medium">Volver</span>
          </button>

          <Link
            to="/"
            className="text-sm underline underline-offset-4 hover:text-sky-200"
          >
            Ir a inicio
          </Link>
        </div>

        {/* Estados */}
        {cargando && (
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-white/10 rounded mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
              <div className="h-60 bg-white/10 rounded-2xl" />
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-6 bg-white/10 rounded" />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-400/40 text-red-100 rounded-xl p-4">
            <p className="font-semibold">Ocurrió un problema</p>
            <p className="text-sm opacity-90 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 inline-flex rounded-lg bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 text-sm"
            >
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && elemento && (
          <>
            {/* Encabezado con info principal */}
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide text-center drop-shadow">
                {elemento.name} <span className="opacity-90">({elemento.symbol})</span>
              </h2>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {elemento.block && <Badge>Bloque: {elemento.block}</Badge>}
                {elemento.group != null && <Badge>Grupo: {elemento.group}</Badge>}
                {elemento.period != null && <Badge>Periodo: {elemento.period}</Badge>}
                {elemento.category && <Badge>{elemento.category}</Badge>}
              </div>
            </div>

            {/* Layout principal: Imagen + Datos */}
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 items-start">
              {/* Imagen */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-xl">
                <div className="aspect-square w-full overflow-hidden rounded-xl border border-white/10">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={elemento.name}
                      onError={onImgError}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/240?text=Sin+Imagen"
                      alt="Sin imagen"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="mt-4 text-center">
                  <div className="text-5xl font-black text-slate-900 bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent drop-shadow">
                    {elemento.symbol}
                  </div>
                  {elemento.atomic_number != null && (
                    <div className="mt-1 text-sm text-white/80">
                      Nº Atómico: <span className="font-semibold">{elemento.atomic_number}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Datos en tarjetas */}
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {campos.map(({ key, label }) => {
                    const value = elemento[key];
                    if (value == null || value === '') return null;
                    return (
                      <div
                        key={key}
                        className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-xl px-4 py-3 shadow"
                      >
                        <div className="text-xs uppercase tracking-widest text-white/70">
                          {label}
                        </div>
                        <div className="text-base md:text-lg font-semibold text-white">
                          {String(value)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Descripción / notas si existen */}
                {elemento.summary && (
                  <div className="bg-white/10 border border-white/15 rounded-xl p-4 leading-relaxed">
                    <div className="text-xs uppercase tracking-widest text-white/70 mb-1">Resumen</div>
                    <p className="text-white/90">{elemento.summary}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="rounded-xl bg-white/10 hover:bg-white/20 px-5 py-2.5 transition"
              >
                Volver
              </button>
              <Link
                to="/elementos"
                className="rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 px-5 py-2.5 font-semibold text-white transition"
              >
                Ver todos los elementos
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ElementoDetalle;
