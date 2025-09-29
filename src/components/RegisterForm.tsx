'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';

interface RegisterFormProps {
  isDark: boolean;
  onSuccess: () => void;
}

// Schema de validação
const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirme sua senha"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "A senha e a confirmação não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm({ isDark, onSuccess }: RegisterFormProps) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    setIsLoading(true);

    try {
      // Simulação de registro (sem autenticação real)
      await login(data.email, data.password);
      alert('Conta criada com sucesso!');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const cardBg = isDark
    ? "bg-[#3e2723] text-[#f5e6d5]"
    : "bg-white text-[#3e2723]";
  const buttonBg = isDark
    ? "bg-[#c7925c] hover:bg-[#a56734]"
    : "bg-[#512b1e] hover:bg-[#A56734]";
  const inputStyle =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a56734]";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`w-full max-w-lg p-8 rounded-xl shadow-2xl ${cardBg}`}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-[#6e3b1f]">
        Criar Conta
      </h2>

      {error && (
        <p className="text-red-600 text-sm mb-4 bg-red-100 p-2 rounded">
          {error}
        </p>
      )}

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nome Completo
        </label>
        <input
          type="text"
          id="name"
          {...register("name")}
          className={inputStyle}
        />
        {errors.name && (
          <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register("email")}
          className={inputStyle}
        />
        {errors.email && (
          <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Senha
        </label>
        <input
          type="password"
          id="password"
          {...register("password")}
          className={inputStyle}
        />
        {errors.password && (
          <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="mb-6">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium mb-1"
        >
          Confirmar Senha
        </label>
        <input
          type="password"
          id="confirmPassword"
          {...register("confirmPassword")}
          className={inputStyle}
        />
        {errors.confirmPassword && (
          <p className="text-red-600 text-xs mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full ${buttonBg} text-white py-3 rounded-md font-semibold transition-colors disabled:opacity-50 mt-2`}
      >
        {isLoading ? "Cadastrando..." : "Cadastre-se"}
      </button>

      <p className="mt-4 text-center text-sm text-[#6e3b1f]">
        Já tem uma conta?{" "}
        <Link href="/" className="font-bold underline hover:text-[#c7925c]">
          Faça Login
        </Link>
      </p>
    </form>
  );
}
