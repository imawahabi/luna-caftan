'use client';

import { useCallback, useEffect, useMemo, useState, type ComponentType } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Mail,
  MailOpen,
  Reply,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

type ContactMessageStatus = 'PENDING' | 'SENT' | 'FAILED';
type ContactInquiryType = 'GENERAL' | 'CAFTAN';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phoneCountryCode?: string | null;
  phoneNumber?: string | null;
  message: string;
  inquiryType: ContactInquiryType;
  inquiryProductId?: string | null;
  inquiryProductName?: string | null;
  inquiryProductNameEn?: string | null;
  adminEmail: string;
  status: ContactMessageStatus;
  emailError?: string | null;
  emailSentAt?: string | null;
  read: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MessagesResponse {
  messages: ContactMessage[];
  stats: MessageStats;
}

type FilterType = 'all' | 'unread' | 'failed';
type MessageStats = {
  total: number;
  unread: number;
  sent: number;
  failed: number;
};

const statusLabels: Record<ContactMessageStatus, { text: string; color: string; background: string; border: string }> = {
  PENDING: {
    text: 'قيد المعالجة',
    color: '#f59e0b',
    background: 'rgba(245, 158, 11, 0.14)',
    border: '1px solid rgba(245, 158, 11, 0.38)',
  },
  SENT: {
    text: 'تم الإرسال',  
    color: '#22c55e',
    background: 'rgba(34, 197, 94, 0.14)',
    border: '1px solid rgba(34, 197, 94, 0.38)',
  },
  FAILED: {
    text: 'فشل الإرسال',
    color: '#ef4444',
    background: 'rgba(239, 68, 68, 0.14)',
    border: '1px solid rgba(239, 68, 68, 0.38)',
  },
};

const CACHE_KEY = 'luna-contact-messages-cache-v1';
const CACHE_MAX_AGE_MS = 5 * 60 * 1000;
const MESSAGE_PREVIEW_MAX_LINES = 4;
const MESSAGE_PREVIEW_MAX_CHARS = 220;
const EMPTY_STATS: MessageStats = {
  total: 0,
  unread: 0,
  sent: 0,
  failed: 0,
};

const canExpandMessage = (message: string): boolean => {
  if (!message) return false;
  return (
    message.length > MESSAGE_PREVIEW_MAX_CHARS ||
    message.split(/\r?\n/).length > MESSAGE_PREVIEW_MAX_LINES
  );
};

const adjustStatsAfterDelete = (stats: MessageStats, message: ContactMessage): MessageStats => ({
  total: Math.max(stats.total - 1, 0),
  unread: message.read ? stats.unread : Math.max(stats.unread - 1, 0),
  sent: message.status === 'SENT' ? Math.max(stats.sent - 1, 0) : stats.sent,
  failed: message.status === 'FAILED' ? Math.max(stats.failed - 1, 0) : stats.failed,
});

