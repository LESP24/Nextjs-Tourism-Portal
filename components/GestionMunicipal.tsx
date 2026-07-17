import Image from 'next/image';

export default function GestionMunicipal() {
  return (
    <section className="py-20 bg-crema border-b border-selva/10">
      <div className="contenedor-sitio grid md:grid-cols-2 gap-12 items-center">
        
        {/* Columna Visual del Presidente */}
        <div className="relative h-[450px] rounded-xl overflow-hidden shadow-2xl border border-selva/10 bg-jade">
          {/* 
            Asegúrate de guardar la foto del presidente en public/imagenes/presidente.jpg 
            Si aún no la tienes, se verá el fondo verde (bg-jade)
          */}
          <Image
           src="/imagenes/Presidente.jpeg"
           alt="Presidente Municipal"
           fill
           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
           className="object-cover" 
/>
          
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-selva p-8 z-10">
            <p className="font-titulo text-crema text-3xl mb-1">
            Victor Alfonso Gordillo Morales
            </p>
            <p className="font-cuerpo text-sol text-sm uppercase tracking-widest font-bold">
              Presidente Municipal de Tzimol Chiapas, México
            </p>
          </div>
        </div>

        {/* Columna de Texto y Logros */}
        <div>
          <h2 className="font-titulo text-sol text-sm tracking-[0.3em] uppercase mb-3">
            H. Ayuntamiento 2024 - 2027
          </h2>
          <h3 className="font-titulo text-selva text-4xl mb-6 leading-tight">
            Impulsando el desarrollo y el turismo en nuestra tierra
          </h3>
          <p className="font-cuerpo text-selva/80 text-lg mb-8 leading-relaxed">
            "Esta administración tiene un compromiso inquebrantable con el bienestar de nuestras familias. A través de la inversión en infraestructura turística y el apoyo directo a nuestras comunidades, estamos posicionando a nuestro municipio como el destino ecoturístico más importante de la región."
          </p>
          
          {/* Lista de logros o acciones clave */}
          <ul className="space-y-4 font-cuerpo text-selva/90 font-medium">
            <li className="flex items-center gap-3">
              <span className="text-sol text-xl">✦</span> Rehabilitación de accesos principales
            </li>
            <li className="flex items-center gap-3">
              <span className="text-sol text-xl">✦</span> Fomento a la economía local y cooperativas
            </li>
            <li className="flex items-center gap-3">
              <span className="text-sol text-xl">✦</span> Preservación de nuestro patrimonio cultural
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
}