import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { BookCard } from '../components/BookCard';

type MyTab = 'published' | 'holding' | 'history';

export const MyBooks: React.FC = () => {
  const [tab, setTab] = useState<MyTab>('published');
  const navigate = useNavigate();
  const user = storage.getCurrentUser();
  const books = storage.getBooks();
  const records = storage.getRecords();

  const published = useMemo(() => books.filter((b) => b.publisherId === user.id), [books, user.id]);

  const holding = useMemo(() => books.filter((b) => b.currentHolderId === user.id), [books, user.id]);

  const history = useMemo(() => {
    const bookIds = new Set(records.filter((r) => r.fromUser === user.id || r.toUser === user.id).map((r) => r.bookId));
    return books.filter((b) => bookIds.has(b.id));
  }, [books, records, user.id]);

  const currentList = tab === 'published' ? published : tab === 'holding' ? holding : history;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 0 8px' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>个人中心</div>
          <div style={{ fontSize: 14, color: 'var(--gray-500)', marginTop: 2 }}>
            {user.nickname} · {user.city}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/publish')}>发布书籍</button>
      </div>

      <div className="tabs">
        <div className={`tab ${tab === 'published' ? 'active' : ''}`} onClick={() => setTab('published')}>
          我发布的 ({published.length})
        </div>
        <div className={`tab ${tab === 'holding' ? 'active' : ''}`} onClick={() => setTab('holding')}>
          我手中的 ({holding.length})
        </div>
        <div className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
          漂流历史 ({history.length})
        </div>
      </div>

      {currentList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{tab === 'published' ? '📖' : tab === 'holding' ? '🤲' : '📜'}</div>
          <div className="empty-text">
            {tab === 'published' ? '还没有发布过书籍' : tab === 'holding' ? '手中暂无书籍' : '暂无漂流历史'}
          </div>
          {tab === 'published' && (
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => navigate('/publish')}>
              去发布
            </button>
          )}
        </div>
      ) : (
        <div className="book-grid">
          {currentList.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};
