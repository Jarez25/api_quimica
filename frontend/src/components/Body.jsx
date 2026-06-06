import { useEffect, useMemo, useState } from 'react';

function Body() {
  const [elementos, setElementos] = useState([]);
  const [elementoSeleccionado, setElementoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [detalleElemento, setDetalleElemento] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/elementos')
      .then((res) => res.json())
      .then((data) => {
        const normalizados = data
          .map((el) => ({
            ...el,
            atomic_number: Number(el.atomic_number || el.number || 0),
            symbol: el.symbol || el.Symbol || '',
            name: el.name || el.nombre || '',
            xpos: Number(el.xpos),
            ypos: Number(el.ypos),
            group: el.group || '',
            period: el.period || el.ypos || '',
            block: el.block || 'unknown',
            group_block: el.group_block || '',
            atomic_mass: el.atomic_mass || '',
            phase: el.phase || '',
          }))
          .filter((el) => el.atomic_number && el.symbol && el.xpos && el.ypos)
          .sort((a, b) => a.atomic_number - b.atomic_number);

        setElementos(normalizados);
      })
      .catch((err) => console.error('❌ Error al cargar los elementos:', err));
  }, []);

  const getElementAtPosition = (x, y) => {
    return elementos.find((el) => Number(el.xpos) === x && Number(el.ypos) === y);
  };

  const estructuraTabla = useMemo(() => {
    const estructura = [];

    // Periodos 1 al 7
    for (let fila = 1; fila <= 7; fila++) {
      for (let col = 1; col <= 18; col++) {
        const elemento = getElementAtPosition(col, fila);

        if (elemento) {
          estructura.push({
            x: col,
            y: fila,
            elemento,
            tipo: 'elemento',
          });
        }
      }
    }

    // Lantánidos y actínidos
    for (let fila = 8; fila <= 9; fila++) {
      for (let col = 3; col <= 16; col++) {
        const elemento = getElementAtPosition(col, fila);

        if (elemento) {
          estructura.push({
            x: col,
            y: fila,
            elemento,
            tipo: fila === 8 ? 'lantanido' : 'actinido',
          });
        }
      }
    }

    return estructura;
  }, [elementos]);

  const getBlockColor = (block) => {
    switch (block) {
      case 's':
        return {
          bg: 'bg-rose-100',
          border: 'border-rose-300',
          text: 'text-rose-950',
          badge: 'bg-rose-500',
        };
      case 'p':
        return {
          bg: 'bg-sky-100',
          border: 'border-sky-300',
          text: 'text-sky-950',
          badge: 'bg-sky-500',
        };
      case 'd':
        return {
          bg: 'bg-emerald-100',
          border: 'border-emerald-300',
          text: 'text-emerald-950',
          badge: 'bg-emerald-500',
        };
      case 'f':
        return {
          bg: 'bg-amber-100',
          border: 'border-amber-300',
          text: 'text-amber-950',
          badge: 'bg-amber-500',
        };
      default:
        return {
          bg: 'bg-slate-100',
          border: 'border-slate-300',
          text: 'text-slate-900',
          badge: 'bg-slate-500',
        };
    }
  };

  const getTipoNombre = (block) => {
    switch (block) {
      case 's':
        return 'Bloque s';
      case 'p':
        return 'Bloque p';
      case 'd':
        return 'Bloque d';
      case 'f':
        return 'Bloque f';
      default:
        return 'Sin bloque';
    }
  };

  const handleElementoClick = (elemento) => {
    if (!elemento?.atomic_number) return;

    setElementoSeleccionado(elemento);
    setMostrarModal(true);
    setMostrarDetalles(false);
    setDetalleElemento(null);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setElementoSeleccionado(null);
    setMostrarDetalles(false);
    setDetalleElemento(null);
  };

  const abrirModalDetalles = () => {
    if (!elementoSeleccionado?.atomic_number) return;

    fetch(`http://localhost:3000/elementos/atomic_number/${elementoSeleccionado.atomic_number}`)
      .then((res) => res.json())
      .then((data) => {
        setDetalleElemento(data);
        setMostrarDetalles(true);
      })
      .catch((err) => console.error('❌ Error al cargar el detalle:', err));
  };

  const cerrarModalDetalles = () => {
    setMostrarDetalles(false);
    setDetalleElemento(null);
  };

  const grupos = Array.from({ length: 18 }, (_, index) => index + 1);
  const periodos = Array.from({ length: 7 }, (_, index) => index + 1);

  return (
    <div className="min-h-screen w-full bg-[#07111f] text-slate-100">
      <div className="mx-auto w-full max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Tabla Periódica de los Elementos
          </h1>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          {[
            { block: 's', label: 'Bloque s' },
            { block: 'p', label: 'Bloque p' },
            { block: 'd', label: 'Bloque d' },
            { block: 'f', label: 'Bloque f' },
          ].map((item) => {
            const color = getBlockColor(item.block);

            return (
              <div
                key={item.block}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 shadow-lg shadow-black/20"
              >
                <span className={`h-3 w-3 rounded-full ${color.badge}`} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-3 shadow-2xl shadow-black/30 backdrop-blur sm:p-5">
          <div className="overflow-x-auto pb-4">
            {estructuraTabla.length > 0 ? (
              <div
                className="grid min-w-[1250px] gap-2"
                style={{
                  gridTemplateColumns: '42px repeat(18, minmax(58px, 1fr))',
                  gridTemplateRows: '34px repeat(7, 74px) 28px repeat(2, 74px)',
                }}
              >
                <div
                  className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold uppercase text-slate-400"
                  style={{ gridColumn: 1, gridRow: 1 }}
                >
                  P/G
                </div>

                {grupos.map((grupo) => (
                  <div
                    key={`grupo-${grupo}`}
                    className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-cyan-200"
                    style={{
                      gridColumn: grupo + 1,
                      gridRow: 1,
                    }}
                  >
                    {grupo}
                  </div>
                ))}

                {periodos.map((periodo) => (
                  <div
                    key={`periodo-${periodo}`}
                    className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-cyan-200"
                    style={{
                      gridColumn: 1,
                      gridRow: periodo + 1,
                    }}
                  >
                    {periodo}
                  </div>
                ))}

                <div
                  className="flex items-center justify-center rounded-lg border border-amber-300/20 bg-amber-400/10 px-2 text-center text-[11px] font-bold text-amber-200"
                  style={{
                    gridColumn: '1 / span 3',
                    gridRow: 10,
                  }}
                >
                  Lantánidos
                </div>

                <div
                  className="flex items-center justify-center rounded-lg border border-orange-300/20 bg-orange-400/10 px-2 text-center text-[11px] font-bold text-orange-200"
                  style={{
                    gridColumn: '1 / span 3',
                    gridRow: 11,
                  }}
                >
                  Actínidos
                </div>

                {estructuraTabla.map((pos) => {
                  const elemento = pos.elemento;
                  const color = getBlockColor(elemento.block);

                  let gridRow = elemento.ypos + 1;

                  if (elemento.ypos === 8) {
                    gridRow = 10;
                  }

                  if (elemento.ypos === 9) {
                    gridRow = 11;
                  }

                  return (
                    <button
                      key={`${elemento.atomic_number}-${elemento.symbol}`}
                      type="button"
                      onClick={() => handleElementoClick(elemento)}
                      className={[
                        'group relative flex h-full w-full flex-col rounded-xl border p-2 text-left shadow-sm transition-all duration-200',
                        'hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-300',
                        color.bg,
                        color.border,
                        color.text,
                      ].join(' ')}
                      style={{
                        gridColumn: elemento.xpos + 1,
                        gridRow,
                      }}
                      title={`${elemento.name || elemento.symbol} - Número atómico ${elemento.atomic_number}`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] font-bold opacity-70">
                          {elemento.atomic_number}
                        </span>

                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase text-white ${color.badge}`}
                        >
                          {elemento.block}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-1 flex-col items-center justify-center text-center">
                        <span className="text-xl font-black leading-none sm:text-2xl">
                          {elemento.symbol}
                        </span>

                        <span className="mt-1 line-clamp-1 max-w-full text-[10px] font-semibold opacity-75">
                          {elemento.name || getTipoNombre(elemento.block)}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center justify-between text-[9px] font-semibold opacity-70">
                        <span>G {elemento.group || elemento.xpos}</span>
                        <span>P {elemento.period || elemento.ypos}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-[400px] items-center justify-center">
                <p className="animate-pulse text-center text-lg font-semibold text-cyan-200">
                  Cargando elementos...
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
          <p>
            <strong className="text-white">Tip:</strong> la tabla está separada por
            grupos del 1 al 18, periodos del 1 al 7 y una sección inferior especial
            para lantánidos y actínidos.
          </p>
        </div>
      </div>

      {(mostrarModal || mostrarDetalles) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-md">
          <div className="flex max-h-[92vh] w-full flex-wrap items-start justify-center gap-6 overflow-y-auto">
            {mostrarModal && elementoSeleccionado && (
              <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/95 p-6 text-white shadow-2xl shadow-black/50">
                <button
                  onClick={cerrarModal}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-white transition hover:bg-white/20"
                  aria-label="Cerrar modal"
                >
                  ✕
                </button>

                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-white/10 p-2">
                    <img
                      src={`https://images-of-elements.com/${elementoSeleccionado.symbol.toLowerCase()}.jpg`}
                      alt={elementoSeleccionado.symbol}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=Sin+Imagen';
                      }}
                      className="h-32 w-32 rounded-full border-4 border-white/20 object-cover shadow-lg"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
                    Elemento químico
                  </p>

                  <h2 className="mt-2 text-5xl font-black">
                    {elementoSeleccionado.symbol}
                  </h2>

                  <p className="mt-2 text-lg font-semibold text-slate-300">
                    {elementoSeleccionado.name || 'Nombre no disponible'}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase text-slate-400">N° atómico</p>
                    <p className="mt-1 text-2xl font-black">
                      {elementoSeleccionado.atomic_number}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase text-slate-400">Bloque</p>
                    <p className="mt-1 text-2xl font-black uppercase">
                      {elementoSeleccionado.block}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase text-slate-400">Grupo</p>
                    <p className="mt-1 text-2xl font-black">
                      {elementoSeleccionado.group || elementoSeleccionado.xpos}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase text-slate-400">Periodo</p>
                    <p className="mt-1 text-2xl font-black">
                      {elementoSeleccionado.period || elementoSeleccionado.ypos}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={cerrarModal}
                    className="rounded-xl border border-white/10 bg-white/10 px-5 py-2.5 font-semibold text-white transition hover:bg-white/20"
                  >
                    Cerrar
                  </button>

                  <button
                    onClick={abrirModalDetalles}
                    className="rounded-xl bg-cyan-500 px-5 py-2.5 font-bold text-slate-950 transition hover:bg-cyan-400"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            )}

            {mostrarDetalles && detalleElemento && (
              <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/95 p-6 text-white shadow-2xl shadow-black/50">
                <button
                  onClick={cerrarModalDetalles}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-white transition hover:bg-white/20"
                  aria-label="Cerrar detalles"
                >
                  ✕
                </button>

                <h2 className="pr-10 text-center text-3xl font-black">
                  {detalleElemento.name} ({detalleElemento.symbol})
                </h2>

                <div className="mt-6 space-y-3">
                  {[
                    ['Número atómico', detalleElemento.atomic_number],
                    ['Masa atómica', detalleElemento.atomic_mass],
                    ['Bloque', detalleElemento.block],
                    ['Grupo', detalleElemento.group],
                    ['Periodo', detalleElemento.period],
                    ['Tipo', detalleElemento.group_block],
                    ['Estado', detalleElemento.phase],
                    ['Configuración electrónica', detalleElemento.electronic_configuration],
                    ['Electronegatividad', detalleElemento.electronegativity],
                    ['Densidad', detalleElemento.density],
                    ['Punto de ebullición', detalleElemento.boiling_point],
                    ['Punto de fusión', detalleElemento.melting_point],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <span className="text-sm font-semibold text-slate-300">
                        {label}
                      </span>

                      <span className="text-right text-sm font-bold text-white">
                        {value || 'No disponible'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={cerrarModalDetalles}
                    className="rounded-xl bg-white px-6 py-2.5 font-bold text-slate-950 transition hover:bg-slate-200"
                  >
                    Cerrar detalles
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Body;