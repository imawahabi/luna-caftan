'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock3,
  Globe2,
  Eye,
  EyeOff,
  Heart,
  Mail,
  MessageSquare,
  Package,
  Plus,
  Settings,
  Star,
  Users,
  UserCircle2,
  CircleDot,
  Phone,
  Pencil,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: string;
  priceEn: string;
  images: string[];
  featured: boolean;
  active: boolean;
  createdAt?: string;
  views?: number;
  likes?: number;
}

type ContactMessageStatus = 'PENDING' | 'SENT' | 'FAILED';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phoneCountryCode?: string | null;
  phoneNumber?: string | null;
  message: string;
  status: ContactMessageStatus;
  read: boolean;
  createdAt: string;
}

interface MessageStats {
  total: number;
  unread: number;
  sent: number;
  failed: number;
}

interface ProductStats {
  total: number;
  active: number;
  inactive: number;
  featured: number;
}

type VisitorRange = '24h' | '7d' | '30d';

interface VisitorOnlineItem {
  session: string;
  countryCode?: string | null;
  countryName?: string | null;
  path: string;
  pageViews: number;
  firstSeenAt: string;
  lastSeenAt: string;
  activeForSeconds: number;
}

interface VisitorCountryStat {
  countryCode?: string | null;
  countryName?: string | null;
  count: number;
  share: number;
}

interface VisitorPageStat {
  path: string;
  count: number;
}

interface VisitorTimelinePoint {
  date: string;
  count: number;
}

interface VisitorAnalytics {
  range: VisitorRange;
  generatedAt: string;
  periodStart: string;
  onlineNow: number;
  onlineVisitors: VisitorOnlineItem[];
  stats: {
    totalVisits: number;
    uniqueVisitors: number;
    countriesTracked: number;
  };
  visitsByCountry: VisitorCountryStat[];
  topPages: VisitorPageStat[];
  visitsTimeline: VisitorTimelinePoint[];
}

const DASHBOARD_MESSAGE_PREVIEW_MAX_LINES = 3;
const DASHBOARD_MESSAGE_PREVIEW_MAX_CHARS = 180;
const DASHBOARD_PANEL_HEIGHT = 560;
const DASHBOARD_UNREAD_MESSAGES_SCROLL_MAX_HEIGHT = 360;

const EMPTY_VISITOR_ANALYTICS: VisitorAnalytics = {
  range: '24h',
  generatedAt: '',
  periodStart: '',
  onlineNow: 0,
  onlineVisitors: [],
  stats: {
    totalVisits: 0,
    uniqueVisitors: 0,
    countriesTracked: 0,
  },
  visitsByCountry: [],
  topPages: [],
  visitsTimeline: [],
};

const VISITOR_RANGE_LABELS: Record<VisitorRange, string> = {
  '24h': '24 ساعة',
  '7d': '7 أيام',
  '30d': '30 يوم',
};

const MESSAGE_STATUS_META: Record<ContactMessageStatus, { label: string; color: string; border: string; background: string }> = {
  PENDING: {
    label: 'قيد المعالجة',
    color: '#f59e0b',
    border: '1px solid rgba(245, 158, 11, 0.35)',
    background: 'rgba(245, 158, 11, 0.12)',
  },
  SENT: {
    label: 'تم الإرسال',
    color: '#22c55e',
    border: '1px solid rgba(34, 197, 94, 0.35)',
    background: 'rgba(34, 197, 94, 0.12)',
  },
  FAILED: {
    label: 'فشل الإرسال',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    background: 'rgba(239, 68, 68, 0.12)',
  },
};

