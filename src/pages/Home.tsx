import React, { useMemo, useState } from 'react';
import { storage } from '../utils/storage';
import { BookCard } from '../components/BookCard';
import type { BookCategory, BookStatus } from '../types';

const ALL_CATEGORIES: (BookCategory | '全部')[] = ['全部', '文学', '科技', '生活', '童书', '社科', '艺术', '经管', '其他'];
const ALL_STATUSES: (BookStatus | '全部')[] = ['全部', '待漂流', '漂流中', '已归档'];

export const Home: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<BookCategory | '全部'>('全部');
  const [status, setStatus] = useState<BookStatus | '全部'>('全部');

  const books = storage.getBooks();

  const filtered = useMemo(() => {
    return books.filter((b) => {
      if (search) {
        const q = search.toLowerCase();
        if (!b.title.toLowerCase().includes(q) && !b.author.toLowerCase().includes(q)) return false;
      }
      if (category !== '全部' && b.category !== category) return false;
      if (status !== '全部' && b.status !== status) return false;
      return true;
    });
  }, [books, search, category, status]);

  return (
    <div>
      <div className="search-bar">
        <input
          className="search-input"
          placeholder="搜索书名或作者..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-bar">
        {ALL_CATEGORIES.map((c) => (
          <button
            key={c}
            className={`filter-btn ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="filter-bar">
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            className={`filter-btn ${status === s ? 'active' : ''}`}
            onClick={() => setStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-text">没有找到匹配的书籍</div>
        </div>
      ) : (
        <div className="book-grid">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};
