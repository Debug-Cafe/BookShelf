'use client';

import { useState } from "react";
import BookCard from "./BookCard";
import AddBookForm from "./AddBookForm";
import EditBookForm from "./EditBookForm";
import type { Book, ReadingStatus } from "@/types";
import { supabase } from "@/lib/supabaseClient";


type BookListClientProps = {
  initialBooks?: Book[];
};

export default function BookListClient({ initialBooks = [] }: BookListClientProps) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [showAddForm, setShowAddForm] = useState(false);
  const [bookBeingEdited, setBookBeingEdited] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reloadBooks = async () => {
    setLoading(true);
    setError(null);

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Erro de autenticação. Faça login novamente.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setError("Erro ao carregar livros.");
    } else if (data) {
      setBooks(data as Book[]);
    }

    setLoading(false);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
    setBookBeingEdited(null);
  };

  const handleEdit = (book: Book) => {
    setBookBeingEdited(book);
    setShowAddForm(false);
  };

  const handleDelete = async (book: Book) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.from("books").delete().eq("id", book.id);

    if (error) {
      setError("Erro ao excluir livro.");
    } else {
      setBooks(prev => prev.filter(b => b.id !== book.id));
    }

    setLoading(false);
  };

  const handleRate = async (book: Book, rating: number) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from("books")
      .update({ rating })
      .eq("id", book.id);

    if (error) {
      setError("Erro ao avaliar livro.");
    } else {
      setBooks(prev =>
        prev.map(b => (b.id === book.id ? { ...b, rating } : b))
      );
    }

    setLoading(false);
  };

  // NOVO: Função para atualizar o status
  const handleStatusUpdate = async (book: Book, newStatus: string) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from("books")
      .update({ status: newStatus })
      .eq("id", book.id);

    if (error) {
      setError("Erro ao atualizar status.");
    } else {
      setBooks(prev =>
        prev.map(b => (b.id === book.id ? { ...b, status: newStatus as ReadingStatus } : b))
      );
    }

    setLoading(false);
  };

  const handleSaveBook = async () => {
    await reloadBooks();
    setShowAddForm(false);
    setBookBeingEdited(null);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setBookBeingEdited(null);
  };

  const isEditing = !!bookBeingEdited;

  return (
    <div className="p-4">
      <button
        onClick={handleAddClick}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        Adicionar Livro
      </button>

      {error && <p className="mb-4 text-red-600 font-semibold">{error}</p>}
      {loading && <p className="mb-4 text-gray-600">Carregando...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRate={handleRate}
            // CORRIGIDO: Chamada correta para onStatusUpdate
            onStatusUpdate={(newStatus) => handleStatusUpdate(book, newStatus)} 
          />
        ))}
      </div>

      {isEditing ? (
        <EditBookForm
          book={bookBeingEdited}
          onSave={handleSaveBook}
          onCancel={handleCancelForm}
        />
      ) : (
        showAddForm && (
          <AddBookForm
            onSave={handleSaveBook}
            onCancel={handleCancelForm}
          />
        )
      )}
    </div>
  );
}
