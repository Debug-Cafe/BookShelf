import { NextRequest, NextResponse } from 'next/server';
import { bookOperations } from '@/lib/database';
import { Book } from '@/types';

// GET /api/books/[id] 
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = bookOperations.getById(id);

    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/books/[id] 
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (body.title !== undefined && !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Título não pode estar vazio' },
        { status: 400 }
      );
    }

    if (body.author !== undefined && !body.author.trim()) {
      return NextResponse.json(
        { success: false, error: 'Autor não pode estar vazio' },
        { status: 400 }
      );
    }

    const updatedBook = bookOperations.update(id, body);
    
    if (!updatedBook) {
      return NextResponse.json(
        { success: false, error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBook,
      message: 'Livro atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/books/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = bookOperations.delete(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Livro removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover livro:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
