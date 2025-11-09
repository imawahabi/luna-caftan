'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, Globe, Phone, Mail, Instagram, 
  Facebook, Twitter, Image as ImageIcon, Info,
  AlertCircle, CheckCircle, Loader2
} from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

interface SettingsForm {
  whatsappNumber: string;
  email: string;
  instagramUrl: string;
  facebookUrl: string;
  logoUrl: string;
  heroBackgroundUrl: string;
  aboutBackgroundUrl: string;
  aboutAr: string;
  aboutEn: string;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.875rem 1rem',
  background: 'rgba(26, 20, 16, 0.4)',
  border: '1px solid rgba(232, 199, 111, 0.3)',
  borderRadius: '12px',
  color: 'var(--color-cream)',
  fontSize: '0.95rem',
  transition: 'all 0.3s',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: '100px',
  resize: 'vertical' as const,
  fontFamily: 'inherit',
};

interface SectionCardProps {
  title: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  children: React.ReactNode;
  fullWidth?: boolean;
  contentStyle?: React.CSSProperties;
}

const SectionCard = ({ title, icon: Icon, children, fullWidth = false, contentStyle }: SectionCardProps) => (
  <div style={{
    background: 'rgba(26, 20, 16, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(232, 199, 111, 0.2)',
    borderRadius: '20px',
    padding: '2rem',
    transition: 'all 0.3s',
    gridColumn: fullWidth ? '1 / -1' : undefined,
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1.75rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid rgba(232, 199, 111, 0.15)',
    }}>
      <div style={{
        padding: '0.75rem',
        background: 'rgba(232, 199, 111, 0.15)',
        borderRadius: '12px',
        display: 'flex',
      }}>
        <Icon size={24} color="var(--color-gold)" strokeWidth={2} />
      </div>
      <h3 style={{
        color: 'var(--color-gold)',
        fontSize: '1.25rem',
        fontWeight: '600',
        margin: 0,
      }}>
        {title}
      </h3>
    </div>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      ...contentStyle,
    }}>
      {children}
    </div>
  </div>
);

interface ImageUploadFieldProps {
  label: string;
  description: string;
  value: string;
  onSelect: (url: string) => void;
}

const ImageUploadField = ({ label, description, value, onSelect }: ImageUploadFieldProps) => (
  <div style={{
    background: 'rgba(12, 9, 7, 0.6)',
    border: '1px solid rgba(232, 199, 111, 0.2)',
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    minHeight: '100%',
  }}>
    <div>
      <h4 style={{
        color: 'var(--color-gold)',
        fontSize: '1.05rem',
        fontWeight: 600,
        margin: 0,
        marginBottom: '0.35rem',
      }}>
        {label}
      </h4>
      <p style={{
        color: 'rgba(232, 199, 111, 0.65)',
        fontSize: '0.85rem',
        margin: 0,
        lineHeight: 1.5,
      }}>
        {description}
      </p>
    </div>
    <ImageUploader
      currentValue={value}
      onImageSelect={onSelect}
      label={label}
      showGallery
    />
  </div>
);

