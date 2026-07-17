// =============================================================
// components/SeccionRutas.tsx
// Sección editorial unificada para mostrar Tradición y Cultura de Tzimol.
// Componente de Servidor — no requiere 'use client'.
// =============================================================
import Image from 'next/image';
import Link from 'next/link'; 

interface PropsSeccionRutas {
  rutas: any[]; 
}

// -----------------------------------------------------------
// Subcomponente: Tarjeta de Cultura/Ruta
// -----------------------------------------------------------
function TarjetaRuta({ ruta, indice }: { ruta: any; indice: number }) {
  const tituloMostrar = ruta.titulo || ruta.nombre;
  const imagen = ruta.imagen;

  // 1. "Traductor" de categorías: Convierte el valor de Sanity a un texto presentable
  const nombresCategorias: Record<string, string> = {
    iglesia: 'Iglesia / Templo',
    ruta: 'Ruta Pública',
    festividad: 'Festividad o Tradición',
    historico: 'Lugar Histórico',
    gastronomia: 'Gastronomía'
  };

  // 2. Definimos qué texto dorado mostrar (Prioriza la categoría, si no, usa el autor)
  const etiquetaDorada = ruta.tipoElemento 
    ? nombresCategorias[ruta.tipoElemento] || ruta.tipoElemento 
    : ruta.autor;

  return (
    <Link 
      href={`/cultura/${ruta.id}`}
      className="group relative rounded-2xl overflow-hidden cursor-pointer
                 aspect-[4/5] shadow-carta hover:shadow-carta-hover
                 transition-all duration-500 hover:-translate-y-1 block"
    >
      <article className="w-full h-full">
        {/* ── IMAGEN DE FONDO ── */}
        {imagen ? (
          <Image
            src={imagen}
            alt={`Experiencia cultural: ${tituloMostrar}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-corteza/40" />
        )}

        {/* Degradado para lectura */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-corteza/90 via-corteza/30 to-transparent"
          aria-hidden="true"
        />

        {/* Número decorativo */}
        <span
          className="absolute top-4 left-4 font-titulo text-crema/20 text-6xl leading-none select-none"
          aria-hidden="true"
        >
          {String(indice + 1).padStart(2, '0')}
        </span>

        {/* ── INFORMACIÓN INFERIOR ── */}
        <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-3">

          {/* 🌟 AQUÍ IMPRIMIMOS LA ETIQUETA DORADA (CATEGORÍA O AUTOR) 🌟 */}
          {etiquetaDorada && (
            <div className="flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5 text-sol flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span className="font-cuerpo text-sol text-xs font-medium tracking-wider uppercase">
                {etiquetaDorada}
              </span>
            </div>
          )}

          {/* Nombre del lugar */}
          <h3 className="font-titulo text-crema text-2xl leading-tight">
            {tituloMostrar}
          </h3>

          {/* Botón hover */}
          <div
            className="flex items-center gap-2 text-sol/0 group-hover:text-sol
                       transition-all duration-300 translate-y-2 group-hover:translate-y-0"
            aria-hidden="true"
          >
            <div className="h-px flex-1 bg-sol/40" />
            <span className="font-cuerpo text-xs tracking-widest uppercase">
              Descubrir
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// -----------------------------------------------------------
// Componente principal: SeccionRutas
// -----------------------------------------------------------
export default function SeccionRutas({ rutas }: PropsSeccionRutas) {
  // Para evitar errores si "rutas" viene vacío desde Sanity
  const listaRutas = rutas || [];

  return (
    <section
      id="cultura" 
      className="py-24 bg-selva"
      aria-labelledby="titulo-cultura"
    >
      <div className="contenedor-sitio">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="flex flex-col gap-4">
            <p className="font-cuerpo text-sol text-xs tracking-[0.4em] uppercase">
              Patrimonio vivo
            </p>
            <h2
              id="titulo-cultura"
              className="font-titulo text-crema text-4xl md:text-5xl lg:text-6xl leading-tight"
            >
              Tradición y<br />Cultura
            </h2>
          </div>
          <p className="font-cuerpo text-crema/55 text-base leading-relaxed max-w-xs">
            Descubre el alma de Tzimol a través de sus rutas, historia y expresiones culturales preservadas por nuestra gente.
          </p>
        </div>

        <div className="h-px w-full bg-crema/10 mb-14" aria-hidden="true" />

        {/* Cuadrícula de Tarjetas */}
        {listaRutas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listaRutas.map((ruta, indice) => (
              <TarjetaRuta key={ruta.id} ruta={ruta} indice={indice} />
            ))}
          </div>
        ) : (
          <p className="text-crema/50 font-cuerpo">Aún no hay publicaciones en esta sección. Agrega contenido desde Sanity.</p>
        )}
      </div>
    </section>
  );
}