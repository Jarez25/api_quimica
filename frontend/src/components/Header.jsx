import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './App.css';

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const toggleMenu = () => setMenuAbierto((v) => !v);

  const linkBase =
    "relative px-2 py-1 border-b-2 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded";
  const getLinkClass = ({ isActive }) =>
    `${linkBase} ${
      isActive
        ? "text-white border-sky-400"
        : "text-slate-300 border-transparent hover:text-white hover:border-slate-500"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-sky-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-semibold tracking-tight text-slate-100">
              QUIMICAPP
            </span>
          </Link>

          {/* Navegación escritorio */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={getLinkClass} end>
              INICIO
            </NavLink>
            <NavLink to="/elementos" className={getLinkClass}>
              ELEMENTOS
            </NavLink>
            <NavLink to="/mezclar" className={getLinkClass}>
              MEZCLAR
            </NavLink>
            <NavLink to="/documentacion" className={getLinkClass}>
              DOCUMENTACIÓN
            </NavLink>
          </nav>

          {/* Botón menú móvil */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded border border-slate-700 text-slate-200 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            onClick={toggleMenu}
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={menuAbierto ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div id="menu-movil" className="md:hidden border-t border-slate-800 bg-slate-900">
          <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-1">
            <NavLink
              to="/"
              end
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                `block px-2 py-2 rounded border ${
                  isActive
                    ? "text-sky-300 border-sky-500 bg-slate-800"
                    : "text-slate-200 border-transparent hover:bg-slate-800"
                }`
              }
            >
              INICIO
            </NavLink>
            <NavLink
              to="/elementos"
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                `block px-2 py-2 rounded border ${
                  isActive
                    ? "text-sky-300 border-sky-500 bg-slate-800"
                    : "text-slate-200 border-transparent hover:bg-slate-800"
                }`
              }
            >
              ELEMENTOS
            </NavLink>
            <NavLink
              to="/mezclar"
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                `block px-2 py-2 rounded border ${
                  isActive
                    ? "text-sky-300 border-sky-500 bg-slate-800"
                    : "text-slate-200 border-transparent hover:bg-slate-800"
                }`
              }
            >
              MEZCLAR
            </NavLink>
            <NavLink
              to="/documentacion"
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                `block px-2 py-2 rounded border ${
                  isActive
                    ? "text-sky-300 border-sky-500 bg-slate-800"
                    : "text-slate-200 border-transparent hover:bg-slate-800"
                }`
              }
            >
              DOCUMENTACIÓN
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
