'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient"; // CORRIGIDO: Importando 'supabase'
import { Book } from "@/types";
import { normalize } from "@/lib/utils";// Assumindo que 'normalize' é exportado nomeado

// Tipos do Supabase Realtime (simplificados para o contexto)
type RealtimePayload = {
  new: Partial<Book>;
  old: Partial<Book>;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
};

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const supabaseInstance = supabase; // Não é necessário renomear se o nome for diferente

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const { data, error } = await supabase // Usando a instância importada
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError("Erro ao carregar livros: " + error.message);
      } else if (data) {
        setBooks(data as Book[]);
      }
      setLoading(false);
    };

    fetchBooks();

    const subscription = supabase
      .channel("bookshelf-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "books" },
        (payload) => {
          const typedPayload = payload as unknown as RealtimePayload;

          if (typedPayload.eventType === "INSERT") {
            setBooks((prev) => [(typedPayload.new as Book), ...prev]);
          }
          if (typedPayload.eventType === "UPDATE") {
            setBooks((prev) =>
              prev.map((book) =>
                book.id === (typedPayload.new as Book).id
                  ? (typedPayload.new as Book)
                  : book
              )
            );
          }
          if (typedPayload.eventType === "DELETE") {
            setBooks((prev) =>
              prev.filter((book) => book.id !== typedPayload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []); // Removido 'supabase' da dependência, pois é constante

  if (loading) return <div className="p-4">Carregando Dashboard...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  const totalBooks = books.length;
  const totalPagesRead = books.reduce(
    (sum, book) => sum + (book.pagesread || 0),
    0
  );
  // Em src/app/Dashboard/page.tsx, por volta da linha 103:

const booksWantToRead = books.filter((book) => normalize(book.status) === "quero ler").length;
const booksReading = books.filter((book) => normalize(book.status) === "lendo").length;
const booksRead = books.filter((book) => normalize(book.status) === "lido").length;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total de Livros" value={totalBooks} />
        <Card title="Páginas Lidas" value={totalPagesRead} />
        <Card title="Quero Ler" value={booksWantToRead} />
        <Card title="Lendo" value={booksReading} />
        <Card title="Lido" value={booksRead} />
      </div>
    </div>
  );
}

// Componente Card simples (assumindo que você o tem em outro lugar ou o adicionou aqui)
const Card = ({ title, value }: { title: string; value: number }) => (
  <div className="p-4 border rounded-lg shadow-sm">
    <h2 className="text-lg font-semibold text-gray-500">{title}</h2>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);
