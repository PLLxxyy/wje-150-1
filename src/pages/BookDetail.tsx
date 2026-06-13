import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { id } from '../utils/seed';
import { useToast } from '../components/Toast';
import { DriftTimeline } from '../components/DriftTimeline';

const coverEmojis: Record<string, string> = {
  '文学': '📖', '科技': '💻', '生活': '🌿', '童书': '🧸',
  '社科': '🌍', '艺术': '🎨', '经管': '📊', '其他': '📚',
};

const statusClass: Record<string, string> = {
  '待漂流': 'tag-status-available',
  '漂流中': 'tag-status-drifting',
  '已归档': 'tag-status-archived',
};

export const BookDetail: React.FC = () => {
  const { id: bookId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = storage.getCurrentUser();

  const [showSendModal, setShowSendModal] = useState(false);
  const [targetNickname, setTargetNickname] = useState('');
  const [targetCity, setTargetCity] = useState('');

  const book = storage.getBookById(bookId || '');
  if (!book) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📚</div>
        <div className="empty-text">书籍不存在</div>
        <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={() => navigate('/')}>返回首页</button>
      </div>
    );
  }

  const records = storage.getRecordsByBook(book.id);
  const isHolder = book.currentHolderId === user.id;
  const isPublisher = book.publisherId === user.id;
  const cities = [...new Set(records.map((r) => r.city))];

  const handleSend = () => {
    if (!targetNickname.trim()) { showToast('请输入对方昵称', 'error'); return; }
    if (!targetCity.trim()) { showToast('请输入对方城市', 'error'); return; }
    const now = Date.now();
    storage.addRecord({
      id: id(),
      bookId: book.id,
      action: '寄出',
      fromUser: user.id,
      fromNickname: user.nickname,
      toUser: `temp-${now}`,
      toNickname: targetNickname.trim(),
      city: user.city,
      timestamp: now,
    });
    storage.updateBook(book.id, { status: '漂流中', currentHolderId: `temp-${now}` });
    showToast('寄出成功！', 'success');
    setShowSendModal(false);
    setTargetNickname('');
    setTargetCity('');
  };

  const handleReceive = () => {
    const now = Date.now();
    storage.addRecord({
      id: id(),
      bookId: book.id,
      action: '收到',
      fromUser: user.id,
      fromNickname: user.nickname,
      toUser: user.id,
      toNickname: user.nickname,
      city: user.city,
      timestamp: now,
    });
    storage.updateBook(book.id, { currentHolderId: user.id });
    showToast('已确认收到！', 'success');
  };

  const handleArchive = () => {
    const now = Date.now();
    storage.addRecord({
      id: id(),
      bookId: book.id,
      action: '完成',
      fromUser: user.id,
      fromNickname: user.nickname,
      toUser: user.id,
      toNickname: user.nickname,
      city: user.city,
      timestamp: now,
    });
    storage.updateBook(book.id, { status: '已归档' });
    showToast('漂流已完成，书籍已归档', 'success');
  };

  return (
    <div>
      <div className="back-link" onClick={() => navigate('/')}>← 返回首页</div>

      <div className="detail-header">
        <div className="detail-cover">
          {book.cover ? (
            <img src={book.cover} alt={book.title} />
          ) : (
            <div className="book-cover-placeholder" style={{ height: 267, fontSize: 64 }}>
              {coverEmojis[book.category] || '📚'}
            </div>
          )}
        </div>
        <div className="detail-meta">
          <div className="detail-title">{book.title}</div>
          <div className="detail-author">{book.author}</div>
          <div className="detail-summary">{book.summary}</div>
          <div className="detail-info-row">
            <span className="tag tag-category">{book.category}</span>
            <span className={`tag ${book.type === '漂流' ? 'tag-drift' : 'tag-swap'}`}>{book.type}</span>
            <span className={`tag ${statusClass[book.status]}`}>{book.status}</span>
            <span className="badge badge-primary">漂流码: {book.driftCode}</span>
          </div>
          {book.status !== '已归档' && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              {isHolder && (
                <button className="btn btn-primary" onClick={() => setShowSendModal(true)}>
                  {book.type === '换书' ? '发起换书' : '寄出漂流'}
                </button>
              )}
              {!isHolder && book.status === '漂流中' && (
                <button className="btn btn-success" onClick={handleReceive}>确认收到</button>
              )}
              {isHolder && book.status === '漂流中' && (
                <button className="btn btn-secondary" onClick={handleArchive}>归档（结束漂流）</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Drift Code */}
      <div className="drift-code-box">
        <div className="drift-code-label">专属漂流码</div>
        <div className="drift-code-value">{book.driftCode}</div>
        <div className="drift-code-hint">分享此码，让其他人查看这本书的漂流轨迹</div>
      </div>

      {/* Cities */}
      {cities.length > 1 && (
        <div className="cities-bar">
          <div className="cities-bar-title">📍 足迹地图</div>
          <div className="cities-list">
            {cities.map((city, i) => (
              <React.Fragment key={city}>
                <span className="city-tag">{city}</span>
                {i < cities.length - 1 && <span className="city-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <DriftTimeline records={records} />

      {/* Send Modal */}
      {showSendModal && (
        <div className="modal-overlay" onClick={() => setShowSendModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{book.type === '换书' ? '发起换书' : '寄出漂流'}</div>
            <div className="form-group">
              <label className="form-label">对方昵称</label>
              <input className="form-input" value={targetNickname} onChange={(e) => setTargetNickname(e.target.value)} placeholder="输入对方昵称" />
            </div>
            <div className="form-group">
              <label className="form-label">对方城市</label>
              <input className="form-input" value={targetCity} onChange={(e) => setTargetCity(e.target.value)} placeholder="输入对方所在城市" />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowSendModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSend}>确认寄出</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
