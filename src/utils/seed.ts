import type { Book, DriftRecord, User } from '../types';
import { storage } from './storage';

const MOCK_USERS: User[] = [
  { id: 'user-1', nickname: '书虫小明', city: '北京', avatar: '' },
  { id: 'user-2', nickname: '阅读达人', city: '上海', avatar: '' },
  { id: 'user-3', nickname: '静静读书', city: '杭州', avatar: '' },
  { id: 'user-4', nickname: '知识猎人', city: '深圳', avatar: '' },
  { id: 'user-5', nickname: '书海拾贝', city: '成都', avatar: '' },
  { id: 'user-6', nickname: '一盏灯下', city: '南京', avatar: '' },
];

const MOCK_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    category: '文学',
    summary: '马孔多小镇上布恩迪亚家族七代人的兴衰史，魔幻现实主义的巅峰之作。',
    cover: '',
    type: '漂流',
    status: '待漂流',
    driftCode: 'DR-20240001',
    publisherId: 'user-2',
    currentHolderId: 'user-2',
    publishTime: Date.now() - 86400000 * 10,
    city: '上海',
  },
  {
    id: 'book-2',
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    category: '社科',
    summary: '从认知革命到人工智能，十万年人类发展史的宏大叙事。',
    cover: '',
    type: '漂流',
    status: '漂流中',
    driftCode: 'DR-20240002',
    publisherId: 'user-3',
    currentHolderId: 'user-1',
    publishTime: Date.now() - 86400000 * 30,
    city: '杭州',
  },
  {
    id: 'book-3',
    title: 'JavaScript高级程序设计',
    author: 'Matt Frisbie',
    category: '科技',
    summary: '前端开发者必读经典，涵盖JavaScript语言方方面面。',
    cover: '',
    type: '换书',
    status: '待漂流',
    driftCode: 'DR-20240003',
    publisherId: 'user-4',
    currentHolderId: 'user-4',
    publishTime: Date.now() - 86400000 * 5,
    city: '深圳',
  },
  {
    id: 'book-4',
    title: '小王子',
    author: '安托万·德·圣-埃克苏佩里',
    category: '童书',
    summary: '一个来自B612小行星的王子，在旅途中遇见形形色色的人。',
    cover: '',
    type: '漂流',
    status: '已归档',
    driftCode: 'DR-20240004',
    publisherId: 'user-5',
    currentHolderId: 'user-6',
    publishTime: Date.now() - 86400000 * 90,
    city: '成都',
  },
  {
    id: 'book-5',
    title: '断舍离',
    author: '山下英子',
    category: '生活',
    summary: '通过整理物品来整理内心，学会放下对物品的执念。',
    cover: '',
    type: '换书',
    status: '漂流中',
    driftCode: 'DR-20240005',
    publisherId: 'user-1',
    currentHolderId: 'user-3',
    publishTime: Date.now() - 86400000 * 20,
    city: '北京',
  },
  {
    id: 'book-6',
    title: '设计心理学',
    author: '唐纳德·诺曼',
    category: '科技',
    summary: '揭示产品设计背后的心理学原理，好设计为什么好。',
    cover: '',
    type: '漂流',
    status: '待漂流',
    driftCode: 'DR-20240006',
    publisherId: 'user-6',
    currentHolderId: 'user-6',
    publishTime: Date.now() - 86400000 * 2,
    city: '南京',
  },
  {
    id: 'book-7',
    title: '富爸爸穷爸爸',
    author: '罗伯特·清崎',
    category: '经管',
    summary: '两位爸爸截然不同的金钱观，颠覆你对财富的认知。',
    cover: '',
    type: '漂流',
    status: '待漂流',
    driftCode: 'DR-20240007',
    publisherId: 'user-1',
    currentHolderId: 'user-1',
    publishTime: Date.now() - 86400000 * 1,
    city: '北京',
  },
  {
    id: 'book-8',
    title: '美的历程',
    author: '李泽厚',
    category: '艺术',
    summary: '从远古图腾到明清文艺，一部中国美学的巡礼。',
    cover: '',
    type: '换书',
    status: '已归档',
    driftCode: 'DR-20240008',
    publisherId: 'user-2',
    currentHolderId: 'user-4',
    publishTime: Date.now() - 86400000 * 60,
    city: '上海',
  },
];

