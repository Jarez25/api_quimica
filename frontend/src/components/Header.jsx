import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Atom,
  FlaskConical,
  LayoutDashboard,
  FileCode2,
  Menu,
  X,
  Activity,
  Database,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { API_DOCS, API_BASE_URL } from '../config/api';

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [apiOnline, setApiOnline] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Healthcheck ping
    fetch(`${API_BASE_URL}/health`)
      .then((res) => {
        if (res.ok) setApiOnline(true);
        else setApiOnline(false);
      })
      .catch(() => setApiOnline(false));
  }, [location.pathname]);

  const toggleMenu = () => setMenuAbierto((v) => !v);
  const cerrarMenu = () => setMenuAbierto(false);

  const navItems = [
    {
      to: '/',
      label: 'Plataforma & API',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/elementos',
      label: 'Tabla Periódica',
      icon: Atom,
    },
    {
      to: '/mezclar',
      label: 'Sintetizador Molecular',
      icon: FlaskConical,
      badge: 'IA',
    },
  ];

  const getDesktopLinkClass = ({ isActive }) =>
    [
      'group relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold tracking-wide transition-all duration-150',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
      isActive
        ? 'bg-slate-800/90 text-cyan-300 shadow-sm border border-cyan-500/30'
        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent',
    ].join(' ');

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070d18]/90 text-white backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Brand Identity / Laboratory Logo */}
          <Link
            to="/"
            onClick={cerrarMenu}
            className="group flex items-center gap-3 transition-opacity hover:opacity-95"
            aria-label="CHEMLAB - Ir al Inicio"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/70 via-slate-900 to-slate-950 shadow-inner shadow-cyan-500/10 transition group-hover:border-cyan-400/50">
              <Atom className="h-5 w-5 text-cyan-400 transition-transform duration-300 group-hover:rotate-45" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${apiOnline ? 'animate-ping bg-emerald-400' : 'bg-rose-400'}`} />
                <span className={`relative inline-flex h-2 w-2 rounded-full ${apiOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              </span>
            </div>

            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-black tracking-wider text-slate-100">
                  CHEM<span className="text-cyan-400">LAB</span>
                </span>
                <span className="rounded border border-slate-700/60 bg-slate-800/50 px-1.5 py-0.2 text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest">
                  v2.0
                </span>
              </div>
              <span className="hidden font-mono text-[11px] text-slate-400 sm:block tracking-tight">
                Investigación & Inteligencia Química
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden items-center gap-1.5 md:flex" aria-label="Navegación principal">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={getDesktopLinkClass}
                >
                  <Icon className="h-4 w-4 opacity-75 group-hover:opacity-100 text-cyan-400" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="rounded border border-cyan-400/30 bg-cyan-400/10 px-1 py-0.2 text-[9px] font-bold font-mono text-cyan-300">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right System Telemetry & External Docs */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Database status pill */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 font-mono text-xs text-slate-300 shadow-sm">
              <Database className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-[11px] text-slate-400">DB:</span>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                ATLAS
              </span>
            </div>

            {/* Swagger Documentation CTA */}
            <a
              href={API_DOCS}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-500/40 hover:bg-slate-700/80 hover:text-white"
            >
              <FileCode2 className="h-3.5 w-3.5 text-cyan-400" />
              <span>Swagger UI</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-200 transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 md:hidden"
            onClick={toggleMenu}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
          >
            {menuAbierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuAbierto && (
        <div className="border-t border-slate-800 bg-[#070d18] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={cerrarMenu}
                  className={({ isActive }) =>
                    [
                      'flex items-center justify-between rounded-lg border px-3.5 py-3 text-sm font-semibold transition',
                      isActive
                        ? 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300'
                        : 'border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800/60',
                    ].join(' ')
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-cyan-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="rounded border border-cyan-400/30 bg-cyan-400/10 px-1.5 py-0.5 text-[10px] font-bold font-mono text-cyan-300">
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  )}
                </NavLink>
              );
            })}

            <div className="mt-2 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
              <a
                href={API_DOCS}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-800/80 px-3.5 py-2.5 text-xs font-semibold text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <FileCode2 className="h-4 w-4 text-cyan-400" />
                  <span>Documentación Swagger OpenAPI</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>

              <div className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/60 px-3.5 py-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-cyan-400" />
                  <span>MongoDB Atlas</span>
                </span>
                <span className="text-emerald-400 font-bold">118 Elementos OK</span>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;