const InputField = ({ label, value, onChange, placeholder, type = 'text', textarea = false }: any) => (
  <div>
    <label style={{
      display: 'block',
      marginBottom: '0.5rem',
      color: 'var(--color-cream)',
      fontSize: '0.9rem',
      fontWeight: '500',
    }}>
      {label}
    </label>
    {textarea ? (
      <textarea
        value={value}
        onChange={onChange}
        style={textareaStyle}
        placeholder={placeholder}
        rows={4}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        style={inputStyle}
        placeholder={placeholder}
      />
    )}
  </div>
);

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState<SettingsForm>({
    whatsappNumber: '',
    email: '',
    instagramUrl: '',
    facebookUrl: '',
    logoUrl: '',
    heroBackgroundUrl: '',
    aboutBackgroundUrl: '',
    aboutAr: '',
    aboutEn: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      
      setFormData({
        whatsappNumber: data.whatsapp_number || '',
        email: data.email || '',
        instagramUrl: data.instagram_url || '',
        facebookUrl: data.facebook_url || '',
        logoUrl: data.logo_url || '',
        heroBackgroundUrl: data.hero_background_url || '',
        aboutBackgroundUrl: data.about_background_url || '',
        aboutAr: data.about_ar || '',
        aboutEn: data.about_en || '',
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SettingsForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp_number: formData.whatsappNumber,
          email: formData.email,
          instagram_url: formData.instagramUrl,
          facebook_url: formData.facebookUrl,
          logo_url: formData.logoUrl,
          hero_background_url: formData.heroBackgroundUrl,
          about_background_url: formData.aboutBackgroundUrl,
          about_ar: formData.aboutAr,
          about_en: formData.aboutEn,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setSubmitError(error.message || 'فشل حفظ الإعدادات. يرجى المحاولة مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Loader2 size={48} className="animate-spin" color="var(--color-gold)" />
      </div>
    );
  }

  return (
    <div style={{
      padding: window.innerWidth < 768 ? '1rem' : '2rem',
      direction: 'rtl',
      maxWidth: '100%',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          color: 'var(--color-gold)',
          fontWeight: '700',
          marginBottom: '0.5rem',
        }}>
          ⚙️ إعدادات الموقع
        </h1>
        <p style={{ color: 'var(--color-light-gold)', fontSize: '1rem' }}>
          قم بتخصيص معلومات موقعك ووسائل التواصل الاجتماعي
        </p>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem 1.25rem',
          background: 'rgba(34, 197, 94, 0.12)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#22c55e',
        }}>
          <CheckCircle size={20} />
          <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>
            تم حفظ الإعدادات بنجاح!
          </span>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem 1.25rem',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#f87171',
        }}>
          <AlertCircle size={20} />
          <span style={{ fontSize: '0.95rem' }}>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: window.innerWidth < 768 ? '1.5rem' : '2rem',
          marginBottom: '2rem',
        }}>
          {/* Contact Info */}
          <SectionCard title="معلومات التواصل" icon={Phone}>
            <InputField
              label="رقم الواتساب"
              value={formData.whatsappNumber}
              onChange={handleInputChange('whatsappNumber')}
              placeholder="+965 69059697"
              type="tel"
            />
            <InputField
              label="البريد الإلكتروني"
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder="contact@lunacaftan.com"
              type="email"
            />
          </SectionCard>

          {/* Social Media */}
          <SectionCard title="وسائل التواصل الاجتماعي" icon={Instagram}>
            <InputField
              label="Instagram"
              value={formData.instagramUrl}
              onChange={handleInputChange('instagramUrl')}
              placeholder="https://instagram.com/luna.caftan.kw"
              type="url"
            />
            <InputField
              label="Facebook"
              value={formData.facebookUrl}
              onChange={handleInputChange('facebookUrl')}
              placeholder="https://facebook.com/lunacaftan"
              type="url"
            />
          </SectionCard>

          {/* About Section */}
          <SectionCard title="عن المتجر" icon={Info}>
            <InputField
              label="نبذة عن المتجر (عربي)"
              value={formData.aboutAr}
              onChange={handleInputChange('aboutAr')}
              placeholder="اكتب نبذة مختصرة عن متجرك..."
              textarea
            />
            <InputField
              label="About Store (English)"
              value={formData.aboutEn}
              onChange={handleInputChange('aboutEn')}
              placeholder="Write a brief description about your store..."
              textarea
            />
          </SectionCard>

          {/* Images Section */}
          <SectionCard
            title="الصور والخلفيات"
            icon={ImageIcon}
            fullWidth
            contentStyle={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: window.innerWidth < 768 ? '1rem' : '1.5rem',
            }}
          >
            <ImageUploadField
              label="شعار الموقع"
              description="يظهر في جميع أقسام الموقع وفي لوحة التحكم. اختر نسخة عالية الدقة بخلفية شفافة إن وجدت."
              value={formData.logoUrl}
              onSelect={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))}
            />
            <ImageUploadField
              label="خلفية الهيرو"
              description="صورة الخلفية الرئيسية للصفحة الرئيسية وجميع الأقسام المرتبطة بالواجهة. استخدم صورة أفقية عالية الجودة."
              value={formData.heroBackgroundUrl}
              onSelect={(url) => setFormData(prev => ({ ...prev, heroBackgroundUrl: url }))}
            />
            <ImageUploadField
              label="خلفية قسم عن لونا"
              description="خلفية قسم التعريف بالعلامة التجارية ضمن الصفحة الرئيسية. يفضل استخدام صورة هادئة بتباين جيد."
              value={formData.aboutBackgroundUrl}
              onSelect={(url) => setFormData(prev => ({ ...prev, aboutBackgroundUrl: url }))}
            />
          </SectionCard>
        </div>

        {/* Save Button */}
        <div style={{
          position: 'sticky',
          bottom: '2rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
        }}>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{
              padding: '1rem 3rem',
              fontSize: '1.1rem',
              gap: '0.75rem',
              minWidth: '200px',
              boxShadow: '0 8px 24px rgba(232, 199, 111, 0.3)',
            }}
          >
            {saving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>حفظ الإعدادات</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* إدارة المسؤولين أصبحت في صفحة مستقلة */}
    </div>
  );
}
