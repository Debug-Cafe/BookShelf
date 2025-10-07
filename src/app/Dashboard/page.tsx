'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Book } from "@/types";
import {
  BookOpen,
  BookMarked,
  BookCheck,
  FileText,
  Library,
} from "lucide-react";
import { normalize } from "@/lib/utils";

type RealtimePayload = {
  new: Partial<Book>;
  old: Partial<Book>;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
};

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const { data, error } = await supabase
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
            setBooks((prev) => [typedPayload.new as Book, ...prev]);
          }

          if (typedPayload.eventType === "UPDATE") {
            setBooks((prev) =>
              prev.map((book) =>
                book.id === typedPayload.new.id ? (typedPayload.new as Book) : book
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
  }, []);

  if (loading) return <div className="p-6 text-lg">Carregando Dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const totalBooks = books.length;
  const totalPagesRead = books.reduce(
    (sum, book) => sum + (book.pagesread || 0),
    0
  );
  const booksWantToRead = books.filter(
    (book) => normalize(book.status) === "quero ler"
  ).length;
  const booksReading = books.filter(
    (book) => normalize(book.status) === "lendo"
  ).length;
  const booksRead = books.filter(
    (book) => normalize(book.status) === "lido"
  ).length;

  return (
    <main className="mx-auto flex-1 bg-[var(--main-background)] min-h-screen pb-32">
      <div className="px-6 lg:px-20">

        {/* === HERO SECTION === */}
        <section
          className="h-[350px] overflow-hidden mt-8 mb-12 py-8 rounded-3xl"
          style={{
            backgroundColor: "var(--color-surface-hero)",
            boxShadow: "0 0 20px 0 var(--color-shadow-hero)",
            borderRadius: "24px",
          }}
        >
          <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-2 items-center h-full gap-8 px-4 md:px-8">
            <div className="flex flex-col justify-center space-y-4 text-center">
              <h1
                className="text-4xl md:text-5xl font-extrabold"
                style={{ color: "var(--text-primary)" }}
              >
                Aqui está o resumo da sua jornada literária!
              </h1>
              <p
                className="text-2xl"
                style={{ color: "var(--text-primary)" }}
              >
                Acompanhe seu progresso de leitura e continue descobrindo novas
                histórias.
              </p>
            </div>

            <div className="hidden md:flex justify-center items-center h-full">
              <Library
                size={220}
                style={{ color: "var(--text-primary)" }}
                strokeWidth={1}
              />
            </div>
          </div>
        </section>

        {/* === STAT CARDS === */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            icon={<BookOpen size={40} className="text-[#6F4E37]" />}
            label="Total de Livros"
            value={totalBooks}
          />
          <StatCard
            icon={<BookMarked size={40} className="text-blue-600" />}
            label="Quero Ler"
            value={booksWantToRead}
          />
          <StatCard
            icon={<BookMarked size={40} className="text-yellow-500" />}
            label="Lendo Atualmente"
            value={booksReading}
          />
          <StatCard
            icon={<BookCheck size={40} className="text-green-600" />}
            label="Finalizados"
            value={booksRead}
          />
          <StatCard
            icon={<FileText size={40} className="text-purple-600" />}
            label="Total de Páginas Lidas"
            value={totalPagesRead}
          />
        </div>
      </div>
    </main>
  );
}

// --- Componente de Card de Estatística ---
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div
      className="rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:scale-[1.03] transition-all duration-300 bg-white text-gray-800"
      style={{
        boxShadow: "0 0 10px 0 var(--color-shadow-hero)",
      }}
    >
      <div className="mb-4">{icon}</div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-1" style={{ color: "var(--color-primary)" }}>
        {label}
      </p>
    </div>
  );
}
