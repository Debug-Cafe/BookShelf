'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState<string | null>(null);
 

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Erro ao buscar usuário:', error.message);
      } else {
        setUser(data.user);
      }
      // carregar avatar do localStorage, se houver
      const saved = localStorage.getItem('user-avatar');
      if (saved) setAvatar(saved);
      setLoading(false);
    };
    fetchUser();
  }, []);


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setAvatar(base64);
        localStorage.setItem('user-avatar', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--main-background)] text-[var(--foreground)]">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--main-background)] text-red-600">
        <p>Você precisa estar logado para ver este conteúdo.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--main-background)] text-[var(--foreground)]">
      {/* Conteúdo principal */}
      <section className="relative -mt-24 px-4 pb-8">
        <div className="max-w-3xl mx-auto bg-[var(--form-background)] rounded-xl shadow-2xl p-8 border border-[var(--divider-color)]">
          
          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
            {/* Avatar */}
            <div className="shrink-0">
              {avatar ? (
                <Image
                  src={avatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-[var(--divider-color)]"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-[var(--divider-color)] flex items-center justify-center text-white text-3xl border-4 border-[var(--divider-color)]">
                  {user.user_metadata?.name?.charAt(0) || 'U'}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-2 text-xs text-[var(--foreground)]"
              />
            </div>

            {/* Informações do usuário */}
            <div className="mt-4 md:mt-0 flex-1">
              <h1 className="text-4xl font-bold text-[var(--title-color)]">
                {user.user_metadata?.name || 'Usuário'}
              </h1>
              <p className="text-sm text-[var(--foreground)] opacity-80 mb-4">
                {user.email}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="font-semibold">ID:</span> {user.id}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => alert('Editar perfil em breve')}
                  className="flex-1 py-2 bg-white text-[var(--title-color)] border border-[var(--divider-color)] rounded-md hover:bg-[var(--divider-color)] hover:text-white transition"
                >
                  Editar Perfil
                </button>
              
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
