'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import BookCard from '@/components/BookCard';
import AddBookForm from '@/components/AddBookForm';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import HeroSection from '@/components/HeroSection';
import type { Book } from '@/types';
import { supabase } from '@/lib/supabaseClient';

// Função para normalizar status para as opções válidas
const STATUS_OPTIONS = ['Quero ler', 'Lendo', 'Lido'];

function normalizeStatus(status?: string): string {
  if (!status) return '';
  const normalized = status.trim().toLowerCase();
  const matched = STATUS_OPTIONS.find(
    (opt) => opt.toLowerCase() === normalized
  );
  return matched || '';
}

export default function CatalogoPage() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar livros:', error.message);
    } else if (data) {
      setAllBooks(data as Book[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleShowAddForm = () => {
    setBookToEdit(null);
    setShowAddForm(true);
  };

  const handleEditBook = (book: Book) => {
    setBookToEdit(book);
    setShowAddForm(true);
  };

  const handleSaveBook = async () => {
    await fetchBooks();
    setShowAddForm(false);
    setBookToEdit(null);
  };

  const handleDeleteBook = (book: Book) => {
    setBookToDelete(book);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', bookToDelete.id);

    if (error) {
      console.error('Erro ao deletar livro:', error.message);
      alert('Erro ao deletar livro.');
      return;
    }

    await fetchBooks();
    setBookToDelete(null);
  };

  const handleCancelDelete = () => {
    setBookToDelete(null);
  };

  // Atualiza o rating do livro
  const handleRateBook = async (book: Book, newRating: number) => {
    const { error } = await supabase
      .from('books')
      .update({ rating: newRating })
      .eq('id', book.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar rating:', error.message);
      alert('Erro ao salvar avaliação.');
      return;
    }

    setAllBooks((prevBooks) =>
      prevBooks.map((b) => (b.id === book.id ? { ...b, rating: newRating } : b))
    );
  };

  // Atualiza o status do livro
  const handleStatusUpdate = async (book: Book, newStatus: string) => {
    const formattedStatus = normalizeStatus(newStatus);

    const { data, error } = await supabase
      .from('books')
      .update({ status: formattedStatus })
      .eq('id', book.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar status:', error.message);
      alert('Erro ao atualizar status.');
      return;
    }

    setAllBooks((prevBooks) =>
      prevBooks.map((b) => (b.id === book.id ? data : b))
    );
  };

  if (loading) {
    return (
      <main className="mx-auto flex-1 px-4 bg-[var(--main-background)] min-h-screen pb-32 flex items-center justify-center">
        <p className="text-lg font-medium">Carregando livros...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex-1 bg-[var(--main-background)] min-h-screen pb-32">
      <div className="px-6 lg:px-20">
        <HeroSection />

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
            Catálogo de Livros
          </h2>

          <p className="text-center mb-6" style={{ color: 'var(--text-primary)' }}>
            Total de livros: <span className="font-semibold">{allBooks.length}</span>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-5 items-stretch">
            {allBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
                onRate={handleRateBook}
                onStatusUpdate={(newStatus) => handleStatusUpdate(book, newStatus)}
              />
            ))}

            <div className="flex items-center justify-center p-4">
              <button
                onClick={handleShowAddForm}
                className="w-24 h-24 bg-[#6E3D34] hover:bg-opacity-80 text-white rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#6E3D34] focus:ring-opacity-50"
                aria-label="Adicionar novo livro"
              >
                <Plus size={40} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <AddBookForm
          bookToEdit={bookToEdit}
          onSave={handleSaveBook}
          onCancel={() => {
            setShowAddForm(false);
            setBookToEdit(null);
          }}
        />
      )}

      {bookToDelete && (
        <DeleteConfirmationModal
          bookTitle={bookToDelete.title}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </main>
  );
}
