import BookListClient from "./BookListClient";
import type { Book } from "@/types";

async function fetchBooks(): Promise<Book[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/books`, {
      cache: 'no-store'
    });
    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (error) {
    console.error("Erro ao buscar livros:", error);
  }
  return [];
}

export default async function BookList() {
  const books = await fetchBooks();
  return <BookListClient initialBooks={books} />;
}
