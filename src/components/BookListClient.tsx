"use client";

import { useState } from "react";
import BookCard from "./BookCard";
import AddBookForm from "./AddBookForm";
import EditBookForm from "./EditBookForm";
import type { Book } from "@/types";

type BookListClientProps = {
  initialBooks?: Book[]; // opcional com default
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
    try {
      const response = await fetch('/api/books');
      const result = await response.json();
      if (result.success && result.data) {
        setBooks(result.data);
      } else {
        setError("Erro ao carregar livros.");
      }
    } catch (err) {
      setError("Erro ao carregar livros.");
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
    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await reloadBooks();
      } else {
        setError("Erro ao deletar livro.");
      }
    } catch (err) {
      setError("Erro ao deletar livro.");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    await reloadBooks();
    setShowAddForm(false);
    setBookBeingEdited(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setBookBeingEdited(null);
  };

  const handleRate = async (book: Book, rating: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });
      if (response.ok) {
        setBooks(prev =>
          prev.map(b => (b.id === book.id ? { ...b, rating } : b))
        );
      } else {
        setError("Erro ao avaliar livro.");
      }
    } catch (err) {
      setError("Erro ao avaliar livro.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meus Livros</h2>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          Adicionar Livro
        </button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <p>Carregando...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRate={handleRate}
          />
        ))}
      </div>

      {showAddForm && (
        <AddBookForm onSave={handleSave} onCancel={handleCancel} />
      )}

      {bookBeingEdited && (
        <EditBookForm
          book={bookBeingEdited}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
