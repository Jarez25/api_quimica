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

  const getBlockColor = (block) => {
    switch (block) {
      case 's': return '#ff6666';     // rojo suave
      case 'p': return '#66ff99';     // verde suave
      case 'd': return '#6699ff';     // azul suave
      case 'f': return '#cc66ff';     // púrpura suave
      default: return '#aaaaaa';      // gris neutro
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
    <div className="p-4 mx-auto max-w-[1200px] font-mono bg-gradient-to-br from-slate-900 to-gray-800 min-h-screen text-cyan-300">
      <h2 className="text-4xl font-bold text-center mb-10 border-b border-cyan-500 pb-3 drop-shadow-md">
        Tabla Periódica Interactiva
      </h2>

      <div className="relative">
        {estructuraTabla.length > 0 ? (
          <div
            className="grid gap-1 cursor-default"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(18, minmax(40px, 1fr))',
              gridTemplateRows: `repeat(${maxY}, 60px)`,
            }}
          >
            {estructuraTabla.map((pos, index) => (
              <div
                key={index}
                onClick={() => handleElementoClick(pos.elemento)}
                style={{
                  gridColumn: pos.x,
                  gridRow: pos.y,
                  backgroundColor: pos.elemento
                    ? getBlockColor(pos.elemento.block)
                    : 'transparent',
                  border: pos.elemento ? '1px solid #0e7490' : '1px dashed #334155',
                  cursor: pos.elemento ? 'pointer' : 'default',
                }}
                className={`rounded-sm p-1 flex flex-col items-center justify-center select-none
                  ${pos.elemento ? 'shadow-lg hover:scale-110 transition-transform duration-300 ease-in-out' : ''}`}
                title={pos.elemento ? `${pos.elemento.symbol} (#${pos.elemento.atomic_number})` : undefined}
              >
                {pos.elemento ? (
                  <>
                    <div className="text-lg font-extrabold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {pos.elemento.symbol}
                    </div>
                    <div className="text-xs opacity-90">{pos.elemento.atomic_number}</div>
                  </>
                ) : (
                  <div className="text-[10px] text-gray-500 select-none">
                    {pos.x},{pos.y}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-20 text-cyan-400 animate-pulse">Cargando elementos...</p>
        )}

        {/* Leyenda */}
        <div className="mt-8 grid grid-cols-4 gap-4 max-w-md mx-auto text-cyan-200">
          {['s', 'p', 'd', 'f'].map((block) => (
            <div key={block} className="flex items-center space-x-2">
              <div
                className="w-6 h-6 rounded-sm border border-cyan-600"
                style={{ backgroundColor: getBlockColor(block) }}
              />
              <span className="capitalize">{block}-block</span>
            </div>
          ))}
        </div>
      </div>

      {(mostrarModal || mostrarDetalles) && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="flex gap-8 items-start max-w-4xl px-4 sm:px-8">

            {/* Modal Principal */}
            {mostrarModal && elementoSeleccionado && (
              <div className="relative bg-white/20 backdrop-blur-lg border border-cyan-500 rounded-2xl p-8 w-[320px] text-cyan-100 shadow-xl transform transition-transform duration-400 ease-out animate-fade-expand">
                <button
                  onClick={cerrarModal}
                  className="absolute top-3 right-3 text-cyan-100 text-2xl font-bold hover:text-cyan-300"
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
                    className="w-28 h-28 rounded-full border-4 border-cyan-400 shadow-lg object-cover"
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
                    className="px-4 py-2 rounded-xl bg-white/30 hover:bg-white/50 text-cyan-900 font-semibold transition"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={abrirModalDetalles}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            )}

            {/* Modal Detalles */}
            {mostrarDetalles && detalleElemento && (
              <div className="relative bg-white/20 backdrop-blur-lg border border-cyan-500 rounded-2xl p-8 w-[400px] text-cyan-100 shadow-xl transform transition-all duration-400 ease-in-out animate-fade-expand">
                <button
                  onClick={cerrarModalDetalles}
                  className="absolute top-3 right-3 text-cyan-100 text-2xl font-bold hover:text-cyan-300"
                  aria-label="Cerrar detalles"
                >
                  ✕
                </button>

                <h2 className="text-3xl font-extrabold mb-6 text-center drop-shadow-md">
                  {detalleElemento.name} ({detalleElemento.symbol})
                </h2>

                <ul className="space-y-3 text-lg">
                  <li><strong>Número atómico:</strong> {detalleElemento.atomic_number}</li>
                  <li><strong>Bloque:</strong> {detalleElemento.block}</li>
                  <li><strong>Grupo:</strong> {detalleElemento.group}</li>
                  <li><strong>Periodo:</strong> {detalleElemento.period}</li>
                  <li><strong>Peso atómico:</strong> {detalleElemento.atomic_mass}</li>
                  <li><strong>Estado:</strong> {detalleElemento.phase}</li>
                  <li><strong>Electronegatividad:</strong> {detalleElemento.electronegativity_pauling}</li>
                </ul>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={cerrarModalDetalles}
                    className="px-6 py-2 rounded-xl bg-white/30 hover:bg-white/50 text-cyan-900 font-semibold transition"
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
