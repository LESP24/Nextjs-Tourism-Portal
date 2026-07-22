import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { groq } from 'next-sanity';
import { clienteSanity } from '@/sanity/cliente'; 
import { PortableText } from '@portabletext/react';

export const dynamic = 'force-dynamic';

function obtenerURLVideo(url: string) {
  if (!url) return null;
  const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
  if (youtubeMatch && youtubeMatch[1]) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  if (url.includes('facebook.com')) return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560`;
  return null;
}

export default async function PaginaCultura({ params }: { params: Promise<{ slug: string }> }) {
  
  const parametrosResueltos = await params;
  const slugLimpio = decodeURIComponent(parametrosResueltos.slug);
  
  const query = groq`*[_type == "experienciaCultural" && slug.current == $slug][0] {
    titulo,
    autor,
    tipoElemento,
    "imagen": imagenPrincipal.asset->url,
    contenidoDetallado,
    "galeria": galeria[].asset->url,
    ubicacionMapa,
    enlaceVideo
  }`;
  
  const experiencia = await clienteSanity.fetch(query, { slug: slugLimpio });

  if (!experiencia) {
    notFound(); 
  }

  const videoEmbed = experiencia.enlaceVideo ? obtenerURLVideo(experiencia.enlaceVideo) : null;

  // 1. INYECCIÓN PROGRAMÁTICA DE IMÁGENES
  // Aquí mezclamos el texto con la galería para que el navegador los intercale correctamente
  let contenidoMezclado: any[] = [];
  let indiceImagen = 0;
  const galeria = experiencia.galeria || [];

  if (experiencia.contenidoDetallado && Array.isArray(experiencia.contenidoDetallado)) {
    experiencia.contenidoDetallado.forEach((bloque: any, index: number) => {
      // Inyectamos una imagen antes del párrafo 0, párrafo 2, párrafo 4, etc.
      if (index % 2 === 0 && indiceImagen < galeria.length) {
        contenidoMezclado.push({
          _key: `img-inyectada-${indiceImagen}`,
          _type: 'imagen_inyectada', // Creamos un tipo custom al vuelo
          url: galeria[indiceImagen],
          esDerecha: indiceImagen % 2 === 0 // Alternamos: derecha, izquierda, derecha...
        });
        indiceImagen++;
      }
      contenidoMezclado.push(bloque);
    });
  }
  
  // Guardamos las imágenes que sobren (si hay más fotos que texto)
  const imagenesSobrantes = galeria.slice(indiceImagen);

  // 2. CONFIGURACIÓN DE PORTABLE TEXT CON NUESTRO TIPO CUSTOM
  const componentesTexto = {
    types: {
      // Le decimos a Sanity cómo dibujar las imágenes que inyectamos en el arreglo
      imagen_inyectada: ({ value }: any) => (
        <div 
          className={`w-full sm:w-1/2 md:w-5/12 mb-6 relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-md mt-2 
            ${value.esDerecha ? 'float-right ml-0 sm:ml-8' : 'float-left mr-0 sm:mr-8'}`}
        >
          <Image 
            src={value.url} 
            alt="Fotografía de la experiencia" 
            fill 
            className="object-cover" 
          />
        </div>
      )
    },
    block: {
      normal: ({ children }: any) => <p className="mb-6 leading-relaxed">{children}</p>,
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc ml-6 mb-6 space-y-3 marker:text-sol">{children}</ul>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => <li>{children}</li>,
    }
  };

  return (
    <main className="min-h-screen bg-crema pb-24">
      
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
        
        <div className="absolute inset-0 bg-gradient-to-t from-selva via-selva/40 to-transparent" />

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

      {/* ── CONTENIDO PRINCIPAL (ESTILO REVISTA FLOTANTE) ── */}
      <section className="py-20 px-4 md:px-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-crema/40 -mt-32 relative z-20">
          
          <h2 className="font-titulo text-3xl text-selva mb-6">Nuestra Historia</h2>
          
          <div className="prose prose-lg prose-p:font-cuerpo prose-p:text-gray-600 prose-a:text-sol max-w-none clearfix">
            
            {/* Renderizamos el texto mezclado con las imágenes inyectadas */}
            {contenidoMezclado.length > 0 ? (
              <PortableText 
                value={contenidoMezclado} 
                components={componentesTexto} 
              />
            ) : (
              <p>Información detallada próximamente...</p>
            )}

          </div>

          {/* ── IMÁGENES SOBRANTES ── */}
          {/* Si subiste más fotos de las que caben intercaladas en el texto, las mostramos abajo */}
          {imagenesSobrantes.length > 0 && (
            <div className="mt-12 pt-8 border-t border-crema/40 clear-both">
              <h3 className="font-titulo text-2xl text-selva mb-6">Más de esta experiencia</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {imagenesSobrantes.map((fotoUrl: string, index: number) => (
                  <div key={index} className="relative h-64 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <Image 
                      src={fotoUrl} 
                      alt={`Foto adicional ${index + 1}`} 
                      fill 
                      className="object-cover hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón de Google Maps */}
          {experiencia.ubicacionMapa && (
            <div className="mt-12 pt-8 border-t border-gray-200 text-center md:text-left clear-both">
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

      {/* ── SECCIÓN MULTIMEDIA EXTERNA (VIDEO) ── */}
      {videoEmbed && (
        <section className="px-4 md:px-12 max-w-4xl mx-auto mt-4">
          <div className="w-full flex flex-col items-center gap-6">
            <h3 className="font-titulo text-3xl text-selva text-center">Explora en video</h3>
            <div className="relative w-full overflow-hidden rounded-3xl shadow-xl" style={{ paddingTop: '56.25%' }}>
              <iframe 
                src={videoEmbed} 
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}