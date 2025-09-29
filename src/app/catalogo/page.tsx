'use client';

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

import BookCard from "@/components/BookCard";
import AddBookForm from "@/components/AddBookForm";
import EditBookForm from "@/components/EditBookForm";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import HeroSection from "@/components/HeroSection"; 

import type { Book } from "@/types";

export default function CatalogoPage() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/books');
      const result = await response.json();
      if (result.success && result.data) {
        setAllBooks(result.data as Book[]);
      }
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
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
    setShowAddForm(false);
  };

  const handleSaveBook = async (book: Book) => {
    try {
      if (bookToEdit) {
        const response = await fetch(`/api/books/${book.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(book),
        });
        
        if (response.ok) {
          await fetchBooks();
        }
      } else {
        const response = await fetch('/api/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(book),
        });
        
        if (response.ok) {
          await fetchBooks(); 
        }
      }
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
    }

    setShowAddForm(false);
    setBookToEdit(null);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setBookToEdit(null);
  };

  const handleDeleteBook = (book: Book) => {
    setBookToDelete(book);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;

    try {
      const response = await fetch(`/api/books/${bookToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchBooks(); 
      }
    } catch (error) {
      console.error('Erro ao deletar livro:', error);
    }
    
    setBookToDelete(null);
  };

  const handleCancelDelete = () => {
    setBookToDelete(null);
  };

  const handleRateBook = async (book: Book, rating: number) => {
    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });

      if (response.ok) {
        setAllBooks(prev =>
          prev.map(b => (b.id === book.id ? { ...b, rating } : b))
        );
      }
    } catch (error) {
      console.error('Erro ao avaliar livro:', error);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto flex-1 px-4 bg-[var(--main-background)] min-h-screen pb-32 flex items-center justify-center">
        <p className="text-lg font-medium">Carregando livros...</p>
      </main>
    );
  }

  return (
    <main 
      className="mx-auto flex-1 bg-[var(--main-background)] min-h-screen pb-32"
    >
      
      {/* CONTÊINER DE ALINHAMENTO PRINCIPAL: Define o espaçamento de "4 dedos" (lg:px-20) */}
      <div className="px-6 lg:px-20">
        
        {/* 1. HERO SECTION */}
        <HeroSection /> 
        
        {/* 2. CONTEÚDO DO CATÁLOGO: Fica alinhado com a Hero Section */}
        <div className="mt-12"> 
          {/* Títulos e contador */}
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
              Catálogo de Livros
          </h2>
          <p className="text-center mb-6" style={{ color: 'var(--text-primary)' }}>
              Total de livros: <span className="font-semibold">{allBooks.length}</span>
          </p>

          {/* GRADE DOS LIVROS: Ajustada para ser menor */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 items-stretch">
            {allBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
                onRate={handleRateBook}
              />
            ))}

            {/* Botão + para adicionar livro */}
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
      </div> {/* Fim do contêiner de alinhamento */}

      {showAddForm && !bookToEdit && (
        <AddBookForm
          onSave={handleSaveBook}
          onCancel={handleCancelForm}
        />
      )}

      {bookToEdit && (
        <EditBookForm
          book={bookToEdit}
          onSave={handleSaveBook}
          onCancel={handleCancelForm}
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
