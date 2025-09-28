import type { Metadata } from "next"; 
import Link from 'next/link'; // Necesario para crear enlaces rápidos
import { Inter } from "next/font/google"; // Asumiendo que usas Inter o lo reemplazarás
import "./globals.css"; // Estilos globales

// Define la fuente (si existe)
// Si usas Geist, reemplaza Inter con tu configuración de Geist
const inter = Inter({ subsets: ["latin"] }); 

// Define los Metadatos
export const metadata: Metadata = {
  title: "E-commerce MVP",
  description: "Catálogo y Dashboard construido con Next.js y Supabase",
};

// --- COMPONENTE DE BARRA DE NAVEGACIÓN (Navbar) ---
function NavBar() {
  const navStyle = {
    backgroundColor: '#333',
    padding: '15px 40px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };
  
  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    marginRight: '20px',
    fontWeight: 'bold',
    transition: 'opacity 0.2s',
  };

  return (
    <nav style={navStyle}>
      {/* Título y Enlace a la Página Principal (/) */}
      <Link href="/" style={{ ...linkStyle, fontSize: '1.4em' }}>
        MiTienda
      </Link>
      
      <div>
        {/* Enlaces Públicos */}
        <Link href="/catalogo" style={linkStyle}>
          Catálogo
        </Link>
        
        {/* Separador */}
        <span style={{ margin: '0 10px', color: '#888' }}>|</span>
        
        {/* Enlace al Dashboard Admin */}
        <Link href="/admin" style={{ ...linkStyle, backgroundColor: '#8b0000', padding: '5px 10px', borderRadius: '4px' }}>
          ADMIN (Dashboard)
        </Link>
      </div>
    </nav>
  );
}
// --- FIN DEL NAVBAR ---


// Este es el componente principal que contiene <html> y <body>
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es"> 
      {/* Usamos la clase de la fuente o la clase que hayas definido en Geist */}
      <body className={inter.className}> 
        
        {/* La Barra de Navegación Global */}
        <NavBar />
        
        {/* 'children' es donde se inserta el contenido de la página actual (/ o /admin) */}
        {children} 
        
      </body>
    </html>
  );
}
