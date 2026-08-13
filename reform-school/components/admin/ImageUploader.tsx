'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const BUCKET = 'lesson-images';
const MAX_MB = 10;

type Uploaded = { url: string; name: string };

export default function ImageUploader({ lessonId }: { lessonId: string }) {
  const [supabase] = useState(() => createClient());
  const [uploads, setUploads] = useState<Uploaded[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    const results: Uploaded[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image file.`);
        continue;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`${file.name} exceeds the ${MAX_MB} MB limit.`);
        continue;
      }
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const path = `${lessonId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) { setError(upErr.message); continue; }
      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
      results.push({ url: publicUrl, name: file.name });
    }

    setUploads((prev) => [...results, ...prev]);
    setUploading(false);
  }

  function copyUrl(url: string) {
    const tag = `<img src="${url}" alt="" class="lesson-img" />`;
    navigator.clipboard.writeText(tag);
    setCopied(url);
    setTimeout(() => setCopied(null), 2200);
  }

  return (
    <div className="img-uploader">
      <div
        className={`img-drop-zone${dragging ? ' dragging' : ''}${uploading ? ' busy' : ''}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading
          ? <span className="img-drop-msg uploading">Uploading…</span>
          : <span className="img-drop-msg">Drop images here <span className="img-drop-or">or</span> click to choose</span>
        }
        <span className="img-drop-hint">PNG, JPG, WebP — up to {MAX_MB} MB each</span>
      </div>

      {error && <p className="img-error">{error}</p>}

      {uploads.length > 0 && (
        <div className="img-gallery">
          {uploads.map((img) => (
            <div className="img-card" key={img.url}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.name} className="img-thumb" />
              <div className="img-card-body">
                <p className="img-name">{img.name}</p>
                <button
                  type="button"
                  className={`img-copy-btn${copied === img.url ? ' done' : ''}`}
                  onClick={() => copyUrl(img.url)}
                >
                  {copied === img.url ? '✓ Copied <img> tag' : 'Copy <img> tag'}
                </button>
                <p className="img-url">{img.url}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
