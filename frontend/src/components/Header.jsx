import { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-gray-900 to-slate-800 text-cyan-300 px-6 py-4 shadow-lg font-mono relative z-50 border-b border-cyan-500">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        {/* Icono tipo átomo */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="hidden md:inline text-sm tracking-widest">QUIMICAPP</span>
      </Link>

      {/* Navegación para escritorio */}
      <nav className="hidden md:flex space-x-6 text-sm">
        <Link to="/" className="hover:text-cyan-100 transition">> INICIO</Link>
        <Link to="/elementos" className="hover:text-cyan-100 transition">> ELEMENTOS</Link>
        <Link to="/mezclar" className="hover:text-cyan-100 transition">> MEZCLAR</Link>
        <Link to="/documentacion" className="hover:text-cyan-100 transition">> DOCUMENTACIÓN</Link>
      </nav>

      {/* Menú hamburguesa en móvil */}
      <button
        className="md:hidden text-cyan-300 focus:outline-none"
        onClick={toggleMenu}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d={menuAbierto ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="absolute top-full left-0 w-full bg-gray-900 border-t border-cyan-500 shadow-md md:hidden z-40">
          <nav className="flex flex-col items-start p-4 space-y-2 text-sm text-cyan-200">
            <Link to="/" className="hover:text-cyan-100 transition w-full">> INICIO</Link>
            <Link to="/elementos" className="hover:text-cyan-100 transition w-full">> ELEMENTOS</Link>
            <Link to="/mezclar" className="hover:text-cyan-100 transition w-full">> MEZCLAR</Link>
            <Link to="/documentacion" className="hover:text-cyan-100 transition w-full">> DOCUMENTACIÓN</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
