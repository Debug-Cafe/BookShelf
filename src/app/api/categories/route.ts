import { NextRequest, NextResponse } from 'next/server';
import { genreOperations } from '@/lib/database';

// GET /api/categories
export async function GET(request: NextRequest) {
  try {
    const dbGenres = genreOperations.getAll();
    const bookGenres = genreOperations.getFromBooks();
    const allGenresSet = new Set([
      ...dbGenres.map(g => g.name),
      ...bookGenres.map(g => g.name)
    ]);
    
    const allGenres = Array.from(allGenresSet).sort();

    return NextResponse.json({
      success: true,
      data: {
        genres: allGenres,
        total: allGenres.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/categories
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.genre || !body.genre.trim()) {
      return NextResponse.json(
        { success: false, error: 'Nome do gênero é obrigatório' },
        { status: 400 }
      );
    }

    const newGenre = body.genre.trim();
    
    const success = genreOperations.create(newGenre);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Gênero já existe' },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { genre: newGenre },
      message: 'Gênero adicionado com sucesso'
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao adicionar gênero:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
