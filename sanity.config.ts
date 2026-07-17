import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'


// 1. IMPORTAMOS TU MOLDE AQUÍ ARRIBA
import lugarTuristico from './sanity/schemas/lugarTuristico' 
import rutaCultural from './sanity/schemas/experienciaCultural'; // 👈 1. Agrega esta línea

export default defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,

  plugins: [structureTool(),],

  schema: {
    // 2. LO AGREGAMOS DENTRO DE LOS CORCHETES
    types: [lugarTuristico, rutaCultural], //], 
    
  },
})