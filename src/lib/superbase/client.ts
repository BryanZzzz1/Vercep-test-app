import { createBrowserClient } from '@supabase/ssr';
// Importamos los tipos de la base de datos para la seguridad de tipos.
import { Database } from './database.types'; 

// Esta función se usa en todos los componentes del cliente ('use client')
// que necesitan interactuar con Supabase.
export const createClient = () =>
  createBrowserClient<Database>(
    // Variables de entorno de Next.js
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
