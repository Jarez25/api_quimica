import { useState, useMemo } from 'react';
import {
  Flame,
  Satellite,
  Eye,
  Radio,
  Zap,
  Activity,
  Layers,
  RotateCcw,
  TrendingUp,
  Sliders,
  Sun,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  obtenerEspectroscopia,
  wavelengthToRGB,
  calcularFrecuenciaTHz,
  calcularEnergiaEV,
  calcularEnergiaJoules,
  calcularNumeroOnda,
  nmAAngstroms,
  aplicarDoppler,
  calcularVelocidadDoppler,
} from '../utils/spectroscopy';

export default function EspectroAtomo({ elemento }) {
  const [modo, setModo] = useState('satelite'); // 'satelite' | 'llama' | 'muestra'
  const [tipoEspectro, setTipoEspectro] = useState('emision'); // 'emision' | 'absorcion'
  const [redshiftZ, setRedshiftZ] = useState(0.000); // z: -0.05 a +0.10
  const [lineaSeleccionada, setLineaSeleccionada] = useState(null);

  const datos = useMemo(() => {
    return obtenerEspectroscopia(elemento);
  }, [elemento]);

  // Línea actualmente activa (o la primera si ninguna está seleccionada)
  const lineaActiva = useMemo(() => {
    if (!datos || !datos.lineasEmision || datos.lineasEmision.length === 0) return null;
    if (lineaSeleccionada) return lineaSeleccionada;
    return datos.lineasEmision[0];
  }, [datos, lineaSeleccionada]);

  // Longitud de onda observada con corrimiento Doppler
  const lambdaObsActiva = useMemo(() => {
    if (!lineaActiva) return 0;
    return aplicarDoppler(lineaActiva.nm, redshiftZ);
  }, [lineaActiva, redshiftZ]);

  // Velocidad radial asociada
  const velocidadKms = useMemo(() => {
    return Number(calcularVelocidadDoppler(redshiftZ));
  }, [redshiftZ]);

  // Cálculo de la curva de Flujo Espectral 2D I(λ) vs λ (SVG)
  const { pathFlux, pathArea, markers } = useMemo(() => {
    if (!datos || !datos.lineasEmision || datos.lineasEmision.length === 0) {
      return { pathFlux: '', pathArea: '', markers: [] };
    }

    const minLambda = 380;
    const maxLambda = 750;
    const rango = maxLambda - minLambda;
    const width = 680;
    const height = 120;
    const xOffset = 45;
    const yOffset = 18;
    const steps = 180;
    const sigma = 3.0; // Ancho instrumental de línea espectral en nm

    // Puntos (λ, I)
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const lambda = minLambda + (i / steps) * rango;
      let flux = 0;

      if (tipoEspectro === 'emision') {
        // Fondo de continuo cósmico tenue (ruido instrumental / cielo)
        const baseline = 0.04;
        let sumPeaks = 0;
        for (const l of datos.lineasEmision) {
          const lObs = aplicarDoppler(l.nm, redshiftZ);
          const diff = lambda - lObs;
          const peak = (l.intensidad || 0.8) * Math.exp(-(diff * diff) / (2 * sigma * sigma));
          sumPeaks += peak;
        }
        flux = Math.min(1.0, baseline + sumPeaks * 0.92);
      } else {
        // Absorción de Fraunhofer: Continuo estelar de cuerpo negro (Planck) con caídas en absorción
        const baseline = 0.88 + 0.08 * Math.sin(((lambda - minLambda) / rango) * Math.PI);
        let attenuation = 1.0;
        for (const l of datos.lineasEmision) {
          const lObs = aplicarDoppler(l.nm, redshiftZ);
          const diff = lambda - lObs;
          const dip = (l.intensidad || 0.8) * 0.82 * Math.exp(-(diff * diff) / (2 * sigma * sigma));
          attenuation *= Math.max(0.08, 1.0 - dip);
        }
        flux = Math.max(0.05, Math.min(1.0, baseline * attenuation));
      }

      const x = xOffset + ((lambda - minLambda) / rango) * width;
      const y = yOffset + (1.0 - flux) * height;
      points.push({ x, y, lambda, flux });
    }

    // SVG Path
    const pathD = points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}` : `${acc} L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    }, '');

    // SVG Area cerrada para el gradiente
    const firstX = points[0]?.x.toFixed(1) || xOffset;
    const lastX = points[points.length - 1]?.x.toFixed(1) || (xOffset + width);
    const bottomY = (yOffset + height).toFixed(1);
    const pathAreaD = `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;

    // Marcadores de picos / valles
    const mks = datos.lineasEmision.map((l) => {
      const lObs = aplicarDoppler(l.nm, redshiftZ);
      const inRange = lObs >= minLambda && lObs <= maxLambda;
      const x = xOffset + ((lObs - minLambda) / rango) * width;
      return {
        ...l,
        lObs,
        inRange,
        x,
      };
    });

    return { pathFlux: pathD, pathArea: pathAreaD, markers: mks };
  }, [datos, tipoEspectro, redshiftZ]);

  if (!elemento || !datos) return null;

  const imgSrc = `https://images-of-elements.com/${elemento.symbol.toLowerCase()}.jpg`;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-6">
      
      {/* Encabezado Principal y Selector de Modos */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
              ESPECTROMETRÍA SATELITAL & ÓPTICA CUÁNTICA
            </h3>
            <span className="rounded bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-300 border border-cyan-500/30">
              NIST CALIBRATED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Firma electromagnética orbital de <span className="text-white font-medium">{elemento.name}</span> ({elemento.symbol}, Z={elemento.atomic_number})
          </p>
        </div>

        {/* Pestañas de Modos Generales */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-1 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setModo('satelite')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition ${
              modo === 'satelite'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
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
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
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
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Muestra Óptica</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODO 1: ESPECTROSCOPÍA SATELITAL & ASTROFÍSICA DE ALTA PRECISIÓN */}
      {/* ============================================================== */}
      {modo === 'satelite' && (
        <div className="space-y-6">

          {/* Subcontroles: Tipo de Espectro (Emisión vs Absorción) y Doppler (Redshift) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Selector de Fenómeno Físico */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                Régimen Espectroscópico Astrofísico
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTipoEspectro('emision')}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2 px-3 text-xs font-mono font-semibold transition ${
                    tipoEspectro === 'emision'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/30 border border-cyan-400/50'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Emisión (Nebulosas)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTipoEspectro('absorcion')}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2 px-3 text-xs font-mono font-semibold transition ${
                    tipoEspectro === 'absorcion'
                      ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md shadow-amber-900/30 border border-amber-400/50'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  <span>Absorción Fraunhofer</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {tipoEspectro === 'emision'
                  ? 'Fotones emitidos por gas ionizado caliente en nebulosas, remanentes de supernova o plasmas estelares.'
                  : 'Líneas oscuras de Fraunhofer provocadas por la absorción en atmósferas estelares o tránsitos de exoplanetas.'}
              </p>
            </div>

            {/* Simulador Doppler / Corrimiento al Rojo Cósmico */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <Sliders className="h-3.5 w-3.5" />
                  Efecto Doppler & Corrimiento (z)
                </span>
                <button
                  type="button"
                  onClick={() => setRedshiftZ(0.000)}
                  title="Restablecer a marco en reposo de laboratorio NIST"
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-400 transition"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset NIST</span>
                </button>
              </div>

              {/* Slider Doppler */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-blue-400 shrink-0">-0.05</span>
                <input
                  type="range"
                  min="-0.050"
                  max="0.100"
                  step="0.001"
                  value={redshiftZ}
                  onChange={(e) => setRedshiftZ(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                />
                <span className="font-mono text-[10px] text-rose-400 shrink-0">+0.10</span>
              </div>

              {/* Readout de Velocidad y Dirección */}
              <div className="flex items-center justify-between text-xs font-mono pt-0.5">
                <span className="text-slate-300 font-bold">
                  z = {redshiftZ >= 0 ? `+${redshiftZ.toFixed(3)}` : redshiftZ.toFixed(3)}
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    redshiftZ > 0.001
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                      : redshiftZ < -0.001
                      ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {redshiftZ > 0.001
                    ? `🔴 Redshift (+${velocidadKms.toLocaleString()} km/s)`
                    : redshiftZ < -0.001
                    ? `🔵 Blueshift (${velocidadKms.toLocaleString()} km/s)`
                    : '⚪ Reposo NIST (v = 0 km/s)'}
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* BARRA DE DISPERSIÓN ESPECTRAL VISIBLE (RED DE DIFRACCIÓN)      */}
          {/* ============================================================== */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <Radio className="h-3.5 w-3.5" />
                ESPECTROGRAMA DISPERSIVO DE DIFRACCIÓN (380 nm – 750 nm)
              </span>
              <span className="text-[11px] text-slate-500">
                {tipoEspectro === 'emision' ? 'Fondo Cósmico Oscuro' : 'Continuo Solar de Fraunhofer'}
              </span>
            </div>

            {/* Barra Espectrográfica */}
            <div className="relative h-24 w-full overflow-hidden rounded-xl border border-slate-700/80 bg-black shadow-inner select-none">
              
              {/* Fondo: Si es absorción muestra continuo visible; si es emisión, espacio oscuro */}
              {tipoEspectro === 'absorcion' ? (
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to right, #38006b 0%, #4c00a4 8%, #0011ff 16%, #00aaff 28%, #00ff66 42%, #aaff00 56%, #ffff00 64%, #ff8800 75%, #ff0000 88%, #660000 100%)',
                  }}
                />
              ) : (
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background:
                      'linear-gradient(to right, #38006b 0%, #0011ff 20%, #00ff66 45%, #ffff00 65%, #ff0000 90%)',
                  }}
                />
              )}

              {/* Líneas Espectrales */}
              {datos.lineasEmision.map((linea, idx) => {
                const lambdaObs = aplicarDoppler(linea.nm, redshiftZ);
                const leftPercent = ((lambdaObs - 380) / (750 - 380)) * 100;
                
                // Si la línea se sale del visible por Doppler
                if (leftPercent < 0 || leftPercent > 100) return null;

                const colorFisico = wavelengthToRGB(Math.max(380, Math.min(780, lambdaObs)));
                const isSelected = lineaActiva?.nm === linea.nm;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLineaSeleccionada(linea)}
                    className="group absolute top-0 bottom-0 cursor-pointer transition-transform hover:scale-y-105 z-10"
                    style={{ left: `${leftPercent}%` }}
                    title={`${linea.nombre} (λ₀=${linea.nm} nm, λ_obs=${lambdaObs.toFixed(1)} nm)`}
                  >
                    {tipoEspectro === 'emision' ? (
                      /* Línea Brillante de Emisión con Efecto Láser / Brillo Cuántico */
                      <div
                        className={`h-full transition-all ${
                          isSelected
                            ? 'w-2 ring-2 ring-white shadow-[0_0_16px_#FFFFFF]'
                            : 'w-1 group-hover:w-1.5'
                        }`}
                        style={{
                          backgroundColor: colorFisico,
                          boxShadow: isSelected
                            ? `0 0 20px ${colorFisico}, 0 0 8px #FFFFFF`
                            : `0 0 10px ${colorFisico}, 0 0 3px #FFFFFF`,
                          opacity: Math.max(0.75, linea.intensidad || 1.0),
                        }}
                      />
                    ) : (
                      /* Línea Oscura de Absorción de Fraunhofer */
                      <div
                        className={`h-full bg-black transition-all ${
                          isSelected
                            ? 'w-2 ring-2 ring-yellow-400 shadow-[0_0_12px_rgba(0,0,0,0.9)]'
                            : 'w-1 group-hover:w-1.5 shadow-[0_0_6px_rgba(0,0,0,0.8)]'
                        }`}
                        style={{
                          opacity: Math.min(1.0, (linea.intensidad || 0.8) * 1.1),
                        }}
                      />
                    )}

                    {/* Tag flotante con longitud de onda */}
                    <span
                      className={`absolute -top-7 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[9px] font-bold text-white shadow-lg pointer-events-none ${
                        isSelected
                          ? 'bg-cyan-600 ring-1 ring-cyan-300 block z-20'
                          : 'bg-slate-900/90 border border-slate-700 group-hover:block hidden z-20'
                      }`}
                    >
                      {lambdaObs.toFixed(1)} nm {linea.fraunhofer && linea.fraunhofer !== '—' ? `[${linea.fraunhofer}]` : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Escala graduada de longitudes de onda */}
            <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1 border-t border-slate-800/80 pt-2">
              <span className="text-violet-400">380 nm (UV / Violeta)</span>
              <span className="text-blue-400">450 nm (Azul)</span>
              <span className="text-teal-400">500 nm (Cian)</span>
              <span className="text-emerald-400">550 nm (Verde)</span>
              <span className="text-yellow-400">600 nm (Amarillo)</span>
              <span className="text-orange-400">650 nm (Naranja)</span>
              <span className="text-rose-400">700 nm (Rojo)</span>
              <span className="text-red-500">750 nm (NIR)</span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* GRÁFICO 2D: FLUJO ESPECTRAL I(λ) vs LONGITUD DE ONDA (SVG)     */}
          {/* ============================================================== */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <TrendingUp className="h-3.5 w-3.5" />
                PERFIL DE FLUJO ESPECTRAL E INTENSIDAD I(λ) vs λ
              </span>
              <span className="text-[10px] text-slate-500">
                {tipoEspectro === 'emision' ? 'Picos Lorentzianos / Gaussianos' : 'Valles de Absorción Atmosférica'}
              </span>
            </div>

            <div className="relative w-full overflow-x-auto bg-slate-950/60 rounded-lg border border-slate-900 p-1">
              <svg
                viewBox="0 0 740 160"
                className="w-full h-40 select-none overflow-visible"
              >
                <defs>
                  {/* Gradiente de relleno para Emisión */}
                  <linearGradient id="gradEmision" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                    <stop offset="70%" stopColor="#0284c7" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Gradiente de relleno para Absorción */}
                  <linearGradient id="gradAbsorcion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                    <stop offset="70%" stopColor="#ef4444" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Ejes y Cuadrícula */}
                <line x1="45" y1="18" x2="45" y2="138" stroke="#334155" strokeWidth="1" />
                <line x1="45" y1="138" x2="725" y2="138" stroke="#334155" strokeWidth="1" />

                {/* Líneas de guía de intensidad */}
                <line x1="45" y1="18" x2="725" y2="18" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="45" y1="78" x2="725" y2="78" stroke="#1e293b" strokeDasharray="3 3" />

                {/* Etiquetas eje Y */}
                <text x="38" y="22" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">1.0</text>
                <text x="38" y="82" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">0.5</text>
                <text x="38" y="141" fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">0.0</text>

                {/* Etiquetas eje X */}
                {[380, 450, 500, 550, 600, 650, 700, 750].map((nmVal) => {
                  const xPos = 45 + ((nmVal - 380) / (750 - 380)) * 680;
                  return (
                    <g key={nmVal}>
                      <line x1={xPos} y1="138" x2={xPos} y2="143" stroke="#475569" strokeWidth="1" />
                      <text
                        x={xPos}
                        y="153"
                        fill="#64748b"
                        fontSize="8.5"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {nmVal}
                      </text>
                    </g>
                  );
                })}

                {/* Área bajo la curva */}
                {pathArea && (
                  <path
                    d={pathArea}
                    fill={tipoEspectro === 'emision' ? 'url(#gradEmision)' : 'url(#gradAbsorcion)'}
                  />
                )}

                {/* Curva de Flujo Espectral */}
                {pathFlux && (
                  <path
                    d={pathFlux}
                    fill="none"
                    stroke={tipoEspectro === 'emision' ? '#22d3ee' : '#fbbf24'}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Marcadores de picos y líneas activas */}
                {markers.map((mk, idx) => {
                  if (!mk.inRange) return null;
                  const isSelected = lineaActiva?.nm === mk.nm;
                  const colorLinea = wavelengthToRGB(Math.max(380, Math.min(780, mk.lObs)));

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer"
                      onClick={() => setLineaSeleccionada(mk)}
                    >
                      <line
                        x1={mk.x}
                        y1="18"
                        x2={mk.x}
                        y2="138"
                        stroke={isSelected ? '#ffffff' : colorLinea}
                        strokeWidth={isSelected ? '2' : '1'}
                        strokeDasharray={isSelected ? 'none' : '2 2'}
                        opacity={isSelected ? 1.0 : 0.65}
                      />
                      {isSelected && (
                        <circle
                          cx={mk.x}
                          cy="18"
                          r="4"
                          fill="#ffffff"
                          stroke={colorLinea}
                          strokeWidth="2"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* ============================================================== */}
          {/* INSPECTOR CUÁNTICO: PARÁMETROS FÍSICOS DE LA LÍNEA ACTIVA      */}
          {/* ============================================================== */}
          {lineaActiva && (
            <div className="rounded-xl border border-cyan-500/30 bg-slate-950 p-4 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="inline-block h-4 w-4 rounded-full border border-white/40 shadow-[0_0_10px_currentColor]"
                    style={{
                      backgroundColor: wavelengthToRGB(Math.max(380, Math.min(780, lambdaObsActiva))),
                      color: wavelengthToRGB(Math.max(380, Math.min(780, lambdaObsActiva))),
                    }}
                  />
                  <div>
                    <h4 className="font-mono text-sm font-bold text-white">
                      {lineaActiva.nombre || 'Transición de Resonancia'}
                    </h4>
                    <span className="text-[11px] font-mono text-cyan-400">
                      Notación de Fraunhofer: <strong>{lineaActiva.fraunhofer || '—'}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs font-mono text-slate-300">
                    Transición: <strong className="text-emerald-400">{lineaActiva.transicion || 'Orbital excitado'}</strong>
                  </span>
                </div>
              </div>

              {/* Matriz Cuántica 6 Paneles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
                
                {/* 1. λ Reposo NIST */}
                <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-3">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 block">λ REPOSO NIST</span>
                  <strong className="text-white text-sm mt-0.5 block">
                    {lineaActiva.nm} nm
                  </strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {nmAAngstroms(lineaActiva.nm)} Å
                  </span>
                </div>

                {/* 2. λ Observada (Doppler) */}
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3">
                  <span className="text-[9px] uppercase tracking-wider text-cyan-400 block">λ OBSERVADA</span>
                  <strong className="text-cyan-300 text-sm mt-0.5 block">
                    {lambdaObsActiva.toFixed(2)} nm
                  </strong>
                  <span className="text-[10px] text-cyan-500 block mt-0.5">
                    Δλ: {(lambdaObsActiva - lineaActiva.nm).toFixed(2)} nm
                  </span>
                </div>

                {/* 3. Frecuencia Óptica */}
                <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-3">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 block">FRECUENCIA (ν)</span>
                  <strong className="text-emerald-400 text-sm mt-0.5 block">
                    {calcularFrecuenciaTHz(lambdaObsActiva)} THz
                  </strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    ν = c / λ
                  </span>
                </div>

                {/* 4. Energía del Fotón (eV) */}
                <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-3">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 block">ENERGÍA (E = h·ν)</span>
                  <strong className="text-purple-300 text-sm mt-0.5 block">
                    {calcularEnergiaEV(lambdaObsActiva)} eV
                  </strong>
                  <span className="text-[10px] text-purple-400/80 block mt-0.5">
                    {calcularEnergiaJoules(lambdaObsActiva)} × 10⁻¹⁹ J
                  </span>
                </div>

                {/* 5. Número de Onda */}
                <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-3">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 block">NÚMERO DE ONDA</span>
                  <strong className="text-amber-400 text-sm mt-0.5 block">
                    {calcularNumeroOnda(lambdaObsActiva)}
                  </strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    cm⁻¹ (Espectroscopía)
                  </span>
                </div>

                {/* 6. Intensidad Relativa */}
                <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-3">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 block">INTENSIDAD NIST</span>
                  <strong className="text-rose-400 text-sm mt-0.5 block">
                    {Math.round((lineaActiva.intensidad || 0.8) * 100)} %
                  </strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Fuerza de oscilador
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TABLA DE TODAS LAS LÍNEAS ESPECTRALES DEL ELEMENTO            */}
          {/* ============================================================== */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-cyan-400" />
                Catálogo de Transiciones de Rydberg & NIST ({datos.lineasEmision.length} líneas principales)
              </span>
              <span className="text-slate-500 text-[11px]">Click en cualquier fila para inspeccionar</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase text-slate-500">
                    <th className="py-2 px-2.5">Fraunhofer</th>
                    <th className="py-2 px-2.5">λ₀ (NIST)</th>
                    <th className="py-2 px-2.5">λ Obs (z)</th>
                    <th className="py-2 px-2.5">Ångströms (Å)</th>
                    <th className="py-2 px-2.5">Energía (eV)</th>
                    <th className="py-2 px-2.5">Transición Orbital</th>
                    <th className="py-2 px-2.5 text-right">Intensidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {datos.lineasEmision.map((l, idx) => {
                    const lObs = aplicarDoppler(l.nm, redshiftZ);
                    const isSelected = lineaActiva?.nm === l.nm;
                    const colorFisico = wavelengthToRGB(Math.max(380, Math.min(780, lObs)));

                    return (
                      <tr
                        key={idx}
                        onClick={() => setLineaSeleccionada(l)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-cyan-950/40 text-cyan-200' : 'hover:bg-slate-900/60 text-slate-300'
                        }`}
                      >
                        <td className="py-2.5 px-2.5 font-bold flex items-center gap-2">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: colorFisico }}
                          />
                          <span>{l.fraunhofer || '—'}</span>
                        </td>
                        <td className="py-2.5 px-2.5 font-semibold text-white">{l.nm} nm</td>
                        <td className="py-2.5 px-2.5 text-cyan-300">{lObs.toFixed(2)} nm</td>
                        <td className="py-2.5 px-2.5 text-slate-400">{nmAAngstroms(lObs)} Å</td>
                        <td className="py-2.5 px-2.5 text-purple-300">{calcularEnergiaEV(lObs)} eV</td>
                        <td className="py-2.5 px-2.5 text-slate-300 truncate max-w-[180px]">{l.transicion}</td>
                        <td className="py-2.5 px-2.5 text-right font-bold text-amber-400">
                          {Math.round((l.intensidad || 0.8) * 100)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contexto de Misiones Satelitales y Astrofísica */}
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-4 flex items-start gap-3.5">
            <Satellite className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1.5">
              <div className="flex items-center gap-2">
                <strong className="text-cyan-200 font-semibold block text-sm">
                  Instrumentación Espacial & Detección Astrofísica
                </strong>
                <span className="rounded bg-cyan-900/40 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-700/50">
                  {datos.instrumentoSatelital || 'Telescopios Espaciales NIRSpec / STIS'}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                {datos.satelites}
              </p>
              <div className="pt-1 flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
                <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  🛰️ James Webb Space Telescope (JWST NIRSpec)
                </span>
                <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  🔭 Hubble Space Telescope (STIS / COS)
                </span>
                <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  ☀️ SDO (Solar Dynamics Observatory)
                </span>
                <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  🌍 ESA Sentinel-2 MSI
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODO 2: ENSAYO A LA LLAMA (COMBUSTIÓN Y EXCITACIÓN TÉRMICA)    */}
      {/* ============================================================== */}
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

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {datos.llama.descripcion}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-[10px] uppercase text-slate-500 block">TEMPERATURA DE ENSAYO</span>
                  <strong className="text-slate-200 mt-0.5 block">{datos.llama.temperatura}</strong>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-[10px] uppercase text-slate-500 block">MECANISMO DE IDENTIFICACIÓN</span>
                  <strong className="text-amber-400 mt-0.5 block">Excitación térmica de capa de valencia</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODO 3: MUESTRA ÓPTICA MACROSCÓPICA (ESTADO PURO)              */}
      {/* ============================================================== */}
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

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
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
