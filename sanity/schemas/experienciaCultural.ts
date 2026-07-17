export default {
  name: 'experienciaCultural', // Se cambia para que sea más general
  type: 'document',
  title: 'Tradición y Cultura', // Lo que leerá el Ayuntamiento en el panel
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
        layout: 'radio' // Se mostrará como botones de selección en Sanity
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
      of: [{ type: 'block' }],
    },
    {
      name: 'galeria',
      title: 'Galería de Fotos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'ubicacionMapa',
      title: 'Enlace de Ubicación (Google Maps)',
      type: 'url',
      description: 'Pega aquí el enlace de Google Maps para que el turista pueda llegar fácilmente.',
    }
  ]
}