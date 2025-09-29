import { NextRequest, NextResponse } from 'next/server';
import { genreOperations, bookOperations } from '@/lib/database';

// DELETE /api/categories/genres/[genre]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ genre: string }> }
) {
  try {
    const { genre } = await params;
    const decodedGenre = decodeURIComponent(genre);
    
    const booksWithGenre = bookOperations.getAll({ genre: decodedGenre });
    
    if (booksWithGenre.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Não é possível remover gêneros que estão sendo usados por livros existentes' 
        },
        { status: 400 }
      );
    }
    
    const success = genreOperations.delete(decodedGenre);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Gênero não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { genre: decodedGenre },
      message: 'Gênero removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover gênero:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
