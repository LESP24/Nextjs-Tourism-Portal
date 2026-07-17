export default {
  name: 'lugarTuristico',
  type: 'document',
  title: 'Atractivos Turísticos',
  fields: [
    {
      name: 'nombre',
      type: 'string',
      title: 'Nombre del Lugar',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Identificador (URL)',
      type: 'slug',
      options: {
        source: 'nombre',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'orden',
      title: 'Orden de aparición',
      type: 'number',
      description: 'Escribe 1 para Las 3 Tzimoleras, 2 para el siguiente, etc.',
    },
    {
      name: 'descripcion',
      type: 'text',
      title: 'Descripción Corta (Para la tarjeta principal)',
      description: 'Texto breve. Ej: Un rincón natural imperdible.',
    },
    {
      name: 'imagenPrincipal',
      type: 'image',
      title: 'Fotografía Principal (Para la tarjeta y portada)',
      options: { hotspot: true },
    },
    
    // ⬇️ ¡AQUÍ EMPIEZAN LOS NUEVOS SUPERPODERES! ⬇️

    {
      name: 'contenidoDetallado',
      title: 'Información Detallada (Para la página interna)',
      type: 'array',
      description: 'Aquí pueden escribir toda la información completa, usar negritas, listas y subtítulos.',
      of: [{ type: 'block' }], // Esto activa el editor estilo "Word" en Sanity
    },
    {
      name: 'galeria',
      title: 'Galería de Fotos Adicionales',
      type: 'array',
      description: 'Sube todas las fotos extra que quieras mostrar en la página del lugar.',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'ubicacionMapa',
      title: 'Enlace de Google Maps',
      type: 'url',
      description: 'Ve a Google Maps, busca el lugar, dale a Compartir -> Copiar enlace y pégalo aquí.',
    },

    // ⬆️ FIN DE LOS NUEVOS SUPERPODERES ⬆️

    {
      name: 'enlaceVideo',
      type: 'url',
      title: 'Enlace de Video (YouTube)',
      description: 'Opcional. Pega el link de YouTube.',
    },
    {
      name: 'enlaceExterno',
      type: 'url',
      title: 'Sitio Web Oficial o Redes Sociales',
      description: 'Opcional. Ideal para centros administrados, ej: link de Las 3 Tzimoleras. Si es público, déjalo vacío.',
    }
  ]
}