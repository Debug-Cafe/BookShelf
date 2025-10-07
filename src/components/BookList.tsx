'use server';

import BookListClient from "./BookListClient";
import type { Book } from "@/types";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";


export default async function BookList() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Usuário não autenticado");
    return <div className="text-red-500">Erro: usuário não autenticado.</div>;
  }

  const { data: books, error } = await supabase
    .from("books")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar livros:", error.message);
    return <div className="text-red-500">Erro ao buscar livros.</div>;
  }

  return <BookListClient initialBooks={books || []} />;
}
