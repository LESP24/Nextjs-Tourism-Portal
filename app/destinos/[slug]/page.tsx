// =============================================================
// app/destinos/[slug]/page.tsx — Portal Turístico de Tzimol
// Diseño editorial: imágenes intercaladas en el texto,
// alternando lado derecho e izquierdo como en revistas de viaje.
// =============================================================
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { clienteSanity } from '../../../sanity/cliente';
import { PortableText } from '@portabletext/react';

export const revalidate = 60;

// -----------------------------------------------------------
// Extrae el ID de un video de YouTube desde cualquier formato de URL
// -----------------------------------------------------------
function obtenerIdYouTube(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// -----------------------------------------------------------
// Etiqueta superior decorativa (el textito en mayúsculas)
// -----------------------------------------------------------
function EtiquetaSeccion({ texto }: { texto: string }) {
  return (
    <p className="font-cuerpo text-terracota font-bold tracking-[0.25em] text-xs uppercase mb-3 text-center">
      {texto}
    </p>
  );
}

// -----------------------------------------------------------
// Imagen editorial con efecto hover y borde redondeado
// Se alterna entre derecha e izquierda según el índice.
//
// Técnica: CSS float clásico — el texto de PortableText
// fluye naturalmente alrededor de la imagen.
// En móvil: ocupa el ancho completo y no flota.
// En desktop (md+): ocupa 46% del ancho y flota al lado indicado.
// -----------------------------------------------------------
function ImagenEditorial({
  url,
  alt,
  indice,
}: {
  url: string;
  alt: string;
  indice: number;
}) {
  const esDerecha = indice % 2 === 0;

  return (
    <figure
      className={[
        // Móvil: ancho completo, sin float
        'w-full h-52 rounded-2xl overflow-hidden shadow-lg shadow-selva/15',
        'my-6 group transition-shadow duration-300 hover:shadow-xl hover:shadow-selva/20',
        // Desktop: float alternado, ancho 46%
        esDerecha
          ? 'md:float-right md:ml-8 md:mb-4 md:w-[46%] md:h-64'
          : 'md:float-left md:mr-8 md:mb-4 md:w-[46%] md:h-64',
      ].join(' ')}
    >
      <div className="relative w-full h-full">
        <Image
          src={url}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradiente sutil en la dirección opuesta al texto */}
        <div
          className={[
            'absolute inset-0 opacity-30',
            esDerecha
              ? 'bg-gradient-to-l from-selva/40 to-transparent'
              : 'bg-gradient-to-r from-selva/40 to-transparent',
          ].join(' ')}
          aria-hidden="true"
        />
      </div>
    </figure>
  );
}

// -----------------------------------------------------------
// Divide un array de bloques en N+1 grupos distribuidos uniformemente.
// Las imágenes se insertan ENTRE cada grupo para crear el efecto
// "texto → imagen → texto → imagen" intercalado.
// -----------------------------------------------------------
function dividirBloques(bloques: any[], totalImagenes: number): any[][] {
  if (totalImagenes === 0 || bloques.length === 0) return [bloques];

  const totalGrupos = totalImagenes + 1;
  const grupos: any[][] = [];

  for (let i = 0; i < totalGrupos; i++) {
    const inicio = Math.floor((i * bloques.length) / totalGrupos);
    const fin = Math.floor(((i + 1) * bloques.length) / totalGrupos);
    grupos.push(bloques.slice(inicio, fin));
  }

  return grupos;
}

