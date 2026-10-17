import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Atom,
  Search,
  Layers,
  Sparkles,
  X,
  ExternalLink,
  Copy,
  CheckCircle2,
  Info,
  Thermometer,
  Zap,
  ShieldAlert,
  Flame,
  Droplets,
  Wind,
} from 'lucide-react';
import { API_ELEMENTOS } from '../config/api';
import { calcularCapasElectronicas, calcularNFPA704, kelvinACelsius } from '../utils/chemistry';

function Body() {
  const [elementos, setElementos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [elementoSeleccionado, setElementoSeleccionado] = useState(null);
  const [hoveredElemento, setHoveredElemento] = useState(null);
  const [modalTab, setModalTab] = useState('fisica'); // 'fisica' | 'cuantica' | 'seguridad'
  
  // Filters
  const [filtroBloque, setFiltroBloque] = useState('todos');
  const [filtroFase, setFiltroFase] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    setCargando(true);
    fetch(API_ELEMENTOS)
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
            phase: (el.standard_state || el.phase || 'unknown').toLowerCase(),
            cpk_hex_color: el.cpk_hex_color || '80D1E3',
          }))
          .filter((el) => el.atomic_number && el.symbol && el.xpos && el.ypos)
          .sort((a, b) => a.atomic_number - b.atomic_number);

        setElementos(normalizados);
      })
      .catch((err) => console.error('❌ Error al cargar los elementos:', err))
      .finally(() => setCargando(false));
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
    // Lantánidos y actínidos (filas 8 y 9)
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

  // Deep laboratory styling by quantum block
  const getBlockStyle = (block) => {
    switch (block) {
      case 's':
        return {
          bg: 'bg-amber-950/25',
          border: 'border-amber-500/30 hover:border-amber-400',
          hoverBg: 'hover:bg-amber-900/40',
          text: 'text-amber-200',
          accent: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'p':
        return {
          bg: 'bg-cyan-950/25',
          border: 'border-cyan-500/30 hover:border-cyan-400',
          hoverBg: 'hover:bg-cyan-900/40',
          text: 'text-cyan-200',
          accent: 'text-cyan-400',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        };
      case 'd':
        return {
          bg: 'bg-emerald-950/25',
          border: 'border-emerald-500/30 hover:border-emerald-400',
          hoverBg: 'hover:bg-emerald-900/40',
          text: 'text-emerald-200',
          accent: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'f':
        return {
          bg: 'bg-rose-950/25',
          border: 'border-rose-500/30 hover:border-rose-400',
          hoverBg: 'hover:bg-rose-900/40',
          text: 'text-rose-200',
          accent: 'text-rose-400',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
      default:
        return {
          bg: 'bg-slate-900/40',
          border: 'border-slate-800 hover:border-slate-700',
          hoverBg: 'hover:bg-slate-800/40',
          text: 'text-slate-200',
          accent: 'text-slate-400',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
        };
    }
  };

  const matchesSearch = (el) => {
    if (!el) return false;
    const q = busqueda.trim().toLowerCase();
    if (!q) return true;
    return (
      el.symbol.toLowerCase().includes(q) ||
      el.name.toLowerCase().includes(q) ||
      String(el.atomic_number).includes(q)
    );
  };

  const matchesFilter = (el) => {
    if (!el) return false;
    if (filtroBloque !== 'todos' && el.block !== filtroBloque) return false;
    if (filtroFase !== 'todos' && !el.phase.includes(filtroFase)) return false;
    return matchesSearch(el);
  };

  const copiarAlPortapapeles = (texto) => {
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const grupos = Array.from({ length: 18 }, (_, index) => index + 1);
  const periodos = Array.from({ length: 7 }, (_, index) => index + 1);

  // Active HUD element
  const hudElement = hoveredElemento || elementoSeleccionado || elementos[0] || null;

  // Selected element computed physics & NFPA
  const capasElectronicas = useMemo(() => {
    return elementoSeleccionado ? calcularCapasElectronicas(elementoSeleccionado.atomic_number) : [];
  }, [elementoSeleccionado]);

  const nfpa = useMemo(() => {
    return elementoSeleccionado ? calcularNFPA704(elementoSeleccionado) : null;
  }, [elementoSeleccionado]);

  return (
    <div className="min-h-screen w-full bg-[#070d18] bg-lab-pattern bg-radial-gradient text-slate-100 pb-20">
      <div className="mx-auto w-full max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Top Laboratory Control Bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xl shadow-xl">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">
              <Atom className="h-4 w-4" />
              <span>SISTEMA PERIÓDICO IUPAC // 118 ELEMENTOS</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white">
              Cuadrícula Cuántica & Tabla Periódica
            </h1>
          </div>

          {/* Quick Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por símbolo, Z o nombre..."
                className="rounded-xl border border-slate-700 bg-slate-950/90 pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none w-56 sm:w-64"
              />
            </div>

            {/* Block filters */}
            <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1 font-mono text-xs">
              {['todos', 's', 'p', 'd', 'f'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setFiltroBloque(b)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition ${
                    filtroBloque === b
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {b === 'todos' ? 'Todos' : `B-${b}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend pills */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 uppercase tracking-wider text-[11px] mr-1">Bloques:</span>
            {[
              { b: 's', label: 'Bloque s (Metales alcalinos / H / He)', color: 'bg-amber-400' },
              { b: 'p', label: 'Bloque p (No metales / Halógenos / Gases)', color: 'bg-cyan-400' },
              { b: 'd', label: 'Bloque d (Metales de transición)', color: 'bg-emerald-400' },
              { b: 'f', label: 'Bloque f (Lantánidos & Actínidos)', color: 'bg-rose-400' },
            ].map((item) => (
              <button
                key={item.b}
                type="button"
                onClick={() => setFiltroBloque(filtroBloque === item.b ? 'todos' : item.b)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 transition ${
                  filtroBloque === item.b
                    ? 'border-white/30 bg-white/10 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${item.color}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              Gas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
              Líquido
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
              Sólido
            </span>
          </div>
        </div>

        {/* Main Periodic Table Grid Container */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto pb-4">
            {cargando ? (
              <div className="flex min-h-[500px] flex-col items-center justify-center gap-3">
                <Atom className="h-10 w-10 animate-spin text-cyan-400" />
                <p className="font-mono text-sm text-cyan-300 tracking-wider uppercase">
                  Sincronizando 118 elementos desde MongoDB Atlas...
                </p>
              </div>
            ) : (
              <div
                className="relative grid min-w-[1300px] gap-1.5"
                style={{
                  gridTemplateColumns: '36px repeat(18, minmax(62px, 1fr))',
                  gridTemplateRows: '28px repeat(7, 76px) 24px repeat(2, 76px)',
                }}
              >
                {/* Column Headers (Groups 1-18) */}
                <div
                  className="flex items-center justify-center rounded border border-slate-800 bg-slate-950 font-mono text-[10px] text-slate-500 font-bold"
                  style={{ gridColumn: 1, gridRow: 1 }}
                >
                  P\G
                </div>

                {grupos.map((g) => (
                  <div
                    key={`g-${g}`}
                    className="flex items-center justify-center rounded border border-slate-800/80 bg-slate-950 font-mono text-xs font-bold text-slate-400"
                    style={{ gridColumn: g + 1, gridRow: 1 }}
                  >
                    {g}
                  </div>
                ))}

                {/* Row Headers (Periods 1-7) */}
                {periodos.map((p) => (
                  <div
                    key={`p-${p}`}
                    className="flex items-center justify-center rounded border border-slate-800/80 bg-slate-950 font-mono text-xs font-bold text-slate-400"
                    style={{ gridColumn: 1, gridRow: p + 1 }}
                  >
                    {p}
                  </div>
                ))}

                {/* In-Grid Hologram HUD in the Empty Center Slot (Columns 4-12, Rows 2-4) */}
                {hudElement && (
                  <div
                    className="pointer-events-none hidden lg:flex flex-col justify-between rounded-xl border border-cyan-500/20 bg-slate-950/80 p-4 shadow-inner backdrop-blur"
                    style={{
                      gridColumn: '4 / span 9',
                      gridRow: '2 / span 3',
                    }}
                  >
                    <div className="flex items-start justify-between border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-lg border font-mono font-black text-2xl text-white shadow-lg"
                          style={{
                            backgroundColor: `#${hudElement.cpk_hex_color}25`,
                            borderColor: `#${hudElement.cpk_hex_color}80`,
                          }}
                        >
                          {hudElement.symbol}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-black text-white">{hudElement.name}</h2>
                            <span className="rounded border border-cyan-400/30 bg-cyan-400/10 px-1.5 py-0.2 text-[10px] font-mono text-cyan-300">
                              Z = {hudElement.atomic_number}
                            </span>
                          </div>
                          <p className="font-mono text-xs text-slate-400 mt-0.5">
                            Masa: <strong className="text-white">{hudElement.atomic_mass} u</strong> | Config: <strong className="text-slate-300">{hudElement.electronic_configuration || 'N/D'}</strong>
                          </p>
                        </div>
                      </div>

                      <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest border border-cyan-500/30 px-2 py-0.5 rounded bg-cyan-950/40">
                        INSPECTOR HUD
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2 font-mono text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Grupo / Periodo</span>
                        <span className="font-bold text-slate-200">G{hudElement.group} / P{hudElement.period}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Estado Físico</span>
                        <span className="font-bold text-slate-200 uppercase">{hudElement.phase || 'N/D'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Punto Fusión</span>
                        <span className="font-bold text-slate-200">{hudElement.melting_point ? `${hudElement.melting_point} K (${kelvinACelsius(hudElement.melting_point)})` : 'N/D'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Electronegatividad</span>
                        <span className="font-bold text-slate-200">{hudElement.electronegativity || 'N/D'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lanthanide / Actinide labels */}
                <div
                  className="flex items-center justify-center rounded border border-rose-500/20 bg-rose-950/20 px-2 text-center font-mono text-[11px] font-bold text-rose-300"
                  style={{ gridColumn: '1 / span 3', gridRow: 10 }}
                >
                  Lantánidos (57-71)
                </div>

                <div
                  className="flex items-center justify-center rounded border border-rose-500/20 bg-rose-950/20 px-2 text-center font-mono text-[11px] font-bold text-rose-300"
                  style={{ gridColumn: '1 / span 3', gridRow: 11 }}
                >
                  Actínidos (89-103)
                </div>

                {/* Chemical Element Cells */}
                {estructuraTabla.map((pos) => {
                  const el = pos.elemento;
                  const style = getBlockStyle(el.block);
                  const isMatch = matchesFilter(el);

                  let gridRow = el.ypos + 1;
                  if (el.ypos === 8) gridRow = 10;
                  if (el.ypos === 9) gridRow = 11;

                  return (
                    <button
                      key={`${el.atomic_number}-${el.symbol}`}
                      type="button"
                      onMouseEnter={() => setHoveredElemento(el)}
                      onClick={() => setElementoSeleccionado(el)}
                      style={{
                        gridColumn: el.xpos + 1,
                        gridRow,
                      }}
                      className={[
                        'group relative flex h-full w-full flex-col justify-between rounded-lg border p-1.5 text-left font-mono transition-all duration-150',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
                        style.bg,
                        style.border,
                        style.hoverBg,
                        style.text,
                        isMatch ? 'opacity-100 shadow-sm' : 'opacity-20 grayscale pointer-events-none',
                        elementoSeleccionado?.atomic_number === el.atomic_number ? 'ring-2 ring-cyan-400 z-10 scale-105' : '',
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between text-[10px] leading-none opacity-70">
                        <span className="font-bold">{el.atomic_number}</span>
                        <span className="text-[9px] uppercase">{el.block}</span>
                      </div>

                      <div className="text-center">
                        <span className="text-lg font-black tracking-tight leading-none sm:text-xl block">
                          {el.symbol}
                        </span>
                        <span className="truncate text-[9px] font-sans font-medium opacity-80 block mt-0.5">
                          {el.name}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[8px] opacity-60 leading-none">
                        <span>{el.atomic_mass ? Math.round(Number(el.atomic_mass) || 0) : ''}</span>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          el.phase === 'gas' ? 'bg-emerald-400' : el.phase === 'liquid' ? 'bg-cyan-400' : 'bg-slate-400'
                        }`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Advanced Laboratory Element Modal / Drawer */}
      {elementoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 py-6 backdrop-blur-md">
          <div className="relative w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-950 p-6 text-white shadow-2xl max-h-[92vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setElementoSeleccionado(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition hover:bg-slate-800 hover:text-white"
              aria-label="Cerrar modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header info */}
            <div className="flex items-start gap-5 border-b border-slate-800 pb-5">
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border font-mono font-black text-3xl shadow-xl"
                style={{
                  backgroundColor: `#${elementoSeleccionado.cpk_hex_color}25`,
                  borderColor: `#${elementoSeleccionado.cpk_hex_color}90`,
                  color: '#ffffff',
                }}
              >
                {elementoSeleccionado.symbol}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-3xl font-black text-white">{elementoSeleccionado.name}</h3>
                  <span className={`rounded border px-2 py-0.5 text-xs font-mono font-bold uppercase ${getBlockStyle(elementoSeleccionado.block).badge}`}>
                    Bloque {elementoSeleccionado.block}
                  </span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-300">
                    Familia: {elementoSeleccionado.group_block || 'N/D'}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-slate-400">
                  Número Atómico: <strong className="text-white">{elementoSeleccionado.atomic_number}</strong> | Masa Atómica: <strong className="text-white">{elementoSeleccionado.atomic_mass} u</strong>
                </p>
                <p className="mt-0.5 font-mono text-xs text-slate-400">
                  Grupo {elementoSeleccionado.group || 'N/D'} | Periodo {elementoSeleccionado.period || 'N/D'} | Enlace: <strong className="text-cyan-300 capitalize">{elementoSeleccionado.bonding_type || 'N/D'}</strong>
                </p>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="mt-4 flex border-b border-slate-800 gap-2 font-mono text-xs">
              {[
                { id: 'fisica', label: 'Propiedades Físicas & Fases', icon: Thermometer },
                { id: 'cuantica', label: 'Estructura Cuántica & Bohr', icon: Zap },
                { id: 'seguridad', label: 'Seguridad NFPA 704 & Riesgos', icon: ShieldAlert },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalTab(tab.id)}
                    className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2.5 font-semibold transition ${
                      modalTab === tab.id
                        ? 'border-cyan-400 text-cyan-300'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content: Física */}
            {modalTab === 'fisica' && (
              <div className="mt-5 space-y-4 font-mono text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="text-[10px] uppercase text-slate-500 block">Punto de Fusión</span>
                    <span className="font-bold text-white block mt-1">
                      {elementoSeleccionado.melting_point ? `${elementoSeleccionado.melting_point} K (${kelvinACelsius(elementoSeleccionado.melting_point)})` : 'N/D'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="text-[10px] uppercase text-slate-500 block">Punto de Ebullición</span>
                    <span className="font-bold text-white block mt-1">
                      {elementoSeleccionado.boiling_point ? `${elementoSeleccionado.boiling_point} K (${kelvinACelsius(elementoSeleccionado.boiling_point)})` : 'N/D'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="text-[10px] uppercase text-slate-500 block">Densidad</span>
                    <span className="font-bold text-white block mt-1">
                      {elementoSeleccionado.density ? `${elementoSeleccionado.density} g/cm³` : 'N/D'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="text-[10px] uppercase text-slate-500 block">Estado Estándar (298 K)</span>
                    <span className="font-bold text-emerald-400 block mt-1 uppercase">
                      {elementoSeleccionado.standard_state || elementoSeleccionado.phase || 'N/D'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="text-[10px] uppercase text-slate-500 block">Tipo de Enlace Químico</span>
                    <span className="font-bold text-slate-200 block mt-1 capitalize">
                      {elementoSeleccionado.bonding_type || 'N/D'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="text-[10px] uppercase text-slate-500 block">Año Descubrimiento</span>
                    <span className="font-bold text-slate-200 block mt-1">
                      {elementoSeleccionado.year_discovered || 'Antigüedad'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content: Cuántica & Bohr */}
            {modalTab === 'cuantica' && (
              <div className="mt-5 space-y-4 font-mono text-xs">
                {/* Electron configuration & Orbitals */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <span className="text-[10px] uppercase text-slate-500 block">Configuración Electrónica por Orbitales</span>
                  <p className="text-sm font-bold text-cyan-300 mt-1">
                    {elementoSeleccionado.electronic_configuration || 'N/D'}
                  </p>
                </div>

                {/* Bohr Electron Shells breakdown */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <span className="text-[10px] uppercase text-slate-500 block mb-2">
                    Capas Electrónicas (Modelo de Bohr / Niveles Cuánticos n=1..7):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {capasElectronicas.map((c) => (
                      <div key={c.capa} className="rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-1.5 text-center">
                        <span className="text-[10px] text-slate-400 block">{c.capa}</span>
                        <span className="font-bold text-white text-xs">{c.electrones} e⁻</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Radii and energies */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="text-[10px] uppercase text-slate-500 block">Electronegatividad</span>
                    <span className="font-bold text-white block mt-1">{elementoSeleccionado.electronegativity || 'N/D'}</span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="text-[10px] uppercase text-slate-500 block">Radio Atómico</span>
                    <span className="font-bold text-white block mt-1">{elementoSeleccionado.atomic_radius ? `${elementoSeleccionado.atomic_radius} pm` : 'N/D'}</span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="text-[10px] uppercase text-slate-500 block">Energía Ionización</span>
                    <span className="font-bold text-white block mt-1">{elementoSeleccionado.ionization_energy ? `${elementoSeleccionado.ionization_energy} kJ/mol` : 'N/D'}</span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="text-[10px] uppercase text-slate-500 block">Afinidad Electrónica</span>
                    <span className="font-bold text-white block mt-1">{elementoSeleccionado.electron_affinity ? `${elementoSeleccionado.electron_affinity} kJ/mol` : 'N/D'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content: Seguridad & NFPA 704 */}
            {modalTab === 'seguridad' && nfpa && (
              <div className="mt-5 space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-center rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  {/* NFPA 704 Diamond Graphic */}
                  <div className="flex flex-col items-center justify-center p-2">
                    <span className="text-[10px] uppercase text-slate-400 font-bold mb-2">Diamante NFPA 704</span>
                    <div className="relative h-28 w-28 rotate-45 border-2 border-slate-600 bg-slate-950 overflow-hidden shadow-lg">
                      {/* Top: Red (Inflamabilidad) */}
                      <div className="absolute top-0 left-0 w-14 h-14 bg-red-600/80 flex items-center justify-center border border-black/40">
                        <span className="-rotate-45 text-white font-black text-sm">{nfpa.inflamabilidad}</span>
                      </div>
                      {/* Left: Blue (Salud) */}
                      <div className="absolute bottom-0 left-0 w-14 h-14 bg-blue-600/80 flex items-center justify-center border border-black/40">
                        <span className="-rotate-45 text-white font-black text-sm">{nfpa.salud}</span>
                      </div>
                      {/* Right: Yellow (Inestabilidad) */}
                      <div className="absolute top-0 right-0 w-14 h-14 bg-yellow-500/80 flex items-center justify-center border border-black/40">
                        <span className="-rotate-45 text-slate-950 font-black text-sm">{nfpa.reactividad}</span>
                      </div>
                      {/* Bottom: White (Especial) */}
                      <div className="absolute bottom-0 right-0 w-14 h-14 bg-slate-200 flex items-center justify-center border border-black/40">
                        <span
                          className="-rotate-45 text-slate-950 font-black text-[10px]"
                          dangerouslySetInnerHTML={{ __html: nfpa.especial || '—' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* NFPA Explanation */}
                  <div className="space-y-2">
                    <p className="text-slate-300">
                      <strong>Azul (Salud: {nfpa.salud}/4):</strong> {nfpa.salud >= 3 ? 'Grave peligro toxicológico o cáustico.' : 'Riesgo moderado o mínimo a la salud humana.'}
                    </p>
                    <p className="text-slate-300">
                      <strong>Rojo (Inflamabilidad: {nfpa.inflamabilidad}/4):</strong> {nfpa.inflamabilidad >= 3 ? 'Altamente inflamable / pirofórico.' : 'No arde o requiere calentamiento extremo.'}
                    </p>
                    <p className="text-slate-300">
                      <strong>Amarillo (Inestabilidad: {nfpa.reactividad}/4):</strong> {nfpa.reactividad >= 2 ? 'Inestable o susceptible de reacción violenta.' : 'Químicamente estable en reposo.'}
                    </p>
                    {nfpa.especial && (
                      <p className="text-amber-300 font-bold">
                        Riesgo Especial: {nfpa.especial === 'OX' ? 'Oxidante fuerte' : nfpa.especial.includes('W') ? 'Reacciona violentamente con agua' : nfpa.especial}
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-amber-200">
                  <p>
                    <strong>Precaución de laboratorio:</strong> Consultar la Ficha de Datos de Seguridad (FDS/MSDS) oficial antes de manipular reactivos de {elementoSeleccionado.name} concentrados.
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5">
              <Link
                to={`/elementos/${elementoSeleccionado.atomic_number}`}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-400"
              >
                <span>Abrir Ficha Permanente</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => copiarAlPortapapeles(JSON.stringify(elementoSeleccionado, null, 2))}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-mono font-semibold text-slate-200 transition hover:bg-slate-700"
              >
                {copiado ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{copiado ? 'Copiado al portapapeles' : 'Copiar Registro JSON'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Body;