'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Instagram,
  Send,
  Home,
  Info,
  Sparkles,
  Phone,
  MapPin,
  Mail,
} from 'lucide-react';
import { PageType } from '@/app/page';
import { useSettings } from '@/lib/settings-context';

interface FooterProps {
  navigateTo: (page: PageType) => void;
}

export default function Footer({ navigateTo }: FooterProps) {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();

  const whatsappNumber = settings.whatsapp_number || '+965 69059697';
  const whatsappDigits = useMemo(() => whatsappNumber.replace(/[^\d+]/g, ''), [whatsappNumber]);
  const emailAddress = settings.email || 'contact@lunacaftan.com';
  const instagramUrl = settings.instagram_url || 'https://instagram.com/luna.caftan.kw';
  const siteDescriptionAr = settings.site_description_ar || 'قفاطين مغربية فاخرة مصنوعة يدوياً من فاس إلى الكويت';
  const siteDescriptionEn = settings.site_description_en || 'Luxurious handcrafted Moroccan caftans from Fes to Kuwait';

  const navLinks = [
    { key: 'home', label: t('nav.home'), icon: Home, action: () => navigateTo('home') },
    { key: 'about', label: t('nav.about'), icon: Info, action: () => navigateTo('about') },
    { key: 'collection', label: t('nav.collection'), icon: Sparkles, action: () => navigateTo('collection') },
    { key: 'contact', label: t('nav.contact'), icon: Send, action: () => navigateTo('contact') },
  ];

  const contactItems = [
    {
      key: 'location',
      icon: MapPin,
      text: i18n.language === 'ar' ? 'الكويت' : 'Kuwait',
    },
    {
      key: 'phone',
      icon: Phone,
      text: whatsappNumber,
      href: `https://wa.me/${whatsappDigits.replace(/^\+/, '')}`,
      aria: 'WhatsApp',
    },
    {
      key: 'email',
      icon: Mail,
      text: emailAddress,
      href: `mailto:${emailAddress}`,
      aria: 'Email',
    },
  ];

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <img 
              src="/logo-white.png" 
              alt="Luna Caftan" 
              className="logo-white logo-footer"
            />
            <p>
              {i18n.language === 'ar' ? siteDescriptionAr : siteDescriptionEn}
            </p>
            <div className="social-links">
              <a
                href={`https://wa.me/${whatsappDigits.replace(/^\+/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="WhatsApp"
              >
                <Send size={20} />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <span className="footer-title">{i18n.language === 'ar' ? 'الروابط' : 'Links'}</span>
            {navLinks.map(({ key, label, icon: Icon, action }) => (
              <button key={key} onClick={action}>
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="footer-contact">
            <span className="footer-title">{t('contact.title')}</span>
            {contactItems.map(({ key, icon: Icon, text, href, aria }) => {
              if (href) {
                return (
                  <a
                    key={key}
                    href={href}
                    aria-label={aria}
                    target={key === 'phone' ? '_blank' : undefined}
                    rel={key === 'phone' ? 'noopener noreferrer' : undefined}
                  >
                    <Icon size={18} />
                    <span>{text}</span>
                  </a>
                );
              }

              return (
                <p key={key}>
                  <Icon size={18} />
                  <span>{text}</span>
                </p>
              );
            })}
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Luna Caftan · {i18n.language === 'ar' ? 'من فاس إلى الكويت' : 'From Fes to Kuwait'}</p>
        </div>
      </div>
    </footer>
  );
}
