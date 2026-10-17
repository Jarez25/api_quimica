import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Atom,
  ArrowLeft,
  Copy,
  CheckCircle2,
  ExternalLink,
  Layers,
  Thermometer,
  Zap,
  History,
  ShieldAlert,
  Share2,
} from 'lucide-react';
import { API_ELEMENTOS } from '../config/api';
import { calcularCapasElectronicas, calcularNFPA704, kelvinACelsius } from '../utils/chemistry';

function ElementoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [elemento, setElemento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [activeTab, setActiveTab] = useState('fisica'); // 'fisica' | 'cuantica' | 'seguridad'

  useEffect(() => {
    const ac = new AbortController();
    setCargando(true);
    setError(null);

    const isNumber = /^\d+$/.test(id);
    const targetUrl = isNumber
      ? `${API_ELEMENTOS}/atomic_number/${id}`
      : `${API_ELEMENTOS}/symbol/${id}`;

    fetch(targetUrl, { signal: ac.signal })
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
          setError('No se pudo encontrar el elemento en la base de datos de MongoDB Atlas.');
          setCargando(false);
        }
      });

    return () => ac.abort();
  }, [id]);

  const imgSrc = useMemo(() => {
    const sym = elemento?.symbol?.toLowerCase?.();
    return sym ? `https://images-of-elements.com/${sym}.jpg` : null;
  }, [elemento]);

  const capasElectronicas = useMemo(() => {
    return elemento ? calcularCapasElectronicas(elemento.atomic_number) : [];
  }, [elemento]);

  const nfpa = useMemo(() => {
    return elemento ? calcularNFPA704(elemento) : null;
  }, [elemento]);

  const copiarJson = () => {
    if (!elemento) return;
    navigator.clipboard.writeText(JSON.stringify(elemento, null, 2));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#070d18] bg-lab-pattern bg-radial-gradient text-slate-100 pb-20">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Navigation Bar */}
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/60 px-3.5 py-2 text-xs font-mono font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a la cuadrícula</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <Link to="/" className="hover:text-cyan-300">Inicio</Link>
            <span>/</span>
            <Link to="/elementos" className="hover:text-cyan-300">Elementos</Link>
            <span>/</span>
            <span className="text-cyan-400 font-bold">{elemento?.symbol || id}</span>
          </div>
        </div>

        {/* Loading State */}
        {cargando && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center backdrop-blur-xl">
            <Atom className="h-10 w-10 animate-spin text-cyan-400 mx-auto" />
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-slate-400">
              Cargando espectro y datos del elemento...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-8 text-center backdrop-blur-xl">
            <ShieldAlert className="h-8 w-8 text-rose-400 mx-auto" />
            <h3 className="mt-3 text-lg font-bold text-rose-200">Elemento no catalogado</h3>
            <p className="mt-1 text-sm text-rose-300/80 font-mono">{error}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/elementos"
                className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950"
              >
                Abrir Tabla Periódica
              </Link>
            </div>
          </div>
        )}

        {/* Element Dossier */}
        {!cargando && !error && elemento && (
          <div className="space-y-6">
            
            {/* Top Identity Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex items-center gap-5">
                  <div
                    className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border font-mono text-4xl font-black text-white shadow-xl"
                    style={{
                      backgroundColor: `#${elemento.cpk_hex_color || '80D1E3'}25`,
                      borderColor: `#${elemento.cpk_hex_color || '80D1E3'}90`,
                    }}
                  >
                    {elemento.symbol}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-3xl sm:text-4xl font-black text-white">{elemento.name}</h1>
                      <span className="rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 font-mono text-xs font-bold text-cyan-300">
                        Z = {elemento.atomic_number}
                      </span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-300">
                        Bloque {elemento.block}
                      </span>
                    </div>

                    <p className="mt-1 font-mono text-sm text-slate-400">
                      Masa Atómica: <strong className="text-white">{elemento.atomic_mass} u</strong> | Familia: <strong className="text-cyan-300">{elemento.group_block || 'N/D'}</strong>
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-mono">
                      <span className="rounded bg-slate-800 px-2.5 py-1 text-slate-300">
                        Grupo {elemento.group || 'N/D'}
                      </span>
                      <span className="rounded bg-slate-800 px-2.5 py-1 text-slate-300">
                        Periodo {elemento.period || 'N/D'}
                      </span>
                      <span className="rounded bg-slate-800 px-2.5 py-1 text-emerald-400 font-semibold uppercase">
                        {elemento.standard_state || elemento.phase || 'N/D'}
                      </span>
                      <span className="rounded bg-slate-800 px-2.5 py-1 text-slate-300 capitalize">
                        Enlace: {elemento.bonding_type || 'N/D'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex md:flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={copiarJson}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-mono font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
                  >
                    {copiado ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    <span>{copiado ? 'Copiado' : 'Copiar Registro JSON'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Split layout: Image Showcase & Tabbed Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
              
              {/* Image Sample card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl space-y-4">
                <span className="font-mono text-[10px] uppercase text-slate-400 tracking-wider block">
                  MUESTRA FÍSICA // ESPECTRO
                </span>

                <div className="aspect-square w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={elemento.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://via.placeholder.com/260?text=Sin+Muestra+Óptica';
                      }}
                      className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  ) : (
                    <span className="font-mono text-xs text-slate-600">Sin Muestra Óptica</span>
                  )}
                </div>

                <div className="text-center font-mono text-xs text-slate-400">
                  <p className="text-white font-bold">{elemento.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Símbolo: {elemento.symbol}</p>
                </div>

                {/* CPK Color preview */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-400">Color CPK IUPAC:</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-4 w-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: `#${elemento.cpk_hex_color || '80D1E3'}` }}
                    />
                    <code className="text-slate-300">#{elemento.cpk_hex_color}</code>
                  </div>
                </div>
              </div>

              {/* Tabbed Technical Content */}
              <div className="space-y-4">
                
                {/* Tab selector */}
                <div className="flex border-b border-slate-800 gap-2 font-mono text-xs">
                  {[
                    { id: 'fisica', label: 'Termodinámica & Fases', icon: Thermometer },
                    { id: 'cuantica', label: 'Estructura Cuántica & Bohr', icon: Zap },
                    { id: 'seguridad', label: 'Seguridad NFPA 704', icon: ShieldAlert },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2.5 font-semibold transition ${
                          activeTab === tab.id
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

                {/* Tab: Física & Fases */}
                {activeTab === 'fisica' && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5">
                          <span className="text-[10px] uppercase text-slate-500 block">Punto de Fusión</span>
                          <span className="font-bold text-white block mt-1">
                            {elemento.melting_point ? `${elemento.melting_point} K (${kelvinACelsius(elemento.melting_point)})` : 'N/D'}
                          </span>
                        </div>

                        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5">
                          <span className="text-[10px] uppercase text-slate-500 block">Punto de Ebullición</span>
                          <span className="font-bold text-white block mt-1">
                            {elemento.boiling_point ? `${elemento.boiling_point} K (${kelvinACelsius(elemento.boiling_point)})` : 'N/D'}
                          </span>
                        </div>

                        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5">
                          <span className="text-[10px] uppercase text-slate-500 block">Densidad</span>
                          <span className="font-bold text-white block mt-1">
                            {elemento.density ? `${elemento.density} g/cm³` : 'N/D'}
                          </span>
                        </div>

                        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5">
                          <span className="text-[10px] uppercase text-slate-500 block">Estado Físico Estándar</span>
                          <span className="font-bold text-emerald-400 block mt-1 uppercase">
                            {elemento.standard_state || elemento.phase || 'N/D'}
                          </span>
                        </div>

                        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5">
                          <span className="text-[10px] uppercase text-slate-500 block">Tipo de Enlace</span>
                          <span className="font-bold text-slate-200 block mt-1 capitalize">
                            {elemento.bonding_type || 'N/D'}
                          </span>
                        </div>

                        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5">
                          <span className="text-[10px] uppercase text-slate-500 block">Año Descubrimiento</span>
                          <span className="font-bold text-slate-200 block mt-1">
                            {elemento.year_discovered || 'Antigüedad'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Cuántica & Bohr */}
                {activeTab === 'cuantica' && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl space-y-4">
                      
                      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                        <span className="text-[10px] uppercase text-slate-500 block">Configuración Electrónica Orbital</span>
                        <p className="text-sm font-bold text-cyan-300 mt-1">
                          {elemento.electronic_configuration || 'N/D'}
                        </p>
                      </div>

                      {/* Bohr Shells */}
                      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                        <span className="text-[10px] uppercase text-slate-500 block mb-2">
                          Distribución de Electrones por Capa (Bohr n=1..7):
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

                      {/* Quantum metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                          <span className="text-[10px] uppercase text-slate-500 block">Electronegatividad</span>
                          <span className="font-bold text-white block mt-1">{elemento.electronegativity || 'N/D'}</span>
                        </div>

                        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                          <span className="text-[10px] uppercase text-slate-500 block">Radio Atómico</span>
                          <span className="font-bold text-white block mt-1">{elemento.atomic_radius ? `${elemento.atomic_radius} pm` : 'N/D'}</span>
                        </div>

                        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                          <span className="text-[10px] uppercase text-slate-500 block">Energía Ionización</span>
                          <span className="font-bold text-white block mt-1">{elemento.ionization_energy ? `${elemento.ionization_energy} kJ/mol` : 'N/D'}</span>
                        </div>

                        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                          <span className="text-[10px] uppercase text-slate-500 block">Afinidad Electrónica</span>
                          <span className="font-bold text-white block mt-1">{elemento.electron_affinity ? `${elemento.electron_affinity} kJ/mol` : 'N/D'}</span>
                        </div>

                        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 col-span-2">
                          <span className="text-[10px] uppercase text-slate-500 block">Estados de Oxidación</span>
                          <span className="font-bold text-cyan-300 block mt-1">{elemento.oxidation_states || 'N/D'}</span>
                        </div>

                        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 col-span-2">
                          <span className="text-[10px] uppercase text-slate-500 block">Radio Van der Waals</span>
                          <span className="font-bold text-white block mt-1">{elemento.van_der_waals_radius ? `${elemento.van_der_waals_radius} pm` : 'N/D'}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Tab: Seguridad NFPA 704 */}
                {activeTab === 'seguridad' && nfpa && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
                      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-center">
                        
                        {/* NFPA Diamond */}
                        <div className="flex flex-col items-center justify-center p-2">
                          <span className="text-[10px] uppercase text-slate-400 font-bold mb-2">Clasificación NFPA 704</span>
                          <div className="relative h-28 w-28 rotate-45 border-2 border-slate-600 bg-slate-950 overflow-hidden shadow-lg">
                            <div className="absolute top-0 left-0 w-14 h-14 bg-red-600/80 flex items-center justify-center border border-black/40">
                              <span className="-rotate-45 text-white font-black text-sm">{nfpa.inflamabilidad}</span>
                            </div>
                            <div className="absolute bottom-0 left-0 w-14 h-14 bg-blue-600/80 flex items-center justify-center border border-black/40">
                              <span className="-rotate-45 text-white font-black text-sm">{nfpa.salud}</span>
                            </div>
                            <div className="absolute top-0 right-0 w-14 h-14 bg-yellow-500/80 flex items-center justify-center border border-black/40">
                              <span className="-rotate-45 text-slate-950 font-black text-sm">{nfpa.reactividad}</span>
                            </div>
                            <div className="absolute bottom-0 right-0 w-14 h-14 bg-slate-200 flex items-center justify-center border border-black/40">
                              <span
                                className="-rotate-45 text-slate-950 font-black text-[10px]"
                                dangerouslySetInnerHTML={{ __html: nfpa.especial || '—' }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-2">
                          <p className="text-slate-300">
                            <strong>Azul (Riesgo Salud: {nfpa.salud}/4):</strong> {nfpa.salud >= 3 ? 'Toxicidad alta o corrosión severa de tejidos.' : 'Efectos menores o seguros bajo normas habituales.'}
                          </p>
                          <p className="text-slate-300">
                            <strong>Rojo (Inflamabilidad: {nfpa.inflamabilidad}/4):</strong> {nfpa.inflamabilidad >= 3 ? 'Gas o líquido muy inflamable a temperatura ambiente.' : 'No combustible.'}
                          </p>
                          <p className="text-slate-300">
                            <strong>Amarillo (Inestabilidad: {nfpa.reactividad}/4):</strong> {nfpa.reactividad >= 2 ? 'Posibilidad de cambio químico violento o descomposición exotérmica.' : 'Estable.'}
                          </p>
                          {nfpa.especial && (
                            <p className="text-amber-300 font-bold">
                              Riesgo Específico: {nfpa.especial === 'OX' ? 'Agente oxidante fuerte (comburente)' : nfpa.especial.includes('W') ? 'Reacciona violentamente con agua' : nfpa.especial}
                            </p>
                          )}
                        </div>

                      </div>

                      <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-amber-200">
                        <p>
                          <strong>Aviso de seguridad química:</strong> Manipular reactivos puros de {elemento.name} utilizando campana extractora y equipo de protección personal (EPI) adecuado según normativa OSHA y GHS.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}

export default ElementoDetalle;
