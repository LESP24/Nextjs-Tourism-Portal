import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://portal-turistico-tzimol.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/studio/', // Bloquea el acceso de los buscadores al panel de Sanity
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}