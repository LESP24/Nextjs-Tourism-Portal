import { MetadataRoute } from 'next';
import { clienteSanity } from '../sanity/cliente'; // Importación corregida

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://portal-turistico-tzimol.vercel.app';

  // 1. Consulta a Sanity
  const query = `{
    "destinos": *[_type == "lugarTuristico"]{ "slug": slug.current, _updatedAt },
    "cultura": *[_type == "experienciaCultural"]{ "slug": slug.current, _updatedAt }
  }`;

  // 2. Uso correcto de tu cliente exportado
  const data = await clienteSanity.fetch(query); 

  // 3. Definir las páginas principales estáticas
  const rutasEstaticas = [
    '',
    '/turismo',
    '/cultura',
  ].map((ruta) => ({
    url: `${baseUrl}${ruta}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: ruta === '' ? 1 : 0.8,
  }));

  // 4. Mapear las rutas dinámicas de los destinos
  const rutasDestinos = data.destinos?.map((destino: any) => ({
    url: `${baseUrl}/destinos/${destino.slug}`,
    lastModified: new Date(destino._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })) || [];

  // 5. Mapear las rutas dinámicas de cultura
  const rutasCultura = data.cultura?.map((articulo: any) => ({
    url: `${baseUrl}/cultura/${articulo.slug}`,
    lastModified: new Date(articulo._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })) || [];

  // 6. Unir todas las rutas y generar el archivo
  return [...rutasEstaticas, ...rutasDestinos, ...rutasCultura];
}