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
  Satellite,
  Flame,
  ChevronLeft,
  ChevronRight,
  Eye,
  Activity,
  FileText,
  Compass,
  Code2,
  Info,
} from 'lucide-react';
import { API_ELEMENTOS } from '../config/api';
import { calcularCapasElectronicas, calcularNFPA704, kelvinACelsius } from '../utils/chemistry';
import EspectroAtomo from './EspectroAtomo';

function ElementoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [elemento, setElemento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [enlaceCopiado, setEnlaceCopiado] = useState(false);

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

  const copiarEnlace = () => {
    navigator.clipboard.writeText(window.location.href);
    setEnlaceCopiado(true);
    setTimeout(() => setEnlaceCopiado(false), 2000);
  };

  const atomicNum = Number(elemento?.atomic_number) || 0;
  const prevZ = atomicNum > 1 ? atomicNum - 1 : null;
  const nextZ = atomicNum < 118 ? atomicNum + 1 : null;

  return (
    <main className="min-h-screen bg-[#070d18] bg-lab-pattern bg-radial-gradient text-slate-100 pb-24">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/elementos')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/60 px-3.5 py-2 text-xs font-mono font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Tabla Periódica</span>
            </button>

            {/* Prev / Next Element Quick Switchers */}
            {prevZ && (
              <button
                type="button"
                onClick={() => navigate(`/elementos/${prevZ}`)}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-2 text-xs font-mono text-slate-400 transition hover:bg-slate-800 hover:text-cyan-300"
                title={`Elemento anterior Z=${prevZ}`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden md:inline">Z={prevZ}</span>
              </button>
            )}

            {nextZ && (
              <button
                type="button"
                onClick={() => navigate(`/elementos/${nextZ}`)}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-2 text-xs font-mono text-slate-400 transition hover:bg-slate-800 hover:text-cyan-300"
                title={`Siguiente elemento Z=${nextZ}`}
              >
                <span className="hidden md:inline">Z={nextZ}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <Link to="/" className="hover:text-cyan-300">Inicio</Link>
            <span>/</span>
            <Link to="/elementos" className="hover:text-cyan-300">Elementos</Link>
            <span>/</span>
            <span className="text-cyan-400 font-bold">{elemento?.name || id} ({elemento?.symbol || '...'})</span>
          </div>
        </div>

        {/* Loading State */}
        {cargando && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-16 text-center backdrop-blur-xl">
            <Atom className="h-12 w-12 animate-spin text-cyan-400 mx-auto" />
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-slate-400">
              Consultando espectro, termodinámica y registro de laboratorio en MongoDB Atlas...
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
                className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
              >
                Abrir Tabla Periódica
              </Link>
            </div>
          </div>
        )}

        {/* FULL INTEGRAL DOSSIER */}
        {!cargando && !error && elemento && (
          <div className="space-y-8">
            
            {/* HERO EXECUTIVE CARD */}
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-[#0a1120] to-slate-950 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
              {/* Subtle CPK Ambient Glow */}
              <div
                className="absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: `#${elemento.cpk_hex_color || '06b6d4'}` }}
              />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Element Badge & Primary Titles */}
                <div className="flex items-start sm:items-center gap-5">
                  <div
                    className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-2xl border-2 font-mono text-white shadow-2xl transition hover:scale-105 duration-300"
                    style={{
                      backgroundColor: `#${elemento.cpk_hex_color || '80D1E3'}25`,
                      borderColor: `#${elemento.cpk_hex_color || '80D1E3'}`,
                      boxShadow: `0 0 35px #${elemento.cpk_hex_color || '06b6d4'}30`,
                    }}
                  >
                    <span className="text-[11px] font-bold opacity-80">{elemento.atomic_number}</span>
                    <span className="text-4xl sm:text-5xl font-black tracking-tight">{elemento.symbol}</span>
                    <span className="text-[9px] uppercase tracking-wider opacity-75">{elemento.block}</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{elemento.name}</h1>
                      <span className="rounded-md border border-cyan-400/40 bg-cyan-400/10 px-2.5 py-0.5 font-mono text-xs font-bold text-cyan-300">
                        Z = {elemento.atomic_number}
                      </span>
                      <span className="rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 font-mono text-xs text-purple-300 font-semibold">
                        Bloque {elemento.block}
                      </span>
                    </div>

                    <p className="font-mono text-sm text-slate-300">
                      Masa Atómica: <strong className="text-white">{elemento.atomic_mass} u</strong> | Familia: <strong className="text-cyan-300">{elemento.group_block || 'N/D'}</strong>
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs font-mono pt-1">
                      <span className="rounded-lg border border-slate-700/60 bg-slate-800/80 px-2.5 py-1 text-slate-300">
                        Grupo {elemento.group || 'N/D'}
                      </span>
                      <span className="rounded-lg border border-slate-700/60 bg-slate-800/80 px-2.5 py-1 text-slate-300">
                        Periodo {elemento.period || 'N/D'}
                      </span>
                      <span className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-1 text-emerald-300 font-semibold uppercase">
                        {elemento.standard_state || elemento.phase || 'N/D'}
                      </span>
                      <span className="rounded-lg border border-slate-700/60 bg-slate-800/80 px-2.5 py-1 text-slate-300 capitalize">
                        Enlace: {elemento.bonding_type || 'N/D'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Header */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={copiarJson}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-mono font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white shadow"
                  >
                    {copiado ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    <span>{copiado ? 'Registro Copiado' : 'Copiar JSON'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={copiarEnlace}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-mono text-slate-400 transition hover:bg-slate-800 hover:text-cyan-300"
                  >
                    {enlaceCopiado ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
                    <span>{enlaceCopiado ? 'Enlace Copiado' : 'Compartir'}</span>
                  </button>
                </div>

              </div>

              {/* QUICK JUMP ANCHOR PILLS */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold mr-1">
                  SECCIONES DEL DOSSIER:
                </span>
                <a
                  href="#espectroscopia-optica"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-cyan-300 hover:bg-cyan-900/50 transition"
                >
                  <Satellite className="h-3 w-3" />
                  <span>Espectroscopía & Llama</span>
                </a>
                <a
                  href="#estructura-cuantica"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-purple-300 hover:bg-purple-900/50 transition"
                >
                  <Zap className="h-3 w-3" />
                  <span>Cuántica & Bohr</span>
                </a>
                <a
                  href="#termodinamica-fases"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-950/40 px-3 py-1 text-blue-300 hover:bg-blue-900/50 transition"
                >
                  <Thermometer className="h-3 w-3" />
                  <span>Termodinámica</span>
                </a>
                <a
                  href="#seguridad-laboratorio"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-amber-300 hover:bg-amber-900/50 transition"
                >
                  <ShieldAlert className="h-3 w-3" />
                  <span>Seguridad NFPA 704</span>
                </a>
                <a
                  href="#datos-api"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1 text-slate-300 hover:bg-slate-700 transition"
                >
                  <Code2 className="h-3 w-3" />
                  <span>API REST</span>
                </a>
              </div>
            </div>

            {/* SECCIÓN 1: ESPECTROSCOPÍA ATÓMICA SATELITAL & ENSAYO A LA LLAMA */}
            <section id="espectroscopia-optica" className="scroll-mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Satellite className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-mono tracking-wide">
                    1. ÓPTICA CUÁNTICA, ESPECTROMETRÍA SATELITAL & ENSAYO A LA LLAMA
                  </h2>
                  <p className="text-xs text-slate-400">
                    Firma electromagnética de {elemento.name}: franjas de emisión de red de difracción, ensayo a la llama Bunsen y muestra física real.
                  </p>
                </div>
              </div>

              {/* Comprehensive Optics & Spectroscopy Module */}
              <EspectroAtomo elemento={elemento} />
            </section>

            {/* SECCIÓN 2: ESTRUCTURA CUÁNTICA & MODELO DE BOHR */}
            <section id="estructura-cuantica" className="scroll-mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-mono tracking-wide">
                    2. ESTRUCTURA CUÁNTICA & MODELO DE CAPAS DE BOHR
                  </h2>
                  <p className="text-xs text-slate-400">
                    Configuración orbital, distribución energética en niveles cuánticos principales (n=1..7) y afinidades electrónicas.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl space-y-5">
                
                {/* Electronic Configuration Banner */}
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-bold block">
                        CONFIGURACIÓN ELECTRÓNICA ORBITAL
                      </span>
                      <p className="text-base sm:text-lg font-mono font-black text-white mt-0.5">
                        {elemento.electronic_configuration || 'N/D'}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800">
                      Electrones totales: <strong className="text-cyan-300">{elemento.atomic_number} e⁻</strong>
                    </span>
                  </div>
                </div>

                {/* Bohr Shell Distribution */}
                <div>
                  <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-3">
                    DISTRIBUCIÓN CUÁNTICA POR CAPAS DE BOHR (n = 1 a 7):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                    {capasElectronicas.map((c) => (
                      <div
                        key={c.capa}
                        className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3 text-center transition hover:border-purple-500/60"
                      >
                        <span className="text-[10px] font-mono text-purple-300 font-bold block uppercase">
                          {c.capa}
                        </span>
                        <span className="text-lg font-mono font-black text-white block mt-0.5">
                          {c.electrones}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 block">electrones</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quantum Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 font-mono">
                    <span className="text-[10px] uppercase text-slate-500 block">Electronegatividad (Pauling)</span>
                    <span className="text-base font-bold text-white block mt-1">{elemento.electronegativity || 'N/D'}</span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 font-mono">
                    <span className="text-[10px] uppercase text-slate-500 block">Radio Atómico</span>
                    <span className="text-base font-bold text-white block mt-1">
                      {elemento.atomic_radius ? `${elemento.atomic_radius} pm` : 'N/D'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 font-mono">
                    <span className="text-[10px] uppercase text-slate-500 block">1ª Energía de Ionización</span>
                    <span className="text-base font-bold text-white block mt-1">
                      {elemento.ionization_energy ? `${elemento.ionization_energy} kJ/mol` : 'N/D'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 font-mono">
                    <span className="text-[10px] uppercase text-slate-500 block">Afinidad Electrónica</span>
                    <span className="text-base font-bold text-white block mt-1">
                      {elemento.electron_affinity ? `${elemento.electron_affinity} kJ/mol` : 'N/D'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 font-mono col-span-2">
                    <span className="text-[10px] uppercase text-slate-500 block">Estados de Oxidación Comunes</span>
                    <span className="text-base font-bold text-cyan-300 block mt-1">
                      {elemento.oxidation_states || 'N/D'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 font-mono">
                    <span className="text-[10px] uppercase text-slate-500 block">Radio Van der Waals</span>
                    <span className="text-base font-bold text-white block mt-1">
                      {elemento.van_der_waals_radius ? `${elemento.van_der_waals_radius} pm` : 'N/D'}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 font-mono">
                    <span className="text-[10px] uppercase text-slate-500 block">Radio Iónico</span>
                    <span className="text-base font-bold text-white block mt-1">
                      {elemento.ion_radius || 'N/D'}
                    </span>
                  </div>
                </div>

              </div>
            </section>

            {/* SECCIÓN 3: TERMODINÁMICA & FASES FÍSICAS */}
            <section id="termodinamica-fases" className="scroll-mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <Thermometer className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-mono tracking-wide">
                    3. TERMODINÁMICA, FASES & PROPIEDADES MACROSCÓPICAS
                  </h2>
                  <p className="text-xs text-slate-400">
                    Comportamiento térmico, puntos críticos de cambio de estado y densidad a 298.15 K (1 atm).
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl space-y-4 font-mono">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                    <span className="text-[10px] uppercase text-slate-500 block">Punto de Fusión</span>
                    <span className="text-sm font-bold text-white block mt-1">
                      {elemento.melting_point ? `${elemento.melting_point} K` : 'N/D'}
                    </span>
                    <span className="text-xs text-cyan-400 block mt-0.5">
                      {kelvinACelsius(elemento.melting_point)}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                    <span className="text-[10px] uppercase text-slate-500 block">Punto de Ebullición</span>
                    <span className="text-sm font-bold text-white block mt-1">
                      {elemento.boiling_point ? `${elemento.boiling_point} K` : 'N/D'}
                    </span>
                    <span className="text-xs text-rose-400 block mt-0.5">
                      {kelvinACelsius(elemento.boiling_point)}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                    <span className="text-[10px] uppercase text-slate-500 block">Densidad Estándar</span>
                    <span className="text-sm font-bold text-white block mt-1">
                      {elemento.density ? `${elemento.density} g/cm³` : 'N/D'}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">a 20 °C</span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                    <span className="text-[10px] uppercase text-slate-500 block">Fase Estándar (STP)</span>
                    <span className="text-sm font-bold text-emerald-400 block mt-1 uppercase">
                      {elemento.standard_state || elemento.phase || 'N/D'}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">101.3 kPa</span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                    <span className="text-[10px] uppercase text-slate-500 block">Tipo de Enlace</span>
                    <span className="text-sm font-bold text-slate-200 block mt-1 capitalize">
                      {elemento.bonding_type || 'N/D'}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">red atómica</span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                    <span className="text-[10px] uppercase text-slate-500 block">Año Descubrimiento</span>
                    <span className="text-sm font-bold text-amber-300 block mt-1">
                      {elemento.year_discovered || 'Antigüedad'}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">registro histórico</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECCIÓN 4: SEGURIDAD QUÍMICA & MATRIZ NFPA 704 */}
            <section id="seguridad-laboratorio" className="scroll-mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-mono tracking-wide">
                    4. SEGURIDAD DE LABORATORIO & ROMBO NFPA 704
                  </h2>
                  <p className="text-xs text-slate-400">
                    Matriz de riesgos estandarizada NFPA (National Fire Protection Association) y precauciones para reactivos puros.
                  </p>
                </div>
              </div>

              {nfpa && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl font-mono text-xs space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-center">
                    
                    {/* NFPA 704 Diamond Graphic */}
                    <div className="flex flex-col items-center justify-center p-3">
                      <span className="text-[10px] uppercase text-slate-400 font-bold mb-3">
                        DIAMANTE DE RIESGO NFPA 704
                      </span>
                      <div className="relative h-32 w-32 rotate-45 border-2 border-slate-600 bg-slate-950 overflow-hidden shadow-2xl">
                        {/* Red: Flammability */}
                        <div className="absolute top-0 left-0 w-16 h-16 bg-red-600/90 flex items-center justify-center border border-black/40">
                          <span className="-rotate-45 text-white font-black text-lg">{nfpa.inflamabilidad}</span>
                        </div>
                        {/* Blue: Health */}
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-600/90 flex items-center justify-center border border-black/40">
                          <span className="-rotate-45 text-white font-black text-lg">{nfpa.salud}</span>
                        </div>
                        {/* Yellow: Instability */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-400/90 flex items-center justify-center border border-black/40">
                          <span className="-rotate-45 text-slate-950 font-black text-lg">{nfpa.reactividad}</span>
                        </div>
                        {/* White: Special Hazard */}
                        <div className="absolute bottom-0 right-0 w-16 h-16 bg-slate-100 flex items-center justify-center border border-black/40">
                          <span
                            className="-rotate-45 text-slate-950 font-black text-xs"
                            dangerouslySetInnerHTML={{ __html: nfpa.especial || '—' }}
                          />
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-500 mt-3 text-center">
                        Escala estándar de 0 (nulo) a 4 (extremo)
                      </span>
                    </div>

                    {/* Breakdown & Hazards */}
                    <div className="space-y-3">
                      <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-3.5">
                        <strong className="text-blue-300 block mb-0.5">
                          🔵 Riesgo a la Salud: {nfpa.salud} de 4
                        </strong>
                        <p className="text-slate-300 text-xs">
                          {nfpa.salud >= 3
                            ? 'Peligro severo: Muy tóxico o corrosivo. Su inhalación o contacto puede causar daños biológicos graves.'
                            : nfpa.salud >= 2
                            ? 'Peligro moderado: Puede causar irritación o efectos nocivos temporales.'
                            : 'Riesgo bajo o nulo bajo condiciones de laboratorio ordinarias.'}
                        </p>
                      </div>

                      <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-3.5">
                        <strong className="text-red-300 block mb-0.5">
                          🔴 Inflamabilidad: {nfpa.inflamabilidad} de 4
                        </strong>
                        <p className="text-slate-300 text-xs">
                          {nfpa.inflamabilidad >= 3
                            ? 'Extremadamente inflamable: Puede encenderse espontáneamente en aire o a temperatura ambiente.'
                            : nfpa.inflamabilidad >= 1
                            ? 'Combustible si se expone a fuentes intensas de calor o llama directa.'
                            : 'No combustible bajo condiciones habituales.'}
                        </p>
                      </div>

                      <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3.5">
                        <strong className="text-amber-300 block mb-0.5">
                          🟡 Inestabilidad / Reactividad: {nfpa.reactividad} de 4
                        </strong>
                        <p className="text-slate-300 text-xs">
                          {nfpa.reactividad >= 2
                            ? 'Químicamente violento: Capaz de descomposición exotérmica rápida, choque o reacción violenta.'
                            : 'Químicamente estable en reposo ordinario.'}
                        </p>
                      </div>

                      {nfpa.especial && (
                        <div className="rounded-xl border border-purple-500/30 bg-purple-950/30 p-3.5">
                          <strong className="text-purple-300 block mb-0.5">
                            ⚪ Riesgo Específico Adicional:
                          </strong>
                          <p className="text-white font-bold text-xs">
                            {nfpa.especial === 'OX'
                              ? 'OX (Agente Oxidante Fuerte / Comburente): Acelera violentamente la combustión de otras materias.'
                              : nfpa.especial.includes('W')
                              ? '<s>W</s> (Reactivo con Agua): Reacciona de forma peligrosa o explosiva al entrar en contacto con humedad o agua.'
                              : nfpa.especial === 'RAD'
                              ? 'RAD (Material Radiactivo): Emisor de radiación ionizante alfa, beta o gamma.'
                              : nfpa.especial}
                          </p>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Laboratory Protocol Banner */}
                  <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-4 text-amber-200">
                    <p className="leading-relaxed">
                      <strong>⚠️ Protocolo de Seguridad Química:</strong> La manipulación de muestras puras o reactivos de <strong>{elemento.name}</strong> debe realizarse en campana extractora certificada, portando guantes de nitrilo/neopreno, gafas de protección hermética y bata antiestática de laboratorio bajo lineamientos de la normativa OSHA y GHS.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* SECCIÓN 5: REGISTRO TÉCNICO & ACCESO A LA API REST */}
            <section id="datos-api" className="scroll-mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                  <Code2 className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-mono tracking-wide">
                    5. REGISTRO TÉCNICO JSON & ACCESO A LA API REST
                  </h2>
                  <p className="text-xs text-slate-400">
                    Datos sin procesar consumidos en tiempo real desde la colección de MongoDB Atlas para desarrolladores.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 font-mono text-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    ENDPOINT: <code className="text-cyan-400 font-bold">GET /api/elementos/symbol/{elemento.symbol}</code>
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={copiarJson}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 transition"
                    >
                      {copiado ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiado ? 'Copiado' : 'Copiar JSON'}</span>
                    </button>
                    
                    <a
                      href={`${API_ELEMENTOS}/symbol/${elemento.symbol}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 transition"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Abrir JSON Crudo</span>
                    </a>
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-900 bg-[#030712] p-4 text-slate-300">
                  <pre className="text-[11px] leading-relaxed">
                    {JSON.stringify(elemento, null, 2)}
                  </pre>
                </div>
              </div>
            </section>

          </div>
        )}

      </div>
    </main>
  );
}

export default ElementoDetalle;
