export interface Message {
  id: string;
  from: 'me' | 'them';
  text: string;
  /** Unix time in milliseconds. */
  at: number;
}

export interface Conversation {
  id: string;
  name: string;
  /** Short status such as "Online" or "Last seen today". */
  status: string;
  color: string;
  unread: number;
  messages: Message[];
}

export interface DayGroup {
  key: string;
  label: string;
  messages: Message[];
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

export function lastMessage(c: Conversation): Message | undefined {
  return c.messages[c.messages.length - 1];
}

/** Case-insensitive filter on name or message text. Empty query keeps everything. */
export function filterConversations(list: Conversation[], query: string): Conversation[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((c) => c.name.toLowerCase().includes(q) || c.messages.some((m) => m.text.toLowerCase().includes(q)));
}

/** Most recent conversation first. */
export function sortByRecent(list: Conversation[]): Conversation[] {
  return [...list].sort((a, b) => (lastMessage(b)?.at ?? 0) - (lastMessage(a)?.at ?? 0));
}

export function totalUnread(list: Conversation[]): number {
  return list.reduce((sum, c) => sum + c.unread, 0);
}

export function dayKey(at: number): string {
  const d = new Date(at);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatTime(at: number): string {
  const d = new Date(at);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function dayLabel(at: number, now: number): string {
  const diff = Math.round((new Date(dayKey(now)).getTime() - new Date(dayKey(at)).getTime()) / 86_400_000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return new Date(at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Groups messages by calendar day, keeping order. */
export function groupByDay(messages: Message[], now: number): DayGroup[] {
  const groups: DayGroup[] = [];
  for (const m of messages) {
    const key = dayKey(m.at);
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.messages.push(m);
    else groups.push({ key, label: dayLabel(m.at, now), messages: [m] });
  }
  return groups;
}

/** Appends a message from me. Blank text is ignored. */
export function sendMessage(list: Conversation[], id: string, text: string, at: number): Conversation[] {
  const clean = text.trim();
  if (!clean) return list;
  return list.map((c) =>
    c.id === id ? { ...c, messages: [...c.messages, { id: `${id}-${at}-${c.messages.length}`, from: 'me', text: clean, at }] } : c,
  );
}

export function markRead(list: Conversation[], id: string): Conversation[] {
  return list.map((c) => (c.id === id && c.unread ? { ...c, unread: 0 } : c));
}

/** One-line preview for the conversation list. */
export function preview(c: Conversation, max = 42): string {
  const m = lastMessage(c);
  if (!m) return 'No messages yet';
  const text = (m.from === 'me' ? 'You: ' : '') + m.text;
  return text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text;
}
