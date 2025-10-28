import { useEffect, useState, useMemo } from 'react';

function Body() {
  const [elementos, setElementos] = useState([]);
  const [elementoSeleccionado, setElementoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [detalleElemento, setDetalleElemento] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/elementos')
      .then(res => res.json())
      .then(data => {
        const normalizados = data.map(el => ({
          atomic_number: el.atomic_number || el.number || 0,
          symbol: el.symbol || el.Symbol || '',
          xpos: Number(el.xpos),
          ypos: Number(el.ypos),
          block: el.block || 'unknown',
        })).sort((a, b) => a.atomic_number - b.atomic_number);
        setElementos(normalizados);
      })
      .catch(err => console.error('❌ Error al cargar los elementos:', err));
  }, []);

  const getElementAtPosition = (x, y) =>
    elementos.find(el => el.xpos === x && el.ypos === y);

  const estructuraTabla = useMemo(() => {
    const estructura = [];
    for (let fila = 1; fila <= 7; fila++) {
      for (let col = 1; col <= 18; col++) {
        if (fila === 1 && col > 2) continue;
        if ((fila === 2 || fila === 3) && col > 2 && col < 13) continue;
        estructura.push({ x: col, y: fila, elemento: getElementAtPosition(col, fila) });
      }
    }
    for (let fila = 8; fila <= 9; fila++) {
      for (let col = 3; col <= 16; col++) {
        estructura.push({ x: col, y: fila, elemento: getElementAtPosition(col, fila) });
      }
    }
    return estructura;
  }, [elementos]);

  const maxY = Math.max(...estructuraTabla.map(item => item.y), 0);

  // 🎨 Paleta pastel agradable
  const getBlockColor = (block) => {
    switch (block) {
      case 's': return '#FCE7F3';     // rosa muy suave
      case 'p': return '#DBEAFE';     // azul muy suave
      case 'd': return '#D1FAE5';     // verde esmeralda suave
      case 'f': return '#FEF9C3';     // amarillo crema
      default:  return '#E5E7EB';     // gris claro (fallback)
    }
  };

  const handleElementoClick = (elemento) => {
    if (elemento?.atomic_number) {
      setElementoSeleccionado(elemento);
      setMostrarModal(true);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setElementoSeleccionado(null);
    setMostrarDetalles(false);
    setDetalleElemento(null);
  };

  const abrirModalDetalles = () => {
    fetch(`http://localhost:3000/elementos/atomic_number/${elementoSeleccionado.atomic_number}`)
      .then(res => res.json())
      .then(data => {
        setDetalleElemento(data);
        setMostrarDetalles(true);
      })
      .catch(err => console.error('❌ Error al cargar el detalle:', err));
  };

  const cerrarModalDetalles = () => {
    setMostrarDetalles(false);
    setDetalleElemento(null);
  };

  return (
    <div className="w-full min-h-screen font-mono text-slate-100 bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-10">
        <h2 className="text-4xl font-bold text-center mb-10 pb-3 drop-shadow-md tracking-wide">
          Tabla Periódica Interactiva
        </h2>

        {/* Contenedor a TODO el ancho */}
        <div className="w-full">
          {estructuraTabla.length > 0 ? (
            <div
              className="grid gap-[6px] cursor-default w-full"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(18, minmax(3.2rem, 1fr))',
                gridTemplateRows: `repeat(${maxY}, minmax(3.5rem, 4.2rem))`,
              }}
            >
              {estructuraTabla.map((pos, index) => {
                const hasEl = Boolean(pos.elemento);
                return (
                  <div
                    key={index}
                    onClick={() => hasEl && handleElementoClick(pos.elemento)}
                    style={{
                      gridColumn: pos.x,
                      gridRow: pos.y,
                      backgroundColor: hasEl
                        ? getBlockColor(pos.elemento.block)
                        : 'transparent',
                      border: hasEl ? '1px solid rgba(15, 23, 42, 0.25)' /* slate-900/25 */ 
                                    : '1px dashed rgba(100, 116, 139, 0.35)' /* slate-500/35 */,
                      cursor: hasEl ? 'pointer' : 'default',
                    }}
                    className={`rounded-md p-2 flex flex-col items-center justify-center select-none
                      ${hasEl
                        ? 'shadow-sm hover:shadow-md hover:-translate-y-[2px] ring-0 hover:ring-2 hover:ring-slate-300/60 transition-all duration-200 ease-out'
                        : 'opacity-50'
                      }`}
                    title={hasEl ? `${pos.elemento.symbol} (#${pos.elemento.atomic_number})` : undefined}
                  >
                    {hasEl ? (
                      <>
                        <div className="text-lg md:text-xl font-extrabold text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                          {pos.elemento.symbol}
                        </div>
                        <div className="text-[11px] md:text-xs text-slate-700 font-semibold">
                          {pos.elemento.atomic_number}
                        </div>
                      </>
                    ) : (
                      <div className="text-[10px] text-slate-500 select-none">{pos.x},{pos.y}</div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center mt-20 text-sky-200 animate-pulse">Cargando elementos...</p>
          )}

          {/* Leyenda suave */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-slate-200">
            {['s', 'p', 'd', 'f'].map((block) => (
              <div key={block} className="flex items-center space-x-3">
                <div
                  className="w-6 h-6 rounded-md border border-white/40 shadow-sm"
                  style={{ backgroundColor: getBlockColor(block) }}
                />
                <span className="capitalize tracking-wide">{block}-block</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modales */}
      {(mostrarModal || mostrarDetalles) && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="flex flex-wrap gap-8 items-start w-full justify-center px-4 sm:px-8">

            {/* Modal Principal */}
            {mostrarModal && elementoSeleccionado && (
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-8 w-[min(92vw,380px)] text-slate-100 shadow-2xl">
                <button
                  onClick={cerrarModal}
                  className="absolute top-3 right-3 text-slate-100 text-2xl font-bold hover:text-white/90"
                  aria-label="Cerrar modal"
                >
                  ✕
                </button>

                <div className="flex justify-center mb-6">
                  <img
                    src={`https://images-of-elements.com/${elementoSeleccionado.symbol.toLowerCase()}.jpg`}
                    alt={elementoSeleccionado.symbol}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=Sin+Imagen';
                    }}
                    className="w-28 h-28 rounded-full border-4 border-white/30 shadow-lg object-cover"
                  />
                </div>

                <h3 className="text-3xl font-extrabold text-center mb-2 drop-shadow-md">
                  {elementoSeleccionado.symbol}
                </h3>
                <p className="text-center text-lg mb-1">N° Atómico: {elementoSeleccionado.atomic_number}</p>
                <p className="text-center italic mb-6 capitalize">Bloque: {elementoSeleccionado.block}</p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={cerrarModal}
                    className="px-4 py-2 rounded-xl bg-white/30 hover:bg-white/40 text-slate-900 font-semibold transition"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={abrirModalDetalles}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-semibold transition"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            )}

            {/* Modal Detalles */}
            {mostrarDetalles && detalleElemento && (
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-8 w-[min(92vw,440px)] text-slate-100 shadow-2xl">
                <button
                  onClick={cerrarModalDetalles}
                  className="absolute top-3 right-3 text-slate-100 text-2xl font-bold hover:text-white/90"
                  aria-label="Cerrar detalles"
                >
                  ✕
                </button>

                <h2 className="text-3xl font-extrabold mb-6 text-center drop-shadow-md">
                  {detalleElemento.name} ({detalleElemento.symbol})
                </h2>

                <ul className="space-y-3 text-[15px] md:text-lg">
                  <li><strong className="text-white/90">Número atómico:</strong> {detalleElemento.atomic_number}</li>
                  <li><strong className="text-white/90">Bloque:</strong> {detalleElemento.block}</li>
                  <li><strong className="text-white/90">Grupo:</strong> {detalleElemento.group}</li>
                  <li><strong className="text-white/90">Periodo:</strong> {detalleElemento.period}</li>
                  <li><strong className="text-white/90">Peso atómico:</strong> {detalleElemento.atomic_mass}</li>
                  <li><strong className="text-white/90">Estado:</strong> {detalleElemento.phase}</li>
                  <li><strong className="text-white/90">Electronegatividad:</strong> {detalleElemento.electronegativity_pauling}</li>
                </ul>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={cerrarModalDetalles}
                    className="px-6 py-2 rounded-xl bg-white/30 hover:bg-white/40 text-slate-900 font-semibold transition"
                  >
                    Cerrar
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
