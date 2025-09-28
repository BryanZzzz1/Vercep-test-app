'use client'; // ¡IMPORTANTE! Necesario para usar hooks (useState, useEffect)

import type { Metadata } from "next";
// Asumo que usas las fuentes Geist, si no, usa Inter o la que tengas
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Importamos el AuthProvider y el hook para usar la sesión
import { AuthProvider, useAuth } from '@/lib/AuthProvider';
import "./globals.css";

// --- Definición de Fuentes (Manteniendo tu configuración) ---
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Los metadatos de Next.js NO pueden estar en un componente de cliente,
// así que los mantenemos aquí y los exportamos, o los movemos a un archivo estático si es necesario.
// Si esto causa error en el server, coméntalo y reubícalo.
// Ya que la directiva 'use client' está arriba, esta exportación podría fallar.
// Vamos a mantenerlos en un objeto constante si falla:
const metaData = {
  title: "E-commerce MVP",
  description: "Catálogo y Dashboard construido con Next.js y Supabase",
};


// --- COMPONENTE DE BARRA DE NAVEGACIÓN (CLIENTE) ---
function NavBar() {
  // Usamos el hook para obtener el estado del usuario
  const { user, profile, isAdmin, signOut, loading } = useAuth();
  const router = useRouter();

  const navStyle = {
    backgroundColor: '#333',
    padding: '15px 40px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'var(--font-geist-sans), sans-serif',
  };
  
  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    marginRight: '20px',
    fontWeight: 'bold',
    padding: '5px 10px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#555',
  };

  if (loading) {
    // No mostrar nada o un spinner mientras carga
    return <nav style={navStyle}><p>Cargando...</p></nav>;
  }


  return (
    <nav style={navStyle}>
      {/* Título y Enlace a la Página Principal (Catálogo) */}
      <Link href="/" style={{ ...linkStyle, fontSize: '1.4em', marginRight: '40px' }}>
        MiTienda
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Enlace al Catálogo (Visible para todos) */}
        <Link href="/catalogo" style={linkStyle}>
          Catálogo
        </Link>
        
        {/* Mostrar Dashboard solo si es Admin */}
        {isAdmin && (
          <Link href="/admin" style={{ ...activeLinkStyle, backgroundColor: '#8b0000', marginLeft: '10px' }}>
            Dashboard (Admin)
          </Link>
        )}

        {/* --- Lado Derecho: Autenticación --- */}
        {!user ? (
          // Si NO hay usuario logueado
          <div style={{ marginLeft: '40px' }}>
            <Link href="/login" style={linkStyle}>
              Iniciar Sesión
            </Link>
            <Link href="/auth" style={{ ...linkStyle, marginLeft: '10px', backgroundColor: '#0070f3' }}>
              Registrarse
            </Link>
          </div>
        ) : (
          // Si HAY usuario logueado
          <div style={{ marginLeft: '40px', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '15px', color: '#ccc', fontSize: '0.9em' }}>
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
                transition: 'background-color 0.2s'
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