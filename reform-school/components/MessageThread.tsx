'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type DirectMessage = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
  is_read: boolean;
};

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MessageThread({
  initial,
  currentUserId,
  otherUserId,
  otherName,
}: {
  initial: DirectMessage[];
  currentUserId: string;
  otherUserId: string;
  otherName: string;
}) {
  const [supabase] = useState(() => createClient());
  const [messages, setMessages] = useState(initial);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const reload = async () => {
    const { data } = await supabase
      .from('direct_messages')
      .select('id, sender_id, body, is_read, created_at')
      .or(
        `and(sender_id.eq.${currentUserId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${currentUserId})`
      )
      .order('created_at', { ascending: true });
    setMessages((data ?? []) as unknown as DirectMessage[]);
  };

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    setBusy(true);
    await supabase.from('direct_messages').insert({
      sender_id: currentUserId,
      recipient_id: otherUserId,
      body: text,
    } as never);
    await reload();
    setDraft('');
    setBusy(false);
  };

  return (
    <div className="dm-thread">
      <div className="dm-header">
        <span className="dm-with">Conversation with {otherName}</span>
      </div>

      <div className="dm-messages">
        {messages.length === 0 && (
          <p className="cm-empty">No messages yet. Send a message to get started.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`dm-msg${m.sender_id === currentUserId ? ' dm-mine' : ''}`}>
            <div className="dm-bubble">{m.body}</div>
            <div className="dm-time">{timeAgo(m.created_at)}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="dm-compose">
        <textarea
          className="dm-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="Write a message…"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button className="btn btn-primary" disabled={busy || !draft.trim()} onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
}
