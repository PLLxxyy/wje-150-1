import React from 'react';
import type { DriftRecord } from '../types';

interface DriftTimelineProps {
  records: DriftRecord[];
}

const actionIcon: Record<string, string> = {
  '发布': '📢',
  '寄出': '📦',
  '收到': '📬',
  '完成': '🎉',
};

function fmt(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const DriftTimeline: React.FC<DriftTimelineProps> = ({ records }) => {
  if (records.length === 0) {
    return <div className="empty-state"><div className="empty-icon">📭</div><div className="empty-text">暂无漂流记录</div></div>;
  }

  return (
    <div className="timeline">
      <div className="timeline-title">🌊 漂流时间线</div>
      <div className="timeline-list">
        {records.map((r) => (
          <div className="timeline-item" key={r.id}>
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-user">{actionIcon[r.action]} {r.fromNickname} {r.action}</div>
              {r.action !== '发布' && r.fromNickname !== r.toNickname && (
                <div className="timeline-detail">
                  {r.action === '寄出' ? `寄给 ${r.toNickname}` : r.action === '收到' ? `来自 ${r.fromNickname}` : ''}
                </div>
              )}
              <div className="timeline-city">📍 {r.city}</div>
              <div className="timeline-time">{fmt(r.timestamp)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
