'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Instagram,
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

  const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
    </svg>
  );

  const navLinks = [
    { key: 'home', label: t('nav.home'), icon: Home, action: () => navigateTo('home') },
    { key: 'about', label: t('nav.about'), icon: Info, action: () => navigateTo('about') },
    { key: 'collection', label: t('nav.collection'), icon: Sparkles, action: () => navigateTo('collection') },
    { key: 'contact', label: t('nav.contact'), icon: WhatsAppIcon, action: () => navigateTo('contact') },
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
                <WhatsAppIcon size={20} />
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
