'use client';
import { useState, useRef } from 'react';
import { submitSessionRequest } from './actions';

export default function SessionRequestForm() {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('submitting');
    const fd = new FormData(e.currentTarget);
    const result = await submitSessionRequest(fd);
    if (result?.error) {
      setErrorMsg(result.error);
      setState('error');
    } else {
      setState('success');
      formRef.current?.reset();
    }
  }

  if (state === 'success') {
    return (
      <div className="req-success">
        <h3>Request received.</h3>
        <p>Thank you — we'll be in touch about scheduling.</p>
        <button className="btn btn-secondary" onClick={() => setState('idle')}>Send another</button>
      </div>
    );
  }

  return (
    <form ref={formRef} className="req-form" onSubmit={handleSubmit} noValidate>
      <div className="req-form-row">
        <label className="req-label">
          Name <span aria-hidden="true">*</span>
          <input className="req-input" name="name" type="text" required placeholder="Your name" />
        </label>
        <label className="req-label">
          Email <span aria-hidden="true">*</span>
          <input className="req-input" name="email" type="email" required placeholder="your@email.com" />
        </label>
      </div>
      <label className="req-label">
        Topic <span aria-hidden="true">*</span>
        <input className="req-input" name="topic" type="text" required placeholder="What would you like to study?" />
      </label>
      <label className="req-label">
        Message
        <textarea className="req-input req-textarea" name="message" rows={4} placeholder="Any extra context — your questions, where you are in your journey…" />
      </label>
      {state === 'error' && <p className="req-error">{errorMsg}</p>}
      <button className="btn btn-primary" type="submit" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'Sending…' : 'Send request'}
      </button>
    </form>
  );
}
