'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Instagram, MapPin, Send, Sparkles } from 'lucide-react';

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
          <img src="/images/about.jpg" alt="Contact" style={{
            filter: 'brightness(0.6) contrast(1.1)',
          }} />
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
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
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
