'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { friendlyError } from '@/lib/errors';

type Kind = 'error' | 'success' | 'info';
interface ToastItem { id: number; kind: Kind; text: string }

interface ToastApi {
  notify: (text: string, kind?: Kind) => void;
  /** Shows a friendly version of any thrown error — never raw codes. */
  notifyError: (err: unknown, fallback?: string) => void;
}

const ToastContext = createContext<ToastApi>({ notify: () => {}, notifyError: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback((id: number) => setItems((all) => all.filter((t) => t.id !== id)), []);

  const notify = useCallback((text: string, kind: Kind = 'info') => {
    const id = ++seq.current;
    setItems((all) => [...all.slice(-2), { id, kind, text }]);
    window.setTimeout(() => dismiss(id), kind === 'error' ? 6000 : 4000);
  }, [dismiss]);

  const notifyError = useCallback((err: unknown, fallback?: string) => notify(friendlyError(err, fallback), 'error'), [notify]);

  return (
    <ToastContext.Provider value={{ notify, notifyError }}>
      {children}
      <ToastViewport items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ items, onDismiss }: { items: ToastItem[]; onDismiss: (id: number) => void }) {
  useEffect(() => {
    if (!items.length) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onDismiss(items[items.length - 1].id); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [items, onDismiss]);

  if (!items.length) return null;
  return (
    <div className="toast-viewport" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`toast toast--${t.kind}`}>
          <span className="toast-text">{t.text}</span>
          <button type="button" className="toast-close" aria-label="Dismiss" onClick={() => onDismiss(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
}
