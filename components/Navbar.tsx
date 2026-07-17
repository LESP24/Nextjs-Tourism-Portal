'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GoogleTranslate from './GoogleTranslate'; 

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [langMenuAbierto, setLangMenuAbierto] = useState(false);
  const [idiomaActual, setIdiomaActual] = useState('Español');

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const toggleLangMenu = () => setLangMenuAbierto(!langMenuAbierto);

  // 1. Revisamos la memoria del navegador al cargar la página para mantener el botón actualizado
  useEffect(() => {
    if (document.cookie.includes('googtrans=/es/en')) {
      setIdiomaActual('English');
    } else {
      setIdiomaActual('Español');
    }
  }, []);

  // Cerrar el menú de idiomas si se hace clic afuera
  useEffect(() => {
    const cerrarMenu = () => setLangMenuAbierto(false);
    if (langMenuAbierto) {
      window.addEventListener('click', cerrarMenu);
    }
    return () => window.removeEventListener('click', cerrarMenu);
  }, [langMenuAbierto]);

  // 2. Método Infalible: Cambiar el idioma inyectando la orden directo en las Cookies
  const cambiarIdioma = (langCode: string, nombreIdioma: string) => {
    if (langCode === 'es') {
      // Regresar al original: Destruimos la cookie de Google
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
    } else {
      // Traducir a inglés: Forzamos la cookie con la ruta de origen/destino (/es/en)
      document.cookie = `googtrans=/es/${langCode}; path=/;`;
      document.cookie = `googtrans=/es/${langCode}; path=/; domain=${window.location.hostname}`;
    }
    
    // Recargamos la página para que Google ejecute la orden de la cookie de inmediato
    window.location.reload();
  };

  return (
    <nav className="bg-selva text-crema sticky top-0 z-50 shadow-xl">
      <GoogleTranslate />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex-shrink-0">
            <Link href="/" className="font-titulo text-2xl tracking-widest font-bold text-crema hover:text-sol transition-colors">
              TZIMOL
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-sol transition-colors font-cuerpo text-lg font-medium">
              Inicio
            </Link>
            
            <Link href="/#ecoturismo" className="hover:text-sol transition-colors font-cuerpo text-lg font-medium">
              Turismo
            </Link>
            
            {/* NUEVA SECCIÓN UNIFICADA */}
            <Link href="/#cultura" className="hover:text-sol transition-colors font-cuerpo text-lg font-medium">
              Tradición y Cultura
            </Link>
            
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={toggleLangMenu}
                className="flex items-center bg-crema/10 px-4 py-2 rounded-lg border border-crema/20 shadow-sm hover:bg-crema/20 transition-all font-cuerpo text-sm font-medium text-crema"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-crema" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {idiomaActual}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1.5 transition-transform duration-200 ${langMenuAbierto ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langMenuAbierto && (
                <div className="absolute right-0 mt-2 w-36 bg-selva border border-crema/20 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <button 
                    onClick={() => cambiarIdioma('es', 'Español')}
                    className="w-full text-left px-4 py-2.5 text-sm font-cuerpo hover:bg-crema/10 text-crema transition-colors"
                  >
                    Español
                  </button>
                  <button 
                    onClick={() => cambiarIdioma('en', 'English')}
                    className="w-full text-left px-4 py-2.5 text-sm font-cuerpo hover:bg-crema/10 text-crema transition-colors"
                  >
                    English
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-crema hover:text-sol focus:outline-none transition-colors">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuAbierto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden absolute w-full bg-selva border-t border-crema/20 shadow-2xl transition-all duration-300 ease-in-out ${menuAbierto ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="px-4 pt-4 pb-6 space-y-2 flex flex-col">
          <Link href="/" onClick={toggleMenu} className="block px-4 py-3 hover:bg-crema/10 hover:text-sol rounded-lg font-cuerpo text-lg transition-colors">
            Inicio
          </Link>
          
          <Link href="/#turismo" onClick={toggleMenu} className="block px-4 py-3 hover:bg-crema/10 hover:text-sol rounded-lg font-cuerpo text-lg transition-colors">
            Turismo
          </Link>
          
          {/* NUEVA SECCIÓN UNIFICADA (Móviles) */}
          <Link href="/#cultura" onClick={toggleMenu} className="block px-4 py-3 hover:bg-crema/10 hover:text-sol rounded-lg font-cuerpo text-lg transition-colors">
            Tradición y Cultura
          </Link>
          
          <div className="pt-4 border-t border-crema/20 mt-2">
            <p className="px-4 text-xs font-titulo uppercase tracking-wider text-crema/40 mb-2">Seleccionar Idioma</p>
            <div className="grid grid-cols-2 gap-2 px-2">
              <button 
                onClick={() => cambiarIdioma('es', 'Español')}
                className={`py-2 rounded-lg font-cuerpo text-sm border text-center transition-all ${idiomaActual === 'Español' ? 'bg-sol text-selva border-sol font-bold' : 'bg-crema/5 border-crema/10 text-crema'}`}
              >
                Español
              </button>
              <button 
                onClick={() => cambiarIdioma('en', 'English')}
                className={`py-2 rounded-lg font-cuerpo text-sm border text-center transition-all ${idiomaActual === 'English' ? 'bg-sol text-selva border-sol font-bold' : 'bg-crema/5 border-crema/10 text-crema'}`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}