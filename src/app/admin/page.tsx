// app/admin/page.tsx
'use client'; 

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURACIÓN DE SUPABASE (Temporalmente pública) ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('Agregando producto...');

    const precioNumerico = parseFloat(precio);
    const stockNumerico = parseInt(stock);

    const { error } = await supabase
      .from('productos')
      .insert([
        { 
          nombre: nombre, 
          precio: precioNumerico, 
          stock: stockNumerico 
          // La descripción y URL de imagen se pueden agregar fácilmente
        },
      ]);

    if (error) {
      console.error(error);
      setMensaje(`⛔ ERROR: No se pudo agregar el producto. Revisa la RLS en Supabase.`);
    } else {
      setMensaje(`✅ Producto '${nombre}' agregado con éxito!`);
      // Limpiar formulario
      setNombre('');
      setPrecio('');
      setStock('');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Dashboard: Agregar Nuevo Producto</h1>
      <p style={{ color: 'green', fontWeight: 'bold' }}>{mensaje}</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
        <label>
          Nombre:
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </label>
        
        <label>
          Precio:
          <input 
            type="number" 
            value={precio} 
            onChange={(e) => setPrecio(e.target.value)} 
            required 
            min="0.01"
            step="0.01"
            style={{ width: '100%', padding: '8px' }}
          />
        </label>

        <label>
          Stock:
          <input 
            type="number" 
            value={stock} 
            onChange={(e) => setStock(e.target.value)} 
            required 
            min="0"
            style={{ width: '100%', padding: '8px' }}
          />
        </label>

        <button 
          type="submit" 
          style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Guardar Producto
        </button>
      </form>
      
      <p style={{ marginTop: '20px' }}>
        <a href="/catalogo" style={{ color: '#0070f3' }}>← Ver Catálogo (Página Principal)</a>
      </p>
    </div>
  );
}