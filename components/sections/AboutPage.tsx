'use client';

import { useTranslation } from 'react-i18next';
import { Scissors, Gem, Crown } from 'lucide-react';

export default function AboutPage() {
  const { t, i18n } = useTranslation();

  const values = [
    {
      icon: Scissors,
      title: i18n.language === 'ar' ? 'حرفية احترافية' : 'Artisanal Mastery',
      description: i18n.language === 'ar' ? 'قفاطين مصنوعة يدوياً في فاس بدقة تعكس الخبرة' : 'Handcrafted in Fes with the meticulous expertise of Om Rakan',
    },
    {
      icon: Gem,
      title: i18n.language === 'ar' ? 'جودة لا تضاهى' : 'Unrivaled Quality',
      description: i18n.language === 'ar' ? 'مواد منتقاة بعناية لتقديم رفاهية تدوم' : 'Carefully selected materials to deliver lasting luxury',
    },
    {
      icon: Crown,
      title: i18n.language === 'ar' ? 'روح فاس الأصيلة' : 'Spirit of Fes',
      description: i18n.language === 'ar' ? 'تصاميم تحمل تراث المغرب وتلائم أناقة المرأة الكويتية' : 'Designs that honor Moroccan heritage while embracing Kuwaiti elegance',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="hero" style={{ minHeight: '60vh' }}>
        <div className="hero-bg">
          <img src="/images/about.jpg" alt="About Luna Caftan" />
          <div className="hero-overlay"></div>
        </div>

        <div className="container">
          <div className="hero-content" style={{ maxWidth: '600px' }}>
            <span className="hero-badge">{i18n.language === 'ar' ? 'تعرف على لونا' : 'Know Luna'}</span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
              {t('about.title')}
            </h1>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '1.2rem', lineHeight: '2', color: 'var(--color-light-gold)', marginBottom: '2rem' }}>
              {i18n.language === 'ar'
                ? 'أُطلق بوتيك لونا أونلاين لأول مرة في أكتوبر 2025 ليجلب القفطان المغربي إلى الكويت برؤية نعيمة لبرينيه "أم راكان"، حيث يجتمع التراث الفاسي مع لمسة عصرية فاخرة.'
                : 'Luna Boutique debuted online in October 2025, bringing Moroccan caftans to Kuwait through the vision of Naima Labrinia “Om Rakan”, blending Fassi heritage with modern luxury.'}
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', color: 'var(--color-light-gold)' }}>
              {i18n.language === 'ar'
                ? 'من العناية بالخامات إلى اللمسات الأخيرة، تتابع أم راكان كل خطوة لتضمن لك تصميماً أنيقاً، مريحاً، ومصنوعاً خصيصاً لكِ.'
                : 'From fabric curation to the finishing touches, Om Rakan supervises every step to ensure each caftan feels elegant, comfortable, and made just for you.'}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1410 100%)', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              {i18n.language === 'ar' ? 'قيمنا' : 'Our Values'}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index}
                  className="value-card"
                  style={{
                    padding: '3rem 2.5rem',
                    background: 'linear-gradient(145deg, rgba(26, 20, 16, 0.4), rgba(10, 10, 10, 0.6))',
                    border: '2px solid rgba(232, 199, 111, 0.2)',
                    borderRadius: '20px',
                    textAlign: 'center',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.5)';
                    e.currentTarget.style.boxShadow = '0 15px 50px rgba(232, 199, 111, 0.3), 0 0 60px rgba(232, 199, 111, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.2)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
                  }}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 2rem',
                    background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.2), rgba(212, 175, 55, 0.1))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(232, 199, 111, 0.2), inset 0 0 20px rgba(232, 199, 111, 0.1)',
                    border: '2px solid rgba(232, 199, 111, 0.3)',
                  }}>
                    <Icon size={36} color="#E8C76F" strokeWidth={1.5} />
                  </div>
                  <h3 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '600', 
                    color: 'var(--color-cream)', 
                    marginBottom: '1.2rem',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                  }}>
                    {value.title}
                  </h3>
                  <p style={{ 
                    color: 'var(--color-light-gold)', 
                    lineHeight: '1.8',
                    fontSize: '1.05rem',
                  }}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
