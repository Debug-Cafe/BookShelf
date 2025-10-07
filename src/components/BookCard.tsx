"use client";

import { useState } from "react";
import { Book } from "@/types";
import StarRating from "./StarRating";
import StatusSelector from "./StatusSelector";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

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
  const { id, title, author, cover, imageurl, rating = 0, status } = book;
  const fallbackCover = "/images/default-cover.jpg";
  const [imgSrc, setImgSrc] = useState(cover || imageurl || fallbackCover);

  return (
    <div className="bg-[#EFEAE4] rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:z-10 flex flex-col h-full min-w-[160px]">

      {/* Capa + Título/Autor */}
      <Link href={`/livro/${id}`} className="flex flex-col h-full cursor-pointer">
        <div className="relative w-full aspect-[2/3] p-4 flex items-center justify-center bg-gray-200">
          <img
            src={imgSrc}
            onError={() => setImgSrc(fallbackCover)}
            alt={`Capa do livro ${title}`}
            className="w-full h-full object-contain rounded-md"
          />
        </div>

        <div className="p-4 flex flex-col items-center text-center flex-grow justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#6F4E37] mb-2 line-clamp-2">
              {title}
            </h3>
            <p className="text-[#8B4513] italic text-sm line-clamp-1">{author}</p>
          </div>
        </div>
      </Link>

      {/* Avaliação por estrelas */}
      <div className="p-4 pt-0 flex justify-center">
        <StarRating
          rating={rating ?? 0}
          onRate={(newRating) => onRate(book, newRating)}
        />
      </div>

      {/* Seletor de status */}
      <StatusSelector
        book={book}
        onStatusUpdate={onStatusUpdate}
      />

      {/* Botões de ação */}
      <div className="flex justify-around px-2 py-4 border-t border-[#d4c4b4]">
        <button
          type="button"
          onClick={() => onEdit(book)}
          className="flex items-center text-yellow-700 hover:text-yellow-900 px-2 py-1 rounded hover:bg-yellow-100 sm:gap-2 sm:px-2 transition-colors"
          aria-label={`Editar ${title}`}
        >
          <Pencil size={20} />
          <span className="hidden md:inline">Editar</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete(book)}
          className="flex items-center text-red-700 hover:text-red-900 px-2 py-1 rounded hover:bg-red-100 sm:gap-2 sm:px-2 transition-colors"
          aria-label={`Excluir ${title}`}
        >
          <Trash2 size={20} />
          <span className="hidden md:inline">Excluir</span>
        </button>
      </div>
    </div>
  );
}
