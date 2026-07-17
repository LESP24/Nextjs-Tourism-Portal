import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { groq } from 'next-sanity';
import { clienteSanity } from '@/sanity/cliente'; 
import { PortableText } from '@portabletext/react';

export default async function PaginaCultura({ params }: { params: { slug: string } }) {
  
  // 1. Limpiamos la URL por si tiene espacios o símbolos raros (como %20)
  const slugLimpio = decodeURIComponent(params.slug);
  
  // 2. Inyectamos el slug ya limpio DIRECTAMENTE en el texto de la consulta
  const query = groq`*[_type == "experienciaCultural" && slug.current == "${slugLimpio}"][0] {
    titulo,
    autor,
    tipoElemento,
    "imagen": imagenPrincipal.asset->url,
    contenidoDetallado,
    ubicacionMapa
  }`;
  
  // 3. Hacemos la petición de forma directa y sencilla
  const experiencia = await clienteSanity.fetch(query, {}, { cache: 'no-store' });

  // 4. Si la publicación no existe en Sanity, mandamos a la página de error 404
  if (!experiencia) {
    notFound(); 
  }

  return (
    <main className="min-h-screen bg-crema">
      
      {/* ── SECCIÓN HERO (PORTADA) ── */}
      <section className="relative h-[60vh] md:h-[70vh] w-full bg-selva">
        {experiencia.imagen ? (
          <Image
            src={experiencia.imagen}
            alt={experiencia.titulo || 'Cultura en Tzimol'}
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-selva" />
        )}
        
        {/* Degradado para lectura */}
        <div className="absolute inset-0 bg-gradient-to-t from-selva via-selva/40 to-transparent" />

        {/* Botón Volver */}
        <div className="absolute top-8 left-4 md:left-12 z-10">
          <Link 
            href="/#cultura"
            className="flex items-center gap-2 text-crema hover:text-sol transition-colors bg-selva/50 px-4 py-2 rounded-full backdrop-blur-sm border border-crema/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-cuerpo text-sm uppercase tracking-wider">Volver</span>
          </Link>
        </div>

        {/* Título sobre imagen */}
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-12 pb-16">
          <div className="max-w-4xl mx-auto">
            {experiencia.autor && (
              <p className="font-cuerpo text-sol text-sm tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                {experiencia.autor}
              </p>
            )}
            <h1 className="font-titulo text-5xl md:text-7xl text-crema leading-tight">
              {experiencia.titulo}
            </h1>
          </div>
        </div>
      </section>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <section className="py-20 px-4 md:px-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-crema/40 -mt-32 relative z-20">
          
          <h2 className="font-titulo text-3xl text-selva mb-6">Nuestra Historia</h2>
          
          <div className="prose prose-lg prose-p:font-cuerpo prose-p:text-gray-600 prose-a:text-sol max-w-none">
            {/* Sanity devuelve el texto en formato de bloques. PortableText lo convierte a HTML */}
            {experiencia.contenidoDetallado ? (
              <PortableText value={experiencia.contenidoDetallado} />
            ) : (
              <p>Información detallada próximamente...</p>
            )}
          </div>

          {/* Botón de Google Maps */}
          {experiencia.ubicacionMapa && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <a 
                href={experiencia.ubicacionMapa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-selva text-crema px-8 py-4 rounded-full font-cuerpo font-medium uppercase tracking-widest hover:bg-sol hover:text-selva transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ver ubicación en el Mapa
              </a>
            </div>
          )}
        </div>
      </section>
      
    </main>
  );
}