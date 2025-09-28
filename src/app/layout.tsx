'use client'; // ¡IMPORTANTE! Necesario para usar hooks (useState, useEffect)

import type { Metadata } from "next";
// Asumo que usas las fuentes Geist, si no, usa Inter o la que tengas
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Importamos el AuthProvider y el hook para usar la sesión
import { AuthProvider, useAuth } from '@/lib/AuthProvider';
import { useMobileDetection } from '@/lib/useMobileDetection'; // <-- IMPORTADO
import "./globals.css";
import { useState } from "react";

// --- Definición de Fuentes (Manteniendo tu configuración) ---
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const metaData = {
    title: "E-commerce MVP",
    description: "Catálogo y Dashboard construido con Next.js y Supabase",
};


// --- COMPONENTE DE BARRA DE NAVEGACIÓN (CLIENTE) ---
function NavBar() {
    // Usamos el hook para obtener el estado del usuario
    const { user, profile, isAdmin, signOut, loading } = useAuth();
    const router = useRouter();
    const isMobile = useMobileDetection(); // <-- USANDO EL HOOK
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú de hamburguesa

    // Estilos base de la navegación
    const navStyle: React.CSSProperties = {
        backgroundColor: '#333',
        padding: '15px 20px', // Reducimos el padding en los laterales
        color: 'white',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row', // Vertical en móvil
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center', // Alineación izquierda en móvil
        fontFamily: 'var(--font-geist-sans), sans-serif',
    };
    
    // Estilos para el texto y enlaces
    const linkStyle: React.CSSProperties = {
        color: 'white',
        textDecoration: 'none',
        marginRight: isMobile ? '0' : '20px', // Quitamos margen derecho en móvil
        marginBottom: isMobile ? '10px' : '0', // Agregamos margen inferior en móvil
        fontWeight: 'bold',
        padding: '8px 10px', // Aumentamos padding para mejor target táctil
        borderRadius: '4px',
        transition: 'background-color 0.2s',
        display: 'block' // Aseguramos que ocupe todo el ancho en móvil
    };

    const activeLinkStyle = {
        ...linkStyle,
        backgroundColor: '#555',
    };

    // Estilo para el contenedor del menú (lo que se colapsa)
    const menuContainerStyle: React.CSSProperties = {
        display: isMobile && !isMenuOpen ? 'none' : 'flex', // Ocultar si es móvil y el menú está cerrado
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        width: isMobile ? '100%' : 'auto',
        marginTop: isMobile ? '10px' : '0',
    };

    // Estilo para el botón de hamburguesa (solo visible en móvil)
    const menuToggleStyle: React.CSSProperties = {
        display: isMobile ? 'block' : 'none',
        fontSize: '1.8em',
        cursor: 'pointer',
        alignSelf: 'flex-end',
        position: 'absolute', // Permite que el botón quede arriba a la derecha
        top: '15px',
        right: '20px',
    };

    // Estilo para el contenedor de usuario/botones de autenticación
    const authControlsStyle: React.CSSProperties = {
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        marginTop: isMobile ? '10px' : '0', 
        marginLeft: isMobile ? '0' : '40px',
    };


    if (loading) {
        return <nav style={navStyle}><p>Cargando...</p></nav>;
    }


    return (
        <nav style={{ ...navStyle, position: 'relative' }}> {/* Posición relativa para el botón de hamburguesa */}
            
            {/* Título y Botón de Hamburguesa */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: isMobile ? '100%' : 'auto' }}>
                <Link href="/" style={{ ...linkStyle, fontSize: '1.4em', marginBottom: '0' }}>
                    MiTienda
                </Link>

                {/* Botón de Hamburguesa (sólo en móvil) */}
                <div 
                    style={menuToggleStyle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? '✕' : '☰'} 
                </div>
            </div>

            {/* Contenedor del Menú que se Colapsa */}
            <div style={menuContainerStyle}>
                
                {/* Menú principal (Catálogo, Admin) */}
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center' }}>
                    <Link href="/catalogo" style={linkStyle}>
                        Catálogo
                    </Link>
                    
                    {isAdmin && (
                        <Link href="/admin" style={{ ...activeLinkStyle, backgroundColor: '#8b0000', marginLeft: isMobile ? '0' : '10px' }}>
                            Dashboard (Admin)
                        </Link>
                    )}
                </div>

                {/* --- Lado Derecho: Autenticación --- */}
                {!user ? (
                    // Si NO hay usuario logueado
                    <div style={authControlsStyle}>
                        <Link href="/login" style={linkStyle}>
                            Iniciar Sesión
                        </Link>
                        <Link href="/auth" style={{ ...linkStyle, marginLeft: isMobile ? '0' : '10px', backgroundColor: '#0070f3' }}>
                            Registrarse
                        </Link>
                    </div>
                ) : (
                    // Si HAY usuario logueado
                    <div style={authControlsStyle}>
                        <span style={{ marginRight: isMobile ? '0' : '15px', color: '#ccc', fontSize: '0.9em', marginBottom: isMobile ? '10px' : '0' }}>
                            Hola, **{profile?.username || 'Usuario'}**
                        </span>
                        <button
                            onClick={signOut}
                            style={{
                                padding: '8px 15px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'background-color 0.2s',
                                width: isMobile ? '100%' : 'auto',
                            }}
                        >
                            Salir
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
// --- FIN DEL NAVBAR ---


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                {/* 1. Envolvemos toda la aplicación en el AuthProvider */}
                <AuthProvider>
                    
                    {/* 2. Insertamos el Navbar (que usa el contexto) */}
                    <NavBar />
                    
                    {/* 3. Contenido de la página */}
                    {children}
                    
                </AuthProvider>
            </body>
        </html>
    );
}
