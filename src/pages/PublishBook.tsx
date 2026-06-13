import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { id, genDriftCode } from '../utils/seed';
import { useToast } from '../components/Toast';
import type { BookCategory, BookType } from '../types';

const CATEGORIES: BookCategory[] = ['文学', '科技', '生活', '童书', '社科', '艺术', '经管', '其他'];

export const PublishBook: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = storage.getCurrentUser();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<BookCategory>('文学');
  const [summary, setSummary] = useState('');
  const [cover, setCover] = useState('');
  const [bookType, setBookType] = useState<BookType>('漂流');

  const handleSubmit = () => {
    if (!title.trim()) { showToast('请输入书名', 'error'); return; }
    if (!author.trim()) { showToast('请输入作者', 'error'); return; }

    const now = Date.now();
    const bookId = id();
    const code = genDriftCode();

    storage.addBook({
      id: bookId,
      title: title.trim(),
      author: author.trim(),
      category,
      summary: summary.trim() || '暂无简介',
      cover,
      type: bookType,
      status: '待漂流',
      driftCode: code,
      publisherId: user.id,
      currentHolderId: user.id,
      publishTime: now,
      city: user.city,
    });

    storage.addRecord({
      id: id(),
      bookId,
      action: '发布',
      fromUser: user.id,
      fromNickname: user.nickname,
      toUser: user.id,
      toNickname: user.nickname,
      city: user.city,
      timestamp: now,
    });

    showToast('发布成功！', 'success');
    navigate(`/book/${bookId}`);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCover(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="form-page">
      <div className="back-link" onClick={() => navigate('/')}>← 返回首页</div>
      <h1 className="form-title">发布书籍</h1>

      <div className="form-group">
        <label className="form-label">书名 *</label>
        <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="输入书名" />
      </div>

      <div className="form-group">
        <label className="form-label">作者 *</label>
        <input className="form-input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="输入作者名" />
      </div>

      <div className="form-group">
        <label className="form-label">分类</label>
        <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value as BookCategory)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">一句话简介</label>
        <textarea className="form-textarea" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="简要描述这本书..." />
      </div>

      <div className="form-group">
        <label className="form-label">封面图</label>
        <input type="file" accept="image/*" onChange={handleCoverUpload} style={{ fontSize: 14 }} />
        {cover && <img src={cover} alt="封面预览" style={{ marginTop: 8, width: 120, borderRadius: 8, boxShadow: 'var(--shadow)' }} />}
        <div className="form-hint">可选，上传一张书籍封面图片</div>
      </div>

      <div className="form-group">
        <label className="form-label">发布方式</label>
        <div className="radio-group">
          <div className={`radio-card ${bookType === '漂流' ? 'selected' : ''}`} onClick={() => setBookType('漂流')}>
            <div className="radio-card-icon">🌊</div>
            <div className="radio-card-label">漂流</div>
            <div className="radio-card-desc">寄出后下一个人继续传</div>
          </div>
          <div className={`radio-card ${bookType === '换书' ? 'selected' : ''}`} onClick={() => setBookType('换书')}>
            <div className="radio-card-icon">🔄</div>
            <div className="radio-card-label">换书</div>
            <div className="radio-card-desc">两人互换各自手中的书</div>
          </div>
        </div>
      </div>

      <button className="btn btn-primary btn-block" onClick={handleSubmit} style={{ marginTop: 8 }}>
        发布书籍
      </button>
    </div>
  );
};
