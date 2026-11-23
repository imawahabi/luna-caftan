import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const MAX_SESSION_KEY_LENGTH = 128;
const MAX_PATH_LENGTH = 400;
const MAX_USER_AGENT_LENGTH = 400;
const TRACK_EVENT_TYPES = new Set(['pageview', 'heartbeat']);
const BOT_SIGNATURES = ['bot', 'spider', 'crawl', 'slurp', 'facebookexternalhit', 'preview'];
const VISIT_INACTIVITY_WINDOW_MS = 30 * 60 * 1000;

const normalizeString = (value: unknown) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

const normalizePath = (value: unknown) => {
  const path = normalizeString(value);
  if (!path) return '/';

  const safePath = path.startsWith('/') ? path : `/${path}`;
  return safePath.slice(0, MAX_PATH_LENGTH);
};

const normalizeSessionKey = (value: unknown) =>
  normalizeString(value).slice(0, MAX_SESSION_KEY_LENGTH);

const isLikelyBot = (userAgent: string) => {
  const normalized = userAgent.toLowerCase();
  return BOT_SIGNATURES.some((signature) => normalized.includes(signature));
};

const isSessionKeyConflictError = (error: unknown) => {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return false;
  }

  return String((error as { code?: unknown }).code ?? '') === 'P2002';
};

const getCountryCode = (request: Request) => {
  const directCode = normalizeString(request.headers.get('x-vercel-ip-country')).toUpperCase();
  if (/^[A-Z]{2}$/.test(directCode)) {
    return directCode;
  }

  const cfCode = normalizeString(request.headers.get('cf-ipcountry')).toUpperCase();
  if (/^[A-Z]{2}$/.test(cfCode)) {
    return cfCode;
  }

  return null;
};

const getCountryName = (countryCode: string | null) => {
  if (!countryCode) return null;

  try {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return displayNames.of(countryCode) || countryCode;
  } catch {
    return countryCode;
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const sessionKey = normalizeSessionKey(body?.sessionKey);
    const path = normalizePath(body?.path);
    const eventTypeRaw = normalizeString(body?.eventType).toLowerCase();
    const eventType = TRACK_EVENT_TYPES.has(eventTypeRaw) ? eventTypeRaw : 'heartbeat';

    if (!sessionKey) {
      return NextResponse.json({ error: 'Missing session key' }, { status: 400 });
    }

    const userAgent = normalizeString(request.headers.get('user-agent')).slice(0, MAX_USER_AGENT_LENGTH);
    if (userAgent && isLikelyBot(userAgent)) {
      return NextResponse.json({ ok: true, ignored: 'bot' });
    }

    if (path.startsWith('/admin') || path.startsWith('/api') || path.startsWith('/_next')) {
      return NextResponse.json({ ok: true, ignored: 'internal-path' });
    }

    const countryCode = getCountryCode(request);
    const countryName = getCountryName(countryCode);
    const now = new Date();
    const visitWindowStart = new Date(now.getTime() - VISIT_INACTIVITY_WINDOW_MS);

    if (eventType === 'pageview') {
      let sessionId: string | null = null;
      let shouldCreateVisit = false;

      try {
        const createdSession = await prisma.visitorSession.create({
          data: {
            sessionKey,
            countryCode,
            countryName,
            userAgent: userAgent || null,
            lastPath: path,
            firstSeenAt: now,
            lastSeenAt: now,
            pageViews: 1,
          },
          select: {
            id: true,
          },
        });

        sessionId = createdSession.id;
        shouldCreateVisit = true;
      } catch (error) {
        if (!isSessionKeyConflictError(error)) {
          throw error;
        }

        const staleSessionUpdated = await prisma.visitorSession.updateMany({
          where: {
            sessionKey,
            lastSeenAt: {
              lt: visitWindowStart,
            },
          },
          data: {
            countryCode,
            countryName,
            userAgent: userAgent || null,
            lastPath: path,
            lastSeenAt: now,
            pageViews: {
              increment: 1,
            },
          },
        });

        if (staleSessionUpdated.count === 1) {
          shouldCreateVisit = true;
        } else {
          await prisma.visitorSession.update({
            where: { sessionKey },
            data: {
              countryCode,
              countryName,
              userAgent: userAgent || undefined,
              lastPath: path,
              lastSeenAt: now,
              pageViews: {
                increment: 1,
              },
            },
          });
        }

        const existingSession = await prisma.visitorSession.findUnique({
          where: { sessionKey },
          select: {
            id: true,
          },
        });

        sessionId = existingSession?.id || null;
      }

      if (shouldCreateVisit && sessionId) {
        await prisma.visitorVisit.create({
          data: {
            sessionId,
            path,
            countryCode,
            countryName,
          },
        });
      }
    } else {
      await prisma.visitorSession.upsert({
        where: { sessionKey },
        create: {
          sessionKey,
          countryCode,
          countryName,
          userAgent: userAgent || null,
          lastPath: path,
          firstSeenAt: now,
          lastSeenAt: now,
          pageViews: 0,
        },
        update: {
          countryCode,
          countryName,
          userAgent: userAgent || undefined,
          lastPath: path,
          lastSeenAt: now,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error tracking visitor analytics:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
