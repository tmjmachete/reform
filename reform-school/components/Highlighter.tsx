'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Props = {
  targetType: 'lesson' | 'journal';
  targetId: string;
  signedIn: boolean;
  children: React.ReactNode;
};

type HighlightRow = { id: string; start_offset: number; end_offset: number };
type Pending = { startOffset: number; endOffset: number; text: string; x: number; y: number };

function getTextOffset(container: HTMLElement, targetNode: Node, targetOffset: number): number {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let offset = 0;
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node === targetNode) return offset + targetOffset;
    offset += (node as Text).length;
  }
  return -1;
}

function applyHighlight(container: HTMLElement, startOff: number, endOff: number, hlId: string): void {
  if (startOff >= endOff) return;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let pos = 0;
  const segments: Array<{ node: Text; localStart: number; localEnd: number }> = [];
  let node: Node | null;

  while ((node = walker.nextNode())) {
    const text = node as Text;
    const len = text.length;
    const nodeEnd = pos + len;
    if (nodeEnd > startOff && pos < endOff) {
      segments.push({ node: text, localStart: Math.max(startOff, pos) - pos, localEnd: Math.min(endOff, nodeEnd) - pos });
    }
    pos += len;
    if (pos >= endOff) break;
  }

  for (let i = segments.length - 1; i >= 0; i--) {
    const { node: textNode, localStart, localEnd } = segments[i];
    try {
      const range = document.createRange();
      range.setStart(textNode, localStart);
      range.setEnd(textNode, localEnd);
      const mark = document.createElement('mark');
      mark.className = 'hl';
      mark.dataset.hlId = hlId;
      range.surroundContents(mark);
    } catch {
      // skip if DOM state prevents wrapping (e.g. cross-block boundaries)
    }
  }
}

export default function Highlighter({ targetType, targetId, signedIn, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [supabase] = useState(() => createClient());
  const [pending, setPending] = useState<Pending | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!signedIn || !containerRef.current) return;
    const container = containerRef.current;

    (async () => {
      const { data } = await supabase
        .from('highlights')
        .select('id, start_offset, end_offset')
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .order('start_offset', { ascending: true });

      const rows = (data ?? []) as HighlightRow[];
      if (!container) return;
      for (const row of rows) {
        applyHighlight(container, row.start_offset, row.end_offset, row.id);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn, targetType, targetId]);

  useEffect(() => {
    if (!signedIn) return;
    const container = containerRef.current;
    if (!container) return;

    function onMouseUp() {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) { setPending(null); return; }

      const range = sel.getRangeAt(0);
      if (!container!.contains(range.commonAncestorContainer)) { setPending(null); return; }

      const text = sel.toString().trim();
      if (!text) { setPending(null); return; }

      const startOff = getTextOffset(container!, range.startContainer, range.startOffset);
      const endOff = getTextOffset(container!, range.endContainer, range.endOffset);
      if (startOff < 0 || endOff < 0 || startOff >= endOff) { setPending(null); return; }

      const rect = range.getBoundingClientRect();
      setPending({ startOffset: startOff, endOffset: endOff, text, x: rect.left + rect.width / 2, y: rect.top });
    }

    document.addEventListener('mouseup', onMouseUp);
    return () => document.removeEventListener('mouseup', onMouseUp);
  }, [signedIn]);

  const saveHighlight = useCallback(async () => {
    if (!pending || !containerRef.current) return;
    setSaving(true);

    const { data, error } = await supabase
      .from('highlights')
      .insert({
        target_type: targetType,
        target_id: targetId,
        start_offset: pending.startOffset,
        end_offset: pending.endOffset,
        highlighted_text: pending.text,
        color: 'yellow',
      } as never)
      .select('id')
      .single();

    if (!error && data && containerRef.current) {
      applyHighlight(containerRef.current, pending.startOffset, pending.endOffset, (data as { id: string }).id);
      window.getSelection()?.removeAllRanges();
    }

    setPending(null);
    setSaving(false);
  }, [pending, supabase, targetType, targetId]);

  return (
    <div ref={containerRef}>
      {children}
      {pending && (
        <button
          className="highlight-btn"
          style={{ position: 'fixed', left: pending.x, top: pending.y, transform: 'translate(-50%, calc(-100% - 8px))' }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={saveHighlight}
          disabled={saving}
        >
          {saving ? '…' : '✦ Highlight'}
        </button>
      )}
    </div>
  );
}
