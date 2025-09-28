'use client';

import { useAuth } from '@/lib/AuthProvider';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// Reemplaza esto con tu cliente real de Supabase si es necesario para crear productos
const mockCreateProduct = (product: { name: string, price: number }) => {
    return new Promise(resolve => setTimeout(() => {
        console.log("Producto creado (Mock):", product);
        resolve({ success: true });
    }, 1000));
};

export default function AdminDashboard() {
    // 1. Usar el hook de autenticación
    const { user, isAdmin, loading } = useAuth();
    const router = useRouter();
    
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    // --- Lógica de Protección ---
    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p>Cargando sesión y verificando permisos...</p>
            </div>
        );
    }

    if (!user) {
        // Si no está logueado, lo manda a Login
        router.push('/login');
        return null;
    }

    if (!isAdmin) {
        // Si está logueado pero NO es admin, le niega el acceso
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#8b0000' }}>
                <h2>Acceso Denegado</h2>
                <p>No tienes los permisos de administrador para acceder a este dashboard.</p>
                <button 
                    onClick={() => router.push('/')}
                    style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Volver al Catálogo
                </button>
            </div>
        );
    }
    // --- Fin Lógica de Protección ---

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        try {
            // Aquí iría la lógica real de supabase.from('products').insert(...)
            await mockCreateProduct({ name: productName, price: productPrice });
            setMessage(`¡Producto "${productName}" creado con éxito!`);
            setProductName('');
            setProductPrice(0);
        } catch (error) {
            setMessage('Error al crear el producto.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h1 style={{ textAlign: 'center', color: '#8b0000' }}>Dashboard de Administración</h1>
            <p style={{ textAlign: 'center', marginBottom: '30px', color: '#555' }}>
                Solo visible para usuarios con `is_admin: true` en Supabase.
            </p>

            {message && (
                <div style={{ padding: '10px', backgroundColor: message.includes('Error') ? '#fdd' : '#dfd', color: message.includes('Error') ? '#c00' : '#090', borderRadius: '4px', marginBottom: '15px' }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre del Producto</label>
                    <input
                        id="name"
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
                        disabled={isSubmitting}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="price" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Precio ($)</label>
                    <input
                        id="price"
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(parseFloat(e.target.value))}
                        required
                        min="0"
                        step="0.01"
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
                        disabled={isSubmitting}
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={isSubmitting || !user}
                    style={{ 
                        width: '100%', 
                        padding: '12px', 
                        backgroundColor: isSubmitting || !user ? '#aaa' : '#8b0000', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: isSubmitting || !user ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s'
                    }}
                >
                    {isSubmitting ? 'Guardando...' : 'Agregar Nuevo Producto'}
                </button>
            </form>
        </div>
    );
}