const canExpandDashboardMessage = (message: string): boolean => {
  if (!message) return false;
  return (
    message.length > DASHBOARD_MESSAGE_PREVIEW_MAX_CHARS ||
    message.split(/\r?\n/).length > DASHBOARD_MESSAGE_PREVIEW_MAX_LINES
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { i18n } = useTranslation();

  const [products, setProducts] = useState<Product[]>([]);
  const [latestMessages, setLatestMessages] = useState<ContactMessage[]>([]);
  const [messageStats, setMessageStats] = useState<MessageStats>({ total: 0, unread: 0, sent: 0, failed: 0 });
  const [visitorRange, setVisitorRange] = useState<VisitorRange>('24h');
  const [visitorAnalytics, setVisitorAnalytics] = useState<VisitorAnalytics>(EMPTY_VISITOR_ANALYTICS);
  const [expandedDashboardMessageIds, setExpandedDashboardMessageIds] = useState<Record<string, boolean>>({});
  const [visitorsLoading, setVisitorsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isRTL = i18n.language === 'ar';

  const fetchVisitorAnalytics = useCallback(async (range: VisitorRange) => {
    try {
      setVisitorsLoading(true);
      const visitorsRes = await fetch(`/api/admin/visitors?range=${range}`);

      if (visitorsRes.ok) {
        const visitorsPayload = await visitorsRes.json();
        setVisitorAnalytics({
          ...EMPTY_VISITOR_ANALYTICS,
          ...visitorsPayload,
        });
      } else {
        setVisitorAnalytics(EMPTY_VISITOR_ANALYTICS);
      }
    } catch (visitorError) {
      console.error('Visitor analytics fetch error:', visitorError);
      setVisitorAnalytics(EMPTY_VISITOR_ANALYTICS);
    } finally {
      setVisitorsLoading(false);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [productsRes, messagesRes] = await Promise.all([
        fetch('/api/products?admin=true'),
        fetch('/api/contact?take=30&unread=true'),
      ]);

      if (!productsRes.ok) {
        throw new Error('تعذر تحميل بيانات القفاطين');
      }

      if (!messagesRes.ok) {
        throw new Error('تعذر تحميل بيانات الرسائل');
      }

      const productsPayload = await productsRes.json();
      const messagesPayload = await messagesRes.json();

      const parsedProducts = Array.isArray(productsPayload) ? productsPayload : [];
      const parsedMessages = Array.isArray(messagesPayload?.messages) ? messagesPayload.messages : [];

      setProducts(parsedProducts);
      setLatestMessages(parsedMessages);
      setExpandedDashboardMessageIds({});

      setMessageStats(
        messagesPayload?.stats || {
          total: parsedMessages.length,
          unread: parsedMessages.filter((item: ContactMessage) => !item.read).length,
          sent: parsedMessages.filter((item: ContactMessage) => item.status === 'SENT').length,
          failed: parsedMessages.filter((item: ContactMessage) => item.status === 'FAILED').length,
        }
      );

    } catch (fetchError) {
      console.error('Dashboard fetch error:', fetchError);
      setError(fetchError instanceof Error ? fetchError.message : 'حدث خطأ أثناء تحميل لوحة التحكم');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchVisitorAnalytics(visitorRange);
  }, [fetchVisitorAnalytics, visitorRange]);

  const productStats = useMemo<ProductStats>(() => {
    const total = products.length;
    const active = products.filter((item) => item.active).length;
    const featured = products.filter((item) => item.featured).length;

    return {
      total,
      active,
      inactive: total - active,
      featured,
    };
  }, [products]);

  const latestProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 10);
  }, [products]);

  const formatDate = (value?: string | null) => {
    if (!value) return 'غير محدد';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'غير محدد';

    return date.toLocaleString('ar-UK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (product: Product) => {
    const preferred = isRTL ? product.price : product.priceEn;
    const fallback = isRTL ? product.priceEn : product.price;

    return (preferred || fallback || '').trim() || '—';
  };

  const visitorRangeLabel = useMemo(() => {
    if (visitorRange === '7d') return 'آخر 7 أيام';
    if (visitorRange === '30d') return 'آخر 30 يوم';
    return 'آخر 24 ساعة';
  }, [visitorRange]);

  const formatRelativeTime = (value?: string | null) => {
    if (!value) return 'غير متاح';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'غير متاح';

    const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
    if (seconds < 60) return `قبل ${seconds} ثانية`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `قبل ${minutes} دقيقة`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `قبل ${hours} ساعة`;

    const days = Math.floor(hours / 24);
    return `قبل ${days} يوم`;
  };

  if (loading) {
    return <LoadingSpinner message="جاري تحميل الرئيسية..." fullScreen />;
  }

  return (
    <div
      style={{
        padding: '1.25rem',
        direction: 'rtl',
      }}
    >
      {/* Top Header */}
      <section
        style={{
          border: '1px solid rgba(232, 199, 111, 0.2)',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(26, 20, 16, 0.88), rgba(17, 13, 10, 0.88))',
          backdropFilter: 'blur(14px)',
          padding: '1.2rem',
          marginBottom: '1.2rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1rem',
          }}
        >
          <div>
            <h1
              style={{
                color: 'var(--color-gold)',
                margin: 0,
                fontSize: '2rem',
                lineHeight: 1.15,
              }}
            >
              الرئيسية
            </h1>
            <p
              style={{
                margin: '0.45rem 0 0',
                color: 'rgba(232, 199, 111, 0.78)',
                fontSize: '0.95rem',
              }}
            >
              نظرة شاملة وسريعة على المتجر والرسائل
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              border: '1px solid rgba(232, 199, 111, 0.28)',
              borderRadius: '14px',
              background: 'rgba(232, 199, 111, 0.08)',
              padding: '0.6rem 0.8rem',
              minWidth: '250px',
            }}
          >
            <UserCircle2 size={22} color="#e8c76f" />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  color: 'var(--color-cream)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {session?.user?.name || 'Admin'}
              </div>
              <div
                style={{
                  color: 'rgba(232, 199, 111, 0.72)',
                  fontSize: '0.76rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {session?.user?.email || 'Admin'}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '0.7rem',
          }}
        >
          <QuickAction
            label="إضافة قفطان"
            icon={Plus}
            onClick={() => router.push('/admin/dashboard/products/new')}
            color="#e8c76f"
          />
          <QuickAction
            label="رسائل التواصل"
            icon={MessageSquare}
            onClick={() => router.push('/admin/dashboard/messages')}
            color="#60a5fa"
          />
          <QuickAction
            label="الإعدادات"
            icon={Settings}
            onClick={() => router.push('/admin/dashboard/settings')}
            color="#22c55e"
          />
          <QuickAction
            label="تحديث البيانات"
            icon={RefreshCw}
            onClick={() => fetchDashboardData()}
            color="#f59e0b"
          />
        </div>
      </section>

      {/* Error Banner */}
      {error && (
        <div
          style={{
            border: '1px solid rgba(239, 68, 68, 0.4)',
            background: 'rgba(239, 68, 68, 0.12)',
            color: '#fca5a5',
            borderRadius: '14px',
            padding: '0.8rem 1rem',
            marginBottom: '1.2rem',
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      {/* Stats */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '0.8rem',
          marginBottom: '1.2rem',
        }}
      >
        <StatsGroup title="القفاطين" subtitle="ملخص المخزون والحالة" icon={Package} color="#e8c76f">
          <StatCard label="إجمالي القفاطين" value={productStats.total} icon={Package} color="#e8c76f" />
          <StatCard label="القفاطين النشطة" value={productStats.active} icon={CheckCircle2} color="#22c55e" />
          <StatCard label="القفاطين المخفية" value={productStats.inactive} icon={EyeOff} color="#ef4444" />
          <StatCard label="المميزة" value={productStats.featured} icon={Star} color="#60a5fa" />
        </StatsGroup>

        <StatsGroup title="رسائل التواصل" subtitle="أداء صندوق الوارد" icon={MessageSquare} color="#f59e0b">
          <StatCard label="إجمالي الرسائل" value={messageStats.total} icon={Mail} color="#e8c76f" />
          <StatCard label="رسائل غير مقروءة" value={messageStats.unread} icon={Mail} color="#f59e0b" />
          <StatCard label="فشل إرسال الرسائل" value={messageStats.failed} icon={AlertTriangle} color="#ef4444" />
        </StatsGroup>

        <StatsGroup title="الزوار" subtitle={`آخر البيانات (${visitorRangeLabel})`} icon={Users} color="#22c55e">
          <StatCard label="المتواجدون الآن" value={visitorAnalytics.onlineNow} icon={Users} color="#22c55e" />
          <StatCard label={`زيارات (${visitorRangeLabel})`} value={visitorAnalytics.stats.totalVisits} icon={Activity} color="#a78bfa" />
          <StatCard label={`زوار فريدون (${visitorRangeLabel})`} value={visitorAnalytics.stats.uniqueVisitors} icon={Globe2} color="#38bdf8" />
        </StatsGroup>
      </section>

      {/* Main two-column panels */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '0.9rem',
          marginBottom: '1.2rem',
        }}
      >
        <Panel
          title="أحدث الرسائل غير المقروءة"
          subtitle="آخر الرسائل غير المقروءة من نموذج التواصل"
          height={DASHBOARD_PANEL_HEIGHT}
          scrollBody={false}
        >
          {latestMessages.length === 0 ? (
            <EmptyState text="لا توجد رسائل غير مقروءة" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', minHeight: 0 }}>
              <div
                style={{
                  borderRadius: '10px',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: '#fbbf24',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '0.45rem 0.6rem',
                }}
              >
                لديك الآن {messageStats.unread} رسالة غير مقروءة
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: '0.6rem',
                  maxHeight: `${DASHBOARD_UNREAD_MESSAGES_SCROLL_MAX_HEIGHT}px`,
                  overflowY: 'auto',
                  paddingInlineEnd: '0.2rem',
                }}
              >
                {latestMessages.map((message) => {
                  const statusMeta = MESSAGE_STATUS_META[message.status];
                  const canShowExpand = canExpandDashboardMessage(message.message);
                  const isMessageExpanded = Boolean(expandedDashboardMessageIds[message.id]);
                  return (
                    <div
                      key={message.id}
                      style={{
                        borderRadius: '12px',
                        border: message.read
                          ? '1px solid rgba(232, 199, 111, 0.18)'
                          : '1px solid rgba(245, 158, 11, 0.35)',
                        background: 'rgba(26, 20, 16, 0.72)',
                        padding: '0.75rem 0.8rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.5rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                            <strong style={{ color: 'var(--color-cream)', fontSize: '0.94rem' }}>{message.name}</strong>
                            {!message.read && (
                              <span
                                style={{
                                  borderRadius: '999px',
                                  padding: '0.14rem 0.45rem',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  background: 'rgba(245, 158, 11, 0.16)',
                                  border: '1px solid rgba(245, 158, 11, 0.4)',
                                  color: '#fbbf24',
                                }}
                              >
                                جديد
                              </span>
                            )}
                          </div>
                          <div style={{ color: 'rgba(232, 199, 111, 0.7)', fontSize: '0.74rem', marginTop: '0.2rem' }}>
                            {formatDate(message.createdAt)}
                          </div>
                        </div>

                        <span
                          style={{
                            borderRadius: '999px',
                            padding: '0.18rem 0.58rem',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: statusMeta.color,
                            border: statusMeta.border,
                            background: statusMeta.background,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {statusMeta.label}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gap: '0.3rem', marginBottom: '0.5rem' }}>
                        <a
                          href={`mailto:${message.email}`}
                          style={{ color: '#93c5fd', fontSize: '0.82rem', textDecoration: 'none', direction: 'ltr', width: 'fit-content' }}
                        >
                          {message.email}
                        </a>
                        {message.phoneNumber && (
                          <a
                            href={`tel:${`${message.phoneCountryCode || ''}${message.phoneNumber}`.replace(/\s+/g, '')}`}
                            style={{ color: '#a7f3d0', fontSize: '0.82rem', textDecoration: 'none', direction: 'ltr', width: 'fit-content', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <Phone size={13} />
                            <span>{message.phoneCountryCode || ''} {message.phoneNumber}</span>
                          </a>
                        )}
                      </div>

                      <div
                        style={{
                          position: 'relative',
                          border: '1px solid rgba(232, 199, 111, 0.14)',
                          borderRadius: '10px',
                          background: 'rgba(0, 0, 0, 0.14)',
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            padding: '0.55rem 0.62rem',
                            color: 'rgba(245, 230, 200, 0.9)',
                            fontSize: '0.82rem',
                            lineHeight: 1.65,
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'anywhere',
                            wordBreak: 'break-word',
                            ...(canShowExpand && !isMessageExpanded
                              ? {
                                  maxHeight: `${DASHBOARD_MESSAGE_PREVIEW_MAX_LINES * 1.65}em`,
                                  overflow: 'hidden',
                                }
                              : {}),
                          }}
                        >
                          {message.message}
                        </p>
                        {canShowExpand && !isMessageExpanded && (
                          <div
                            style={{
                              position: 'absolute',
                              left: 1,
                              right: 1,
                              bottom: 1,
                              height: '1.8rem',
                              borderBottomLeftRadius: '10px',
                              borderBottomRightRadius: '10px',
                              background:
                                'linear-gradient(180deg, rgba(11, 9, 8, 0) 0%, rgba(11, 9, 8, 0.95) 100%)',
                              pointerEvents: 'none',
                            }}
                          />
                        )}
                      </div>
                      {canShowExpand && (
                        <div style={{ marginTop: '0.38rem' }}>
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedDashboardMessageIds((prev) => ({
                                ...prev,
                                [message.id]: !prev[message.id],
                              }))
                            }
                            style={{
                              border: '1px solid rgba(232, 199, 111, 0.28)',
                              background: 'rgba(232, 199, 111, 0.08)',
                              color: 'var(--color-gold)',
                              borderRadius: '999px',
                              padding: '0.18rem 0.58rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {isMessageExpanded ? 'إظهار أقل' : 'إظهار المزيد'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 'auto' }}>
                <PanelFooterButton
                  label="فتح صفحة الرسائل"
                  onClick={() => router.push('/admin/dashboard/messages')}
                  isRTL={isRTL}
                />
              </div>
            </div>
          )}
        </Panel>

        <Panel title="أحدث 10 قفاطين" subtitle="آخر 10 قفاطين مضافة مع تاريخ الإضافة" height={DASHBOARD_PANEL_HEIGHT}>
          {latestProducts.length === 0 ? (
            <EmptyState text="لا توجد قفاطين بعد" />
          ) : (
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              {latestProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    borderRadius: '12px',
                    border: '1px solid rgba(232, 199, 111, 0.18)',
                    background: 'rgba(26, 20, 16, 0.72)',
                    padding: '0.65rem 0.75rem',
                    display: 'grid',
                    gridTemplateColumns: '62px minmax(0, 1fr) auto',
                    gap: '0.65rem',
                    alignItems: 'center',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'}
                    alt={product.name}
                    style={{
                      width: '62px',
                      height: '62px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      border: '1px solid rgba(232, 199, 111, 0.22)',
                    }}
                  />

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        color: 'var(--color-cream)',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {product.name}
                    </div>
                    <div
                      style={{
                        color: 'rgba(232, 199, 111, 0.8)',
                        fontSize: '0.76rem',
                        marginTop: '0.15rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        direction: 'ltr',
                      }}
                    >
                      {product.nameEn || '—'}
                    </div>
                    <div style={{ color: 'rgba(232, 199, 111, 0.74)', fontSize: '0.78rem', marginTop: '0.18rem' }}>
                      {formatPrice(product)}
                    </div>
                    <div
                      style={{
                        color: 'rgba(232, 199, 111, 0.65)',
                        fontSize: '0.72rem',
                        marginTop: '0.22rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <Calendar size={12} />
                      <span>{formatDate(product.createdAt)}</span>
                    </div>
                    <div
                      style={{
                        color: 'rgba(232, 199, 111, 0.7)',
                        fontSize: '0.72rem',
                        marginTop: '0.22rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Eye size={12} />
                        <span>{product.views || 0}</span>
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Heart size={12} />
                        <span>{product.likes || 0}</span>
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                      {!product.active && <BadgeMini text="مخفي" color="#ef4444" />}
                      {product.featured && <BadgeMini text="مميز" color="#60a5fa" />}
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/admin/dashboard/products/${product.id}`)}
                    style={{
                      borderRadius: '10px',
                      border: '1px solid rgba(147, 197, 253, 0.35)',
                      background: 'rgba(59, 130, 246, 0.12)',
                      color: '#93c5fd',
                      padding: '0.45rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="تعديل القفطان"
                    aria-label="تعديل القفطان"
                  >
                    <Pencil size={15} />
                  </button>
                </div>
              ))}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
                <PanelFooterButton
                  label="جميع القفاطين"
                  onClick={() => router.push('/admin/dashboard/products')}
                  isRTL={isRTL}
                />
                <PanelFooterButton
                  label="إضافة جديد"
                  onClick={() => router.push('/admin/dashboard/products/new')}
                  isRTL={isRTL}
                />
              </div>
            </div>
          )}
        </Panel>
      </section>

      {/* Visitor analytics */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '0.9rem',
          marginBottom: '1.2rem',
        }}
      >
        <Panel title="الزوار الحاليون (Online now)" subtitle="يتم التحديث تلقائياً عبر heartbeat كل 30 ثانية" height={DASHBOARD_PANEL_HEIGHT}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.6rem',
              flexWrap: 'wrap',
              marginBottom: '0.75rem',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#86efac', fontSize: '0.84rem', fontWeight: 700 }}>
              <Users size={16} />
              <span>{visitorAnalytics.onlineNow} متواجد الآن</span>
            </div>

            <div style={{ display: 'inline-flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {(['24h', '7d', '30d'] as VisitorRange[]).map((rangeOption) => (
                <button
                  key={rangeOption}
                  onClick={() => setVisitorRange(rangeOption)}
                  style={{
                    borderRadius: '999px',
                    border: visitorRange === rangeOption
                      ? '1px solid rgba(232, 199, 111, 0.45)'
                      : '1px solid rgba(232, 199, 111, 0.2)',
                    background: visitorRange === rangeOption
                      ? 'rgba(232, 199, 111, 0.16)'
                      : 'rgba(20, 15, 12, 0.7)',
                    color: visitorRange === rangeOption ? 'var(--color-gold)' : 'rgba(232, 199, 111, 0.76)',
                    padding: '0.3rem 0.58rem',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {VISITOR_RANGE_LABELS[rangeOption]}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              borderRadius: '10px',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              background: 'rgba(34, 197, 94, 0.08)',
              color: '#86efac',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '0.45rem 0.6rem',
              marginBottom: '0.65rem',
            }}
          >
            {`إجمالي الزيارات (${visitorRangeLabel}): ${visitorAnalytics.stats.totalVisits} • زوار فريدون: ${visitorAnalytics.stats.uniqueVisitors}`}
          </div>

          {visitorsLoading && (
            <div
              style={{
                marginBottom: '0.6rem',
                color: 'rgba(232, 199, 111, 0.8)',
                fontSize: '0.76rem',
              }}
            >
              جاري تحديث بيانات الزوار...
            </div>
          )}

          {visitorAnalytics.onlineVisitors.length === 0 ? (
            <EmptyState text="لا يوجد زوار متصلون الآن" />
          ) : (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {visitorAnalytics.onlineVisitors.map((visitor) => (
                <div
                  key={`${visitor.session}-${visitor.lastSeenAt}`}
                  style={{
                    borderRadius: '11px',
                    border: '1px solid rgba(232, 199, 111, 0.2)',
                    background: 'rgba(26, 20, 16, 0.72)',
                    padding: '0.6rem 0.7rem',
                    display: 'grid',
                    gap: '0.32rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--color-cream)', fontWeight: 700, fontSize: '0.84rem', direction: 'ltr' }}>
                      {visitor.session}
                    </span>
                    <span style={{ color: '#a7f3d0', fontSize: '0.74rem', fontWeight: 700 }}>
                      {visitor.countryName || visitor.countryCode || 'Unknown'}
                    </span>
                  </div>
                  <div style={{ color: 'rgba(232, 199, 111, 0.82)', fontSize: '0.75rem', direction: 'ltr', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {visitor.path}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.7rem', color: 'rgba(232, 199, 111, 0.68)', fontSize: '0.72rem' }}>
                    <span>آخر نشاط: {formatRelativeTime(visitor.lastSeenAt)}</span>
                    <span>المشاهدات: {visitor.pageViews}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="إحصائيات الدول والصفحات" subtitle={`تفاصيل الزيارات حسب ${visitorRangeLabel}`} height={DASHBOARD_PANEL_HEIGHT}>
          {visitorAnalytics.visitsByCountry.length === 0 ? (
            <EmptyState text="لا توجد بيانات زيارات كافية بعد" />
          ) : (
            <div style={{ display: 'grid', gap: '0.65rem' }}>
              <div style={{ color: 'rgba(232, 199, 111, 0.8)', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Globe2 size={14} />
                <span>{`الدول المسجلة: ${visitorAnalytics.stats.countriesTracked}`}</span>
              </div>

              {visitorAnalytics.visitsByCountry.slice(0, 8).map((country) => (
                <div key={`${country.countryCode || 'xx'}-${country.countryName || 'unknown'}`} style={{ display: 'grid', gap: '0.3rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.45rem' }}>
                    <span style={{ color: 'var(--color-cream)', fontSize: '0.8rem', fontWeight: 600 }}>
                      {country.countryName || country.countryCode || 'Unknown'}
                    </span>
                    <span style={{ color: 'rgba(232, 199, 111, 0.78)', fontSize: '0.76rem', fontWeight: 700 }}>
                      {country.count} ({country.share}%)
                    </span>
                  </div>
                  <div style={{ height: '7px', borderRadius: '999px', background: 'rgba(232, 199, 111, 0.12)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(Math.max(country.share, 2), 100)}%`,
                        height: '100%',
                        borderRadius: '999px',
                        background: 'linear-gradient(90deg, rgba(232, 199, 111, 0.95), rgba(212, 175, 55, 0.8))',
                      }}
                    />
                  </div>
                </div>
              ))}

              <div
                style={{
                  marginTop: '0.2rem',
                  paddingTop: '0.65rem',
                  borderTop: '1px dashed rgba(232, 199, 111, 0.2)',
                }}
              >
                <div style={{ color: 'rgba(232, 199, 111, 0.82)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.45rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <BarChart3 size={14} />
                  <span>أكثر الصفحات زيارة</span>
                </div>
                {visitorAnalytics.topPages.length === 0 ? (
                  <div style={{ color: 'rgba(232, 199, 111, 0.66)', fontSize: '0.75rem' }}>
                    لا توجد بيانات صفحات حتى الآن
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '0.35rem' }}>
                    {visitorAnalytics.topPages.slice(0, 6).map((page) => (
                      <div key={page.path} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem' }}>
                        <span style={{ color: 'rgba(245, 230, 200, 0.92)', fontSize: '0.76rem', direction: 'ltr', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                          {page.path}
                        </span>
                        <span style={{ color: '#93c5fd', fontSize: '0.75rem', fontWeight: 700 }}>
                          {page.count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Panel>
      </section>

      {/* Quick insights */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.8rem',
        }}
      >
        <InsightCard
          icon={Clock3}
          title="آخر تحديث"
          value={formatDate(new Date().toISOString())}
          color="#e8c76f"
        />
        <InsightCard
          icon={CircleDot}
          title="قيد المعالجة"
          value={`${Math.max(messageStats.total - messageStats.sent - messageStats.failed, 0)} رسالة`}
          color="#f59e0b"
        />
        <InsightCard
          icon={ExternalLink}
          title="إدارة سريعة"
          value="انتقل مباشرة لأي قسم من الأزرار بالأعلى"
          color="#22c55e"
        />
      </section>
    </div>
  );
}

function QuickAction({
  label,
  icon: Icon,
  onClick,
  color,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: '12px',
        border: `1px solid ${color}55`,
        background: `${color}18`,
        color,
        padding: '0.65rem 0.75rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.45rem',
        fontSize: '0.86rem',
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
}) {
  return (
    <div
      style={{
        borderRadius: '14px',
        border: `1px solid ${color}55`,
        background: `linear-gradient(135deg, ${color}1a, rgba(20, 15, 12, 0.78))`,
        padding: '0.72rem 0.8rem',
        minHeight: '94px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ color: 'rgba(232, 199, 111, 0.86)', fontSize: '0.75rem', fontWeight: 600 }}>{label}</span>
        <Icon size={16} color={color} />
      </div>
      <strong style={{ color: 'var(--color-cream)', fontSize: '1.45rem', lineHeight: 1 }}>{value}</strong>
    </div>
  );
}

function StatsGroup({
  title,
  subtitle,
  icon: Icon,
  color,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderRadius: '15px',
        border: '1px solid rgba(232, 199, 111, 0.2)',
        background: 'linear-gradient(135deg, rgba(26, 20, 16, 0.82), rgba(17, 13, 10, 0.8))',
        backdropFilter: 'blur(12px)',
        padding: '0.85rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.6rem', marginBottom: '0.7rem' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--color-cream)', fontSize: '0.96rem' }}>{title}</h3>
          <p style={{ margin: '0.28rem 0 0', color: 'rgba(232, 199, 111, 0.7)', fontSize: '0.74rem' }}>{subtitle}</p>
        </div>
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '9px',
            border: `1px solid ${color}55`,
            background: `${color}1a`,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={15} color={color} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
        {children}
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
  height = DASHBOARD_PANEL_HEIGHT,
  scrollBody = true,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  height?: number;
  scrollBody?: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: '16px',
        border: '1px solid rgba(232, 199, 111, 0.2)',
        background: 'rgba(20, 15, 12, 0.72)',
        backdropFilter: 'blur(12px)',
        padding: '0.95rem',
        height: `${height}px`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ marginBottom: '0.8rem', flexShrink: 0 }}>
        <h3 style={{ color: 'var(--color-cream)', margin: 0, fontSize: '1.05rem' }}>{title}</h3>
        <p style={{ color: 'rgba(232, 199, 111, 0.72)', margin: '0.35rem 0 0', fontSize: '0.78rem' }}>{subtitle}</p>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: scrollBody ? 'auto' : 'visible',
          paddingInlineEnd: scrollBody ? '0.2rem' : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        borderRadius: '12px',
        border: '1px dashed rgba(232, 199, 111, 0.28)',
        padding: '1rem',
        color: 'rgba(232, 199, 111, 0.78)',
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  );
}

function PanelFooterButton({
  label,
  onClick,
  isRTL,
}: {
  label: string;
  onClick: () => void;
  isRTL: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: '10px',
        border: '1px solid rgba(232, 199, 111, 0.3)',
        background: 'rgba(232, 199, 111, 0.1)',
        color: 'var(--color-gold)',
        padding: '0.55rem 0.7rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        fontWeight: 700,
        cursor: 'pointer',
        fontSize: '0.8rem',
      }}
    >
      <span>{label}</span>
      {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
    </button>
  );
}

function BadgeMini({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        borderRadius: '999px',
        padding: '0.13rem 0.42rem',
        fontSize: '0.67rem',
        fontWeight: 700,
        color,
        border: `1px solid ${color}66`,
        background: `${color}1f`,
      }}
    >
      {text}
    </span>
  );
}

function InsightCard({
  icon: Icon,
  title,
  value,
  color,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        borderRadius: '14px',
        border: `1px solid ${color}55`,
        background: `linear-gradient(135deg, ${color}14, rgba(20, 15, 12, 0.7))`,
        padding: '0.8rem 0.9rem',
        minHeight: '102px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem' }}>
        <Icon size={15} color={color} />
        <strong style={{ color: 'rgba(232, 199, 111, 0.9)', fontSize: '0.78rem' }}>{title}</strong>
      </div>
      <p style={{ margin: 0, color: 'var(--color-cream)', fontSize: '0.84rem', lineHeight: 1.6 }}>{value}</p>
    </div>
  );
}
