import { useEffect, useRef, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Thread } from './components/Thread';
import { AUTO_REPLIES, seedConversations } from './data/seed';
import { markRead, sendMessage, type Conversation } from './lib/chat';
import { useTheme } from './lib/theme';

const KEY = 'chatly-state';

function load(): Conversation[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Conversation[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {
    /* ignore corrupt or unavailable storage */
  }
  return seedConversations(Date.now());
}

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [conversations, setConversations] = useState<Conversation[]>(load);
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [query, setQuery] = useState('');
  const [mobileThread, setMobileThread] = useState(false);
  const [typingId, setTypingId] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(conversations));
    } catch {
      /* storage can be unavailable; the app still works */
    }
  }, [conversations]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  const select = (id: string) => {
    setActiveId(id);
    setConversations((list) => markRead(list, id));
    setMobileThread(true);
  };

  const send = (text: string) => {
    const id = active.id;
    setConversations((list) => sendMessage(list, id, text, Date.now()));
    window.clearTimeout(timer.current);
    setTypingId(id);
    timer.current = window.setTimeout(() => {
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      setConversations((list) =>
        list.map((c) => (c.id === id ? { ...c, messages: [...c.messages, { id: `${id}-r-${Date.now()}`, from: 'them', text: reply, at: Date.now() }] } : c)),
      );
      setTypingId(null);
    }, 1400);
  };

  return (
    <div className={`app ${mobileThread ? 'show-thread' : ''}`}>
      <Sidebar conversations={conversations} activeId={active.id} query={query} theme={theme} onQuery={setQuery} onSelect={select} onToggleTheme={toggleTheme} />
      <Thread conversation={active} typing={typingId === active.id} onSend={send} onBack={() => setMobileThread(false)} />
    </div>
  );
}