export default function ContactMessagesPage() {
  const [allMessages, setAllMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<MessagesResponse['stats']>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingMessageId, setUpdatingMessageId] = useState<string | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [hoveredActionKey, setHoveredActionKey] = useState<string | null>(null);
  const [expandedMessageIds, setExpandedMessageIds] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<FilterType>('all');
  const [viewportWidth, setViewportWidth] = useState(1280);

  const fetchMessages = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      const searchParams = new URLSearchParams();
      searchParams.set('take', '150');

      const res = await fetch(`/api/contact?${searchParams.toString()}`);
      if (!res.ok) {
        throw new Error('فشل تحميل الرسائل');
      }

      const data: MessagesResponse = await res.json();
      setAllMessages(data.messages);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      alert('فشل تحميل الرسائل');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      fetchMessages(true);
      return;
    }

    let loadedFromCache = false;

    try {
      const rawCache = window.sessionStorage.getItem(CACHE_KEY);
      if (rawCache) {
        const parsed = JSON.parse(rawCache) as {
          savedAt: number;
          messages: ContactMessage[];
          stats: MessagesResponse['stats'];
        };

        if (
          parsed &&
          Array.isArray(parsed.messages) &&
          parsed.stats &&
          typeof parsed.savedAt === 'number' &&
          Date.now() - parsed.savedAt < CACHE_MAX_AGE_MS
        ) {
          setAllMessages(parsed.messages);
          setStats(parsed.stats);
          loadedFromCache = true;
        }
      }
    } catch (error) {
      console.error('Failed to read contact messages cache:', error);
    }

    fetchMessages(!loadedFromCache);
  }, [fetchMessages]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          savedAt: Date.now(),
          messages: allMessages,
          stats,
        })
      );
    } catch (error) {
      console.error('Failed to persist contact messages cache:', error);
    }
  }, [allMessages, stats]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncViewport = () => {
      setViewportWidth(window.innerWidth);
    };

    syncViewport();
    window.addEventListener('resize', syncViewport, { passive: true });

    return () => {
      window.removeEventListener('resize', syncViewport);
    };
  }, []);

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      setUpdatingMessageId(id);
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !currentRead }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل تحديث الرسالة');
      }

      setAllMessages((prev) => {
        return prev.map((item) =>
          item.id === id
            ? { ...item, read: !currentRead, readAt: !currentRead ? new Date().toISOString() : null }
            : item
        );
      });

      setStats((prev) => ({
        ...prev,
        unread: !currentRead ? Math.max(prev.unread - 1, 0) : prev.unread + 1,
      }));
    } catch (error) {
      console.error('Error updating contact message:', error);
      alert(error instanceof Error ? error.message : 'فشل تحديث الرسالة');
    } finally {
      setUpdatingMessageId(null);
    }
  };

  const deleteMessage = async (id: string) => {
    const targetMessage = allMessages.find((item) => item.id === id);
    if (!targetMessage) return;

    if (!window.confirm('هل أنت متأكد من حذف هذه الرسالة نهائياً؟')) {
      return;
    }

    try {
      setDeletingMessageId(id);
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'فشل حذف الرسالة');
      }

      setAllMessages((prev) => prev.filter((item) => item.id !== id));
      setStats((prev) => adjustStatsAfterDelete(prev, targetMessage));
      setExpandedMessageIds((prev) => {
        if (!prev[id]) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (error) {
      console.error('Error deleting contact message:', error);
      alert(error instanceof Error ? error.message : 'فشل حذف الرسالة');
    } finally {
      setDeletingMessageId(null);
    }
  };

  const messages = useMemo(() => {
    if (filter === 'unread') {
      return allMessages.filter((item) => !item.read);
    }

    if (filter === 'failed') {
      return allMessages.filter((item) => item.status === 'FAILED');
    }

    return allMessages;
  }, [allMessages, filter]);

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

  const getFailureReason = (value?: string | null) => {
    if (!value) return 'تعذر إرسال إشعار البريد الإلكتروني، يرجى المراجعة';
    const normalized = value.toLowerCase();

    if (normalized.includes('smtp is not configured')) {
      return 'إعدادات البريد الإلكتروني (SMTP) غير مكتملة';
    }

    if (
      normalized.includes('auth') ||
      normalized.includes('invalid login') ||
      normalized.includes('username and password not accepted') ||
      normalized.includes('535-5.7.8')
    ) {
      return 'بيانات تسجيل الدخول غير صحيحة. في Gmail استخدمي App Password (16 حرف) بدون مسافات وبنفس الإيميل المستخدم في SMTP Username';
    }

    if (normalized.includes('econnrefused') || normalized.includes('enotfound') || normalized.includes('connection')) {
      return 'تعذر الاتصال بخادم البريد الإلكتروني';
    }

    return 'تعذر إرسال إشعار البريد الإلكتروني، يرجى مراجعة الإعدادات';
  };

  const filterLabel = useMemo(() => {
    if (filter === 'unread') return 'غير المقروءة';
    if (filter === 'failed') return 'الفاشلة';
    return 'كل الرسائل';
  }, [filter]);

  if (loading) {
    return <LoadingSpinner message="جاري تحميل رسائل التواصل..." fullScreen />;
  }

  const isMobileViewport = viewportWidth < 768;

  return (
    <div
      style={{
        padding: isMobileViewport ? '1rem' : '2rem',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2rem',
              color: 'var(--color-gold)',
              fontWeight: 700,
              marginBottom: '0.35rem',
            }}
          >
            رسائل التواصل
          </h1>
          <p style={{ color: 'var(--color-light-gold)', fontSize: '0.95rem' }}>
            عرض وإدارة رسائل نموذج تواصلي معنا
          </p>
        </div>
        <button
          onClick={() => fetchMessages(false)}
          disabled={refreshing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.65rem 1rem',
            borderRadius: '12px',
            border: '1px solid rgba(232, 199, 111, 0.3)',
            background: 'rgba(232, 199, 111, 0.1)',
            color: 'var(--color-gold)',
            cursor: 'pointer',
            fontWeight: 600,
            opacity: refreshing ? 0.75 : 1,
          }}
        >
          <RefreshCw size={16} style={{ transform: refreshing ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          <span>{refreshing ? 'جاري التحديث...' : 'تحديث'}</span>
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobileViewport ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <StatCard label="إجمالي الرسائل" value={stats.total} icon={Mail} color="#e8c76f" />
        <StatCard label="غير مقروءة" value={stats.unread} icon={MailOpen} color="#f59e0b" />
        <StatCard label="تم إرسالها" value={stats.sent} icon={CheckCircle2} color="#22c55e" />
        <StatCard label="فشل الإرسال" value={stats.failed} icon={AlertTriangle} color="#ef4444" />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          flexWrap: 'wrap',
          marginBottom: '1.25rem',
        }}
      >
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} text="الكل" />
        <FilterButton active={filter === 'unread'} onClick={() => setFilter('unread')} text="غير مقروءة" />
        <FilterButton active={filter === 'failed'} onClick={() => setFilter('failed')} text="فشل الإرسال" />
      </div>

      {messages.length === 0 ? (
        <div
          style={{
            borderRadius: '16px',
            border: '1px solid rgba(232, 199, 111, 0.2)',
            background: 'rgba(26, 20, 16, 0.65)',
            padding: '2rem',
            color: 'rgba(232, 199, 111, 0.8)',
            textAlign: 'center',
          }}
        >
          لا توجد رسائل ضمن فلتر: {filterLabel}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobileViewport ? '1fr' : 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '1rem',
            alignItems: 'stretch',
          }}
        >
          {messages.map((item) => {
            const statusMeta = statusLabels[item.status];
            const canShowExpand = canExpandMessage(item.message);
            const isMessageExpanded = Boolean(expandedMessageIds[item.id]);
            const phoneValue = item.phoneNumber
              ? `${item.phoneCountryCode || ''}${item.phoneNumber}`.replace(/\s+/g, '')
              : '';
            const phoneDisplay = item.phoneNumber
              ? `${item.phoneCountryCode || ''} ${item.phoneNumber}`.trim()
              : 'غير متوفر';
            const deliveryStatusText = item.status === 'FAILED' && item.emailError
              ? `سبب الفشل: ${getFailureReason(item.emailError)}`
              : item.emailSentAt
                ? `تم الإرسال: ${formatDate(item.emailSentAt)}`
                : 'بانتظار الإرسال';
            const inquiryTypeText = item.inquiryType === 'CAFTAN' ? 'استفسار عن قفطان' : 'رسالة عامة';
            const inquiryCaftanName = [item.inquiryProductName, item.inquiryProductNameEn]
              .filter(Boolean)
              .join(' / ');
            const toggleReadLabel = item.read ? 'غير مقروء' : 'مقروء';
            const replyLabel = 'الرد';
            const deleteLabel = 'حذف';
            return (
              <div
                key={item.id}
                style={{
                  borderRadius: '16px',
                  border: item.read
                    ? '1px solid rgba(232, 199, 111, 0.18)'
                    : '1px solid rgba(245, 158, 11, 0.42)',
                  background: item.read
                    ? 'rgba(26, 20, 16, 0.62)'
                    : 'rgba(38, 27, 17, 0.75)',
                  padding: '1.1rem 1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: isMobileViewport ? 'unset' : '360px',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobileViewport ? '1fr' : 'minmax(0, 1fr) auto',
                    gap: '0.8rem',
                    alignItems: 'start',
                    marginBottom: '0.9rem',
                    paddingBottom: '0.85rem',
                    borderBottom: '1px solid rgba(232, 199, 111, 0.16)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
                      <span style={{ color: 'rgba(232, 199, 111, 0.72)', fontSize: '0.72rem', fontWeight: 700 }}>
                        الاسم
                      </span>
                      <strong style={{ color: 'var(--color-cream)', fontSize: '1.02rem' }}>{item.name}</strong>
                      {!item.read && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            color: '#f59e0b',
                            background: 'rgba(245, 158, 11, 0.14)',
                            border: '1px solid rgba(245, 158, 11, 0.35)',
                            borderRadius: '999px',
                            padding: '0.16rem 0.5rem',
                            fontWeight: 700,
                          }}
                        >
                          جديد
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'grid', gap: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <span style={{ color: 'rgba(232, 199, 111, 0.72)', fontSize: '0.72rem', fontWeight: 700 }}>
                          البريد
                        </span>
                        <a
                          href={`mailto:${item.email}`}
                          style={{
                            color: '#93c5fd',
                            fontSize: '0.9rem',
                            textDecoration: 'none',
                            direction: 'ltr',
                            display: 'inline-block',
                            wordBreak: 'break-word',
                          }}
                        >
                          {item.email}
                        </a>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <span style={{ color: 'rgba(232, 199, 111, 0.72)', fontSize: '0.72rem', fontWeight: 700 }}>
                          الهاتف
                        </span>
                        {item.phoneNumber ? (
                          <a
                            href={`tel:${phoneValue}`}
                            style={{
                              color: '#a7f3d0',
                              fontSize: '0.88rem',
                              textDecoration: 'none',
                              direction: 'ltr',
                              display: 'inline-block',
                            }}
                          >
                            {phoneDisplay}
                          </a>
                        ) : (
                          <span style={{ color: 'rgba(245, 230, 200, 0.85)', fontSize: '0.88rem' }}>
                            {phoneDisplay}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <span style={{ color: 'rgba(232, 199, 111, 0.72)', fontSize: '0.72rem', fontWeight: 700 }}>
                          نوع الاستفسار
                        </span>
                        <span style={{ color: 'rgba(245, 230, 200, 0.9)', fontSize: '0.86rem' }}>
                          {inquiryTypeText}
                        </span>
                      </div>

                      {item.inquiryType === 'CAFTAN' && (
                        <div style={{ display: 'grid', gap: '0.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                            <span style={{ color: 'rgba(232, 199, 111, 0.72)', fontSize: '0.72rem', fontWeight: 700 }}>
                              القفطان
                            </span>
                            <span style={{ color: 'rgba(245, 230, 200, 0.9)', fontSize: '0.86rem' }}>
                              {inquiryCaftanName || 'غير محدد'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                            <span style={{ color: 'rgba(232, 199, 111, 0.72)', fontSize: '0.72rem', fontWeight: 700 }}>
                              الكود
                            </span>
                            <span style={{ color: 'rgba(167, 243, 208, 0.92)', fontSize: '0.83rem', direction: 'ltr' }}>
                              {item.inquiryProductId || 'N/A'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: isMobileViewport ? 'row' : 'column',
                      alignItems: isMobileViewport ? 'center' : 'flex-end',
                      justifyContent: 'space-between',
                      gap: '0.45rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        color: statusMeta.color,
                        background: statusMeta.background,
                        border: statusMeta.border,
                        borderRadius: '999px',
                        padding: '0.22rem 0.66rem',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                      }}
                    >
                      {statusMeta.text}
                    </span>
                    <span style={{ color: 'rgba(232, 199, 111, 0.7)', fontSize: '0.78rem' }}>
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '0.95rem' }}>
                  <div style={{ color: 'rgba(232, 199, 111, 0.72)', fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    الرسالة
                  </div>
                  <div
                    style={{
                      position: 'relative',
                      background: 'rgba(0, 0, 0, 0.18)',
                      border: '1px solid rgba(232, 199, 111, 0.16)',
                      borderRadius: '10px',
                    }}
                  >
                    <div
                      style={{
                        margin: 0,
                        color: 'rgba(245, 230, 200, 0.94)',
                        lineHeight: 1.8,
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'anywhere',
                        wordBreak: 'break-word',
                        maxWidth: '100%',
                        padding: '0.75rem 0.85rem',
                        flexGrow: 1,
                        ...(canShowExpand && !isMessageExpanded
                          ? {
                              maxHeight: `${MESSAGE_PREVIEW_MAX_LINES * 1.8}em`,
                              overflow: 'hidden',
                            }
                          : {}),
                      }}
                    >
                      {item.message}
                    </div>
                    {canShowExpand && !isMessageExpanded && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 1,
                          right: 1,
                          bottom: 1,
                          height: '2.1rem',
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
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        marginTop: '0.45rem',
                      }}
                    >
                      <button
                        onClick={() =>
                          setExpandedMessageIds((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                          }))
                        }
                        style={{
                          border: '1px solid rgba(232, 199, 111, 0.28)',
                          background: 'rgba(232, 199, 111, 0.08)',
                          color: 'var(--color-gold)',
                          borderRadius: '999px',
                          padding: '0.24rem 0.65rem',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {isMessageExpanded ? 'إظهار أقل' : 'إظهار المزيد'}
                      </button>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    color: 'rgba(232, 199, 111, 0.68)',
                    fontSize: '0.78rem',
                    borderTop: '1px dashed rgba(232, 199, 111, 0.2)',
                    paddingTop: '0.7rem',
                    marginBottom: '0.85rem',
                  }}
                >
                  {deliveryStatusText}
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobileViewport ? '1fr' : 'repeat(3, minmax(0, 1fr))',
                    gap: '0.55rem',
                  }}
                >
                    <button
                      onClick={() => toggleRead(item.id, item.read)}
                      title={toggleReadLabel}
                      aria-label={toggleReadLabel}
                      onMouseEnter={() => setHoveredActionKey(`${item.id}-toggle`)}
                      onMouseLeave={() => setHoveredActionKey(null)}
                      onFocus={() => setHoveredActionKey(`${item.id}-toggle`)}
                      onBlur={() => setHoveredActionKey(null)}
                      disabled={updatingMessageId === item.id || deletingMessageId === item.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '10px',
                        border: '1px solid rgba(232, 199, 111, 0.3)',
                        background: 'rgba(232, 199, 111, 0.1)',
                        color: 'var(--color-gold)',
                        padding: '0.45rem 0.75rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        width: '100%',
                        opacity: updatingMessageId === item.id ? 0.7 : 1,
                      }}
                    >
                      {updatingMessageId === item.id ? (
                        <Loader2 size={16} />
                      ) : item.read ? (
                        <Mail size={16} />
                      ) : (
                        <MailOpen size={16} />
                      )}
                      <span
                        style={{
                          maxWidth: hoveredActionKey === `${item.id}-toggle` ? '120px' : '0',
                          opacity: hoveredActionKey === `${item.id}-toggle` ? 1 : 0,
                          marginRight: hoveredActionKey === `${item.id}-toggle` ? '0.35rem' : '0',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          transition: 'max-width 0.25s ease, opacity 0.2s ease, margin 0.25s ease',
                        }}
                      >
                        {toggleReadLabel}
                      </span>
                    </button>
                    <a
                      href={`mailto:${item.email}?subject=${encodeURIComponent('رد من Luna Caftan')}`}
                      title={replyLabel}
                      aria-label={replyLabel}
                      onMouseEnter={() => setHoveredActionKey(`${item.id}-reply`)}
                      onMouseLeave={() => setHoveredActionKey(null)}
                      onFocus={() => setHoveredActionKey(`${item.id}-reply`)}
                      onBlur={() => setHoveredActionKey(null)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '10px',
                        border: '1px solid rgba(147, 197, 253, 0.35)',
                        background: 'rgba(59, 130, 246, 0.12)',
                        color: '#93c5fd',
                        padding: '0.45rem 0.75rem',
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textAlign: 'center',
                      }}
                    >
                      <Reply size={16} />
                      <span
                        style={{
                          maxWidth: hoveredActionKey === `${item.id}-reply` ? '120px' : '0',
                          opacity: hoveredActionKey === `${item.id}-reply` ? 1 : 0,
                          marginRight: hoveredActionKey === `${item.id}-reply` ? '0.35rem' : '0',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          transition: 'max-width 0.25s ease, opacity 0.2s ease, margin 0.25s ease',
                        }}
                      >
                        {replyLabel}
                      </span>
                    </a>
                    <button
                      onClick={() => deleteMessage(item.id)}
                      title={deleteLabel}
                      aria-label={deleteLabel}
                      onMouseEnter={() => setHoveredActionKey(`${item.id}-delete`)}
                      onMouseLeave={() => setHoveredActionKey(null)}
                      onFocus={() => setHoveredActionKey(`${item.id}-delete`)}
                      onBlur={() => setHoveredActionKey(null)}
                      disabled={deletingMessageId === item.id || updatingMessageId === item.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '10px',
                        border: '1px solid rgba(239, 68, 68, 0.35)',
                        background: 'rgba(239, 68, 68, 0.12)',
                        color: '#fca5a5',
                        padding: '0.45rem 0.75rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        width: '100%',
                        opacity: deletingMessageId === item.id ? 0.7 : 1,
                      }}
                    >
                      {deletingMessageId === item.id ? <Loader2 size={16} /> : <Trash2 size={16} />}
                      <span
                        style={{
                          maxWidth: hoveredActionKey === `${item.id}-delete` ? '120px' : '0',
                          opacity: hoveredActionKey === `${item.id}-delete` ? 1 : 0,
                          marginRight: hoveredActionKey === `${item.id}-delete` ? '0.35rem' : '0',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          transition: 'max-width 0.25s ease, opacity 0.2s ease, margin 0.25s ease',
                        }}
                      >
                        {deleteLabel}
                      </span>
                    </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  text,
}: {
  active: boolean;
  onClick: () => void;
  text: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.55rem 0.9rem',
        borderRadius: '10px',
        border: `1px solid ${active ? 'rgba(232, 199, 111, 0.45)' : 'rgba(232, 199, 111, 0.2)'}`,
        background: active ? 'rgba(232, 199, 111, 0.16)' : 'rgba(26, 20, 16, 0.6)',
        color: active ? 'var(--color-gold)' : 'rgba(232, 199, 111, 0.75)',
        cursor: 'pointer',
        fontWeight: active ? 700 : 600,
        fontSize: '0.84rem',
      }}
    >
      {text}
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
  icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
}) {
  return (
    <div
      style={{
        borderRadius: '14px',
        border: `1px solid ${color}55`,
        background: `linear-gradient(135deg, ${color}1f, rgba(20, 15, 12, 0.75))`,
        padding: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.55rem' }}>
        <span style={{ color: 'rgba(232, 199, 111, 0.82)', fontSize: '0.82rem', fontWeight: 600 }}>{label}</span>
        <Icon size={18} color={color} />
      </div>
      <strong style={{ color: 'var(--color-cream)', fontSize: '1.6rem', lineHeight: 1 }}>{value}</strong>
    </div>
  );
}
