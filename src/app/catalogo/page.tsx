// app/catalogo/page.tsx
import { createClient } from '@supabase/supabase-js';

// --- (1) Definición de Tipos para TypeScript ---
interface Producto {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
}

// --- (2) Conexión a Supabase ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- (3) Componente Asíncrono ---
export default async function CatalogoPage() {
  const { data: productos, error } = await supabase
    .from("productos")
    .select("id, name, price, image_url");

  if (error) {
    console.error("Error al cargar productos:", error);
    return (
      <main style={{ padding: "20px" }}>
        Error al cargar el catálogo. Revisa tus claves API y las políticas de RLS en Supabase.
      </main>
    );
  }

  // --- (4) Renderizado del Catálogo ---
  return (
    <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>Catálogo de Productos</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {productos?.map((producto: Producto) => (
          <div
            key={producto.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
              backgroundColor: "#fff",
            }}
          >
            {producto.image_url ? (
              <img
                src={producto.image_url}
                alt={producto.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  background: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#aaa",
                  fontSize: "14px",
                }}
              >
                Sin imagen
              </div>
            )}

            <div style={{ padding: "15px" }}>
              <h2 style={{ fontSize: "18px", margin: "0 0 10px" }}>
                {producto.name}
              </h2>
              <p style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}>
                ${producto.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
