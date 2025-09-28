'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const supabase = createClientComponentClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Error: Las contraseñas no coinciden.');
      return;
    }
    
    // VALIDACIÓN BÁSICA DE CONTRASEÑA (Supabase la gestiona)
    if (password.length < 6) {
        setMessage('Error: La contraseña debe tener al menos 6 caracteres.');
        return;
    }


    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            // Aquí puedes añadir más opciones si es necesario
        }
      });

      if (error) {
        setMessage(`Error al registrar: ${error.message}`);
      } else if (data.user) {
        // El usuario se crea en auth.users, el trigger crea la fila en profiles.
        setMessage('¡Registro exitoso! Revisa tu email para confirmar tu cuenta.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        // En un escenario real, redirigirías aquí.
        // redirect('/'); 
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
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Registro de Nuevo Usuario</h2>
      
      {message && (
        <p style={{ padding: '10px', backgroundColor: message.includes('Error') ? '#fdd' : '#dfd', color: message.includes('Error') ? '#c00' : '#090', borderRadius: '4px', marginBottom: '15px' }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSignUp}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email (Será tu Usuario):</label>
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
        <div style={{ marginBottom: '15px' }}>
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
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>Confirmar Contraseña:</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        <Link href="/login" style={{ color: '#0070f3', textDecoration: 'none' }}>
            ¿Ya tienes cuenta? Inicia Sesión
        </Link>
      </p>
    </div>
  );
}