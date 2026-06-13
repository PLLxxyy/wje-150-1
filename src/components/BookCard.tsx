import React from 'react';
import type { Book } from '../types';
import { useNavigate } from 'react-router-dom';

interface BookCardProps {
  book: Book;
}

const statusClass: Record<string, string> = {
  '待漂流': 'tag-status-available',
  '漂流中': 'tag-status-drifting',
  '已归档': 'tag-status-archived',
};

const coverEmojis: Record<string, string> = {
  '文学': '📖', '科技': '💻', '生活': '🌿', '童书': '🧸',
  '社科': '🌍', '艺术': '🎨', '经管': '📊', '其他': '📚',
};

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();

  return (
    <div className="book-card" onClick={() => navigate(`/book/${book.id}`)}>
      {book.cover ? (
        <img className="book-cover" src={book.cover} alt={book.title} />
      ) : (
        <div className="book-cover-placeholder">{coverEmojis[book.category] || '📚'}</div>
      )}
      <div className="book-info">
        <div className="book-title">{book.title}</div>
        <div className="book-author">{book.author}</div>
        <div className="book-summary">{book.summary}</div>
        <div className="book-tags">
          <span className="tag tag-category">{book.category}</span>
          <span className={`tag ${book.type === '漂流' ? 'tag-drift' : 'tag-swap'}`}>{book.type}</span>
          <span className={`tag ${statusClass[book.status]}`}>{book.status}</span>
        </div>
      </div>
    </div>
  );
};
