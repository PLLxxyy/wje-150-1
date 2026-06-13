import type { Book, DriftRecord, User } from '../types';

const KEYS = {
  books: 'drift_books',
  records: 'drift_records',
  user: 'drift_current_user',
  seeded: 'drift_seeded',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const storage = {
  getBooks(): Book[] {
    return read<Book[]>(KEYS.books, []);
  },
  setBooks(books: Book[]): void {
    write(KEYS.books, books);
  },
  getBookById(id: string): Book | undefined {
    return this.getBooks().find((b) => b.id === id);
  },
  getBookByCode(code: string): Book | undefined {
    return this.getBooks().find((b) => b.driftCode === code);
  },
  addBook(book: Book): void {
    const books = this.getBooks();
    books.unshift(book);
    this.setBooks(books);
  },
  updateBook(id: string, patch: Partial<Book>): void {
    const books = this.getBooks().map((b) => (b.id === id ? { ...b, ...patch } : b));
    this.setBooks(books);
  },

  getRecords(): DriftRecord[] {
    return read<DriftRecord[]>(KEYS.records, []);
  },
  setRecords(records: DriftRecord[]): void {
    write(KEYS.records, records);
  },
  getRecordsByBook(bookId: string): DriftRecord[] {
    return this.getRecords().filter((r) => r.bookId === bookId).sort((a, b) => a.timestamp - b.timestamp);
  },
  addRecord(record: DriftRecord): void {
    const records = this.getRecords();
    records.push(record);
    this.setRecords(records);
  },

  getCurrentUser(): User {
    return read<User>(KEYS.user, { id: 'user-1', nickname: '书虫小明', city: '北京', avatar: '' });
  },
  setCurrentUser(user: User): void {
    write(KEYS.user, user);
  },

  isSeeded(): boolean {
    return localStorage.getItem(KEYS.seeded) === '1';
  },
  markSeeded(): void {
    localStorage.setItem(KEYS.seeded, '1');
  },
};
