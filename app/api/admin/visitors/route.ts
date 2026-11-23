import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const ONLINE_WINDOW_MS = 2 * 60 * 1000;
const RANGE_TO_MS = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
} as const;

type VisitorRange = keyof typeof RANGE_TO_MS;

const resolveRange = (value: string | null): VisitorRange => {
  if (!value) return '24h';
  if (value === '7d' || value === '30d' || value === '24h') return value;
  return '24h';
};

const shortSession = (value: string) => {
  if (!value) return '';
  if (value.length <= 8) return value;
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
};

const toIsoDay = (value: Date) =>
  value.toISOString().slice(0, 10);

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = resolveRange(searchParams.get('range'));

    const now = new Date();
    const onlineCutoff = new Date(now.getTime() - ONLINE_WINDOW_MS);
    const periodStart = new Date(now.getTime() - RANGE_TO_MS[range]);

    const onlineVisitorsRaw = await prisma.visitorSession.findMany({
      where: {
        lastSeenAt: {
          gte: onlineCutoff,
        },
      },
      orderBy: {
        lastSeenAt: 'desc',
      },
      take: 30,
      select: {
        sessionKey: true,
        countryCode: true,
        countryName: true,
        lastPath: true,
        firstSeenAt: true,
        lastSeenAt: true,
        pageViews: true,
      },
    });

    const totalVisits = await prisma.visitorVisit.count({
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
    });

    const uniqueVisitorsGrouped = await prisma.visitorVisit.groupBy({
      by: ['sessionId'],
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
    });

    const countriesGrouped = await prisma.visitorVisit.groupBy({
      by: ['countryCode', 'countryName'],
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 12,
    });

    const topPagesGrouped = await prisma.visitorVisit.groupBy({
      by: ['path'],
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 8,
    });

    const timelineVisits = await prisma.visitorVisit.findMany({
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 5000,
    });

    const timelineMap = new Map<string, number>();
    for (const item of timelineVisits) {
      const day = toIsoDay(item.createdAt);
      timelineMap.set(day, (timelineMap.get(day) || 0) + 1);
    }

    const onlineVisitors = onlineVisitorsRaw.map((visitor) => ({
      session: shortSession(visitor.sessionKey),
      countryCode: visitor.countryCode,
      countryName: visitor.countryName,
      path: visitor.lastPath || '/',
      pageViews: visitor.pageViews,
      firstSeenAt: visitor.firstSeenAt,
      lastSeenAt: visitor.lastSeenAt,
      activeForSeconds: Math.max(
        0,
        Math.floor((now.getTime() - new Date(visitor.firstSeenAt).getTime()) / 1000)
      ),
    }));

    const visitsByCountry = countriesGrouped.map((country) => {
      const count = country._count.id || 0;
      const share = totalVisits > 0 ? Number(((count / totalVisits) * 100).toFixed(1)) : 0;
      return {
        countryCode: country.countryCode,
        countryName: country.countryName,
        count,
        share,
      };
    });

    const topPages = topPagesGrouped.map((page) => ({
      path: page.path,
      count: page._count.id || 0,
    }));

    const visitsTimeline = Array.from(timelineMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    return NextResponse.json({
      range,
      generatedAt: now.toISOString(),
      periodStart: periodStart.toISOString(),
      onlineNow: onlineVisitors.length,
      onlineVisitors,
      stats: {
        totalVisits,
        uniqueVisitors: uniqueVisitorsGrouped.length,
        countriesTracked: visitsByCountry.length,
      },
      visitsByCountry,
      topPages,
      visitsTimeline,
    });
  } catch (error) {
    console.error('Error fetching visitor analytics:', error);
    return NextResponse.json(
      { error: 'فشل تحميل إحصائيات الزوار' },
      { status: 500 }
    );
  }
}
