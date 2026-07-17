// =============================================================
// components/EncabezadoPrincipal.tsx
// Sección "Hero" principal del portal turístico de Tzimol.
// Componente de Servidor (no necesita 'use client').
// =============================================================

// Icono de flecha hacia abajo (inline SVG para evitar dependencias)
function IconoFlecha() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 animate-flote"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// -----------------------------------------------------------
// Componente principal
// -----------------------------------------------------------
export default function EncabezadoPrincipal() {
  return (
    <header 
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/imagenes/fondo-inicio.jpeg')" }}
    >
      {/* ── CAPA OSCURA: Para asegurar que el texto blanco siempre se lea ── */}
      <div
        className="absolute inset-0 bg-black/50 pointer-events-none"
        aria-hidden="true"
      />

      {/* ── CAPA 3: Resplandor dorado en esquina superior derecha ── */}
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full
                   bg-sol/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* ── BARRA DE NAVEGACIÓN SUPERIOR ── */}
      <nav className="relative z-10 contenedor-sitio flex items-center justify-between pt-8">
        

        {/* 
          📌 CMS: Los elementos del menú de navegación pueden gestionarse
          desde el panel de administrador (añadir/quitar secciones del portal).
        */}
       
      </nav>

      {/* ── BLOQUE CENTRAL: Título y subtítulo ── */}
      <div className="relative z-10 contenedor-sitio flex-1 flex flex-col justify-center py-20">

        {/* Indicador de ubicación — pequeño y en mayúsculas */}
        <p className="animacion-revelar retraso-100 font-cuerpo text-sol text-xs md:text-sm
                      tracking-[0.5em] uppercase mb-6">
          Municipio de — Chiapas, México
        </p>

        {/* Título principal enorme */}
        <h1
          className="animacion-revelar retraso-200 font-titulo text-crema leading-none
                     text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[12rem]"
        >
          TZIMOL
        </h1>

        {/* Línea dorada decorativa */}
        <div className="animacion-revelar retraso-300 h-0.5 w-24 bg-sol my-6" />

        {/* Eslogan */}
        <p className="animacion-revelar retraso-400 font-cuerpo italic text-crema/75
                      text-lg md:text-2xl max-w-lg leading-relaxed">
          Naturaleza, cultura y tradición en el corazón de Chiapas.
        </p>

        {/* Botones de llamada a la acción */}
        <div className="animacion-revelar retraso-500 flex flex-wrap gap-4 mt-10">
          <a
            href="#ecoturismo"
            className="boton-primario shadow-sol"
          >
            Explorar destinos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#rutas"
            className="inline-flex items-center gap-2 border border-crema/30 text-crema
                       font-cuerpo text-sm font-medium px-5 py-2.5 rounded-full
                       hover:border-sol hover:text-sol transition-all duration-300"
          >
            Ver rutas culturales
          </a>
        </div>
      </div>

    

      {/* ── INDICADOR DE SCROLL ── */}
      <div className="absolute bottom-36 right-8 z-10 hidden md:flex flex-col
                      items-center gap-2 text-crema/40">
        <span className="font-cuerpo text-[10px] tracking-[0.3em] uppercase [writing-mode:vertical-rl]">
          Descubrir
        </span>
        <IconoFlecha />
      </div>
{/* ── INDICADOR DE SCROLL ── */}
      <a 
        href="#ecoturismo"
        className="absolute bottom-36 right-8 z-10 hidden md:flex flex-col
                   items-center gap-2 text-crema/40 hover:text-sol transition-colors duration-300 cursor-pointer group"
        aria-label="Ir a la sección de destinos"
      >
        <span className="font-cuerpo text-[10px] tracking-[0.3em] uppercase [writing-mode:vertical-rl] group-hover:-translate-y-1 transition-transform duration-300">
          Descubrir
        </span>
        <div className="group-hover:translate-y-1 transition-transform duration-300">
          <IconoFlecha />
        </div>
      </a>
    </header>
  );
}
