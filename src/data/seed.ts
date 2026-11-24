import type { Conversation } from '../lib/chat';

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/** Builds demo conversations relative to "now" so labels like Today and Yesterday always show. */
export function seedConversations(now: number): Conversation[] {
  const m = (id: string, from: 'me' | 'them', text: string, ago: number) => ({ id, from, text, at: now - ago });
  return [
    {
      id: 'ana',
      name: 'Ana Souza',
      status: 'Online',
      color: '#7c5cff',
      unread: 2,
      messages: [
        m('a1', 'them', 'Hi! Did you get a chance to look at the new designs?', 2 * DAY + 3 * HOUR),
        m('a2', 'me', 'Yes, they look great. I left a few notes in the doc.', 2 * DAY + 2 * HOUR),
        m('a3', 'them', 'Perfect, thank you!', DAY + 5 * HOUR),
        m('a4', 'them', 'Are we still on for the review at 3?', 40 * MIN),
        m('a5', 'them', 'I will bring the updated mockups.', 38 * MIN),
      ],
    },
    {
      id: 'team',
      name: 'Design Team',
      status: '5 members',
      color: '#0ea5a4',
      unread: 0,
      messages: [
        m('t1', 'them', 'Reminder: sprint demo is tomorrow morning.', DAY + 2 * HOUR),
        m('t2', 'me', 'I will have the prototype ready tonight.', DAY + HOUR),
        m('t3', 'them', 'Awesome, see you all there.', 3 * HOUR),
      ],
    },
    {
      id: 'bruno',
      name: 'Bruno Lima',
      status: 'Last seen 1h ago',
      color: '#f59e0b',
      unread: 1,
      messages: [
        m('b1', 'me', 'Lunch tomorrow?', 6 * HOUR),
        m('b2', 'them', 'Sure! The new place on Main Street?', 90 * MIN),
      ],
    },
    {
      id: 'carla',
      name: 'Carla Mendes',
      status: 'Online',
      color: '#ec4899',
      unread: 0,
      messages: [
        m('c1', 'them', 'Thanks for sending the invoice.', 3 * DAY),
        m('c2', 'me', 'Anytime! Let me know if anything is missing.', 3 * DAY - HOUR),
      ],
    },
    {
      id: 'diego',
      name: 'Diego Alves',
      status: 'Last seen yesterday',
      color: '#3b82f6',
      unread: 0,
      messages: [m('d1', 'them', 'Happy birthday! 🎉', 5 * DAY)],
    },
  ];
}

/** Short canned replies used by the demo to simulate the other person. */
export const AUTO_REPLIES = [
  'Sounds good to me!',
  'Thanks, I will take a look.',
  'Got it. Talk soon!',
  'Perfect, let us do that.',
  'Great idea 👍',
];
