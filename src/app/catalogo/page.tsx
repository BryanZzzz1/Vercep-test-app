// app/catalogo/page.tsx
import { createClient } from '@supabase/supabase-js';

// --- (1) Definición de Tipos para TypeScript ---
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen_url: string | null;
}

// --- (2) Conexión a Supabase (debe tener las variables .env.local configuradas) ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- (3) Componente Asíncrono para Carga de Datos ---
export default async function CatalogoPage() { // <--- ¡Asegúrate de que esta línea esté correcta!
  
  // Consulta a la tabla 'productos'
  const { data: productos, error } = await supabase
    .from('productos')
    .select('id, nombre, precio, imagen_url'); 
    
  if (error) {
    console.error("Error al cargar productos:", error);
    return <main style={{ padding: '20px' }}>Error al cargar el catálogo. Revisa tus claves API y las políticas de RLS en Supabase.</main>;
  }
  
  // --- (4) Renderizado del Catálogo ---
  return (
    <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Catálogo de Productos</h1>
      
      {/* ... (El resto del JSX para mostrar la cuadrícula de productos) ... */}

      <div style={{ /* ... estilos ... */ }}>
        {productos.map((producto: Producto) => (
          <div key={producto.id} style={{ /* ... estilos ... */ }}>
            {/* ... renderizado de imagen y datos ... */}
            
            <div style={{ padding: '15px' }}>
              <h2>{producto.nombre}</h2>
              <p>${producto.precio.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}