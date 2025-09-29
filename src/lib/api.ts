import { Book } from '@/types';

const API_BASE_URL = '/api';

// respostas da API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
}

// requisições
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na requisição da API:', error);
    return {
      success: false,
      error: 'Erro de conexão com a API'
    };
  }
}

// operações com livros
export const booksApi = {
  getAll: async (filters?: {
    genre?: string;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<Book[]>> => {
    const params = new URLSearchParams();
    
    if (filters?.genre) params.append('genre', filters.genre);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/books?${queryString}` : '/books';
    
    return apiRequest<Book[]>(endpoint);
  },

  getById: async (id: string): Promise<ApiResponse<Book>> => {
    return apiRequest<Book>(`/books/${id}`);
  },

  create: async (book: Omit<Book, 'id'>): Promise<ApiResponse<Book>> => {
    return apiRequest<Book>('/books', {
      method: 'POST',
      body: JSON.stringify(book),
    });
  },

  update: async (id: string, book: Partial<Book>): Promise<ApiResponse<Book>> => {
    return apiRequest<Book>(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(book),
    });
  },

  delete: async (id: string): Promise<ApiResponse<Book>> => {
    return apiRequest<Book>(`/books/${id}`, {
      method: 'DELETE',
    });
  },
};

export const categoriesApi = {
 
  getAll: async (): Promise<ApiResponse<{ genres: string[]; total: number }>> => {
    return apiRequest<{ genres: string[]; total: number }>('/categories');
  },
  addGenre: async (genre: string): Promise<ApiResponse<{ genre: string }>> => {
    return apiRequest<{ genre: string }>('/categories', {
      method: 'POST',
      body: JSON.stringify({ genre }),
    });
  },
  removeGenre: async (genre: string): Promise<ApiResponse<{ genre: string }>> => {
    const encodedGenre = encodeURIComponent(genre);
    return apiRequest<{ genre: string }>(`/categories/genres/${encodedGenre}`, {
      method: 'DELETE',
    });
  },
};

export const useApi = () => {
  return {
    books: booksApi,
    categories: categoriesApi,
  };
};
