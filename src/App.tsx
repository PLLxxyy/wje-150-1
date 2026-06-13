import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { Home } from './pages/Home';
import { BookDetail } from './pages/BookDetail';
import { PublishBook } from './pages/PublishBook';
import { MyBooks } from './pages/MyBooks';

const NotFound: React.FC = () => (
  <div className="empty-state">
    <div className="empty-icon">🤷</div>
    <div className="empty-text">页面不存在</div>
  </div>
);

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <nav className="navbar">
          <div className="navbar-inner">
            <NavLink to="/" className="navbar-logo">
              <span>📖</span> 图书漂流
            </NavLink>
            <div className="navbar-links">
              <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} end>
                首页
              </NavLink>
              <NavLink to="/publish" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                发布书籍
              </NavLink>
              <NavLink to="/my" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                个人中心
              </NavLink>
            </div>
          </div>
        </nav>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/publish" element={<PublishBook />} />
            <Route path="/my" element={<MyBooks />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
};
