import { describe, expect, it } from 'vitest';
import {
  filterConversations,
  formatTime,
  groupByDay,
  initials,
  markRead,
  preview,
  sendMessage,
  sortByRecent,
  totalUnread,
  type Conversation,
} from './chat';

const t = (d: number, h = 10, m = 0) => new Date(2026, 10, d, h, m).getTime();
const make = (id: string, name: string, texts: [string, 'me' | 'them', number][], unread = 0): Conversation => ({
  id,
  name,
  status: 'Online',
  color: '#000',
  unread,
  messages: texts.map(([text, from, at], i) => ({ id: `${id}${i}`, from, text, at })),
});

const A = make('a', 'Ana Souza', [['Hello there', 'them', t(20)], ['See you soon', 'me', t(22)]], 2);
const B = make('b', 'Bruno Lima', [['Lunch tomorrow?', 'them', t(23)]], 1);

describe('chat helpers', () => {
  it('builds initials', () => {
    expect(initials('ana souza')).toBe('AS');
    expect(initials('Madonna')).toBe('M');
  });
  it('filters by name or message text', () => {
    expect(filterConversations([A, B], 'bruno')).toHaveLength(1);
    expect(filterConversations([A, B], 'LUNCH')[0].id).toBe('b');
    expect(filterConversations([A, B], '  ')).toHaveLength(2);
    expect(filterConversations([A, B], 'zzz')).toHaveLength(0);
  });
  it('sorts by most recent message', () => {
    expect(sortByRecent([A, B]).map((c) => c.id)).toEqual(['b', 'a']);
  });
  it('sums unread counts and marks read', () => {
    expect(totalUnread([A, B])).toBe(3);
    expect(totalUnread(markRead([A, B], 'a'))).toBe(1);
  });
  it('formats time with two digits', () => {
    expect(formatTime(t(1, 9, 5))).toBe('09:05');
  });
  it('groups messages by day with friendly labels', () => {
    const now = t(22, 15);
    const groups = groupByDay(
      [
        { id: '1', from: 'them', text: 'a', at: t(20) },
        { id: '2', from: 'me', text: 'b', at: t(21, 9) },
        { id: '3', from: 'them', text: 'c', at: t(21, 18) },
        { id: '4', from: 'me', text: 'd', at: t(22, 8) },
      ],
      now,
    );
    expect(groups.map((g) => g.label)).toEqual(['Nov 20', 'Yesterday', 'Today']);
    expect(groups[1].messages).toHaveLength(2);
  });
  it('sends trimmed messages and ignores blanks', () => {
    const next = sendMessage([A, B], 'b', '  Sure!  ', t(24));
    expect(next[1].messages).toHaveLength(2);
    expect(next[1].messages[1]).toMatchObject({ from: 'me', text: 'Sure!' });
    expect(sendMessage([A, B], 'b', '   ', t(24))).toEqual([A, B]);
  });
  it('previews the last message', () => {
    expect(preview(A)).toBe('You: See you soon');
    expect(preview(B)).toBe('Lunch tomorrow?');
    expect(preview(make('c', 'C', []))).toBe('No messages yet');
    expect(preview(B, 6)).toBe('Lunch…');
  });
});
