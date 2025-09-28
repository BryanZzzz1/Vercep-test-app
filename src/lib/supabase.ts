import { createClient } from '@supabase/supabase-js'

// Asegúrate de que las variables de entorno estén disponibles
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY son requeridas.')
}

// Cliente de Supabase para ser usado en Componentes de Cliente
export const createClientComponentClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}
