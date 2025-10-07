'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen } from 'lucide-react';
import LoginForm from '@/components/LoginForm';

interface HomePageProps {
  theme: 'dark' | 'light';
}

export default function HomePage({ theme }: HomePageProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/catalogo'); // redireciona automaticamente se já logado
    }
  }, [isAuthenticated, router]);

  const isDark = theme === 'dark';
  const leftBg = isDark ? "bg-[var(--background)] text-[var(--foreground)]" : "bg-[#d7a86e] text-[#3e2723]";
  const rightBg = isDark ? "bg-[#512b1e] text-[var(--foreground)]" : "bg-[#d7a86e] text-[#ffffff]";

  // Se estiver logado, não renderiza o form (ou pode mostrar um loader, se quiser)
  if (isAuthenticated) return null;

  return (
    <div className="flex h-full w-full"> 
      
      <div 
        className={`flex-1 hidden md:flex justify-center items-center flex-col gap-6 p-8 text-center transition-colors duration-300 ${leftBg}`}
      >
        <h1 className="font-bold flex items-center gap-4 text-5xl lg:text-7xl xl:text-8xl">
          <BookOpen className="size-16 lg:size-24" />
          CaféBooks
        </h1>

        <p className="font-medium text-xl lg:text-2xl">
          Sua biblioteca com cheirinho de café!
        </p>
        <p className="mt-4 text-sm max-w-sm">
          Use este espaço para gerenciar sua estante, acompanhar seu progresso de leitura e descobrir novos títulos.
        </p>
      </div>

      <div className={`w-full md:flex-1 flex justify-center items-center p-8 transition-colors duration-300 ${rightBg}`}>
        <LoginForm isDark={isDark} />
      </div>
    </div>
  );
}