// -----------------------------------------------------------
// Componente Principal
// -----------------------------------------------------------
export default async function PaginaDestino({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // ── Consulta GROQ a Sanity ──────────────────────────────────
  const query = `
    *[_type == "lugarTuristico" && slug.current == $slug][0]{
      nombre,
      "imagenPrincipalUrl": imagenPrincipal.asset->url,
      contenidoDetallado[]{
        ...,
        _type == "image" => {
          "imgUrl": asset->url,
          "imgAlt": alt
        }
      },
      "galeriaUrls": galeria[].asset->url,
      ubicacionMapa,
      enlaceVideo,
      enlaceExterno
    }
  `;

  const destino = await clienteSanity.fetch(query, { slug });
  if (!destino) notFound();

  const idVideo = destino.enlaceVideo ? obtenerIdYouTube(destino.enlaceVideo) : null;

  // ── Preparar grupos de contenido para intercalar imágenes ───
  // galeriaUrls es el array de fotos del campo "galeria" en Sanity.
  // bloquesContenido son los párrafos del campo "contenidoDetallado".
  //
  // 📌 CMS: El cliente agrega/quita fotos en el panel; la lógica de
  //         intercalado se recalcula automáticamente. Sin tocar código.
  const galeriaUrls: string[]  = destino.galeriaUrls    ?? [];
  const bloques:     any[]     = destino.contenidoDetallado ?? [];
  const gruposContenido        = dividirBloques(bloques, galeriaUrls.length);

  // ── Componentes personalizados para PortableText ─────────────
  const componentesPortableText = {
    types: {
      // Imagen incrustada directamente en el texto enriquecido de Sanity
      image: ({ value }: { value: any }) => (
        <div className="relative w-full h-72 md:h-96 my-10 rounded-2xl overflow-hidden shadow-xl shadow-selva/10">
          <Image
            src={value.imgUrl}
            alt={value.imgAlt || destino.nombre}
            fill
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-cover"
          />
        </div>
      ),
    },
    block: {
      h2: ({ children }: { children?: any }) => (
        <h2 className="font-titulo text-2xl md:text-3xl text-selva mt-12 mb-5 pb-3 border-b-2 border-terracota/25 clear-both">
          {children}
        </h2>
      ),
      h3: ({ children }: { children?: any }) => (
        <h3 className="font-titulo text-xl md:text-2xl text-selva mt-8 mb-3 clear-both">
          {children}
        </h3>
      ),
      blockquote: ({ children }: { children?: any }) => (
        <blockquote className="clear-both border-l-4 border-sol pl-6 italic text-selva/80 my-8 text-xl font-cuerpo bg-sol/5 py-4 pr-4 rounded-r-xl">
          {children}
        </blockquote>
      ),
      // Párrafo normal: si empieza con negrita → fila de lista estilo "ficha"
      normal: ({ children, value }: { children?: any; value?: any }) => {
        const primerHijo = value?.children?.[0];
        const empiezaConEtiqueta = primerHijo?.marks?.includes('strong');

        if (empiezaConEtiqueta) {
          return (
            <div className="flex gap-4 items-start py-4 border-b border-selva/8 last:border-b-0">
              <span
                aria-hidden="true"
                className="mt-2.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-terracota"
              />
              <p className="leading-relaxed text-corteza/75 text-base md:text-lg">
                {children}
              </p>
            </div>
          );
        }

        return (
          <p className="leading-loose text-corteza/75 mb-5 text-base md:text-lg">
            {children}
          </p>
        );
      },
    },
    list: {
      bullet: ({ children }: { children?: any }) => (
        <ul className="space-y-3 my-6 ml-2">{children}</ul>
      ),
      number: ({ children }: { children?: any }) => (
        <ol className="space-y-3 my-6 ml-6 list-decimal">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }: { children?: any }) => (
        <li className="flex gap-3 items-start text-corteza/75 leading-relaxed text-base md:text-lg">
          <span
            aria-hidden="true"
            className="mt-2.5 flex-shrink-0 w-2 h-2 rounded-full bg-jade"
          />
          <span>{children}</span>
        </li>
      ),
      number: ({ children }: { children?: any }) => (
        <li className="text-corteza/75 leading-relaxed text-base md:text-lg">
          {children}
        </li>
      ),
    },
    marks: {
      strong: ({ children }: { children?: any }) => (
        <strong className="font-titulo font-bold text-selva text-lg md:text-xl mr-1">
          {children}
        </strong>
      ),
      em: ({ children }: { children?: any }) => (
        <em className="italic text-terracota">{children}</em>
      ),
      link: ({ children, value }: { children?: any; value?: any }) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-terracota font-semibold underline decoration-terracota/40 hover:decoration-terracota transition-colors"
        >
          {children}
        </a>
      ),
    },
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <main className="min-h-screen bg-crema">

      {/* ── 1. HERO / PORTADA ───────────────────────────────────── */}
      <section className="relative w-full h-[50vh] md:h-[70vh] bg-jade overflow-hidden">
        {destino.imagenPrincipalUrl && (
          <Image
            src={destino.imagenPrincipalUrl}
            alt={destino.nombre}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-selva/45" aria-hidden="true" />
        <div
          className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-crema to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-7xl text-crema font-titulo drop-shadow-lg leading-tight">
            {destino.nombre}
          </h1>
        </div>
      </section>

      {/* ── 2. CONTENIDO PRINCIPAL ──────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 pb-20">

        {/* Botón de sitio oficial (aparece solo si el CMS tiene el campo) */}
        {destino.enlaceExterno && (
          <div className="mb-10 flex justify-center">
            <a
              href={destino.enlaceExterno}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-selva text-crema px-7 py-3.5 rounded-full font-cuerpo font-bold text-sm tracking-wider hover:bg-terracota transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
            >
              Visitar sitio oficial
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        {/* ── TARJETA EDITORIAL ───────────────────────────────────
            Diseño tipo revista: texto e imágenes fluyen juntos.
            La tarjeta tiene overflow-visible para que los h2/h3
            con clear-both no generen saltos raros.
        ────────────────────────────────────────────────────────── */}
        <div className="relative bg-white rounded-3xl shadow-xl shadow-selva/10 border border-selva/8 overflow-visible">

          {/* Barra accent superior con gradiente de la paleta */}
          <div
            className="h-1 rounded-t-3xl bg-gradient-to-r from-jade via-sol to-terracota"
            aria-hidden="true"
          />

          {/* Decoración: número de foto flotante (fondo) */}
          <svg
            viewBox="0 0 100 100"
            aria-hidden="true"
            className="absolute -top-4 -right-4 w-24 h-24 text-jade/8 pointer-events-none select-none"
            fill="currentColor"
          >
            <path d="M50 5C20 25 10 60 35 90c5-25 15-40 35-50C55 30 50 15 50 5z" />
          </svg>

          <div className="px-6 md:px-12 pt-10 md:pt-14 pb-12 md:pb-16">

            {/* Nombre del destino como título interno de la tarjeta */}
            <div className="mb-8 pb-6 border-b border-selva/10">
              <p className="font-cuerpo text-terracota text-xs tracking-[0.35em] uppercase mb-2">
                Destino turístico
              </p>
              <h2 className="font-titulo text-3xl md:text-4xl text-selva leading-tight">
                {destino.nombre}
              </h2>
            </div>

            {/* ── CONTENIDO EDITORIAL CON IMÁGENES INTERCALADAS ────
                Algoritmo:
                  gruposContenido[0] → texto del primer bloque
                  imagen [0] flotada a la DERECHA
                  gruposContenido[1] → texto fluye alrededor
                  [clear-both]
                  imagen [1] flotada a la IZQUIERDA
                  gruposContenido[2] → texto fluye alrededor
                  [clear-both]
                  ... y así sucesivamente.
                
                📌 CMS: Si el cliente agrega más fotos en Sanity,
                        el algoritmo las redistribuye automáticamente
                        sin necesidad de ajustes manuales.
            ───────────────────────────────────────────────────────── */}
            {bloques.length > 0 ? (
              <>
                {gruposContenido.map((grupo, indiceGrupo) => (
                  <div key={indiceGrupo}>

                    {/* Imagen ANTES de este grupo de texto (excepto el primero)
                        → la imagen flota y el texto del grupo la rodea   */}
                    {indiceGrupo > 0 && galeriaUrls[indiceGrupo - 1] && (
                      <ImagenEditorial
                        url={galeriaUrls[indiceGrupo - 1]}
                        alt={`Imagen ${indiceGrupo} de ${destino.nombre}`}
                        indice={indiceGrupo - 1}
                      />
                    )}

                    {/* Bloques de texto de este grupo */}
                    {grupo.length > 0 && (
                      <PortableText
                        value={grupo}
                        components={componentesPortableText}
                      />
                    )}

                    {/* Limpia los floats al terminar el grupo para evitar
                        que la siguiente imagen herede el flow anterior   */}
                    <div className="clear-both" aria-hidden="true" />

                  </div>
                ))}

                {/* Si hay más imágenes que grupos (ej. 1 imagen con poco texto),
                    mostrar las imágenes restantes al final en grid 2 columnas  */}
                {galeriaUrls.length > gruposContenido.length && (
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {galeriaUrls.slice(gruposContenido.length).map((url, i) => (
                      <div
                        key={i}
                        className="relative h-56 rounded-2xl overflow-hidden shadow-md group"
                      >
                        <Image
                          src={url}
                          alt={`Fotografía adicional ${i + 1} de ${destino.nombre}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 45vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-corteza/70 text-lg leading-loose">
                La información detallada de este lugar estará disponible pronto.
              </p>
            )}

          </div>
        </div>
      </section>

      {/* ── 3. VIDEO (aparece solo si el CMS tiene enlace) ─────── */}
      {idVideo && (
        <section className="bg-selva/5 py-16 md:py-24 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <EtiquetaSeccion texto="Multimedia" />
            <h2 className="font-titulo text-3xl md:text-5xl text-selva mb-12">
              Explora en video
            </h2>
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-selva/20">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${idVideo}`}
                title={`Video de ${destino.nombre}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* ── 4. MAPA / UBICACIÓN ─────────────────────────────────
          📌 CMS: El campo "ubicacionMapa" en Sanity debe contener
          la URL tipo "Insertar un mapa" (Embed) de Google Maps.
          Cómo obtenerla:
            1. Busca el lugar en Google Maps → clic en "Compartir"
            2. Pestaña "Insertar un mapa" (NO "Enviar un enlace")
            3. Copia la URL que está dentro de src="..."
               (empieza con https://www.google.com/maps/embed?pb=...)
            4. Pega esa URL en el campo del panel de Sanity.
      ─────────────────────────────────────────────────────────── */}
      {destino.ubicacionMapa && (
        <section className="bg-selva py-16 md:py-20 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-titulo text-3xl md:text-4xl text-crema mb-4">
              ¿Cómo llegar?
            </h2>
            <p className="font-cuerpo text-crema/70 mb-10 text-base leading-relaxed">
              Encuentra este destino en el mapa o ábrelo directo en Google Maps.
            </p>
            <a
              href={destino.ubicacionMapa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-crema text-selva px-8 py-4 rounded-full font-cuerpo font-bold tracking-wider hover:bg-terracota hover:text-crema transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-95"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Abrir en Google Maps
            </a>
          </div>
        </section>
      )}

    </main>
  );
}