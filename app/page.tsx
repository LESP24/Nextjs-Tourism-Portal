// =============================================================
// app/page.tsx — Página principal del Portal Turístico de Tzimol
// =============================================================

// 1. IMPORTACIONES DE SANITY
import { clienteSanity } from '../sanity/cliente';
import { groq } from 'next-sanity';

// Componentes del portal
import GestionMunicipal from '@/components/GestionMunicipal';
import EncabezadoPrincipal from '../components/EncabezadoPrincipal';
import TarjetaLugar from '../components/TarjetaLugar';
import SeccionRutas from '../components/SeccionRutas';

// 2. FUNCIÓN PARA TRAER ECOTURISMO
async function obtenerDestinosEcoturismo() {
  const destinos = await clienteSanity.fetch(
    groq`*[_type == "lugarTuristico"] | order(orden asc) {
      "id": slug.current,
      nombre,
      descripcion,
      "imagen": imagenPrincipal.asset->url,
      "sitioWebOficial": enlaceExterno
    }`,
    {},
    { cache: 'no-store' }
  );
  return destinos;
}

// 3. FUNCIÓN PARA TRAER TRADICIÓN Y CULTURA (UNIFICADA)
async function obtenerCultura() {
  const cultura = await clienteSanity.fetch(
    groq`*[_type == "experienciaCultural"] | order(numero asc) {
      "id": slug.current,
      titulo,
      autor,
      tipoElemento, // 👈 ¡AQUÍ ESTÁ EL NUEVO DATO!
      "imagen": imagenPrincipal.asset->url,
      descripcionCorta
    }`,
    {},
    { cache: 'no-store' }
  );
  return cultura;
}

export const metadata = {
  title: 'Inicio',
};

export default async function PaginaPrincipalInicio() {

  // 4. DESCARGAMOS LOS DOS CONJUNTOS DE DATOS EN PARALELO
  const [destinosSanity, culturaSanity] = await Promise.all([
    obtenerDestinosEcoturismo(),
    obtenerCultura(),
  ]);

  return (
    <main className="flex-1">

      {/* ══════════════════════════════════════════════════════
          1. SECCIÓN HERO Y POLÍTICA
      ══════════════════════════════════════════════════════ */}
      <EncabezadoPrincipal />
      <GestionMunicipal />

      {/* ══════════════════════════════════════════════════════
          2. SECCIÓN ECOTURISMO (NUBE)
      ══════════════════════════════════════════════════════ */}
      <section id="ecoturismo" className="py-24 bg-crema" aria-labelledby="titulo-ecoturismo">
        <div className="contenedor-sitio">
          <div className="flex flex-col gap-4 mb-14">
            <p className="font-cuerpo text-terracota text-xs tracking-[0.4em] uppercase">
              Naturaleza viva
            </p>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h2 id="titulo-ecoturismo" className="font-titulo text-selva text-4xl md:text-5xl lg:text-6xl leading-tight">
                Destinos<br />Ecoturísticos
              </h2>
            </div>
            <div className="h-px w-20 bg-sol" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinosSanity.map((lugar: any) => (
              <TarjetaLugar key={lugar.id} lugar={lugar} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. SECCIÓN TRADICIÓN Y CULTURA (NUBE)
          📌 CMS: Los datos vienen del tipo "experienciaCultural"
      ══════════════════════════════════════════════════════ */}
      <SeccionRutas rutas={culturaSanity} />

      {/* ══════════════════════════════════════════════════════
          4. BANNER FINAL Y FOOTER
      ══════════════════════════════════════════════════════ */}
      <section className="bg-selva py-24">
        <div className="contenedor-sitio text-center flex flex-col items-center gap-6">
          <p className="font-cuerpo text-sol text-xs tracking-[0.4em] uppercase">Visítanos</p>
          <h2 className="font-titulo text-crema text-4xl md:text-5xl leading-tight max-w-xl">
            Tzimol te espera con los brazos abiertos
          </h2>
          <p className="font-cuerpo text-crema/55 text-base max-w-md leading-relaxed">
            Planea tu visita y descubre por qué Tzimol es uno de los municipios más auténticos de Chiapas.
          </p>
          <a
            href="https://www.google.com/maps/search/Tzimol,+Chiapas"
            target="_blank"
            rel="noopener noreferrer"
            className="boton-primario shadow-sol"
          >
            Cómo llegar
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </a>
        </div>
      </section>

      <footer className="bg-corteza py-10">
        <div className="contenedor-sitio flex flex-col md:flex-row items-center justify-between gap-4 text-crema/40 font-cuerpo text-xs">
          <span className="font-titulo text-crema/60 text-lg tracking-widest">TZIMOL</span>
          <span>© {new Date().getFullYear()} Municipio de Tzimol, Chiapas. Todos los derechos reservados.</span>
          <span>turismo@tzimol.gob.mx</span>
        </div>
      </footer>

    </main>
  );
}