import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FlaskConical,
  Atom,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  X,
  Plus,
  Minus,
  RefreshCw,
  Info,
  ChevronRight,
  Activity,
  Layers,
  Thermometer,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { API_ELEMENTOS, API_MEZCLAR } from '../config/api';

function Mezclar() {
  const [elementos, setElementos] = useState([]);
  // Cada reactivo tiene { elemento: 'H', cantidad: 2 }
  const [reactivos, setReactivos] = useState([
    { elemento: 'H', cantidad: 2 },
    { elemento: 'O', cantidad: 1 },
  ]);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [procesandoIA, setProcesandoIA] = useState(false);

  const MAX_REACTIVOS = 5;
  const MIN_REACTIVOS = 2;

  useEffect(() => {
    fetch(API_ELEMENTOS)
      .then((res) => res.json())
      .then((data) => {
        const normalizados = data
          .map((el) => ({
            atomic_number: Number(el.atomic_number || el.number || 0),
            symbol: el.symbol || el.Symbol || '',
            name: el.name || el.nombre || '',
            block: el.block || 'unknown',
            group: el.group || '',
            period: el.period || '',
            cpk_hex_color: el.cpk_hex_color || 'cccccc',
          }))
          .filter((el) => el.symbol && el.atomic_number)
          .sort((a, b) => a.atomic_number - b.atomic_number);

        setElementos(normalizados);
      })
      .catch((err) => console.error('❌ Error al cargar elementos:', err))
      .finally(() => setCargando(false));
  }, []);

  const getElemento = (symbol) => {
    return elementos.find((el) => el.symbol.toLowerCase() === String(symbol).toLowerCase());
  };

  // Comparaciones estequiométricas directas sugeridas por el usuario (H2O vs HO vs H3O)
  const estudiosEstequiometricos = [
    {
      titulo: 'Serie Hidrógeno - Oxígeno (H + O)',
      opciones: [
        { label: 'H₂O (Agua Neutra)', items: [{ elemento: 'H', cantidad: 2 }, { elemento: 'O', cantidad: 1 }] },
        { label: 'HO• (Radical Hidroxilo)', items: [{ elemento: 'H', cantidad: 1 }, { elemento: 'O', cantidad: 1 }] },
        { label: 'H₃O⁺ (Ion Hidronio)', items: [{ elemento: 'H', cantidad: 3 }, { elemento: 'O', cantidad: 1 }] },
        { label: 'H₂O₂ (Peróxido de Hidrógeno)', items: [{ elemento: 'H', cantidad: 2 }, { elemento: 'O', cantidad: 2 }] },
      ],
    },
    {
      titulo: 'Serie Carbono - Oxígeno (C + O)',
      opciones: [
        { label: 'CO (Monóxido Tóxico)', items: [{ elemento: 'C', cantidad: 1 }, { elemento: 'O', cantidad: 1 }] },
        { label: 'CO₂ (Dióxido Estable)', items: [{ elemento: 'C', cantidad: 1 }, { elemento: 'O', cantidad: 2 }] },
      ],
    },
    {
      titulo: 'Serie Nitrógeno - Hidrógeno (N + H)',
      opciones: [
        { label: 'NH₃ (Amoníaco Gas)', items: [{ elemento: 'N', cantidad: 1 }, { elemento: 'H', cantidad: 3 }] },
        { label: 'NH₄⁺ (Ion Amonio Catiónico)', items: [{ elemento: 'N', cantidad: 1 }, { elemento: 'H', cantidad: 4 }] },
      ],
    },
  ];

  // Cálculo en tiempo real de la fórmula bruta ingresada
  const formulaBrutaCalculada = useMemo(() => {
    const ordenados = reactivos
      .filter((r) => r.elemento)
      .map((r) => `${r.elemento}${r.cantidad > 1 ? r.cantidad : ''}`)
      .join('');
    return ordenados || '—';
  }, [reactivos]);

  const actualizarElemento = (index, nuevoSimbolo) => {
    const copia = [...reactivos];
    copia[index].elemento = nuevoSimbolo;
    setReactivos(copia);
    setResultado(null);
  };

  const modificarCantidad = (index, delta) => {
    const copia = [...reactivos];
    const nuevaCantidad = Math.max(1, Math.min(12, copia[index].cantidad + delta));
    copia[index].cantidad = nuevaCantidad;
    setReactivos(copia);
    setResultado(null);
  };

  const agregarReactivo = () => {
    if (reactivos.length >= MAX_REACTIVOS) return;
    setReactivos([...reactivos, { elemento: '', cantidad: 1 }]);
    setResultado(null);
  };

  const quitarReactivo = (index) => {
    if (reactivos.length <= MIN_REACTIVOS) return;
    const copia = reactivos.filter((_, i) => i !== index);
    setReactivos(copia);
    setResultado(null);
  };

  const cargarEstudio = (items) => {
    setReactivos(items);
    setResultado(null);
  };

  const mezclarElementos = async () => {
    const filtrados = reactivos.filter((r) => r.elemento);

    if (filtrados.length < MIN_REACTIVOS) {
      setResultado({
        error: true,
        titulo: 'Reactivos insuficientes',
        mensaje: 'Debes seleccionar al menos dos elementos químicos distintos con sus cantidades.',
      });
      return;
    }

    try {
      setProcesandoIA(true);
      setResultado(null);

      const res = await fetch(API_MEZCLAR, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reactivos: filtrados,
          elementos: filtrados.map((r) => r.elemento),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detalle || data.error || 'Error al procesar la síntesis');
      }

      setResultado(data);
    } catch (err) {
      console.error('❌ Error al procesar la síntesis:', err);
      setResultado({
        error: true,
        titulo: 'Aviso del Servidor Químico',
        mensaje: err.message,
      });
    } finally {
      setProcesandoIA(false);
    }
  };

  const getHazardBadge = (nivel) => {
    switch (nivel?.toLowerCase()) {
      case 'alto':
      case 'extremo':
        return {
          bg: 'bg-rose-950/40 border-rose-500/50 text-rose-300',
          dot: 'bg-rose-500',
          label: 'PELIGRO ALTO / REACTIVO',
        };
      case 'medio':
        return {
          bg: 'bg-amber-950/40 border-amber-500/50 text-amber-300',
          dot: 'bg-amber-500',
          label: 'PRECAUCIÓN / MODERADO',
        };
      default:
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300',
          dot: 'bg-emerald-500',
          label: 'ESTABLE / RIESGO BAJO',
        };
    }
  };

  return (
    <main className="min-h-screen bg-[#070d18] bg-lab-pattern bg-radial-gradient text-slate-100 pb-20">
      
      {/* Top Banner */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl sm:p-10 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div className="flex items-center gap-3">
              <FlaskConical className="h-5 w-5 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest">
                CÁMARA ESTEQUIOMÉTRICA // SIMULADOR DE ESPECIES & IONES
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <span className="rounded bg-slate-800/80 px-2 py-0.5 border border-slate-700/60 text-cyan-300">
                PROPORCIÓN ESTEQUIOMÉTRICA EXACTA
              </span>
              <span className="rounded bg-slate-800/80 px-2 py-0.5 border border-slate-700/60 text-emerald-400">
                CALIBRADO IUPAC
              </span>
            </div>
          </div>

          <div className="mt-6 max-w-3xl">
            <h1 className="text-3xl font-black text-white sm:text-4xl">
              Sintetizador Estequiométrico & Análisis de Especies
            </h1>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Define cantidades atómicas exactas (ej. <strong>H:1 + O:1</strong> vs <strong>H:2 + O:1</strong> vs <strong>H:3 + O:1</strong>)
              para discernir entre moléculas neutras ($H_2O$), especies radicalarias ($HO^\bullet$) o iones poliatómicos en solución ($H_3O^+$).
            </p>
          </div>

          {/* Quick Comparative Series (H2O vs HO vs H3O) */}
          <div className="mt-6 space-y-3 pt-4 border-t border-slate-800/60">
            <span className="text-xs font-mono text-slate-400 block uppercase tracking-wider">
              Series de Estudio Comparativo (Haz clic para cargar estequiometría):
            </span>

            <div className="space-y-2">
              {estudiosEstequiometricos.map((serie) => (
                <div key={serie.titulo} className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-cyan-400/80 min-w-[200px] font-semibold">
                    {serie.titulo}:
                  </span>
                  {serie.opciones.map((op) => (
                    <button
                      key={op.label}
                      type="button"
                      onClick={() => cargarEstudio(op.items)}
                      className="rounded-lg border border-slate-700/60 bg-slate-800/70 px-2.5 py-1 text-xs font-mono font-medium text-slate-200 transition hover:border-cyan-500/50 hover:bg-slate-700 hover:text-white"
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reagent Chamber / Interactive Stoichiometric Workbench */}
      <section className="mx-auto max-w-7xl px-4 mt-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl sm:p-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-widest">
                RACK DE REACTIVOS // COEFICIENTES ATÓMICOS
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Ajusta el multiplicador numérico para deducir compuestos, iones o radicales libres.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-1.5 font-mono text-xs">
              <span className="text-slate-400">Fórmula ingresada:</span>
              <strong className="text-cyan-300 text-sm tracking-wide">{formulaBrutaCalculada}</strong>
            </div>
          </div>

          {/* Slot Grid with Multipliers */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {reactivos.map((r, idx) => {
              const elInfo = getElemento(r.elemento);

              return (
                <div
                  key={idx}
                  className="relative rounded-xl border border-slate-800 bg-slate-950/80 p-4 transition shadow-sm hover:border-slate-700"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                    <span className="font-semibold text-slate-300">Reactivo #{idx + 1}</span>
                    {reactivos.length > MIN_REACTIVOS && (
                      <button
                        type="button"
                        onClick={() => quitarReactivo(idx)}
                        className="rounded p-0.5 text-slate-500 hover:text-rose-400 transition"
                        title="Quitar reactivo"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Dropdown selector */}
                  <select
                    value={r.elemento}
                    onChange={(e) => actualizarElemento(idx, e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-mono text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="">Seleccionar elemento...</option>
                    {elementos.map((el) => (
                      <option key={el.symbol} value={el.symbol}>
                        {el.symbol} - {el.name} (Z={el.atomic_number})
                      </option>
                    ))}
                  </select>

                  {/* Stoichiometric Multiplier Stepper (- 1 +) */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                      Subíndice / Cantidad de Átomos:
                    </span>
                    
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/90 p-1">
                      <button
                        type="button"
                        onClick={() => modificarCantidad(idx, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
                        title="Reducir átomos"
                      >
                        <Minus className="h-3 w-3" />
                      </button>

                      <span className="font-mono text-sm font-black text-cyan-300 px-2">
                        × {r.cantidad}
                      </span>

                      <button
                        type="button"
                        onClick={() => modificarCantidad(idx, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
                        title="Aumentar átomos"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Element preview chip */}
                  {elInfo ? (
                    <div className="mt-3 flex items-center gap-2.5 pt-2 border-t border-slate-800/60">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 font-mono font-bold text-white shadow-inner"
                        style={{ backgroundColor: `#${elInfo.cpk_hex_color}25` }}
                      >
                        {elInfo.symbol}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">{elInfo.name}</p>
                        <p className="text-[10px] font-mono text-slate-400">
                          Bloque {elInfo.block} | G{elInfo.group}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-2 text-center text-[11px] font-mono text-slate-500">
                      Ranura disponible
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add slot button */}
            {reactivos.length < MAX_REACTIVOS && (
              <button
                type="button"
                onClick={agregarReactivo}
                className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-6 text-slate-400 transition hover:border-cyan-500/40 hover:bg-slate-900/40 hover:text-cyan-300 min-h-[170px]"
              >
                <Plus className="h-5 w-5 mb-1" />
                <span className="text-xs font-mono font-semibold">+ Añadir Elemento</span>
              </button>
            )}
          </div>

          {/* Trigger button */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-6">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>
                Resolución instantánea con catálogo termodinámico y motor molecular IA.
              </span>
            </div>

            <button
              type="button"
              disabled={procesandoIA}
              onClick={mezclarElementos}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {procesandoIA ? (
                <>
                  <Activity className="h-4 w-4 animate-spin" />
                  <span>Sintetizando Estequiometría...</span>
                </>
              ) : (
                <>
                  <FlaskConical className="h-4 w-4" />
                  <span>Analizar Estructura Molecular</span>
                </>
              )}
            </button>
          </div>

        </div>
      </section>

      {/* Results Section */}
      {resultado && (
        <section className="mx-auto max-w-7xl px-4 mt-8 sm:px-6 lg:px-8">
          {resultado.error ? (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-950/20 p-6 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-rose-200">{resultado.titulo}</h3>
                  <p className="mt-1 text-sm text-rose-300/90">{resultado.mensaje}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl sm:p-8 shadow-2xl">
              
              {/* Result Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold">
                      ESPECIE QUÍMICA DEDUCIDA // IUPAC
                    </span>
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-mono font-bold ${getHazardBadge(resultado.nivel_peligro).bg}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${getHazardBadge(resultado.nivel_peligro).dot}`} />
                      {getHazardBadge(resultado.nivel_peligro).label}
                    </span>
                  </div>

                  <h3 className="mt-2 text-3xl sm:text-4xl font-black text-white">
                    {resultado.nombre}
                  </h3>
                  
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span
                      className="text-3xl font-mono font-bold text-cyan-300"
                      dangerouslySetInnerHTML={{ __html: resultado.formula_html || resultado.resultado }}
                    />
                    <span className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 font-mono text-xs text-slate-300 font-semibold">
                      {resultado.tipo_especie || resultado.tipo}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-mono text-xs md:text-right">
                  <span className="text-slate-500 block uppercase text-[10px]">Estado Termodinámico</span>
                  <span className="font-bold text-sm text-emerald-400 block mt-0.5">
                    {resultado.estabilidad || (resultado.posible ? 'Estable' : 'Inestable')}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Origen: {resultado.origen_datos === 'catalogo_estequiometrico_calibrado' ? 'Base Local Calibrada' : 'Simulación IA'}
                  </span>
                </div>
              </div>

              {/* Comparative Contextual Analysis (Answers user requirement directly!) */}
              {resultado.comparacion_contextual && (
                <div className="mt-6 rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 font-mono text-xs text-cyan-200">
                  <div className="flex items-start gap-2.5">
                    <Info className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
                    <div>
                      <strong className="block text-cyan-300 font-bold uppercase text-[11px]">
                        Estudio Comparativo de Estequiometría & Enlace
                      </strong>
                      <p className="mt-1 leading-relaxed opacity-95">
                        {resultado.comparacion_contextual}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Physical-chemical Description */}
              <div className="mt-6">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Análisis Físicoquímico Detallado
                </h4>
                <p className="mt-2 text-sm text-slate-200 leading-relaxed max-w-4xl">
                  {resultado.descripcion}
                </p>
              </div>

              {/* Physical Chemistry Metrics Bento */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                  <span className="text-[10px] uppercase text-slate-500 block">Geometría Molecular</span>
                  <p className="mt-1 font-bold text-white text-sm">
                    {resultado.geometria_molecular || 'Diatómica / Lineal'}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                  <span className="text-[10px] uppercase text-slate-500 block">Momento Dipolar</span>
                  <p className="mt-1 font-bold text-cyan-300 text-sm">
                    {resultado.momento_dipolar || 'En estudio'}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                  <span className="text-[10px] uppercase text-slate-500 block">Entalpía de Formación (ΔH°f)</span>
                  <p className="mt-1 font-bold text-emerald-400 text-sm">
                    {resultado.entalpia_formacion || 'Exotérmica'}
                  </p>
                </div>
              </div>

              {/* Stoichiometric Atom Count Table */}
              {resultado.componentes?.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                    Composición Estequiométrica (Átomos en la Fórmula)
                  </h4>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {resultado.componentes.map((c, i) => (
                      <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 font-mono">
                        <div className="flex items-center justify-between text-cyan-400">
                          <span className="text-lg font-bold">{c.elemento}</span>
                          <span className="text-xs rounded bg-slate-800 px-2 py-0.5 text-white font-bold">
                            × {c.cantidad} átomos
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400 truncate">{c.nombre}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety & Hazards Warning */}
              {resultado.advertencia_seguridad && (
                <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 font-mono text-xs text-amber-200">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                    <div>
                      <strong className="block text-amber-300 font-bold uppercase text-[11px]">
                        Protocolo de Manejo Seguro en Laboratorio
                      </strong>
                      <p className="mt-1 opacity-90 leading-relaxed">
                        {resultado.advertencia_seguridad}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Specific Risks List */}
              {resultado.riesgos?.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 mr-1">Riesgos Clasificados:</span>
                  {resultado.riesgos.map((r, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg border border-rose-500/30 bg-rose-950/30 px-2.5 py-1 text-xs font-mono text-rose-300"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              )}

            </div>
          )}
        </section>
      )}

    </main>
  );
}

export default Mezclar;