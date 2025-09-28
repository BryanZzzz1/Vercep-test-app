'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(`Error al iniciar sesión: ${error.message}`);
      } else {
        // Redirige a la raíz (donde el AuthContext verificará si es Admin)
        setMessage('Inicio de sesión exitoso. Redirigiendo...');
        router.refresh(); // Fuerza la re-renderización del layout y del contexto
        router.push('/'); 
      }
    } catch (err) {
      setMessage('Ocurrió un error inesperado.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Iniciar Sesión</h2>
      
      {message && (
        <p style={{ padding: '10px', backgroundColor: message.includes('Error') ? '#fdd' : '#dfd', color: message.includes('Error') ? '#c00' : '#090', borderRadius: '4px', marginBottom: '15px' }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSignIn}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
            disabled={loading}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: loading ? '#aaa' : '#0070f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        <Link href="/auth" style={{ color: '#0070f3', textDecoration: 'none' }}>
            ¿No tienes cuenta? Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
