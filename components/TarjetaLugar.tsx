// =============================================================
// components/TarjetaLugar.tsx
// Tarjeta reutilizable para mostrar un destino ecoturístico.
// =============================================================
import Image from 'next/image';
import Link from 'next/link';
import type { LugarEcoturistico } from '../types/tipos';

interface PropsTarjetaLugar {
  lugar: LugarEcoturistico | any; 
}

export default function TarjetaLugar({ lugar }: PropsTarjetaLugar) {
  // Ya no extraemos sitioWebOficial porque quitamos la etiqueta
  const { nombre, descripcion, imagen } = lugar;
  
  // Identificador seguro
  const identificador = lugar.slug?.current || lugar.id;

  return (
    <article
      className="group relative bg-crema rounded-[2rem] overflow-hidden
                 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(34,66,41,0.12)]
                 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full border border-corteza/5"
    >
      {/* ── IMAGEN DEL LUGAR ── */}
      <div className="relative h-60 shrink-0 overflow-hidden bg-jade/10">
        
        {imagen && (
          <Image
            src={imagen}
            alt={`Vista de ${nombre}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        )}
        
        {/* ¡Eliminamos el degradado oscuro y la etiqueta amarilla! Ahora la foto brilla al 100% */}
      </div>

      {/* ── CUERPO DE LA TARJETA ── */}
      <div className="flex flex-col flex-grow p-6 md:p-8 gap-4 bg-crema z-10 relative">

        {/* Línea decorativa animada */}
        <div className="h-1 w-10 bg-sol rounded-full transition-all duration-500 group-hover:w-20 group-hover:bg-terracota" aria-hidden="true" />

        {/* Nombre del lugar */}
        <h3 className="font-titulo text-2xl md:text-3xl leading-tight text-selva transition-colors duration-300 group-hover:text-terracota">
          {nombre}
        </h3>

        {/* Descripción */}
        <p className="font-cuerpo text-corteza/70 text-base leading-relaxed line-clamp-3 mb-2 font-light">
          {descripcion}
        </p>

        {/* ── BOTÓN ESTILO PREMIUM ── */}
        <div className="mt-auto pt-4">
          <Link
            href={`/destinos/${identificador}`}
            className="flex items-center justify-between w-full bg-selva/5 text-selva px-6 py-4 rounded-2xl font-cuerpo font-bold tracking-wider text-sm transition-all duration-300 group-hover:bg-terracota group-hover:text-crema"
            aria-label={`Descubrir más sobre ${nombre}`}
          >
            <span>Descubrir más</span>
            
            {/* Flecha animada */}
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        
      </div>
    </article>
  );
}