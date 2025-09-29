'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Book } from '@/types';

export default function BookDetailPage() {
  const { id } = useParams() as { id: string };
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${id}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setBook(result.data as Book);
        } else {
          setBook(null);
        }
      } catch (error) {
        console.error("Erro ao buscar livro:", error);
        setBook(null);
      }

      setLoading(false);
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  // --- COMPONENTES DE LOADING E NÃO ENCONTRADO (Ajustando a cor do texto) ---

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12" style={{ color: 'var(--text-primary)' }}>
        <p>Carregando livro...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-12 text-center" style={{ color: 'var(--text-primary)' }}>
        <p className="text-xl font-semibold">Livro não encontrado.</p>
        <a href="/catalogo" className="inline-block mt-6 text-sm hover:underline" style={{ color: 'var(--color-accent)' }}>
          ← Voltar ao catálogo
        </a>
      </div>
    );
  }

  // --- COMPONENTE PRINCIPAL (Ajustando as cores do texto) ---

  return (
    <main className="mx-auto flex-1 bg-[var(--main-background)] min-h-screen pb-32">
      <div className="px-6 lg:px-20 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Coluna da Capa */}
            <div className="md:col-span-1">
              <div className="sticky top-8">
                <img
                  src={book.cover || '/placeholder-book.jpg'}
                  alt={`Capa do livro ${book.title}`}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Coluna das Informações */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {book.title}
                </h1>
                <p className="text-xl mb-4" style={{ color: 'var(--text-secondary)' }}>
                  por {book.author}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Gênero:</span>
                  <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>{book.genre}</span>
                </div>
                <div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Ano:</span>
                  <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>{book.year}</span>
                </div>
                <div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Páginas:</span>
                  <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>{book.pages}</span>
                </div>
                <div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Status:</span>
                  <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>{book.status}</span>
                </div>
              </div>

              {book.synopsis && (
                <div>
                  <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Sinopse
                  </h2>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {book.synopsis}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <a
                  href="/catalogo"
                  className="text-sm hover:underline"
                  style={{ color: 'var(--color-accent)' }}
                >
                  ← Voltar ao catálogo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
