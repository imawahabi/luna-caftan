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
        description: 'بوتيك لونا متخصص في نقل تراث القفطان المغربي الأصيل من مدينة فاس العريقة إلى الكويت. نحرص على اختيار قطع مصنوعة يدوياً بعناية، تجمع بين الأصالة المغربية والذوق العصري، لنقدم لكِ قفاطين تعكس جمال التراث وتناسب مناسباتك الخاصة',
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
        description: 'Luna Boutique specializes in bringing authentic Moroccan caftan heritage from the historic city of Fes to Kuwait. We carefully select handcrafted pieces that blend Moroccan authenticity with contemporary taste, offering you caftans that reflect the beauty of tradition and suit your special occasions',
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
