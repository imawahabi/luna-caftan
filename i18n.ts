import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      nav: {
        home: 'الرئيسية',
        collection: 'القفاطين',
        about: 'عن لونا',
        contact: 'تواصلي معنا',
      },
      sale: {
        announcement: 'تخفيضات خاصة — خصم 20% لفترة محدودة 🇲🇦🇰🇼',
        badge: 'خصم 20%',
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
        form: {
          name: 'الاسم',
          email: 'البريد الإلكتروني',
          inquiryType: 'نوع الاستفسار',
          inquiryTypeGeneral: 'رسالة عامة',
          inquiryTypeCaftan: 'استفسار عن قفطان محدد',
          caftan: 'اختيار القفطان',
          caftanPlaceholder: 'ابحثي عن القفطان بالاسم',
          caftanLoading: 'جاري تحميل القفاطين...',
          caftanHint: 'اختاري القفطان الذي تريدين الاستفسار عنه',
          caftanEmpty: 'لا يوجد قفاطين متاحة حالياً للاختيار',
          countrySearch: 'الدولة / كود الدولة',
          countrySearchPlaceholder: 'ابحثي عن الدولة أو الكود (مثل الكويت أو +965)',
          phoneCountryCode: 'كود الدولة',
          phoneNumber: 'رقم الهاتف',
          phoneCountryCodePlaceholder: '+965',
          phoneNumberPlaceholder: '5XXXXXXXX',
          phoneNumberLengthHintExact: 'رقم الهاتف يجب أن يكون {{count}} أرقام',
          phoneNumberLengthHintRange: 'رقم الهاتف يجب أن يكون بين {{min}} و{{max}} أرقام',
          message: 'الرسالة',
          send: 'إرسال الرسالة',
          sending: 'جاري الإرسال...',
          success: 'تم إرسال رسالتك بنجاح وسوف يتم التواصل معك في أقرب وقت',
          error: 'تعذر إرسال الرسالة، يرجى المحاولة مرة أخرى',
          serviceUnavailable: 'الخدمة غير متاحة مؤقتًا بسبب مشكلة اتصال. يرجى المحاولة بعد قليل.',
          validationRequired: 'الاسم والبريد الإلكتروني ورقم الهاتف والرسالة مطلوبة',
          nameTooLong: 'الاسم طويل جدًا',
          emailInvalid: 'البريد الإلكتروني غير صالح',
          phoneCountryCodeRequired: 'كود الدولة مطلوب',
          phoneCountryCodeInvalid: 'كود الدولة غير صالح',
          phoneNumberRequired: 'رقم الهاتف مطلوب',
          phoneNumberInvalid: 'رقم الهاتف غير صالح',
          phoneNumberLengthByCountryInvalid: 'رقم الهاتف غير متوافق مع الدولة المختارة',
          inquiryTypeInvalid: 'نوع الاستفسار غير صالح',
          caftanRequired: 'يرجى اختيار القفطان المراد الاستفسار عنه',
          caftanInvalid: 'القفطان المختار غير متاح، يرجى اختيار قفطان آخر',
          messageTooLong: 'الرسالة طويلة جدًا',
        },
      },
    },
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        collection: 'Collection',
        about: 'About Luna',
        contact: 'Contact',
      },
      sale: {
        announcement: 'Private Sale — 20% off, limited time',
        badge: '-20%',
      },
      home: {
        hero: {
          title: 'Luna Caftan',
          subtitle: 'Luxury Moroccan Caftans',
        },
      },
      about: {
        title: 'About Luna',
        description: 'Luna Boutique specializes in bringing authentic Moroccan caftan heritage from the historic city of Fes to Kuwait. We carefully select handcrafted pieces that blend Moroccan authenticity with contemporary taste, offering you caftans that reflect the beauty of tradition and suit your special occasions',
      },
      collection: {
        title: 'Collection',
        subtitle: 'Luxury Caftans',
      },
      contact: {
        title: 'Contact Us',
        form: {
          name: 'Name',
          email: 'Email',
          inquiryType: 'Inquiry Type',
          inquiryTypeGeneral: 'General Message',
          inquiryTypeCaftan: 'Specific Caftan Inquiry',
          caftan: 'Select Caftan',
          caftanPlaceholder: 'Search caftan by name',
          caftanLoading: 'Loading caftans...',
          caftanHint: 'Choose the caftan you are asking about',
          caftanEmpty: 'No caftans are available to select right now',
          countrySearch: 'Country / Code',
          countrySearchPlaceholder: 'Search country or code (e.g. Kuwait or +965)',
          phoneCountryCode: 'Country Code',
          phoneNumber: 'Phone Number',
          phoneCountryCodePlaceholder: '+965',
          phoneNumberPlaceholder: '5XXXXXXXX',
          phoneNumberLengthHintExact: 'Phone number must be exactly {{count}} digits.',
          phoneNumberLengthHintRange: 'Phone number must be between {{min}} and {{max}} digits.',
          message: 'Message',
          send: 'Send Message',
          sending: 'Sending...',
          success: 'Your message has been sent successfully. We will contact you as soon as possible.',
          error: 'Unable to send your message, please try again.',
          serviceUnavailable: 'Service is temporarily unavailable due to a connection issue. Please try again shortly.',
          validationRequired: 'Name, email, phone number, and message are required.',
          nameTooLong: 'The name is too long.',
          emailInvalid: 'The email address is invalid.',
          phoneCountryCodeRequired: 'Country code is required.',
          phoneCountryCodeInvalid: 'Country code is invalid.',
          phoneNumberRequired: 'Phone number is required.',
          phoneNumberInvalid: 'Phone number is invalid.',
          phoneNumberLengthByCountryInvalid: 'Phone number does not match the selected country.',
          inquiryTypeInvalid: 'Inquiry type is invalid.',
          caftanRequired: 'Please select the caftan you are asking about.',
          caftanInvalid: 'Selected caftan is not available. Please pick another one.',
          messageTooLong: 'The message is too long.',
        },
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
