'use client';

import { useEffect, useState } from 'react';
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  UserPlus,
  UserCog,
  Trash2,
  Save,
  X,
  Shield,
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [updatingAdminId, setUpdatingAdminId] = useState<string | null>(null);
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [editBuffers, setEditBuffers] = useState<Record<string, { name: string; email: string; password: string }>>({});

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const fetchAdmins = async () => {
    resetMessages();
    setLoading(true);
    try {
      const res = await fetch('/api/admins');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل تحميل المسؤولين');
      }
      const data = await res.json();
      setAdmins(Array.isArray(data) ? data : []);
      setEditBuffers({});
    } catch (err: any) {
      console.error('Error fetching admins:', err);
      setError(err.message || 'فشل تحميل المسؤولين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!newAdmin.name?.trim() || !newAdmin.email?.trim() || !newAdmin.password?.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setCreatingAdmin(true);
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAdmin.name.trim(),
          email: newAdmin.email.trim(),
          password: newAdmin.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل إنشاء المسؤول');
      }

      setNewAdmin({ name: '', email: '', password: '' });
      setSuccess('تم إنشاء المسؤول بنجاح');
      await fetchAdmins();
    } catch (err: any) {
      console.error('Error creating admin:', err);
      setError(err.message || 'فشل إنشاء المسؤول');
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleEditBufferChange = (id: string, field: 'name' | 'email' | 'password', value: string) => {
    setEditBuffers(prev => {
      const admin = admins.find(a => a.id === id);
      if (!admin) return prev;

      return {
        ...prev,
        [id]: {
          name: prev[id]?.name ?? admin.name,
          email: prev[id]?.email ?? admin.email,
          password: prev[id]?.password ?? '',
          [field]: value,
        },
      };
    });
  };

  const handleUpdateAdmin = async (id: string) => {
    resetMessages();
    const buffer = editBuffers[id];
    const admin = admins.find(a => a.id === id);
    
    if (!admin) {
      setError('لا يمكن العثور على المسؤول');
      return;
    }

    // إرسال فقط الحقول المتغيرة
    const updates: { name?: string; email?: string; password?: string } = {};
    
    // التحقق من التغييرات
    const hasNameChange = buffer?.name?.trim() && buffer.name.trim() !== admin.name;
    const hasEmailChange = buffer?.email?.trim() && buffer.email.trim() !== admin.email;
    const hasPasswordChange = buffer?.password?.trim();
    
    if (hasNameChange) {
      updates.name = buffer.name.trim();
    }
    
    if (hasEmailChange) {
      updates.email = buffer.email.trim();
    }
    
    if (hasPasswordChange) {
      updates.password = buffer.password;
    }

    if (Object.keys(updates).length === 0) {
      setError('لا توجد تغييرات لحفظها');
      return;
    }

    setUpdatingAdminId(id);
    try {
      const res = await fetch(`/api/admins/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل تعديل بيانات المسؤول');
      }

      setSuccess('تم حفظ التعديلات بنجاح');
      setEditBuffers(prev => {
        const newBuffers = { ...prev };
        delete newBuffers[id];
        return newBuffers;
      });
      await fetchAdmins();
    } catch (err: any) {
      console.error('Error updating admin:', err);
      setError(err.message || 'فشل تعديل بيانات المسؤول');
    } finally {
      setUpdatingAdminId(null);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    resetMessages();
    const admin = admins.find(item => item.id === id);
    if (!admin) return;

    const confirmed = window.confirm(`هل أنت متأكد من حذف المسؤول ${admin.name}؟`);
    if (!confirmed) return;

    setDeletingAdminId(id);
    try {
      const res = await fetch(`/api/admins/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل حذف المسؤول');
      }

      setSuccess('تم حذف المسؤول بنجاح');
      await fetchAdmins();
    } catch (err: any) {
      console.error('Error deleting admin:', err);
      setError(err.message || 'فشل حذف المسؤول');
    } finally {
      setDeletingAdminId(null);
    }
  };

  const formatDate = (value: string) => {
    try {
      return new Date(value).toLocaleDateString('ar-UK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return value;
    }
  };

  return (
    <div style={{
      padding: window.innerWidth < 768 ? '1rem' : '2rem',
      direction: 'rtl',
      maxWidth: '1400px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-gold)', fontWeight: '700', marginBottom: '0.5rem' }}>
          إدارة المسؤولين
        </h1>
        <p style={{ color: 'var(--color-light-gold)', fontSize: '1rem' }}>
          تحكم في حسابات المسؤولين وصلاحيات الوصول للوحة التحكم
        </p>
      </div>

      {/* Messages */}
      {(error || success) && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem 1.5rem',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          background: error ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
          border: error ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)',
          color: error ? '#fca5a5' : '#86efac',
          boxShadow: error 
            ? '0 4px 16px rgba(239, 68, 68, 0.2)' 
            : '0 4px 16px rgba(34, 197, 94, 0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {error ? <AlertCircle size={22} /> : <CheckCircle size={22} />}
            <span style={{ fontSize: '1rem', fontWeight: '500' }}>{error || success}</span>
          </div>
          <button
            onClick={resetMessages}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              opacity: 0.7,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Add New Admin Card */}
      <div style={{
        background: 'rgba(26, 20, 16, 0.7)',
        border: '1px solid rgba(232, 199, 111, 0.25)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
      }}>
        <h2 style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: 'var(--color-gold)',
          fontSize: '1.35rem',
          fontWeight: '600',
          margin: '0 0 1.5rem 0',
        }}>
          <UserPlus size={24} />
          إضافة مسؤول جديد
        </h2>

        <form onSubmit={handleCreateAdmin} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.25rem',
          alignItems: 'end',
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--color-cream)',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}>
              الاسم الكامل
            </label>
            <input
              type="text"
              value={newAdmin.name}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.9rem 1.1rem',
                background: 'rgba(15, 15, 12, 0.6)',
                border: '1px solid rgba(232, 199, 111, 0.25)',
                borderRadius: '12px',
                color: 'var(--color-cream)',
                fontSize: '0.95rem',
                transition: 'all 0.3s',
                outline: 'none',
              }}
              placeholder="أدخل اسم المسؤول"
              disabled={creatingAdmin}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-gold)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.25)'}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--color-cream)',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}>
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.9rem 1.1rem',
                background: 'rgba(15, 15, 12, 0.6)',
                border: '1px solid rgba(232, 199, 111, 0.25)',
                borderRadius: '12px',
                color: 'var(--color-cream)',
                fontSize: '0.95rem',
                transition: 'all 0.3s',
                outline: 'none',
              }}
              placeholder="admin@example.com"
              disabled={creatingAdmin}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-gold)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.25)'}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--color-cream)',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}>
              كلمة المرور
            </label>
            <input
              type="password"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.9rem 1.1rem',
                background: 'rgba(15, 15, 12, 0.6)',
                border: '1px solid rgba(232, 199, 111, 0.25)',
                borderRadius: '12px',
                color: 'var(--color-cream)',
                fontSize: '0.95rem',
                transition: 'all 0.3s',
                outline: 'none',
              }}
              placeholder="••••••••"
              disabled={creatingAdmin}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-gold)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.25)'}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ 
              padding: '1rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              opacity: creatingAdmin ? 0.6 : 1,
              cursor: creatingAdmin ? 'not-allowed' : 'pointer',
            }}
            disabled={creatingAdmin}
          >
            {creatingAdmin ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader2 className="animate-spin" size={18} />
                جاري الإنشاء...
              </span>
            ) : (
              'إضافة مسؤول'
            )}
          </button>
        </form>
      </div>

      {/* Current Admins Card */}
      <div style={{
        background: 'rgba(26, 20, 16, 0.7)',
        border: '1px solid rgba(232, 199, 111, 0.25)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
      }}>
        <h2 style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: 'var(--color-gold)',
          fontSize: '1.35rem',
          fontWeight: '600',
          margin: '0 0 1.5rem 0',
        }}>
          <UserCog size={24} />
          المسؤولون الحاليون
          {!loading && admins.length > 0 && (
            <span style={{
              background: 'rgba(232, 199, 111, 0.2)',
              color: 'var(--color-gold)',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600',
            }}>
              {admins.length}
            </span>
          )}
        </h2>

        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 0',
            gap: '1rem',
          }}>
            <Loader2 className="animate-spin" size={40} color="var(--color-gold)" />
            <p style={{ color: 'var(--color-light-gold)', fontSize: '1rem' }}>
              جاري تحميل البيانات...
            </p>
          </div>
        ) : admins.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: 'rgba(232, 199, 111, 0.6)',
          }}>
            <UserCog size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '1.1rem', margin: 0 }}>
              لا يوجد أي مسؤولين حتى الآن
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {admins.map(admin => {
              const buffer = editBuffers[admin.id] ?? {
                name: admin.name,
                email: admin.email,
                password: '',
              };

              const isUpdating = updatingAdminId === admin.id;
              const isDeleting = deletingAdminId === admin.id;
              const isDisabled = isUpdating || isDeleting;

              return (
                <div
                  key={admin.id}
                  style={{
                    background: 'rgba(15, 15, 12, 0.6)',
                    border: '1px solid rgba(232, 199, 111, 0.2)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    transition: 'all 0.3s',
                  }}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.25rem',
                    marginBottom: '1.25rem',
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: 'var(--color-cream)',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                      }}>
                        الاسم
                      </label>
                      <input
                        type="text"
                        value={buffer.name}
                        onChange={(e) => handleEditBufferChange(admin.id, 'name', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          background: 'rgba(10, 10, 10, 0.5)',
                          border: '1px solid rgba(232, 199, 111, 0.2)',
                          borderRadius: '10px',
                          color: 'var(--color-cream)',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s',
                          outline: 'none',
                        }}
                        disabled={isDisabled}
                        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-gold)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.2)'}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: 'var(--color-cream)',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                      }}>
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        value={buffer.email}
                        onChange={(e) => handleEditBufferChange(admin.id, 'email', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          background: 'rgba(10, 10, 10, 0.5)',
                          border: '1px solid rgba(232, 199, 111, 0.2)',
                          borderRadius: '10px',
                          color: 'var(--color-cream)',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s',
                          outline: 'none',
                        }}
                        disabled={isDisabled}
                        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-gold)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.2)'}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: 'var(--color-cream)',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                      }}>
                        كلمة مرور جديدة (اختياري)
                      </label>
                      <input
                        type="password"
                        value={buffer.password}
                        onChange={(e) => handleEditBufferChange(admin.id, 'password', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          background: 'rgba(10, 10, 10, 0.5)',
                          border: '1px solid rgba(232, 199, 111, 0.2)',
                          borderRadius: '10px',
                          color: 'var(--color-cream)',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s',
                          outline: 'none',
                        }}
                        placeholder="اتركه فارغاً للإبقاء على الحالية"
                        disabled={isDisabled}
                        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-gold)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.2)'}
                      />
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(232, 199, 111, 0.1)',
                  }}>
                    <p style={{
                      color: 'rgba(232, 199, 111, 0.5)',
                      fontSize: '0.85rem',
                      margin: 0,
                    }}>
                      تم الإنشاء في {formatDate(admin.createdAt)}
                    </p>

                    <div style={{
                      display: 'flex',
                      gap: '0.75rem',
                      flexWrap: 'wrap',
                    }}>
                      <button
                        type="button"
                        onClick={() => handleUpdateAdmin(admin.id)}
                        className="btn btn-outline"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.25rem',
                          fontSize: '0.9rem',
                          opacity: isDisabled ? 0.5 : 1,
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                        }}
                        disabled={isDisabled}
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="animate-spin" size={16} />
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            حفظ التعديلات
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.25rem',
                          fontSize: '0.9rem',
                          background: 'rgba(239, 68, 68, 0.12)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '10px',
                          color: '#fca5a5',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s',
                          fontWeight: '500',
                          opacity: isDisabled ? 0.5 : 1,
                        }}
                        disabled={isDisabled}
                        onMouseEnter={(e) => {
                          if (!isDisabled) {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isDisabled) {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                          }
                        }}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="animate-spin" size={16} />
                            جاري الحذف...
                          </>
                        ) : (
                          <>
                            <Trash2 size={16} />
                            حذف
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
