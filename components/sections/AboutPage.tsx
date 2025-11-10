'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Scissors, Gem, Crown, Sparkles } from 'lucide-react';
import React from 'react';
import { useSettings } from '@/lib/settings-context';

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    <div style={{
      background: 'linear-gradient(180deg, #0a0808 0%, #1a1410 50%, #0a0808 100%)',
      minHeight: '100vh',
    }}>
      {/* Hero with Enhanced Background */}
      <section className="hero" style={{ 
        minHeight: '70vh',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated Background Gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(232, 199, 111, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(212, 175, 55, 0.06) 0%, transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite',
        }} />
        
        <div className="hero-bg">
          <img src="/images/about.jpg" alt="About Luna Caftan" style={{
            filter: 'brightness(0.7) contrast(1.1)',
          }} />
          <div className="hero-overlay" style={{
            background: 'linear-gradient(135deg, rgba(10, 8, 8, 0.85) 0%, rgba(26, 20, 16, 0.75) 50%, rgba(10, 8, 8, 0.9) 100%)',
          }}></div>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
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
              <Sparkles size={16} color="#e8c76f" />
              <span style={{ color: '#e8c76f', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '0.5px' }}>
                {i18n.language === 'ar' ? 'تعرفي على لونا' : 'Know Luna'}
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
                lineHeight: '1.2',
                fontWeight: 'bold',
              }}
            >
              {t('about.title')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                fontSize: '1.15rem',
                color: 'rgba(232, 199, 111, 0.8)',
                lineHeight: '1.8',
                maxWidth: '600px',
              }}
            >
              {i18n.language === 'ar' 
                ? 'رحلة من التراث المغربي إلى الأناقة الكويتية'
                : 'A journey from Moroccan heritage to Kuwaiti elegance'}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Story Section with Enhanced Design & Image */}
      <section className="section" style={{
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(26, 20, 16, 0.3) 0%, rgba(10, 8, 8, 0.5) 100%)',
        padding: '6rem 0',
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(232, 199, 111, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ 
              maxWidth: '1200px', 
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? '3rem' : '4rem',
              alignItems: 'center',
            }}
          >
            {/* Text Content */}
            <div>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ 
                  fontSize: '1.3rem', 
                  lineHeight: '2.2', 
                  color: '#f5e6c8', 
                  marginBottom: '2rem',
                  fontWeight: '400',
                }}
              >
                {i18n.language === 'ar'
                  ? 'في قلب كل قصة عظيمة، توجد رؤية تحلم بجسر يربط بين عالمين. هكذا وُلدت لونا كافتان - حلم نعيمة لبرينيه "أم راكان" بأن تنقل عبق التراث المغربي من قلب فاس العتيقة إلى أرض الكويت، بلد الأناقة والذوق الرفيع.'
                  : 'At the heart of every great story lies a vision dreaming of a bridge between two worlds. Thus was born Luna Caftan - the dream of Naima Labrinia "Om Rakan" to transport the essence of Moroccan heritage from ancient Fes to Kuwait, the land of elegance and refined taste.'}
              </motion.p>
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{ 
                  fontSize: '1.2rem', 
                  lineHeight: '2', 
                  color: '#e8c76f', 
                  marginBottom: '2rem',
                  fontWeight: '400',
                }}
              >
                {i18n.language === 'ar'
                  ? 'لم تكن لونا مجرد بوتيك للقفاطين، بل كانت رسالة حب وثقافة - رسالة تقول إن الجمال لا حدود له، وأن التراث عندما يلتقي بالحداثة يولد تحفة فنية خالدة. كل قفطان يحمل قصة فاس، أزقة حرفتها، وأيادي صناعها.'
                  : 'Luna was never just a caftan boutique, but a message of love and culture - a message that beauty knows no borders, and that when heritage meets modernity, an eternal masterpiece is born. Each caftan carries the story of Fes, its crafted alleys, and the hands of its artisans.'}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{
                  padding: '2rem',
                  background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.08), rgba(212, 175, 55, 0.05))',
                  borderRadius: '16px',
                  border: '1px solid rgba(232, 199, 111, 0.2)',
                  marginBottom: '2rem',
                }}
              >
                <p style={{ 
                  color: '#f5e6c8', 
                  lineHeight: '2',
                  fontSize: '1.15rem',
                  fontWeight: '500',
                }}>
                  {i18n.language === 'ar'
                    ? 'نعيمة لبرينيه "أم راكان" - الروح التي تضخ الحياة في كل تفصيلة. من اختيار الخامات النادرة إلى الإشراف على كل غرزة، تضع خبرتها وخبرتها الفاسية لتضمن أن كل قطعة ليست مجرد ملابس، بل إرث يرتدي.'
                    : 'Naima Labrinia "Om Rakan" - the soul that breathes life into every detail. From selecting rare fabrics to supervising every stitch, she puts her Fassi expertise and experience to ensure that each piece is not just clothing, but wearable heritage.'}
                </p>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{ 
                  fontSize: '1.15rem', 
                  lineHeight: '2', 
                  color: '#e8c76f', 
                  fontWeight: '400',
                }}
              >
                {i18n.language === 'ar'
                  ? 'في لونا، لا نبيع القفاطين فقط - نشارككم جزءاً من روح المغرب، ونحكي قصة الأناقة التي تتحدث لغة واحدة في كل أنحاء العالم: لغة الجمال الأصيل والذوق الرفيع.'
                  : 'At Luna, we don\'t just sell caftans - we share with you a piece of Morocco\'s soul, and tell a story of elegance that speaks one language across the world: the language of authentic beauty and refined taste.'}
              </motion.p>
            </div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: isMobile ? 0 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 30px 90px rgba(0, 0, 0, 0.6)',
                background: 'linear-gradient(135deg, rgba(26, 20, 16, 0.3), rgba(10, 8, 8, 0.5))',
                border: '2px solid rgba(232, 199, 111, 0.2)',
                aspectRatio: isMobile ? '1/1' : '4/5',
                order: isMobile ? -1 : 1,
              }}
            >
              {/* Decorative Glow */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(232, 199, 111, 0.1), transparent 60%)',
                filter: 'blur(60px)',
                pointerEvents: 'none',
              }} />
              
              <img 
                src={settings.about_background_url || '/images/hero.jpg'} 
                alt="Luna Caftan Story"
                style={{
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  opacity: 0.9,
                  transition: 'transform 0.6s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
              
              {/* Overlay Gradient */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(10, 8, 8, 0.2) 0%, transparent 50%, rgba(26, 20, 16, 0.3) 100%)',
                pointerEvents: 'none',
              }} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="section" style={{
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(10, 8, 8, 0.6) 0%, rgba(26, 20, 16, 0.4) 100%)',
        padding: '5rem 0',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ 
              maxWidth: '1000px', 
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ 
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                background: 'linear-gradient(135deg, #f5e6c8, #e8c76f)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '3rem',
              }}
            >
              {i18n.language === 'ar' ? 'رؤيتنا ورسالتنا' : 'Our Vision & Mission'}
            </motion.h2>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
              gap: '3rem' 
            }}>
              {/* Vision */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{
                  padding: '2.5rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(232, 199, 111, 0.2)',
                  textAlign: 'center',
                }}
              >
                <h3 style={{
                  fontSize: '1.8rem',
                  color: '#f5e6c8',
                  marginBottom: '1.5rem',
                  fontWeight: '600',
                }}>
                  {i18n.language === 'ar' ? 'رؤيتنا' : 'Our Vision'}
                </h3>
                <p style={{
                  color: 'rgba(232, 199, 111, 0.9)',
                  lineHeight: '1.9',
                  fontSize: '1.1rem',
                }}>
                  {i18n.language === 'ar'
                    ? 'أن نكون الجسر الثقافي الذي يربط بين تراث المغرب العريق وأناقة الكويت العصرية، مانحين كل امرأة فرصة للتعبير عن هويتها بقطعة تجمع بين الأصالة والحداثة.'
                    : 'To be the cultural bridge connecting Morocco\'s rich heritage with Kuwait\'s modern elegance, giving every woman the opportunity to express her identity through pieces that unite authenticity and modernity.'}
                </p>
              </motion.div>

              {/* Mission */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{
                  padding: '2.5rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(232, 199, 111, 0.2)',
                  textAlign: 'center',
                }}
              >
                <h3 style={{
                  fontSize: '1.8rem',
                  color: '#f5e6c8',
                  marginBottom: '1.5rem',
                  fontWeight: '600',
                }}>
                  {i18n.language === 'ar' ? 'رسالتنا' : 'Our Mission'}
                </h3>
                <p style={{
                  color: 'rgba(232, 199, 111, 0.9)',
                  lineHeight: '1.9',
                  fontSize: '1.1rem',
                }}>
                  {i18n.language === 'ar'
                    ? 'تقديم قفاطين فاخرة تجسد قصص الحرفيين المغاربة، مع ضمان أعلى معايير الجودة والراحة، وخلق تجربة تسوق فريدة تحتفل بالجمال والثقافة.'
                    : 'To offer luxury caftans that embody the stories of Moroccan artisans, ensuring the highest standards of quality and comfort, and creating a unique shopping experience that celebrates beauty and culture.'}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section with Enhanced Cards */}
      <section className="section" style={{ 
        background: 'linear-gradient(180deg, rgba(10, 8, 8, 0.8) 0%, rgba(26, 20, 16, 0.6) 50%, rgba(10, 8, 8, 0.9) 100%)', 
        paddingTop: '6rem', 
        paddingBottom: '6rem',
        position: 'relative',
      }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header" 
            style={{ marginBottom: '4rem', textAlign: 'center' }}
          >
            <h2 style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              background: 'linear-gradient(135deg, #f5e6c8, #e8c76f)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '1rem',
            }}>
              {i18n.language === 'ar' ? 'قيمنا' : 'Our Values'}
            </h2>
            <p style={{ color: 'rgba(232, 199, 111, 0.7)', fontSize: '1.1rem' }}>
              {i18n.language === 'ar' ? 'ما يميز لونا كافتان' : 'What makes Luna Caftan special'}
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: isMobile ? '2rem' : '2.5rem' }}>
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="value-card"
                  style={{
                    padding: '3.5rem 2.5rem',
                    background: 'linear-gradient(145deg, rgba(0, 0, 0, 0.5), rgba(26, 20, 16, 0.4))',
                    border: '1.5px solid rgba(232, 199, 111, 0.25)',
                    borderRadius: '24px',
                    textAlign: 'center',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(232, 199, 111, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.6)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(232, 199, 111, 0.3), 0 0 80px rgba(232, 199, 111, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.25)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(232, 199, 111, 0.1)';
                  }}
                >
                  {/* Glow Effect on Hover */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, rgba(232, 199, 111, 0.1), transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.4s',
                    pointerEvents: 'none',
                  }} className="card-glow" />
                  
                  <div style={{
                    width: '90px',
                    height: '90px',
                    margin: '0 auto 2.5rem',
                    background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.15), rgba(212, 175, 55, 0.08))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(232, 199, 111, 0.2), inset 0 0 30px rgba(232, 199, 111, 0.08)',
                    border: '2px solid rgba(232, 199, 111, 0.3)',
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    <Icon size={40} color="#E8C76F" strokeWidth={1.8} />
                  </div>
                  <h3 style={{ 
                    fontSize: '1.6rem', 
                    fontWeight: '700', 
                    background: 'linear-gradient(135deg, #f5e6c8, #e8c76f)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '1.5rem',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                  }}>
                    {value.title}
                  </h3>
                  <p style={{ 
                    color: 'rgba(232, 199, 111, 0.85)', 
                    lineHeight: '1.9',
                    fontSize: '1.05rem',
                  }}>
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
