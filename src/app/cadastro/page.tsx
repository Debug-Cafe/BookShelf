'use client';

import RegisterForm from '@/components/RegisterForm';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function CadastroPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setIsSuccess(true);

    setTimeout(() => {
      router.push('/catalogo');
    }, 3000);
  };

  // Fundo claro do lado direito, igual da página login
  const rightBg = "bg-[#d7a86e] text-[#3e2723]";

  return (
    <div className="flex h-full w-full min-h-screen">

      <div className={`w-full flex flex-col justify-center items-center p-8 ${rightBg}`}>
        <div className="w-full max-w-lg">

          {/* Texto dentro da div do form, estilizado igual ao anterior */}
          <p className="mb-6 text-5xl font-bold text-[#3e2723] text-center">
            Crie sua conta
          </p>

          {isSuccess ? (
            <div className="w-full p-8 rounded-xl shadow-2xl text-center bg-white text-green-800">
              <CheckCircle size={64} className="mx-auto mb-4 text-green-600" />
              <h2 className="text-3xl font-bold mb-2">Conta Criada!</h2>
              <p>Você será redirecionado para o Catálogo em instantes.</p>
            </div>
          ) : (
            <RegisterForm onSuccess={handleSuccess} />
          )}
        </div>
      </div>

    </div>
  );
}
