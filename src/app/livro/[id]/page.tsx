import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Book } from "@/types";
import { notFound } from "next/navigation";

export default async function LivroPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });

  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !book) {
    notFound();
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img
            src={book.cover || book.imageurl || "/placeholder.jpg"} // CORRIGIDO: imageUrl -> imageurl
            alt={`Capa do livro ${book.title}`}
            className="w-full h-auto rounded shadow-md"
          />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
          <h2 className="text-xl text-gray-600 mb-4">Por {book.author}</h2>
          <p className="mb-2">
            <strong>Gênero:</strong> {book.genre}
          </p>
          <p className="mb-2">
            <strong>Ano de Publicação:</strong> {book.year}
          </p>
          <p className="mb-2">
            <strong>Páginas:</strong> {book.pages}
          </p>
          <p className="mb-2">
            <strong>Status:</strong> {book.status}
          </p>
          <p className="mb-4">
            <strong>Avaliação:</strong> {book.rating || "Não avaliado"}
          </p>

          <h3 className="text-2xl font-semibold mt-6 mb-2">Sinopse</h3>
          <p className="text-gray-700">{book.synopsis || "Sinopse não disponível."}</p>
        </div>
      </div>
    </div>
  );
}