const MOCK_RECORDS: DriftRecord[] = [
  // book-2 漂流中: user-3(杭州) -> user-1(北京)
  { id: 'rec-1', bookId: 'book-2', action: '发布', fromUser: 'user-3', fromNickname: '静静读书', toUser: 'user-3', toNickname: '静静读书', city: '杭州', timestamp: Date.now() - 86400000 * 30 },
  { id: 'rec-2', bookId: 'book-2', action: '寄出', fromUser: 'user-3', fromNickname: '静静读书', toUser: 'user-1', toNickname: '书虫小明', city: '杭州', timestamp: Date.now() - 86400000 * 25 },
  { id: 'rec-3', bookId: 'book-2', action: '收到', fromUser: 'user-1', fromNickname: '书虫小明', toUser: 'user-1', toNickname: '书虫小明', city: '北京', timestamp: Date.now() - 86400000 * 22 },

  // book-4 已归档: 完整漂流
  { id: 'rec-4', bookId: 'book-4', action: '发布', fromUser: 'user-5', fromNickname: '书海拾贝', toUser: 'user-5', toNickname: '书海拾贝', city: '成都', timestamp: Date.now() - 86400000 * 90 },
  { id: 'rec-5', bookId: 'book-4', action: '寄出', fromUser: 'user-5', fromNickname: '书海拾贝', toUser: 'user-2', toNickname: '阅读达人', city: '成都', timestamp: Date.now() - 86400000 * 82 },
  { id: 'rec-6', bookId: 'book-4', action: '收到', fromUser: 'user-2', fromNickname: '阅读达人', toUser: 'user-2', toNickname: '阅读达人', city: '上海', timestamp: Date.now() - 86400000 * 78 },
  { id: 'rec-7', bookId: 'book-4', action: '寄出', fromUser: 'user-2', fromNickname: '阅读达人', toUser: 'user-6', toNickname: '一盏灯下', city: '上海', timestamp: Date.now() - 86400000 * 60 },
  { id: 'rec-8', bookId: 'book-4', action: '收到', fromUser: 'user-6', fromNickname: '一盏灯下', toUser: 'user-6', toNickname: '一盏灯下', city: '南京', timestamp: Date.now() - 86400000 * 55 },
  { id: 'rec-9', bookId: 'book-4', action: '完成', fromUser: 'user-6', fromNickname: '一盏灯下', toUser: 'user-6', toNickname: '一盏灯下', city: '南京', timestamp: Date.now() - 86400000 * 50 },

  // book-5 漂流中: user-1(北京) -> user-3(杭州)
  { id: 'rec-10', bookId: 'book-5', action: '发布', fromUser: 'user-1', fromNickname: '书虫小明', toUser: 'user-1', toNickname: '书虫小明', city: '北京', timestamp: Date.now() - 86400000 * 20 },
  { id: 'rec-11', bookId: 'book-5', action: '寄出', fromUser: 'user-1', fromNickname: '书虫小明', toUser: 'user-3', toNickname: '静静读书', city: '北京', timestamp: Date.now() - 86400000 * 15 },
  { id: 'rec-12', bookId: 'book-5', action: '收到', fromUser: 'user-3', fromNickname: '静静读书', toUser: 'user-3', toNickname: '静静读书', city: '杭州', timestamp: Date.now() - 86400000 * 12 },

  // book-8 已归档
  { id: 'rec-13', bookId: 'book-8', action: '发布', fromUser: 'user-2', fromNickname: '阅读达人', toUser: 'user-2', toNickname: '阅读达人', city: '上海', timestamp: Date.now() - 86400000 * 60 },
  { id: 'rec-14', bookId: 'book-8', action: '寄出', fromUser: 'user-2', fromNickname: '阅读达人', toUser: 'user-4', toNickname: '知识猎人', city: '上海', timestamp: Date.now() - 86400000 * 52 },
  { id: 'rec-15', bookId: 'book-8', action: '收到', fromUser: 'user-4', fromNickname: '知识猎人', toUser: 'user-4', toNickname: '知识猎人', city: '深圳', timestamp: Date.now() - 86400000 * 48 },
  { id: 'rec-16', bookId: 'book-8', action: '完成', fromUser: 'user-4', fromNickname: '知识猎人', toUser: 'user-4', toNickname: '知识猎人', city: '深圳', timestamp: Date.now() - 86400000 * 45 },

  // book-1 发布记录
  { id: 'rec-17', bookId: 'book-1', action: '发布', fromUser: 'user-2', fromNickname: '阅读达人', toUser: 'user-2', toNickname: '阅读达人', city: '上海', timestamp: Date.now() - 86400000 * 10 },

  // book-3 发布记录
  { id: 'rec-18', bookId: 'book-3', action: '发布', fromUser: 'user-4', fromNickname: '知识猎人', toUser: 'user-4', toNickname: '知识猎人', city: '深圳', timestamp: Date.now() - 86400000 * 5 },

  // book-6 发布记录
  { id: 'rec-19', bookId: 'book-6', action: '发布', fromUser: 'user-6', fromNickname: '一盏灯下', toUser: 'user-6', toNickname: '一盏灯下', city: '南京', timestamp: Date.now() - 86400000 * 2 },

  // book-7 发布记录
  { id: 'rec-20', bookId: 'book-7', action: '发布', fromUser: 'user-1', fromNickname: '书虫小明', toUser: 'user-1', toNickname: '书虫小明', city: '北京', timestamp: Date.now() - 86400000 * 1 },
];

export function seedData(): void {
  if (storage.isSeeded()) return;
  storage.setBooks(MOCK_BOOKS);
  storage.setRecords(MOCK_RECORDS);
  storage.setCurrentUser(MOCK_USERS[0]);
  storage.markSeeded();
}

export function id(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function genDriftCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `DR-${new Date().getFullYear()}${num}`;
}
