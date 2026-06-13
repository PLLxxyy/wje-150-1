export type BookCategory = '文学' | '科技' | '生活' | '童书' | '社科' | '艺术' | '经管' | '其他';
export type BookStatus = '待漂流' | '漂流中' | '已归档';
export type BookType = '漂流' | '换书';

export interface User {
  id: string;
  nickname: string;
  city: string;
  avatar: string;
}

export interface DriftRecord {
  id: string;
  bookId: string;
  action: '发布' | '寄出' | '收到' | '完成';
  fromUser: string;
  fromNickname: string;
  toUser: string;
  toNickname: string;
  city: string;
  timestamp: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  summary: string;
  cover: string;
  type: BookType;
  status: BookStatus;
  driftCode: string;
  publisherId: string;
  currentHolderId: string;
  publishTime: number;
  city: string;
}
