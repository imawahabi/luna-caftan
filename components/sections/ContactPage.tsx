'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Instagram, MapPin } from 'lucide-react';

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero" style={{ minHeight: '50vh' }}>
        <div className="hero-bg">
          <img src="/images/about.jpg" alt="Contact" />
          <div className="hero-overlay"></div>
        </div>

        <div className="container">
          <div className="hero-content" style={{ maxWidth: '600px' }}>
            <span className="hero-badge">{i18n.language === 'ar' ? 'تواصلي معنا' : 'Contact Us'}</span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
              {t('contact.title')}
            </h1>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            {/* Contact Info */}
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--color-cream)', marginBottom: '2rem' }}>
                {i18n.language === 'ar' ? 'تواصلي معنا' : 'Get in Touch'}
              </h2>
              <p style={{ color: 'var(--color-light-gold)', marginBottom: '2.5rem', lineHeight: '1.8' }}>
                {i18n.language === 'ar' 
                  ? 'نسعد بالتواصل معكم عبر أي من القنوات التالية'
                  : 'We are happy to connect with you through any of the following channels'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <a
                  href="https://wa.me/96569059697"
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
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <p style={{ color: 'var(--color-cream)', fontWeight: '600', marginBottom: '0.3rem' }}>
                      {i18n.language === 'ar' ? 'تواصلي معنا' : 'Contact Us'}
                    </p>
                    <p style={{ color: 'var(--color-light-gold)', fontSize: '0.9rem' }}>
                      +965 69059697
                    </p>
                  </div>
                </a>

                <a
                  href="https://instagram.com/luna.caftan.kw"
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
                      @luna.caftan.kw
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
            </div>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--color-cream)', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {i18n.language === 'ar' ? 'الاسم' : 'Name'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(139, 115, 85, 0.08)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '4px',
                      color: 'var(--color-cream)',
                      fontSize: '1rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--color-cream)', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {i18n.language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(139, 115, 85, 0.08)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '4px',
                      color: 'var(--color-cream)',
                      fontSize: '1rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'var(--color-cream)', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {i18n.language === 'ar' ? 'الرسالة' : 'Message'}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(139, 115, 85, 0.08)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '4px',
                      color: 'var(--color-cream)',
                      fontSize: '1rem',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '1.2rem', fontSize: '1rem' }}
                >
                  {isSubmitting 
                    ? (i18n.language === 'ar' ? 'جاري الإرسال...' : 'Sending...') 
                    : (i18n.language === 'ar' ? 'إرسال الرسالة' : 'Send Message')}
                </button>

                {submitSuccess && (
                  <p style={{ color: 'var(--color-gold)', textAlign: 'center', fontWeight: '600' }}>
                    {i18n.language === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent successfully!'}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
