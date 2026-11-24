import { useEffect, useRef, useState, type FormEvent } from 'react';
import { groupByDay, formatTime, initials, type Conversation } from '../lib/chat';
import { Icon } from './Icon';

interface Props {
  conversation: Conversation;
  typing: boolean;
  onSend: (text: string) => void;
  onBack: () => void;
}

export function Thread({ conversation, typing, onSend, onBack }: Props) {
  const [draft, setDraft] = useState('');
  const end = useRef<HTMLDivElement>(null);
  const groups = groupByDay(conversation.messages, Date.now());

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' });
  }, [conversation.messages.length, typing, conversation.id]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSend(draft);
    setDraft('');
  };

  return (
    <section className="thread" aria-label={`Chat with ${conversation.name}`}>
      <header className="thread-head">
        <button type="button" className="icon-btn back" aria-label="Back to conversations" onClick={onBack}>
          <Icon name="back" />
        </button>
        <span className="avatar" style={{ background: conversation.color }}>{initials(conversation.name)}</span>
        <div>
          <strong>{conversation.name}</strong>
          <small>{typing ? 'typing…' : conversation.status}</small>
        </div>
      </header>

      <div className="messages" role="log" aria-live="polite">
        {groups.map((g) => (
          <div key={g.key}>
            <div className="day"><span>{g.label}</span></div>
            {g.messages.map((m) => (
              <div key={m.id} className={`row ${m.from}`}>
                <p className="bubble">
                  {m.text}
                  <time>{formatTime(m.at)}</time>
                </p>
              </div>
            ))}
          </div>
        ))}
        {typing && (
          <div className="row them">
            <p className="bubble dots" aria-label="typing"><i /><i /><i /></p>
          </div>
        )}
        <div ref={end} />
      </div>

      <form className="composer" onSubmit={submit}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a message…" aria-label="Message" autoComplete="off" />
        <button type="submit" className="send" aria-label="Send message" disabled={!draft.trim()}>
          <Icon name="send" />
        </button>
      </form>
    </section>
  );
}
