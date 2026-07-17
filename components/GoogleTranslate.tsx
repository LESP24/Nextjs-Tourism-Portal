'use client';

import { useEffect } from 'react';

export default function GoogleTranslate() {
  useEffect(() => {
    // Declaramos la función de inicialización para que Google la encuentre
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { 
          pageLanguage: 'es', 
          // Aquí puedes limitar los idiomas, por ejemplo: inglés, francés, alemán
          includedLanguages: 'en,fr,de,it', 
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE 
        },
        'google_translate_element'
      );
    };

    // Inyectamos el script oficial de Google Translate de forma asíncrona
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    // Este div es donde aparecerá mágicamente el menú desplegable de idiomas
    <div id="google_translate_element" className="translate-container"></div>
  );
}