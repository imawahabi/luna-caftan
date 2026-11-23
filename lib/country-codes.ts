export interface CountryPhoneOption {
  iso2: string;
  nameAr: string;
  nameEn: string;
  dialCode: string;
  phoneNumberMinLength: number;
  phoneNumberMaxLength: number;
}

export const COUNTRY_PHONE_OPTIONS: CountryPhoneOption[] = [
  // Gulf countries
  { iso2: 'KW', nameAr: 'الكويت', nameEn: 'Kuwait', dialCode: '+965', phoneNumberMinLength: 8, phoneNumberMaxLength: 8 },
  { iso2: 'SA', nameAr: 'السعودية', nameEn: 'Saudi Arabia', dialCode: '+966', phoneNumberMinLength: 9, phoneNumberMaxLength: 9 },
  { iso2: 'AE', nameAr: 'الإمارات', nameEn: 'United Arab Emirates', dialCode: '+971', phoneNumberMinLength: 9, phoneNumberMaxLength: 9 },
  { iso2: 'QA', nameAr: 'قطر', nameEn: 'Qatar', dialCode: '+974', phoneNumberMinLength: 8, phoneNumberMaxLength: 8 },
  { iso2: 'BH', nameAr: 'البحرين', nameEn: 'Bahrain', dialCode: '+973', phoneNumberMinLength: 8, phoneNumberMaxLength: 8 },
  { iso2: 'OM', nameAr: 'عُمان', nameEn: 'Oman', dialCode: '+968', phoneNumberMinLength: 8, phoneNumberMaxLength: 8 },

  // Arab countries
  { iso2: 'EG', nameAr: 'مصر', nameEn: 'Egypt', dialCode: '+20', phoneNumberMinLength: 10, phoneNumberMaxLength: 10 },
  { iso2: 'MA', nameAr: 'المغرب', nameEn: 'Morocco', dialCode: '+212', phoneNumberMinLength: 9, phoneNumberMaxLength: 9 },
  { iso2: 'DZ', nameAr: 'الجزائر', nameEn: 'Algeria', dialCode: '+213', phoneNumberMinLength: 9, phoneNumberMaxLength: 9 },
  { iso2: 'TN', nameAr: 'تونس', nameEn: 'Tunisia', dialCode: '+216', phoneNumberMinLength: 8, phoneNumberMaxLength: 8 },
  { iso2: 'LY', nameAr: 'ليبيا', nameEn: 'Libya', dialCode: '+218', phoneNumberMinLength: 9, phoneNumberMaxLength: 9 },
  { iso2: 'SD', nameAr: 'السودان', nameEn: 'Sudan', dialCode: '+249', phoneNumberMinLength: 9, phoneNumberMaxLength: 9 },
  { iso2: 'YE', nameAr: 'اليمن', nameEn: 'Yemen', dialCode: '+967', phoneNumberMinLength: 9, phoneNumberMaxLength: 9 },
  { iso2: 'IQ', nameAr: 'العراق', nameEn: 'Iraq', dialCode: '+964', phoneNumberMinLength: 10, phoneNumberMaxLength: 10 },
  { iso2: 'SY', nameAr: 'سوريا', nameEn: 'Syria', dialCode: '+963', phoneNumberMinLength: 9, phoneNumberMaxLength: 9 },
  { iso2: 'LB', nameAr: 'لبنان', nameEn: 'Lebanon', dialCode: '+961', phoneNumberMinLength: 8, phoneNumberMaxLength: 8 },
  { iso2: 'JO', nameAr: 'الأردن', nameEn: 'Jordan', dialCode: '+962', phoneNumberMinLength: 9, phoneNumberMaxLength: 9 },
  { iso2: 'PS', nameAr: 'فلسطين', nameEn: 'Palestine', dialCode: '+970', phoneNumberMinLength: 9, phoneNumberMaxLength: 9 },
  { iso2: 'MR', nameAr: 'موريتانيا', nameEn: 'Mauritania', dialCode: '+222', phoneNumberMinLength: 8, phoneNumberMaxLength: 8 },
  { iso2: 'SO', nameAr: 'الصومال', nameEn: 'Somalia', dialCode: '+252', phoneNumberMinLength: 8, phoneNumberMaxLength: 8 },
  { iso2: 'DJ', nameAr: 'جيبوتي', nameEn: 'Djibouti', dialCode: '+253', phoneNumberMinLength: 8, phoneNumberMaxLength: 8 },
  { iso2: 'KM', nameAr: 'جزر القمر', nameEn: 'Comoros', dialCode: '+269', phoneNumberMinLength: 7, phoneNumberMaxLength: 7 },

  // Popular European countries
  { iso2: 'GB', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom', dialCode: '+44', phoneNumberMinLength: 10, phoneNumberMaxLength: 10 },
  { iso2: 'FR', nameAr: 'فرنسا', nameEn: 'France', dialCode: '+33', phoneNumberMinLength: 9, phoneNumberMaxLength: 9 },
  { iso2: 'DE', nameAr: 'ألمانيا', nameEn: 'Germany', dialCode: '+49', phoneNumberMinLength: 10, phoneNumberMaxLength: 11 },
  { iso2: 'IT', nameAr: 'إيطاليا', nameEn: 'Italy', dialCode: '+39', phoneNumberMinLength: 9, phoneNumberMaxLength: 10 },
  { iso2: 'ES', nameAr: 'إسبانيا', nameEn: 'Spain', dialCode: '+34', phoneNumberMinLength: 9, phoneNumberMaxLength: 9 },
  { iso2: 'NL', nameAr: 'هولندا', nameEn: 'Netherlands', dialCode: '+31', phoneNumberMinLength: 9, phoneNumberMaxLength: 9 },
  { iso2: 'BE', nameAr: 'بلجيكا', nameEn: 'Belgium', dialCode: '+32', phoneNumberMinLength: 8, phoneNumberMaxLength: 9 },
  { iso2: 'CH', nameAr: 'سويسرا', nameEn: 'Switzerland', dialCode: '+41', phoneNumberMinLength: 9, phoneNumberMaxLength: 9 },
  { iso2: 'AT', nameAr: 'النمسا', nameEn: 'Austria', dialCode: '+43', phoneNumberMinLength: 10, phoneNumberMaxLength: 13 },
  { iso2: 'SE', nameAr: 'السويد', nameEn: 'Sweden', dialCode: '+46', phoneNumberMinLength: 7, phoneNumberMaxLength: 9 },
  { iso2: 'NO', nameAr: 'النرويج', nameEn: 'Norway', dialCode: '+47', phoneNumberMinLength: 8, phoneNumberMaxLength: 8 },
  { iso2: 'DK', nameAr: 'الدنمارك', nameEn: 'Denmark', dialCode: '+45', phoneNumberMinLength: 8, phoneNumberMaxLength: 8 },
  { iso2: 'FI', nameAr: 'فنلندا', nameEn: 'Finland', dialCode: '+358', phoneNumberMinLength: 7, phoneNumberMaxLength: 12 },
  { iso2: 'PT', nameAr: 'البرتغال', nameEn: 'Portugal', dialCode: '+351', phoneNumberMinLength: 9, phoneNumberMaxLength: 9 },
  { iso2: 'IE', nameAr: 'أيرلندا', nameEn: 'Ireland', dialCode: '+353', phoneNumberMinLength: 8, phoneNumberMaxLength: 9 },
  { iso2: 'GR', nameAr: 'اليونان', nameEn: 'Greece', dialCode: '+30', phoneNumberMinLength: 10, phoneNumberMaxLength: 10 },
  { iso2: 'PL', nameAr: 'بولندا', nameEn: 'Poland', dialCode: '+48', phoneNumberMinLength: 9, phoneNumberMaxLength: 9 },
  { iso2: 'CZ', nameAr: 'التشيك', nameEn: 'Czechia', dialCode: '+420', phoneNumberMinLength: 9, phoneNumberMaxLength: 9 },
];

export const DEFAULT_PHONE_NUMBER_MIN_LENGTH = 5;
export const DEFAULT_PHONE_NUMBER_MAX_LENGTH = 15;

export const getPhoneNumberLengthRuleByDialCode = (dialCode: string) => {
  const country = COUNTRY_PHONE_OPTIONS.find((item) => item.dialCode === dialCode);
  if (!country) {
    return {
      minLength: DEFAULT_PHONE_NUMBER_MIN_LENGTH,
      maxLength: DEFAULT_PHONE_NUMBER_MAX_LENGTH,
    };
  }

  return {
    minLength: country.phoneNumberMinLength,
    maxLength: country.phoneNumberMaxLength,
  };
};
