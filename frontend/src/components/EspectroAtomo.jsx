import { useState, useMemo } from 'react';
import {
  Flame,
  Satellite,
  Eye,
  Sparkles,
  Info,
  Radio,
  Zap,
  Maximize2,
} from 'lucide-react';
import { obtenerEspectroscopia, wavelengthToRGB } from '../utils/spectroscopy';

export default function EspectroAtomo({ elemento }) {
  const [modo, setModo] = useState('satelite'); // 'satelite' | 'llama' | 'muestra'
  const [lineaSeleccionada, setLineaSeleccionada] = useState(null);

  const datos = useMemo(() => {
    return obtenerEspectroscopia(elemento);
  }, [elemento]);

  if (!elemento || !datos) return null;

  // Cálculo de energía del fotón: E = hc / λ (en eV)
  const calcularEnergiaEV = (nm) => {
    if (!nm) return '0.00';
    // h*c ≈ 1239.84 eV·nm
    return (1239.84 / nm).toFixed(2);
  };

  const imgSrc = `https://images-of-elements.com/${elemento.symbol.toLowerCase()}.jpg`;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-6">
      
      {/* Header with Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
              ÓPTICA CUÁNTICA & ESPECTROMETRÍA SATELITAL
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Huella dactilar electromagnética de {elemento.name} ({elemento.symbol})
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-1">
          <button
            type="button"
            onClick={() => setModo('satelite')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition ${
              modo === 'satelite'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Satellite className="h-3.5 w-3.5" />
            <span>Espectro Satelital</span>
          </button>

          <button
            type="button"
            onClick={() => setModo('llama')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition ${
              modo === 'llama'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Ensayo a la Llama</span>
          </button>

          <button
            type="button"
            onClick={() => setModo('muestra')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition ${
              modo === 'muestra'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Muestra Óptica</span>
          </button>
        </div>
      </div>

      {/* MODE 1: SATELLITE SPECTROGRAPH (DIFFRACTION GRATING) */}
      {modo === 'satelite' && (
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-800/80 bg-slate-950 p-4 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Radio className="h-3.5 w-3.5" />
                SENSOR ESPECTRÓGRAFO DE DIFRACCIÓN (380 nm - 750 nm)
              </span>
              <span>Resolución Cuántica 1 nm</span>
            </div>

            {/* Continuous Spectrum Bar with Emission Lines */}
            <div className="relative h-20 w-full overflow-hidden rounded-lg border border-slate-700/80 bg-black shadow-inner">
              
              {/* Darkened background grid */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  background:
                    'linear-gradient(to right, #4B0082, #0000FF, #00FFFF, #00FF00, #FFFF00, #FF7F00, #FF0000)',
                }}
              />

              {/* Emission Lines */}
              {datos.lineasEmision.map((linea, idx) => {
                // Posición porcentual de 380 nm a 750 nm
                const leftPercent = Math.max(0, Math.min(100, ((linea.nm - 380) / (750 - 380)) * 100));
                const colorFisico = wavelengthToRGB(linea.nm);
                const isSelected = lineaSeleccionada?.nm === linea.nm;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLineaSeleccionada(linea)}
                    className="group absolute top-0 bottom-0 cursor-pointer transition-transform hover:scale-y-110"
                    style={{ left: `${leftPercent}%` }}
                    title={`${linea.nombre || 'Línea de emisión'} (${linea.nm} nm)`}
                  >
                    {/* Glowing Spectral Line */}
                    <div
                      className={`h-full transition-all ${isSelected ? 'w-1.5 ring-2 ring-white shadow-lg' : 'w-1 group-hover:w-1.5'}`}
                      style={{
                        backgroundColor: colorFisico,
                        boxShadow: `0 0 12px ${colorFisico}, 0 0 4px #FFFFFF`,
                        opacity: Math.max(0.7, linea.intensidad || 1.0),
                      }}
                    />

                    {/* Wavelength Tag on Top */}
                    <span
                      className={`absolute -top-6 -translate-x-1/2 whitespace-nowrap rounded px-1 py-0.5 font-mono text-[9px] font-bold text-white shadow ${
                        isSelected ? 'bg-cyan-500' : 'bg-slate-900 border border-slate-700 group-hover:block hidden'
                      }`}
                    >
                      {linea.nm} nm
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Scale Axis */}
            <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1 border-t border-slate-800/80 pt-1.5">
              <span>380 nm (UV / Violeta)</span>
              <span>450 nm (Azul)</span>
              <span>520 nm (Verde)</span>
              <span>590 nm (Amarillo)</span>
              <span>650 nm (Rojo)</span>
              <span>750 nm (Infrarrojo)</span>
            </div>
          </div>

          {/* Selected Line Photon Energy Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-[10px] uppercase text-slate-500 block">LÍNEA SELECCIONADA</span>
              <strong className="text-cyan-300 text-sm mt-0.5 block">
                {lineaSeleccionada ? `${lineaSeleccionada.nm} nm` : `${datos.lineasEmision[0]?.nm || '—'} nm`}
              </strong>
              <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                {lineaSeleccionada?.nombre || datos.lineasEmision[0]?.nombre || 'Fotón de resonancia'}
              </span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-[10px] uppercase text-slate-500 block">ENERGÍA DEL FOTÓN (E = h·ν)</span>
              <strong className="text-emerald-400 text-sm mt-0.5 block">
                {calcularEnergiaEV(lineaSeleccionada?.nm || datos.lineasEmision[0]?.nm)} eV
              </strong>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Transición cuántica de Rydberg
              </span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-[10px] uppercase text-slate-500 block">APLICACIÓN SATELITAL</span>
              <strong className="text-purple-300 text-xs mt-0.5 block line-clamp-2">
                Huella digital espectroscópica
              </strong>
            </div>
          </div>

          {/* Satellite Context Box */}
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-4 flex items-start gap-3">
            <Satellite className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="text-cyan-200 font-semibold block">
                ¿Cómo fotografían los satélites este elemento a millones de kilómetros?
              </strong>
              <p className="text-slate-300 leading-relaxed font-sans">
                {datos.satelites} Los telescopios espaciales (como Hubble, James Webb o satélites Sentinel) descomponen la luz recibida en un espectrógrafo de difracción. Al comparar las franjas luminosas con este patrón de laboratorio, los astrónomos identifican la presencia exacta de <strong>{elemento.name}</strong> en exoplanetas y nebulosas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: FLAME TEST (COMBUSTIÓN Y EXCITAÇÃO TÉRMICA) */}
      {modo === 'llama' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-center">
            
            {/* Visual Flame Simulation Chamber */}
            <div className="relative h-64 w-full rounded-2xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-end pb-4 overflow-hidden shadow-2xl">
              
              {/* Thermal Glow background */}
              <div
                className="absolute inset-0 opacity-20 blur-2xl transition-all duration-500"
                style={{ backgroundColor: datos.llama.color }}
              />

              {/* Animated Flame */}
              <div className="relative flex flex-col items-center">
                {/* Flame Tongue */}
                <div
                  className="w-16 h-36 rounded-full blur-[1px] animate-pulse transition-all duration-700"
                  style={{
                    background: `radial-gradient(ellipse at bottom, #FFFFFF 0%, ${datos.llama.color} 50%, rgba(0,0,0,0) 85%)`,
                    boxShadow: `0 0 35px ${datos.llama.color}`,
                  }}
                />
                
                {/* Inner White-Hot Core */}
                <div className="absolute bottom-2 w-6 h-14 bg-white/90 rounded-full blur-[2px]" />

                {/* Bunsen Burner Nozzle */}
                <div className="w-12 h-6 bg-gradient-to-b from-slate-700 to-slate-900 border-t border-slate-600 rounded-t-sm mt-1 z-10" />
                <div className="w-16 h-2 bg-slate-800 rounded-full z-10" />
              </div>

              <span className="font-mono text-[10px] text-slate-400 mt-2 z-10 uppercase tracking-widest">
                MECHERO BUNSEN // ENSAYO QUÍMICO
              </span>
            </div>

            {/* Flame Technical Properties */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
                  COLOR A LA LLAMA EMITIDO:
                </span>
                <h4 className="text-2xl font-black text-white mt-1 flex items-center gap-3">
                  <span
                    className="inline-block h-5 w-5 rounded-full border border-white/40 shadow-lg"
                    style={{ backgroundColor: datos.llama.color }}
                  />
                  <span>{datos.llama.nombre}</span>
                </h4>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {datos.llama.descripcion}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-[10px] uppercase text-slate-500 block">TEMPERATURA DE ENSAYO</span>
                  <strong className="text-slate-200 mt-0.5 block">{datos.llama.temperatura}</strong>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-[10px] uppercase text-slate-500 block">USO PIROTÉCNICO & IDENTIFICACIÓN</span>
                  <strong className="text-amber-400 mt-0.5 block">Análisis cualitativo clásico</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: PHYSICAL OPTICAL SAMPLE */}
      {modo === 'muestra' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-center">
            
            {/* Real Photographic Element Sample */}
            <div className="aspect-square w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-center p-2 shadow-2xl">
              <img
                src={imgSrc}
                alt={`Muestra física de ${elemento.name}`}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://periodictable.com/Samples/${String(elemento.atomic_number).padStart(3, '0')}.1/s9s.JPG`;
                }}
                className="h-full w-full object-cover rounded-xl transition-transform hover:scale-105 duration-300"
              />
            </div>

            {/* Optical Description */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider block">
                  ASPECTO ÓPTICO MACROSCÓPICO (ESTADO PURO):
                </span>
                <h4 className="text-xl font-black text-white mt-1">
                  Muestra Pura de {elemento.name} ({elemento.symbol})
                </h4>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {datos.aspectoMuestra}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs pt-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-[10px] uppercase text-slate-500 block">ESTADO ESTÁNDAR</span>
                  <strong className="text-slate-200 capitalize mt-0.5 block">
                    {elemento.standard_state || elemento.phase || 'Sólido'}
                  </strong>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-[10px] uppercase text-slate-500 block">LUSTRE / BRILLO</span>
                  <strong className="text-cyan-300 mt-0.5 block">
                    {['alkali', 'metal', 'transition'].some((t) => String(elemento.group_block).toLowerCase().includes(t)) ? 'Metálico' : 'No metálico'}
                  </strong>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-[10px] uppercase text-slate-500 block">COLOR CPK</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="inline-block h-3.5 w-3.5 rounded border border-white/20"
                      style={{ backgroundColor: `#${elemento.cpk_hex_color || '80D1E3'}` }}
                    />
                    <strong className="text-slate-300">#{elemento.cpk_hex_color}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
