'use client';
import React from 'react';
import type { Book } from '@/types';

export default function Card({ title, author, cover }: Book): React.JSX.Element {
  return (
    <div className="card-container">
      <img
        src={cover ?? ""}
        alt={`Capa do livro ${title}`}
        className="book-cover"
      />
      <h3>{title}</h3>
      <p>{author}</p>
    </div>
  );
}
