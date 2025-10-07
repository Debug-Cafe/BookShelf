'use client';

import { useEffect, useState } from "react";
import type { Book } from "@/types";
import { supabase } from "@/lib/supabaseClient";
import {
  BookOpen,
  BookMarked,
  BookCheck,
  FileText,
  Library,
} from "lucide-react";
import React from "react";

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase.from("books").select("*");
      if (!error && data) {
        setBooks(data as Book[]);
      }
    };
    fetchBooks();

    // Cria o canal
    const channel = supabase
      .channel('public:books') // nome arbitrário para canal
      .on<Book & any>( // força tipagem para payload (usamos `Book & any`)
        'postgres_changes',
        { event: '*', schema: 'public', table: 'books' },
        (payload) => {
          // payload conforme tipo RealtimePostgresChangesPayload<Book>
          // checar payload.eventType
          const et = (payload as any).eventType as
            | 'INSERT'
            | 'UPDATE'
            | 'DELETE';

          if (et === 'INSERT') {
            setBooks(prev => [payload.new as Book, ...prev]);
          }
          if (et === 'UPDATE') {
            setBooks(prev =>
              prev.map(b => (b.id === (payload.new as Book).id ? (payload.new as Book) : b))
            );
          }
          if (et === 'DELETE') {
            setBooks(prev =>
              prev.filter(b => b.id !== (payload.old as Book).id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const normalize = (str?: string) => str?.trim().toLowerCase();

  const totalBooks = books.length;
  const totalPagesRead = books.reduce((sum, b) => sum + (b.pagesread || 0), 0);
  const booksWantToRead = books.filter(b => normalize(b.status) === "quero ler").length;
  const booksReading = books.filter(b => normalize(b.status) === "lendo").length;
  const booksFinished = books.filter(b => normalize(b.status) === "lido").length;

  return (
    <main className="mx-auto flex-1 bg-[var(--main-background)] min-h-screen pb-32">
      <div className="px-6 lg:px-20">
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
              <h1 className="text-4xl md:text-5xl font-extrabold" style={{ color: "var(--text-primary)" }}>
                Aqui está o resumo da sua jornada literária!
              </h1>
              <p className="text-2xl" style={{ color: "var(--text-primary)" }}>
                Acompanhe seu progresso de leitura e continue descobrindo novas histórias.
              </p>
            </div>
            <div className="hidden md:flex justify-center items-center h-full">
              <Library size={220} style={{ color: "var(--text-primary)" }} strokeWidth={1} />
            </div>
          </div>
        </section>

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
            value={booksFinished}
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
