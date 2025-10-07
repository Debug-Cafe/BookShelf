"use client";

import { useState } from "react";
import { Book } from "@/types";
import StarRating from "./StarRating";
import StatusSelector from "./StatusSelector";
import { statusLabels } from "@/types";

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onRate: (book: Book, rating: number) => void;
  onStatusUpdate: (newStatus: string) => void;
}

export default function BookCard({
  book,
  onEdit,
  onDelete,
  onRate,
  onStatusUpdate,
}: BookCardProps) {
  // CORRIGIDO: imageUrl -> imageurl
  const { id, title, author, cover, imageurl, rating = 0, status } = book;
  const fallbackCover = "/images/default-cover.jpg";
  // CORRIGIDO: imageUrl -> imageurl
  const [imgSrc, setImgSrc] = useState(cover || imageurl || fallbackCover);

  return (
    <div className="border rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <div className="relative h-64 overflow-hidden">
        <img
          src={imgSrc}
          alt={`Capa do livro ${title}`}
          className="w-full h-full object-cover"
          onError={() => setImgSrc(fallbackCover)}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold truncate mb-1">{title}</h3>
        <p className="text-gray-600 mb-3 flex-grow">Por {author}</p>

        {/* Avaliação por estrelas */}
        <div className="p-4 pt-0 flex justify-center">
          {/* CORRIGIDO: rating ?? 0 para tratar null */}
          <StarRating
            rating={rating ?? 0}
            onRate={(newRating) => onRate(book, newRating)}
          />
        </div>

        {/* Seletor de status */}
        <div className="mt-auto">
          <StatusSelector
            book={book} // CORRIGIDO: Passar o objeto book inteiro
            onStatusUpdate={onStatusUpdate}
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => onEdit(book)}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(book)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
