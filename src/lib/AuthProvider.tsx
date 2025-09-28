'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
// Asegúrate de que '@/lib/supabase' sea la ruta correcta a tu cliente de Supabase
import { createClientComponentClient } from '@/lib/supabase'; 

// Definición de tipos para el perfil de usuario (incluyendo is_admin)
interface UserProfile {
  username: string | null;
  is_admin: boolean;
}

// Definición de tipos para el Contexto de Autenticación
interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Inicializamos el cliente de Supabase (componente de cliente)
const supabase = createClientComponentClient();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Variable computada para el rol de administrador
  const isAdmin = profile ? profile.is_admin : false;

  // 1. Manejador de estado de autenticación (Suscripción)
  useEffect(() => {
    // 1.a. Obtener la sesión inicial
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // 1.b. Suscribirse a cambios de estado
    const { data: listener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    // Limpiar la suscripción
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // 2. Obtener el perfil y el rol (is_admin) del usuario
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setLoading(true);
        // Traer el perfil de la tabla 'profiles'
        const { data, error } = await supabase
          .from('profiles')
          .select(`username, is_admin`)
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setProfile({ username: 'Desconocido', is_admin: false });
        } else if (data) {
          setProfile({ username: data.username || 'Usuario', is_admin: data.is_admin });
        }
        setLoading(false);
      } else {
        setProfile(null);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]); // Ejecutar cuando el usuario cambia

  // 3. Funciones de Autenticación
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    // Nota: El estado de user/session se actualizará automáticamente por el listener
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    // El listener se encarga de limpiar el estado
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};