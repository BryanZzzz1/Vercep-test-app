'use client';

import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar si la pantalla es de tamaño móvil.
 * @returns boolean true si el ancho de la ventana es menor a 600px.
 */
export function useMobileDetection() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Función para verificar si es móvil (ancho menor a 600px)
        const checkMobile = () => {
            if (typeof window !== 'undefined') {
                setIsMobile(window.innerWidth < 600);
            }
        };
        
        // Ejecutar inmediatamente al montar
        checkMobile();
        
        // Añadir listener para recalcular al redimensionar
        window.addEventListener('resize', checkMobile);
        
        // Limpiar el listener al desmontar el componente
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
}
