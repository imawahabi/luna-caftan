'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_KEY = 'luna-visitor-session-key';
const HEARTBEAT_INTERVAL_MS = 30_000;
const SESSION_KEY_MAX_LENGTH = 128;

const normalizePath = (value: string | null) => {
  if (!value) return '/';
  if (!value.startsWith('/')) return `/${value}`;
  return value;
};

const isTrackablePath = (path: string) => {
  return !(
    path.startsWith('/admin') ||
    path.startsWith('/api') ||
    path.startsWith('/_next')
  );
};

const buildSessionKey = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
};

const getSessionKey = () => {
  if (typeof window === 'undefined') return '';

  try {
    const existing = window.localStorage.getItem(STORAGE_KEY) || '';
    if (existing && existing.length <= SESSION_KEY_MAX_LENGTH) {
      return existing;
    }

    const next = buildSessionKey().slice(0, SESSION_KEY_MAX_LENGTH);
    window.localStorage.setItem(STORAGE_KEY, next);
    return next;
  } catch {
    return buildSessionKey().slice(0, SESSION_KEY_MAX_LENGTH);
  }
};

const sendTrackEvent = (payload: {
  sessionKey: string;
  path: string;
  eventType: 'pageview' | 'heartbeat';
}) => {
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    keepalive: true,
    cache: 'no-store',
  }).catch(() => {
    // Silent fail to avoid affecting UX if analytics endpoint is down.
  });
};

export default function VisitorTracker() {
  const pathname = usePathname();
  const safePath = useMemo(() => normalizePath(pathname), [pathname]);

  useEffect(() => {
    if (!safePath || !isTrackablePath(safePath)) {
      return;
    }

    const sessionKey = getSessionKey();
    if (!sessionKey) return;

    sendTrackEvent({
      sessionKey,
      path: safePath,
      eventType: 'pageview',
    });

    const heartbeat = () => {
      sendTrackEvent({
        sessionKey,
        path: safePath,
        eventType: 'heartbeat',
      });
    };

    const intervalId = window.setInterval(heartbeat, HEARTBEAT_INTERVAL_MS);

    const visibilityHandler = () => {
      if (document.visibilityState === 'visible') {
        heartbeat();
      }
    };

    document.addEventListener('visibilitychange', visibilityHandler);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', visibilityHandler);
    };
  }, [safePath]);

  return null;
}
