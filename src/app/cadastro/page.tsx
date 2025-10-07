'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/RegisterForm';
import { CheckCircle } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

export default function CadastroPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSuccess = () => {
    setIsSuccess(true);

    setTimeout(() => {
      router.push('/catalogo');
    }, 3000);
  };

  const pageBg = isDark 
    ? "bg-[var(--main-background)] text-[var(--foreground)]"
    : "bg-[#d7a86e] text-[#3e2723]";

  return (
    <div className={`flex flex-col justify-center items-center h-screen w-full transition-colors duration-300 ${pageBg}`}>
      
      {/* Cabeçalho */}
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Cadastro</h1>
        <p className="mt-2 text-lg font-medium">
          Crie sua conta. É rápido e fácil!
        </p>
      </div>
      
      {/* Conteúdo central */}
      <div className="flex flex-col justify-center items-center w-full max-w-lg">
        {isSuccess ? (
          <div className={`w-full p-8 rounded-xl shadow-2xl text-center 
            ${isDark ? 'bg-[#3e2723] text-green-300' : 'bg-white text-green-800'}`}>
            <CheckCircle size={64} className="mx-auto mb-4 text-green-600" />
            <h2 className="text-3xl font-bold mb-2">Conta Criada!</h2>
            <p>Você será redirecionado para o Catálogo em instantes.</p>
          </div>
        ) : (
          <RegisterForm isDark={isDark} onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}
