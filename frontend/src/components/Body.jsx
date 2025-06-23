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
      case 's': return '#ff9999';
      case 'p': return '#99ff99';
      case 'd': return '#9999ff';
      case 'f': return '#ff99ff';
      default: return '#cccccc';
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
    <div className="p-4 mx-auto max-w-[1200px]">
      <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Tabla Periódica</h2>

      <div className="relative">
        {estructuraTabla.length > 0 ? (
          <div
            className="grid gap-1"
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
                  border: pos.elemento ? '1px solid #333' : '1px dashed #ccc',
                  cursor: pos.elemento ? 'pointer' : 'default',
                }}
                className={`rounded-sm p-1 flex flex-col items-center justify-center
                  ${pos.elemento ? 'shadow-md hover:scale-105 transition-transform' : ''}`}
              >
                {pos.elemento ? (
                  <>
                    <div className="text-sm font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                      {pos.elemento.symbol}
                    </div>
                    <div className="text-xs text-white opacity-90">
                      {pos.elemento.atomic_number}
                    </div>
                  </>
                ) : (
                  <div className="text-[10px] text-gray-400">{pos.x},{pos.y}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">Cargando elementos...</p>
        )}

        {/* Leyenda */}
        <div className="mt-6 grid grid-cols-4 gap-4 max-w-md mx-auto">
          {['s', 'p', 'd', 'f'].map((block, i) => (
            <div className="flex items-center" key={block}>
              <div
                className="w-5 h-5 mr-2 rounded-sm"
                style={{ backgroundColor: getBlockColor(block) }}
              ></div>
              <span className="text-sm">{block}-block</span>
            </div>
          ))}
        </div>
      </div>

      {(mostrarModal || mostrarDetalles) && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="flex gap-6 items-start">

            {/* Modal principal con animación */}
            {mostrarModal && elementoSeleccionado && (
              <div
                className="relative bg-white/30 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-6 w-[320px] text-white transform transition-transform duration-500 ease-out scale-100 animate-fade-expand"
              >
                <button
                  onClick={cerrarModal}
                  className="absolute top-3 right-3 text-white text-xl font-bold hover:text-gray-200"
                >
                  ✕
                </button>

                <div className="flex justify-center mb-4">
                  <img
                    src={`https://images-of-elements.com/${elementoSeleccionado.symbol.toLowerCase()}.jpg`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=Sin+Imagen';
                    }}
                    alt={elementoSeleccionado.symbol}
                    className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
                  />
                </div>

                <h3 className="text-2xl font-bold text-center drop-shadow-md mb-2">
                  {elementoSeleccionado.symbol}
                </h3>
                <p className="text-center text-lg mb-1">N° Atómico: {elementoSeleccionado.atomic_number}</p>
                <p className="text-center text-sm italic mb-4">Bloque: {elementoSeleccionado.block}</p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={cerrarModal}
                    className="px-4 py-2 rounded-xl bg-white/40 hover:bg-white/60 text-black font-semibold transition"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={abrirModalDetalles}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            )}

            {/* Modal Detalle */}
            {mostrarDetalles && detalleElemento && (
              <div
                className="relative bg-white/30 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-6 w-[400px] text-white transform transition-all duration-500 ease-in-out scale-100"
              >
                <button
                  onClick={cerrarModalDetalles}
                  className="absolute top-3 right-3 text-white text-xl font-bold hover:text-gray-200"
                >
                  ✕
                </button>

                <h2 className="text-3xl font-bold mb-4 text-center">
                  {detalleElemento.name} ({detalleElemento.symbol})
                </h2>

                <ul className="space-y-2 text-base">
                  <li><strong>Número atómico:</strong> {detalleElemento.atomic_number}</li>
                  <li><strong>Bloque:</strong> {detalleElemento.block}</li>
                  <li><strong>Grupo:</strong> {detalleElemento.group}</li>
                  <li><strong>Periodo:</strong> {detalleElemento.period}</li>
                  <li><strong>Peso atómico:</strong> {detalleElemento.atomic_mass}</li>
                  <li><strong>Estado:</strong> {detalleElemento.phase}</li>
                  <li><strong>Electronegatividad:</strong> {detalleElemento.electronegativity_pauling}</li>
                </ul>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={cerrarModalDetalles}
                    className="px-4 py-2 bg-white/40 hover:bg-white/60 text-black rounded-xl font-semibold transition"
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
