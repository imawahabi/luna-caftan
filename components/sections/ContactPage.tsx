'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, ChevronDown, Instagram, Mail, MapPin, Search, Send, X } from 'lucide-react';
import Image from 'next/image';
import { useSettings } from '@/lib/settings-context';
import { useProducts } from '@/lib/products-context';
import { canOptimizeImageSrc, sanitizeImageSrc } from '@/lib/image-utils';
import {
  COUNTRY_PHONE_OPTIONS,
  getPhoneNumberLengthRuleByDialCode,
  type CountryPhoneOption,
} from '@/lib/country-codes';

const DEFAULT_COUNTRY_OPTION =
  COUNTRY_PHONE_OPTIONS.find((country) => country.iso2 === 'KW') || COUNTRY_PHONE_OPTIONS[0];
type ContactInquiryType = 'GENERAL' | 'CAFTAN';

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const { products, loading: productsLoading } = useProducts();
  const successMessage = t('contact.form.success');
  const getCountryLabel = (country: CountryPhoneOption) =>
    i18n.language === 'ar' ? country.nameAr : country.nameEn;
  const getCountryDisplay = (country: CountryPhoneOption) =>
    `${getCountryLabel(country)} (${country.dialCode})`;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'GENERAL' as ContactInquiryType,
    inquiryProductId: '',
    phoneCountryCode: DEFAULT_COUNTRY_OPTION.dialCode,
    phoneNumber: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [countrySearchValue, setCountrySearchValue] = useState(
    getCountryDisplay(DEFAULT_COUNTRY_OPTION)
  );
  const [isCaftanPickerOpen, setIsCaftanPickerOpen] = useState(false);
  const [caftanSearchQuery, setCaftanSearchQuery] = useState('');
  const contactHeroSrc = sanitizeImageSrc(
    settings.contact_hero_background_url || settings.hero_background_url,
    '/images/about.jpg'
  );
  const canOptimizeContactHeroImage = canOptimizeImageSrc(contactHeroSrc);
  const whatsappNumber = settings.whatsapp_number || '+965 51246133';
  const whatsappNumberLink = whatsappNumber.replace(/[^\d]/g, '') || '96551246133';
  const instagramUrl = settings.instagram_url || 'https://instagram.com/luna.caftan.kw';
  const instagramHandle = instagramUrl
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '@')
    .replace(/\/+$/, '') || '@luna.caftan.kw';
  const siteEmail = settings.email || 'contact@lunacaftan.com';
  const resolveContactFormMessageKey = (value: unknown, fallbackKey: string) => {
    if (typeof value !== 'string') return fallbackKey;
    return value.startsWith('contact.form.') ? value : fallbackKey;
  };
  const countryOptions = useMemo(
    () =>
      COUNTRY_PHONE_OPTIONS.map((country) => ({
        ...country,
        display: `${i18n.language === 'ar' ? country.nameAr : country.nameEn} (${country.dialCode})`,
      })),
    [i18n.language]
  );
  const caftanOptions = useMemo(
    () =>
      products
        .filter((product) => product.active !== false)
        .map((product) => {
          const nameAr = (product.name || '').trim();
          const nameEn = (product.nameEn || '').trim();
          const display = i18n.language === 'ar'
            ? `${nameAr}${nameEn ? ` (${nameEn})` : ''}`
            : `${nameEn || nameAr}${nameAr ? ` (${nameAr})` : ''}`;
          return {
            id: product.id,
            nameAr,
            nameEn,
            display: display.trim(),
            image:
              Array.isArray(product.images) && product.images.length > 0
                ? product.images[0]
                : '/placeholder.jpg',
          };
        }),
    [products, i18n.language]
  );
  const filteredCaftanOptions = useMemo(() => {
    const query = caftanSearchQuery.trim().toLowerCase();
    if (!query) return caftanOptions;

    return caftanOptions.filter((item) => {
      return (
        item.display.toLowerCase().includes(query) ||
        item.nameAr.toLowerCase().includes(query) ||
        item.nameEn.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
      );
    });
  }, [caftanOptions, caftanSearchQuery]);

  const resolveCountryCodeFromSearch = (value: string) => {
    const normalizedValue = value.trim().toLowerCase();
    if (!normalizedValue) return null;

    const exactOption = countryOptions.find((country) => {
      const display = country.display.toLowerCase();
      const nameAr = country.nameAr.toLowerCase();
      const nameEn = country.nameEn.toLowerCase();
      return (
        display === normalizedValue ||
        nameAr === normalizedValue ||
        nameEn === normalizedValue ||
        country.dialCode.toLowerCase() === normalizedValue
      );
    });

    if (exactOption) return exactOption.dialCode;

    const codeMatch = value.match(/\+\d{1,5}/);
    return codeMatch ? codeMatch[0] : null;
  };
  const selectedCountryByCode = useMemo(
    () => COUNTRY_PHONE_OPTIONS.find((country) => country.dialCode === formData.phoneCountryCode) || null,
    [formData.phoneCountryCode]
  );
  const selectedCaftanById = useMemo(
    () => caftanOptions.find((item) => item.id === formData.inquiryProductId) || null,
    [caftanOptions, formData.inquiryProductId]
  );
  const { minLength: phoneMinLength, maxLength: phoneMaxLength } = useMemo(
    () => getPhoneNumberLengthRuleByDialCode(formData.phoneCountryCode),
    [formData.phoneCountryCode]
  );
  const phonePattern = useMemo(
    () => `[0-9]{${phoneMinLength},${phoneMaxLength}}`,
    [phoneMinLength, phoneMaxLength]
  );
  const phoneLengthHint = useMemo(() => {
    if (phoneMinLength === phoneMaxLength) {
      return t('contact.form.phoneNumberLengthHintExact', { count: phoneMinLength });
    }
    return t('contact.form.phoneNumberLengthHintRange', {
      min: phoneMinLength,
      max: phoneMaxLength,
    });
  }, [phoneMinLength, phoneMaxLength, t]);

  useEffect(() => {
    if (selectedCountryByCode) {
      setCountrySearchValue(
        `${i18n.language === 'ar' ? selectedCountryByCode.nameAr : selectedCountryByCode.nameEn} (${selectedCountryByCode.dialCode})`
      );
    }
  }, [selectedCountryByCode, i18n.language]);

  useEffect(() => {
    setFormData((prev) => {
      if (!prev.phoneNumber || prev.phoneNumber.length <= phoneMaxLength) {
        return prev;
      }
      return { ...prev, phoneNumber: prev.phoneNumber.slice(0, phoneMaxLength) };
    });
  }, [phoneMaxLength]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setSubmitError('');
    setSubmitSuccess(false);
    setSubmitMessage('');

    if (formData.inquiryType === 'CAFTAN') {
      if (!formData.inquiryProductId) {
        setSubmitError(t('contact.form.caftanRequired'));
        return;
      }

      const isCaftanValid = caftanOptions.some((item) => item.id === formData.inquiryProductId);
      if (!isCaftanValid) {
        setSubmitError(t('contact.form.caftanInvalid'));
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(resolveContactFormMessageKey(data?.errorKey, 'contact.form.error'));
      }

      setSubmitMessage(
        t(resolveContactFormMessageKey(data?.messageKey, 'contact.form.success'))
      );
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        inquiryType: 'GENERAL',
        inquiryProductId: '',
        phoneCountryCode: DEFAULT_COUNTRY_OPTION.dialCode,
        phoneNumber: '',
        message: '',
      });
      setCountrySearchValue(getCountryDisplay(DEFAULT_COUNTRY_OPTION));
      setCaftanSearchQuery('');
      setIsCaftanPickerOpen(false);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSubmitMessage('');
      }, 4000);
    } catch (error) {
      console.error('Contact form submit error:', error);
      const key = error instanceof Error
        ? resolveContactFormMessageKey(error.message, 'contact.form.error')
        : 'contact.form.error';
      setSubmitError(t(key));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInquiryTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextType = e.target.value === 'CAFTAN' ? 'CAFTAN' : 'GENERAL';
    setFormData((prev) => ({
      ...prev,
      inquiryType: nextType,
      inquiryProductId: nextType === 'CAFTAN' ? prev.inquiryProductId : '',
    }));
    if (nextType !== 'CAFTAN') {
      setCaftanSearchQuery('');
      setIsCaftanPickerOpen(false);
    }
  };

  const handleCaftanSelect = (caftanId: string) => {
    setFormData((prev) => ({ ...prev, inquiryProductId: caftanId }));
    setCaftanSearchQuery('');
    setIsCaftanPickerOpen(false);
  };

  const clearCaftanSelection = () => {
    setFormData((prev) => ({ ...prev, inquiryProductId: '' }));
    setCaftanSearchQuery('');
  };

  const handleCountrySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCountrySearchValue(value);
    const resolvedCode = resolveCountryCodeFromSearch(value);
    if (resolvedCode) {
      setFormData((prev) => ({ ...prev, phoneCountryCode: resolvedCode }));
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/[^\d]/g, '');
    setFormData((prev) => ({
      ...prev,
      phoneNumber: digitsOnly.slice(0, phoneMaxLength),
    }));
  };

  const handleCountrySearchBlur = () => {
    const resolvedCode = resolveCountryCodeFromSearch(countrySearchValue);
    if (!resolvedCode) {
      if (selectedCountryByCode) {
        setCountrySearchValue(getCountryDisplay(selectedCountryByCode));
      }
      return;
    }

    const matchedCountry = COUNTRY_PHONE_OPTIONS.find(
      (country) => country.dialCode === resolvedCode
    );
    if (matchedCountry) {
      setCountrySearchValue(getCountryDisplay(matchedCountry));
      setFormData((prev) => ({ ...prev, phoneCountryCode: matchedCountry.dialCode }));
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0a0808 0%, #1a1410 50%, #0a0808 100%)',
      minHeight: '100vh',
    }}>
      {/* Hero with Enhanced Background */}
      <section className="hero" style={{ 
        minHeight: '60vh',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated Background Gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 40% 40%, rgba(232, 199, 111, 0.1) 0%, transparent 50%), radial-gradient(circle at 60% 70%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)',
        }} />
        
        <div className="hero-bg">
          {canOptimizeContactHeroImage ? (
            <Image
              src={contactHeroSrc}
              alt="Contact"
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                filter: 'brightness(0.6) contrast(1.1)',
              }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={contactHeroSrc}
              alt="Contact"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                filter: 'brightness(0.6) contrast(1.1)',
              }}
            />
          )}
          <div className="hero-overlay" style={{
            background: 'linear-gradient(135deg, rgba(10, 8, 8, 0.9) 0%, rgba(26, 20, 16, 0.8) 50%, rgba(10, 8, 8, 0.95) 100%)',
          }}></div>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content" 
            style={{ maxWidth: '700px' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(232, 199, 111, 0.3)',
                borderRadius: '50px',
                marginBottom: '1.5rem',
              }}
            >
              <Send size={16} color="#e8c76f" />
              <span style={{ color: '#e8c76f', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '0.5px' }}>
                {i18n.language === 'ar' ? 'تواصلي معنا' : 'Contact Us'}
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ 
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                background: 'linear-gradient(135deg, #f5e6c8, #e8c76f, #d4af37)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem',
                lineHeight: '1.5',
                fontWeight: 'bold',
              }}
            >
              {t('contact.title')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                fontSize: '1.15rem',
                color: 'rgba(232, 199, 111, 0.8)',
                lineHeight: '1.8',
              }}
            >
              {i18n.language === 'ar' 
                ? 'نحن هنا للإجابة على استفساراتكم'
                : 'We are here to answer your questions'}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section with Enhanced Design */}
      <section className="section" style={{ 
        paddingTop: '5rem', 
        paddingBottom: '6rem',
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(26, 20, 16, 0.4) 0%, rgba(10, 8, 8, 0.6) 100%)',
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(232, 199, 111, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'start' }}>
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 style={{ 
                fontSize: '2.5rem', 
                background: 'linear-gradient(135deg, #f5e6c8, #e8c76f)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1.5rem',
                fontWeight: '700',
              }}>
                {i18n.language === 'ar' ? 'تواصلي معنا' : 'Get in Touch'}
              </h2>
              <p style={{ color: 'rgba(232, 199, 111, 0.8)', marginBottom: '3rem', lineHeight: '1.9', fontSize: '1.1rem' }}>
                {i18n.language === 'ar' 
                  ? 'نسعد بالتواصل معكم عبر أي من القنوات التالية'
                  : 'We are happy to connect with you through any of the following channels'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <a
                  href={`https://wa.me/${whatsappNumberLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.5rem',
                    background: 'rgba(139, 115, 85, 0.08)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                  }}
                >
                  <div className="social-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ color: 'var(--color-cream)', fontWeight: '600', marginBottom: '0.3rem' }}>
                      {i18n.language === 'ar' ? 'الاتصال او الواتساب' : 'Call or WhatsApp'}
                    </p>
                    <p style={{ color: 'var(--color-light-gold)', fontSize: '0.9rem' }}>
                      {whatsappNumber}
                    </p>
                  </div>
                </a>

                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.5rem',
                    background: 'rgba(139, 115, 85, 0.08)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                  }}
                >
                  <div className="social-link">
                    <Instagram size={20} />
                  </div>
                  <div>
                    <p style={{ color: 'var(--color-cream)', fontWeight: '600', marginBottom: '0.3rem' }}>
                      {i18n.language === 'ar' ? 'إنستغرام' : 'Instagram'}
                    </p>
                    <p style={{ color: 'var(--color-light-gold)', fontSize: '0.9rem' }}>
                      {instagramHandle}
                    </p>
                  </div>
                </a>

                <a
                  href={`mailto:${siteEmail}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.5rem',
                    background: 'rgba(139, 115, 85, 0.08)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                  }}
                >
                  <div className="social-link">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p style={{ color: 'var(--color-cream)', fontWeight: '600', marginBottom: '0.3rem' }}>
                      {i18n.language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </p>
                    <p style={{ color: 'var(--color-light-gold)', fontSize: '0.9rem' }}>
                      {siteEmail}
                    </p>
                  </div>
                </a>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.5rem',
                    background: 'rgba(139, 115, 85, 0.08)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '4px',
                  }}
                >
                  <div className="social-link">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p style={{ color: 'var(--color-cream)', fontWeight: '600', marginBottom: '0.3rem' }}>
                      {i18n.language === 'ar' ? 'الموقع' : 'Location'}
                    </p>
                    <p style={{ color: 'var(--color-light-gold)', fontSize: '0.9rem' }}>
                      {i18n.language === 'ar' ? 'الكويت' : 'Kuwait'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{
                padding: '3rem',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1.5px solid rgba(232, 199, 111, 0.2)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              }}
            >
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--color-cream)', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.78rem 0.9rem',
                      background: 'rgba(139, 115, 85, 0.08)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '4px',
                      color: 'var(--color-cream)',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--color-cream)', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.78rem 0.9rem',
                      background: 'rgba(139, 115, 85, 0.08)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '4px',
                      color: 'var(--color-cream)',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--color-cream)', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {t('contact.form.inquiryType')}
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInquiryTypeChange}
                    style={{
                      width: '100%',
                      padding: '0.78rem 0.9rem',
                      background: 'rgba(139, 115, 85, 0.08)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '4px',
                      color: 'var(--color-cream)',
                      fontSize: '0.95rem',
                    }}
                  >
                    <option
                      value="GENERAL"
                      style={{ color: '#1f1b16', backgroundColor: '#fffdf8' }}
                    >
                      {t('contact.form.inquiryTypeGeneral')}
                    </option>
                    <option
                      value="CAFTAN"
                      style={{ color: '#1f1b16', backgroundColor: '#fffdf8' }}
                    >
                      {t('contact.form.inquiryTypeCaftan')}
                    </option>
                  </select>
                </div>

                {formData.inquiryType === 'CAFTAN' && (
                  <div>
                    <label style={{ display: 'block', color: 'var(--color-cream)', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {t('contact.form.caftan')}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCaftanPickerOpen(true)}
                      disabled={productsLoading || caftanOptions.length === 0}
                      style={{
                        width: '100%',
                        padding: '0.66rem 0.85rem',
                        background: 'rgba(139, 115, 85, 0.08)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        borderRadius: '10px',
                        color: 'var(--color-cream)',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        cursor: productsLoading || caftanOptions.length === 0 ? 'not-allowed' : 'pointer',
                        opacity: productsLoading || caftanOptions.length === 0 ? 0.7 : 1,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                        {selectedCaftanById ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={selectedCaftanById.image}
                            alt={selectedCaftanById.display}
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid rgba(212, 175, 55, 0.26)',
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '8px',
                              border: '1px dashed rgba(212, 175, 55, 0.3)',
                              background: 'rgba(0, 0, 0, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'rgba(232, 199, 111, 0.7)',
                              flexShrink: 0,
                            }}
                          >
                            <Search size={16} />
                          </div>
                        )}
                        <div style={{ minWidth: 0, textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>
                          <div
                            style={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              color: 'var(--color-cream)',
                              fontWeight: 600,
                              fontSize: '0.88rem',
                            }}
                          >
                            {selectedCaftanById
                              ? (i18n.language === 'ar'
                                  ? (selectedCaftanById.nameAr || selectedCaftanById.nameEn)
                                  : (selectedCaftanById.nameEn || selectedCaftanById.nameAr))
                              : (productsLoading
                                  ? t('contact.form.caftanLoading')
                                  : t('contact.form.caftanPlaceholder'))}
                          </div>
                          {selectedCaftanById && (
                            <div
                              style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                color: 'rgba(232, 199, 111, 0.74)',
                                fontSize: '0.74rem',
                                marginTop: '0.14rem',
                              }}
                            >
                              {i18n.language === 'ar'
                                ? selectedCaftanById.nameEn
                                : selectedCaftanById.nameAr}
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronDown size={18} color="#e8c76f" />
                    </button>

                    <div
                      style={{
                        marginTop: '0.45rem',
                        color: 'rgba(232, 199, 111, 0.7)',
                        fontSize: '0.78rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.6rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span>
                        {caftanOptions.length === 0
                          ? t('contact.form.caftanEmpty')
                          : t('contact.form.caftanHint')}
                      </span>
                      {selectedCaftanById && (
                        <button
                          type="button"
                          onClick={clearCaftanSelection}
                          style={{
                            border: '1px solid rgba(239, 68, 68, 0.35)',
                            background: 'rgba(239, 68, 68, 0.12)',
                            color: '#fca5a5',
                            borderRadius: '999px',
                            padding: '0.18rem 0.55rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <X size={12} />
                          <span>{i18n.language === 'ar' ? 'إزالة الاختيار' : 'Clear'}</span>
                        </button>
                      )}
                    </div>

                    {isCaftanPickerOpen && (
                      <div
                        onClick={(event) => {
                          if (event.target === event.currentTarget) {
                            setIsCaftanPickerOpen(false);
                          }
                        }}
                        style={{
                          position: 'fixed',
                          inset: 0,
                          zIndex: 1200,
                          background: 'rgba(0, 0, 0, 0.68)',
                          backdropFilter: 'blur(3px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '1rem',
                        }}
                      >
                        <div
                          role="dialog"
                          aria-modal="true"
                          style={{
                            width: 'min(760px, 100%)',
                            maxHeight: '85vh',
                            background: 'linear-gradient(180deg, rgba(24, 19, 15, 0.98), rgba(12, 10, 8, 0.98))',
                            border: '1px solid rgba(232, 199, 111, 0.26)',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              padding: '0.9rem 1rem',
                              borderBottom: '1px solid rgba(232, 199, 111, 0.16)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.75rem',
                            }}
                          >
                            <div>
                              <div style={{ color: 'var(--color-cream)', fontWeight: 700, fontSize: '0.95rem' }}>
                                {t('contact.form.caftan')}
                              </div>
                              <div style={{ color: 'rgba(232, 199, 111, 0.72)', fontSize: '0.76rem', marginTop: '0.18rem' }}>
                                {i18n.language === 'ar' ? 'اختاري القفطان من الصور' : 'Choose the caftan by image'}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsCaftanPickerOpen(false)}
                              style={{
                                border: '1px solid rgba(232, 199, 111, 0.25)',
                                background: 'rgba(232, 199, 111, 0.08)',
                                color: 'var(--color-gold)',
                                borderRadius: '10px',
                                width: '34px',
                                height: '34px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                flexShrink: 0,
                              }}
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div style={{ padding: '0.85rem 1rem 0.75rem' }}>
                            <div style={{ position: 'relative' }}>
                              <Search
                                size={16}
                                color="rgba(232, 199, 111, 0.8)"
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  left: i18n.language === 'ar' ? 'auto' : '0.65rem',
                                  right: i18n.language === 'ar' ? '0.65rem' : 'auto',
                                }}
                              />
                              <input
                                type="text"
                                value={caftanSearchQuery}
                                onChange={(e) => setCaftanSearchQuery(e.target.value)}
                                placeholder={t('contact.form.caftanPlaceholder')}
                                style={{
                                  width: '100%',
                                  padding: i18n.language === 'ar' ? '0.7rem 2.2rem 0.7rem 0.8rem' : '0.7rem 0.8rem 0.7rem 2.2rem',
                                  background: 'rgba(139, 115, 85, 0.08)',
                                  border: '1px solid rgba(212, 175, 55, 0.2)',
                                  borderRadius: '10px',
                                  color: 'var(--color-cream)',
                                  fontSize: '0.9rem',
                                }}
                              />
                            </div>
                          </div>

                          <div style={{ padding: '0 1rem 1rem', overflowY: 'auto' }}>
                            {filteredCaftanOptions.length === 0 ? (
                              <div
                                style={{
                                  borderRadius: '12px',
                                  border: '1px dashed rgba(232, 199, 111, 0.25)',
                                  padding: '1.1rem',
                                  color: 'rgba(232, 199, 111, 0.75)',
                                  textAlign: 'center',
                                  fontSize: '0.82rem',
                                }}
                              >
                                {t('contact.form.caftanEmpty')}
                              </div>
                            ) : (
                              <div
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                                  gap: '0.65rem',
                                }}
                              >
                                {filteredCaftanOptions.map((caftan) => {
                                  const isSelected = caftan.id === formData.inquiryProductId;
                                  return (
                                    <button
                                      key={caftan.id}
                                      type="button"
                                      onClick={() => handleCaftanSelect(caftan.id)}
                                      style={{
                                        borderRadius: '12px',
                                        border: isSelected
                                          ? '1px solid rgba(232, 199, 111, 0.55)'
                                          : '1px solid rgba(232, 199, 111, 0.2)',
                                        background: isSelected
                                          ? 'rgba(232, 199, 111, 0.14)'
                                          : 'rgba(26, 20, 16, 0.7)',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        textAlign: i18n.language === 'ar' ? 'right' : 'left',
                                        padding: 0,
                                      }}
                                    >
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={caftan.image}
                                        alt={caftan.display}
                                        style={{
                                          width: '100%',
                                          height: '110px',
                                          objectFit: 'cover',
                                          display: 'block',
                                        }}
                                      />
                                      <div style={{ padding: '0.55rem 0.6rem' }}>
                                        <div
                                          style={{
                                            color: 'var(--color-cream)',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                          }}
                                        >
                                          {caftan.nameAr || caftan.nameEn || caftan.display}
                                        </div>
                                        <div
                                          style={{
                                            color: 'rgba(232, 199, 111, 0.7)',
                                            fontSize: '0.73rem',
                                            marginTop: '0.15rem',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                          }}
                                        >
                                          {caftan.nameEn || caftan.nameAr || caftan.id}
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 0.85fr) minmax(0, 1.35fr)', gap: '0.7rem' }}>
                  <div>
                    <label style={{ display: 'block', color: 'var(--color-cream)', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {t('contact.form.countrySearch')}
                    </label>
                    <input
                      type="text"
                      list="contact-country-options"
                      value={countrySearchValue}
                      onChange={handleCountrySearchChange}
                      onBlur={handleCountrySearchBlur}
                      required
                      placeholder={t('contact.form.countrySearchPlaceholder')}
                      style={{
                        width: '100%',
                        padding: '0.78rem 0.9rem',
                        background: 'rgba(139, 115, 85, 0.08)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        borderRadius: '4px',
                        color: 'var(--color-cream)',
                        fontSize: '0.95rem',
                      }}
                    />
                    <datalist id="contact-country-options">
                      {countryOptions.map((country) => (
                        <option key={country.iso2} value={country.display} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--color-cream)', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {t('contact.form.phoneNumber')}
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handlePhoneNumberChange}
                      required
                      minLength={phoneMinLength}
                      maxLength={phoneMaxLength}
                      pattern={phonePattern}
                      inputMode="numeric"
                      autoComplete="tel-national"
                      dir="ltr"
                      placeholder={t('contact.form.phoneNumberPlaceholder')}
                      style={{
                        width: '100%',
                        padding: '0.78rem 0.9rem',
                        background: 'rgba(139, 115, 85, 0.08)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        borderRadius: '4px',
                        color: 'var(--color-cream)',
                        fontSize: '0.95rem',
                      }}
                    />
                    <div style={{ marginTop: '0.45rem', color: 'rgba(232, 199, 111, 0.7)', fontSize: '0.78rem' }}>
                      {phoneLengthHint}
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--color-cream)', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '0.78rem 0.9rem',
                      background: 'rgba(139, 115, 85, 0.08)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '4px',
                      color: 'var(--color-cream)',
                      fontSize: '0.95rem',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '1rem', fontSize: '0.95rem' }}
                >
                  {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
                </button>

                {submitSuccess && (
                  <div
                    role="status"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(34, 197, 94, 0.35)',
                      background: 'rgba(34, 197, 94, 0.12)',
                      color: '#86efac',
                      padding: '0.85rem 1rem',
                      fontWeight: 700,
                      lineHeight: 1.7,
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>{submitMessage || successMessage}</span>
                  </div>
                )}
                {submitError && (
                  <div
                    role="alert"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      background: 'rgba(239, 68, 68, 0.12)',
                      color: '#fca5a5',
                      padding: '0.85rem 1rem',
                      fontWeight: 700,
                      lineHeight: 1.7,
                    }}
                  >
                    <AlertCircle size={18} />
                    <span>{submitError}</span>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
