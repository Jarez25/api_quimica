import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './App.css';

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => setMenuAbierto((v) => !v);
  const cerrarMenu = () => setMenuAbierto(false);

  const links = [
    {
      to: '/',
      label: 'Inicio',
      end: true,
    },
    {
      to: '/elementos',
      label: 'Elementos',
    },
    {
      to: '/mezclar',
      label: 'Mezclar',
    },
    {
      to: '/documentacion',
      label: 'Documentación',
    },
  ];

  const getDesktopLinkClass = ({ isActive }) =>
    [
      'relative rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
      isActive
        ? 'bg-cyan-400/15 text-cyan-200 shadow-sm shadow-cyan-500/10'
        : 'text-slate-300 hover:bg-white/10 hover:text-white',
    ].join(' ');

  const getMobileLinkClass = ({ isActive }) =>
    [
      'flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-bold transition-all',
      isActive
        ? 'border-cyan-400/40 bg-cyan-400/15 text-cyan-200'
        : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10',
    ].join(' ');

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/90 text-white shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            onClick={cerrarMenu}
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 shadow-lg shadow-cyan-500/10 transition group-hover:bg-cyan-400/15">
              <svg
                className="h-7 w-7 text-cyan-300"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="32" r="4" fill="currentColor" />
                <ellipse
                  cx="32"
                  cy="32"
                  rx="24"
                  ry="9"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <ellipse
                  cx="32"
                  cy="32"
                  rx="24"
                  ry="9"
                  stroke="currentColor"
                  strokeWidth="3"
                  transform="rotate(60 32 32)"
                />
                <ellipse
                  cx="32"
                  cy="32"
                  rx="24"
                  ry="9"
                  stroke="currentColor"
                  strokeWidth="3"
                  transform="rotate(120 32 32)"
                />
              </svg>

              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
            </div>

            <div className="leading-tight">
              <span className="block text-base font-black tracking-tight text-white">
                QUIMICAPP
              </span>
              <span className="hidden text-xs font-semibold text-slate-400 sm:block">
                API de elementos químicos
              </span>
            </div>
          </Link>

          {/* Navegación escritorio */}
          <nav className="hidden items-center gap-2 md:flex">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={getDesktopLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Acciones escritorio */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/elementos"
              className="rounded-2xl bg-cyan-500 px-5 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
            >
              Ver tabla
            </Link>
          </div>

          {/* Botón menú móvil */}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 md:hidden"
            onClick={toggleMenu}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  menuAbierto
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 7h16M4 12h16M4 17h16'
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        id="menu-movil"
        className={[
          'overflow-hidden border-t border-white/10 bg-[#07111f]/95 backdrop-blur-xl transition-all duration-300 md:hidden',
          menuAbierto ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6 lg:px-8">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={cerrarMenu}
              className={getMobileLinkClass}
            >
              <span>{item.label}</span>
              <span className="text-slate-500">›</span>
            </NavLink>
          ))}

          <Link
            to="/elementos"
            onClick={cerrarMenu}
            className="mt-2 flex items-center justify-center rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-400"
          >
            Abrir tabla periódica
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;