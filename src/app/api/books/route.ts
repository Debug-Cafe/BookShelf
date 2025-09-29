import { NextRequest, NextResponse } from 'next/server';
import { bookOperations } from '@/lib/database';
import { Book } from '@/types';

// GET /api/books
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const filters: { genre?: string; search?: string } = {};
    if (genre && genre !== 'all') {
      filters.genre = genre;
    }
    if (search) {
      filters.search = search;
    }

    let filteredBooks = bookOperations.getAll(filters);

    if (status && status !== 'all') {
      filteredBooks = filteredBooks.filter(book => book.status === status);
    }

    return NextResponse.json({
      success: true,
      data: filteredBooks,
      total: filteredBooks.length
    });
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/books
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.title || !body.author) {
      return NextResponse.json(
        { success: false, error: 'Título e autor são obrigatórios' },
        { status: 400 }
      );
    }

    const newBook: Omit<Book, 'id'> = {
      title: body.title,
      author: body.author,
      genre: body.genre || '',
      year: body.year || new Date().getFullYear(),
      pages: body.pages || 0,
      pagesRead: body.pagesRead || 0,
      status: body.status || 'quero ler',
      rating: body.rating || 0,
      synopsis: body.synopsis || '',
      cover: body.cover || '',
      imageUrl: body.imageUrl || body.cover || ''
    };

    const createdBook = bookOperations.create(newBook);

    return NextResponse.json({
      success: true,
      data: createdBook,
      message: 'Livro criado com sucesso'
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
