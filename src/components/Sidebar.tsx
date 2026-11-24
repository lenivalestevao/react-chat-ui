import { filterConversations, formatTime, initials, lastMessage, preview, sortByRecent, totalUnread, type Conversation } from '../lib/chat';
import type { Theme } from '../lib/theme';
import { Icon } from './Icon';

interface Props {
  conversations: Conversation[];
  activeId: string;
  query: string;
  theme: Theme;
  onQuery: (q: string) => void;
  onSelect: (id: string) => void;
  onToggleTheme: () => void;
}

export function Sidebar({ conversations, activeId, query, theme, onQuery, onSelect, onToggleTheme }: Props) {
  const list = sortByRecent(filterConversations(conversations, query));
  const unread = totalUnread(conversations);
  return (
    <aside className="sidebar" aria-label="Conversations">
      <header className="side-head">
        <h1>
          Chatly {unread > 0 && <span className="count" aria-label={`${unread} unread messages`}>{unread}</span>}
        </h1>
        <button type="button" className="icon-btn" aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} onClick={onToggleTheme}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
      </header>
      <label className="search">
        <Icon name="search" size={18} />
        <input type="search" placeholder="Search chats" value={query} onChange={(e) => onQuery(e.target.value)} aria-label="Search chats" />
      </label>
      <ul className="convs">
        {list.map((c) => {
          const last = lastMessage(c);
          return (
            <li key={c.id}>
              <button type="button" className={`conv ${c.id === activeId ? 'active' : ''}`} onClick={() => onSelect(c.id)} aria-current={c.id === activeId}>
                <span className="avatar" style={{ background: c.color }}>{initials(c.name)}</span>
                <span className="conv-main">
                  <span className="conv-top">
                    <strong>{c.name}</strong>
                    {last && <time>{formatTime(last.at)}</time>}
                  </span>
                  <span className="conv-bottom">
                    <span className="snippet">{preview(c)}</span>
                    {c.unread > 0 && <span className="count">{c.unread}</span>}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
        {list.length === 0 && <li className="empty">No chats match your search.</li>}
      </ul>
    </aside>
  );
}
