import Database from 'better-sqlite3';
import path from 'path';
import { Book } from '@/types';

const dbPath = path.join(process.cwd(), 'bookshelf.db');

const db = new Database(dbPath);

const initDatabase = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      genre TEXT NOT NULL,
      year INTEGER NOT NULL,
      pages INTEGER NOT NULL,
      pagesRead INTEGER DEFAULT 0,
      status TEXT DEFAULT 'quero ler',
      rating INTEGER DEFAULT 0,
      synopsis TEXT,
      cover TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS genres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const bookCount = db.prepare('SELECT COUNT(*) as count FROM books').get() as { count: number };
  
  if (bookCount.count === 0) {
    const insertBook = db.prepare(`
      INSERT INTO books (id, title, author, genre, year, pages, pagesRead, status, rating, synopsis, cover)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialBooks = [
      {
        id: "1",
        title: "O Senhor dos Anéis",
        author: "J.R.R. Tolkien",
        genre: "Fantasia",
        year: 1954,
        pages: 1216,
        pagesRead: 300,
        status: "lendo",
        rating: 5,
        synopsis: "Uma jornada épica pela Terra Média para destruir o Um Anel.",
        cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1566425108i/33.jpg"
      },
      {
        id: "2",
        title: "A Revolução dos Bichos",
        author: "George Orwell",
        genre: "Distopia",
        year: 1945,
        pages: 152,
        pagesRead: 152,
        status: "finalizado",
        rating: 4,
        synopsis: "Uma fábula política sobre animais que se rebelam contra os humanos.",
        cover: "https://m.media-amazon.com/images/I/91BsZhxCRjL._UF1000,1000_QL80_.jpg"
      },
      {
        id: "3",
        title: "1984",
        author: "George Orwell",
        genre: "Ficção Científica",
        year: 1949,
        pages: 328,
        pagesRead: 328,
        status: "finalizado",
        rating: 5,
        synopsis: "Em um regime totalitário, um homem luta contra a vigilância e o controle absoluto.",
        cover: "https://m.media-amazon.com/images/I/61t0bwt1s3L._UF1000,1000_QL80_.jpg"
      },
      {
        id: "4",
        title: "Duna",
        author: "Frank Herbert",
        genre: "Ficção Científica",
        year: 1965,
        pages: 688,
        pagesRead: 100,
        status: "lendo",
        rating: 5,
        synopsis: "A luta pelo controle de um planeta desértico rico em especiarias.",
        cover: "https://m.media-amazon.com/images/I/81zN7udGRUL.jpg"
      },
      {
        id: "5",
        title: "O Pequeno Príncipe",
        author: "Antoine de Saint-Exupéry",
        genre: "Fábula",
        year: 1943,
        pages: 96,
        pagesRead: 96,
        status: "finalizado",
        rating: 4,
        synopsis: "Um piloto encontra um pequeno príncipe vindo de outro planeta.",
        cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1367545443i/157993.jpg"
      },
      {
        id: "6",
        title: "Sapiens: Uma Breve História da Humanidade",
        author: "Yuval Noah Harari",
        genre: "Não-Ficção",
        year: 2011,
        pages: 464,
        pagesRead: 200,
        status: "lendo",
        rating: 5,
        synopsis: "Uma análise profunda da história da humanidade, da pré-história à era moderna.",
        cover: "https://m.media-amazon.com/images/I/81BTkpMrLYL.jpg"
      },
      {
        id: "7",
        title: "A Guerra dos Tronos",
        author: "George R.R. Martin",
        genre: "Fantasia",
        year: 1996,
        pages: 592,
        pagesRead: 0,
        status: "quero ler",
        rating: 5,
        synopsis: "Nobres disputam o trono de ferro em um mundo medieval cheio de intrigas e traições.",
        cover: "https://m.media-amazon.com/images/I/91+1SUO3vUL.jpg"
      },
      {
        id: "8",
        title: "Harry Potter e a Pedra Filosofal",
        author: "J.K. Rowling",
        genre: "Fantasia",
        year: 1997,
        pages: 223,
        pagesRead: 223,
        status: "finalizado",
        rating: 5,
        synopsis: "Um jovem bruxo descobre seu passado e começa sua jornada na Escola de Magia de Hogwarts.",
        cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg"
      }
    ];

    for (const book of initialBooks) {
      insertBook.run(
        book.id, book.title, book.author, book.genre, book.year,
        book.pages, book.pagesRead, book.status, book.rating,
        book.synopsis, book.cover
      );
    }

    const insertGenre = db.prepare('INSERT OR IGNORE INTO genres (name) VALUES (?)');
    const initialGenres = ['Fantasia', 'Distopia', 'Ficção Científica', 'Fábula', 'Não-Ficção'];
    
    for (const genre of initialGenres) {
      insertGenre.run(genre);
    }
  }
};

export const bookOperations = {
  getAll: (filters?: { genre?: string; search?: string }) => {
    let query = 'SELECT * FROM books';
    const params: any[] = [];

    if (filters?.genre || filters?.search) {
      const conditions: string[] = [];
      
      if (filters.genre) {
        conditions.push('genre = ?');
        params.push(filters.genre);
      }
      
      if (filters.search) {
        conditions.push('(title LIKE ? OR author LIKE ?)');
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }
      
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC';
    
    return db.prepare(query).all(...params) as Book[];
  },

  getById: (id: string) => {
    return db.prepare('SELECT * FROM books WHERE id = ?').get(id) as Book | undefined;
  },

  create: (book: Omit<Book, 'id'>) => {
    const id = Date.now().toString();
    const stmt = db.prepare(`
      INSERT INTO books (id, title, author, genre, year, pages, pagesRead, status, rating, synopsis, cover)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id, book.title, book.author, book.genre, book.year,
      book.pages, book.pagesRead || 0, book.status || 'quero ler',
      book.rating || 0, book.synopsis || '', book.cover || ''
    );
    
    return { id, ...book };
  },

  update: (id: string, book: Partial<Book>) => {
    const stmt = db.prepare(`
      UPDATE books 
      SET title = ?, author = ?, genre = ?, year = ?, pages = ?, 
          pagesRead = ?, status = ?, rating = ?, synopsis = ?, cover = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const existingBook = bookOperations.getById(id);
    if (!existingBook) return null;
    
    const updatedBook = { ...existingBook, ...book };
    
    stmt.run(
      updatedBook.title, updatedBook.author, updatedBook.genre, updatedBook.year,
      updatedBook.pages, updatedBook.pagesRead, updatedBook.status,
      updatedBook.rating, updatedBook.synopsis, updatedBook.cover, id
    );
    
    return updatedBook;
  },

  delete: (id: string) => {
    const stmt = db.prepare('DELETE FROM books WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
};

export const genreOperations = {

  getAll: () => {
    return db.prepare('SELECT DISTINCT name FROM genres ORDER BY name').all() as { name: string }[];
  },

  getFromBooks: () => {
    return db.prepare('SELECT DISTINCT genre as name FROM books ORDER BY genre').all() as { name: string }[];
  },

  create: (name: string) => {
    const stmt = db.prepare('INSERT OR IGNORE INTO genres (name) VALUES (?)');
    const result = stmt.run(name);
    return result.changes > 0;
  },

  delete: (name: string) => {
    const stmt = db.prepare('DELETE FROM genres WHERE name = ?');
    const result = stmt.run(name);
    return result.changes > 0;
  }
};

initDatabase();

export default db;
