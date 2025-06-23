import { useState } from 'react'
import './App.css'

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto)
  }

  return (
    <>
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow-md relative z-50">
        {/* Logo (ícono de átomo) */}
        <a href="#" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0zm9-9v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414-1.414m0-9.192l1.414 1.414M17.95 17.95l-1.414-1.414M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
          </svg>
        </a>

        {/* Navegación en pantallas grandes */}
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-700 hover:text-blue-700 transition">Inicio</a>
          <a href="#" className="text-gray-700 hover:text-blue-700 transition">Elementos</a>
          <a href="#" className="text-gray-700 hover:text-blue-700 transition">Mezclar</a>
        </nav>

        {/* Botón hamburguesa */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={menuAbierto ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Menú móvil */}
        {menuAbierto && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden z-40">
            <nav className="flex flex-col items-start p-4 space-y-2">
              <a href="#" className="text-gray-700 hover:text-blue-700 transition w-full">Inicio</a>
              <a href="#" className="text-gray-700 hover:text-blue-700 transition w-full">Elementos</a>
              <a href="#" className="text-gray-700 hover:text-blue-700 transition w-full">Mezclar</a>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}

export default Header
