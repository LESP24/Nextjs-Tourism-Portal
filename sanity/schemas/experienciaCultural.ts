export default {
  name: 'experienciaCultural',
  type: 'document',
  title: 'Tradición y Cultura',
  fields: [
    {
      name: 'titulo',
      type: 'string',
      title: 'Nombre del Lugar o Tradición',
      description: 'Ej: Templo de Santo Domingo, La Ruta del Posh, Fiesta de San Román...',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Identificador (URL)',
      type: 'slug',
      options: {
        source: 'titulo',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'tipoElemento',
      title: 'Categoría',
      type: 'string',
      description: 'Selecciona qué tipo de información estás subiendo',
      options: {
        list: [
          { title: 'Iglesia / Templo', value: 'iglesia' },
          { title: 'Ruta Pública', value: 'ruta' },
          { title: 'Festividad o Tradición', value: 'festividad' },
          { title: 'Lugar Histórico', value: 'historico' },
          { title: 'Gastronomía', value: 'gastronomia' }
        ],
        layout: 'radio'
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'numero',
      title: 'Número de Orden (Opcional)',
      type: 'string',
      description: 'Ej: 01, 02... Sirve para ordenar cómo aparecen en la página principal.',
    },
    {
      name: 'autor',
      title: 'Guía, Autor o Contacto (Opcional)',
      type: 'string',
      description: 'Si es una ruta puede ser el guía local. Si es una iglesia, se puede dejar en blanco.',
    },
    {
      name: 'imagenPrincipal',
      type: 'image',
      title: 'Fotografía de Portada',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'descripcionCorta',
      type: 'text',
      title: 'Descripción Corta',
      description: 'Resumen de 1 o 2 líneas para invitar al turista a descubrir más.',
    },
    {
      name: 'contenidoDetallado',
      title: 'Historia y Detalles Completos',
      type: 'array',
      of: [
        { type: 'block' }
      ],
      description: 'Aquí puedes escribir toda la historia. El texto rodeará automáticamente la primera foto de la galería.',
    },
    {
      name: 'galeria',
      title: 'Galería de Fotos Adicionales',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Sube aquí las fotos. La primera aparecerá flotando junto al texto.',
    },
    {
      name: 'enlaceVideo',
      title: 'Enlace de Video (YouTube o Facebook)',
      type: 'url',
      description: 'Pega aquí el link del video para mostrarlo en la página.',
    },
    {
      name: 'ubicacionMapa',
      title: 'Enlace de Ubicación (Google Maps)',
      type: 'url',
      description: 'Pega aquí el enlace de Google Maps para que el turista pueda llegar fácilmente.',
    }
  ]
}