

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const setup = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (session?.user) {
        const { id, email, user_metadata } = session.user;

        const { data: profileData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', id)
          .single();

        const name = profileData?.name || user_metadata?.name || 'Usuário';
        // CORRIGIDO 1/3: Garante que o email seja string
        setUser({ id, name, email: email ?? "" }); 
      } else {
        setUser(null);
      }

      setIsLoading(false);
    };

    setup();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { id, email, user_metadata } = session.user;

        const { data: profileData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', id)
          .single();

        const name = profileData?.name || user_metadata?.name || 'Usuário';
        // CORRIGIDO 2/3: Garante que o email seja string
        setUser({ id, name, email: email ?? "" }); 
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      throw new Error('E-mail ou senha incorretos.');
    }

    const { id, user_metadata } = data.user;
    const { data: profileData } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', id)
      .single();

    const name = profileData?.name || user_metadata?.name || 'Usuário';
    // CORRIGIDO 3/3: Garante que o email seja string
    setUser({ id, name, email: email ?? "" }); 
    router.push('/catalogo');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
