import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      nav: {
        home: 'الرئيسية',
        about: 'عن لونا',
        collection: 'القفاطين',
        contact: 'تواصلي معنا',
      },
      home: {
        hero: {
          title: 'Luna Caftan',
          subtitle: 'قفاطين مغربية فاخرة',
        },
      },
      about: {
        title: 'عن لونا',
        description: 'أطلقنا بوتيك لونا أونلاين في أكتوبر 2025 لنقدّم قفاطين مغربية فاخرة من فاس إلى الكويت، بإشراف نعيمة لبرينيه (أم راكان) التي تهتم بأدق التفاصيل لجودة لا مثيل لها',
      },
      collection: {
        title: 'القفاطين',
        subtitle: 'تشكيلة فاخرة',
      },
      contact: {
        title: 'تواصلي معنا',
      },
    },
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'About',
        collection: 'Collection',
        contact: 'Contact',
      },
      home: {
        hero: {
          title: 'Luna Caftan',
          subtitle: 'Luxury Moroccan Caftans',
        },
      },
      about: {
        title: 'About Us',
        description: 'Luna Boutique launched online in October 2025 to deliver luxurious Moroccan caftans from Fes to Kuwait under the meticulous eye of Naima Labrinia (Om Rakan)',
      },
      collection: {
        title: 'Collection',
        subtitle: 'Luxury Caftans',
      },
      contact: {
        title: 'Contact Us',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
