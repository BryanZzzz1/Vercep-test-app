'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/superbase/client'; // Importamos el cliente centralizado
import { useAuth } from '@/lib/AuthProvider';
import { useRouter } from 'next/navigation';
import { useMobileDetection } from '@/lib/useMobileDetection';
import { v4 as uuidv4 } from 'uuid'; // Necesitas instalar 'uuid' si no lo tienes: npm install uuid

// Definición simple del tipo de producto
interface Producto {
    id?: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string | null;
}

export default function AdminDashboardPage() {
    const { isAdmin, loading } = useAuth();
    const router = useRouter();
    
    const supabase = createClient(); // Inicializamos el cliente

    const [newProduct, setNewProduct] = useState<Omit<Producto, 'id' | 'image_url'>>({
        name: '',
        description: '',
        price: 0,
        stock: 0,
    });
    const isMobile = useMobileDetection();
    const [imageFile, setImageFile] = useState<File | null>(null); // Nuevo estado para el archivo
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Redirección y Control de Acceso ---
    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/');
        }
    }, [isAdmin, loading, router]);

    // --- MANEJO DE INPUTS ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: (name === 'price' || name === 'stock') ? Number(value) : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    // --- MANEJO DE LA CREACIÓN DEL PRODUCTO ---
    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsSubmitting(true);
        let imageUrl: string | null = null; // Variable para guardar la URL de la imagen

        if (!newProduct.name || newProduct.price <= 0 || newProduct.stock < 0) {
            setError('Por favor, completa todos los campos requeridos con valores válidos.');
            setIsSubmitting(false);
            return;
        }

        try {
            // 1. SUBIDA DE LA IMAGEN A SUPABASE STORAGE
            if (imageFile) {
                // Generar un nombre de archivo único
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${uuidv4()}.${fileExt}`;
                const filePath = `public/${fileName}`; // Guardar en una carpeta pública

                const { error: uploadError } = await supabase.storage
                    .from('product_images') // Asume que tienes un bucket llamado 'product_images'
                    .upload(filePath, imageFile);

                if (uploadError) {
                    throw new Error(`Error al subir la imagen: ${uploadError.message}`);
                }

                // Obtener la URL pública (la necesitas para mostrarla en el catálogo)
                const { data: publicUrlData } = supabase.storage
                    .from('product_images')
                    .getPublicUrl(filePath);
                
                imageUrl = publicUrlData.publicUrl;
            }

            // 2. INSERCIÓN DEL PRODUCTO EN LA BASE DE DATOS
            const { data, error: insertError } = await supabase
                .from('productos')
                .insert([{
                    ...newProduct,
                    image_url: imageUrl, // Guardamos la URL pública (puede ser null si no se subió imagen)
                }])
                .select();

            if (insertError) {
                // Si la inserción falla, lanza un error para que el catch lo maneje
                throw new Error(`Error al insertar en DB: ${insertError.message}`);
            }

            console.log('Producto creado con éxito:', data);
            setMessage(`Producto "${newProduct.name}" creado con éxito.`);
            
            // Limpiar formulario y archivo
            setNewProduct({ name: '', description: '', price: 0, stock: 0 });
            setImageFile(null);
            const imageInput = document.getElementById('image-upload') as HTMLInputElement;
            if (imageInput) imageInput.value = ''; // Limpia el input file
            
        } catch (err: any) {
            console.error('Error durante la creación del producto:', err.message);
            setError(`Error: ${err.message}. Verifica las políticas de RLS en la tabla 'productos' y en el bucket 'product_images'.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || !isAdmin) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
                <p>Cargando o acceso no autorizado...</p>
            </div>
        );
    }

    // --- ESTILOS DARK/RESPONSIVOS ---
    const darkThemeColors = {
        background: '#1a1a1a', 
        cardBg: '#2a2a2a',     
        text: '#f0f0f0',       
        inputBg: '#3a3a3a',
        primary: '#8b0000', 
        success: '#28a745',
        error: '#dc3545',
    };

    const baseStyle = { 
        width: isMobile ? '95%' : '700px',
        margin: '50px auto', 
        padding: isMobile ? '20px' : '30px', 
        borderRadius: '12px', 
        boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
        backgroundColor: darkThemeColors.cardBg, 
        color: darkThemeColors.text, 
        fontFamily: 'var(--font-geist-sans), sans-serif',
    };

    const inputStyle = {
        width: '100%', 
        padding: '12px',
        boxSizing: 'border-box', 
        border: '1px solid #555', 
        borderRadius: '8px', 
        backgroundColor: darkThemeColors.inputBg, 
        color: darkThemeColors.text,
        marginBottom: '15px',
    };

    const fileInputStyle = {
        ...inputStyle,
        padding: '8px 12px',
        cursor: 'pointer',
    }

    const buttonStyle = { 
        width: '100%', 
        padding: '14px', 
        border: 'none', 
        borderRadius: '8px', 
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1.1em',
        transition: 'background-color 0.2s',
        marginTop: '25px',
        backgroundColor: darkThemeColors.primary,
        color: 'white',
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: darkThemeColors.background, padding: '20px' }}>
            <div style={baseStyle}>
                <h1 style={{ textAlign: 'center', color: darkThemeColors.text, marginBottom: '30px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
                    Dashboard de Administración
                </h1>

                <h2>Crear Nuevo Producto</h2>
                
                {error && (
                    <div style={{ padding: '10px', backgroundColor: '#4a2525', color: darkThemeColors.error, borderRadius: '6px', marginBottom: '15px' }}>
                        {error}
                    </div>
                )}
                {message && (
                    <div style={{ padding: '15px', backgroundColor: '#2d4734', color: darkThemeColors.success, borderRadius: '6px', marginBottom: '15px' }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleCreateProduct}>
                    {/* Campos de Texto */}
                    <label style={{ display: 'block', marginBottom: '5px' }}>Nombre:</label>
                    <input name="name" type="text" value={newProduct.name} onChange={handleInputChange} style={inputStyle} required />

                    <label style={{ display: 'block', marginBottom: '5px' }}>Descripción:</label>
                    <textarea name="description" value={newProduct.description} onChange={handleInputChange} style={{ ...inputStyle, minHeight: '80px' }} required />

                    {/* Campos Numéricos */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Precio ($):</label>
                            <input name="price" type="number" value={newProduct.price} onChange={handleInputChange} style={inputStyle} min="0.01" step="0.01" required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Stock:</label>
                            <input name="stock" type="number" value={newProduct.stock} onChange={handleInputChange} style={inputStyle} min="0" required />
                        </div>
                    </div>
                    
                    {/* Campo de Subida de Imagen */}
                    <label style={{ display: 'block', marginBottom: '5px' }}>Imagen del Producto:</label>
                    <input 
                        id="image-upload"
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        style={fileInputStyle} 
                    />
                    
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{ ...buttonStyle, backgroundColor: isSubmitting ? '#555' : darkThemeColors.primary }}
                    >
                        {isSubmitting ? 'Creando Producto...' : 'Crear Producto'}
                    </button>
                </form>

            </div>
        </div>
    );
}
