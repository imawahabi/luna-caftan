/**
 * Tags Configuration
 * مركز إدارة الوسوم - جميع الوسوم في مكان واحد
 * 
 * لإضافة وسم جديد:
 * 1. أضف الوسم الإنجليزي في englishTags
 * 2. أضف الترجمة العربية في arabicTags بنفس الترتيب
 * 
 * ملاحظة: يجب أن يكون عدد الوسوم الإنجليزية = عدد الوسوم العربية
 */

// الوسوم الإنجليزية (English Tags)
export const englishTags = [
  'Traditional',
  'Modern',
  'Elegant',
  'Casual',
  'Formal',
  'Wedding',
  'Party',
  'Summer',
  'Winter',
  'Handmade',
  'Embroidered',
  'Silk',
  'Cotton',
  'Velvet',
  'Luxury',
  'Classic',
  'Vintage',
  'Contemporary',
  'Modest',
  'Festive',
];

// الوسوم العربية (Arabic Tags)
export const arabicTags = [
  'تقليدي',
  'عصري',
  'أنيق',
  'كاجوال',
  'رسمي',
  'زفاف',
  'حفلات',
  'صيفي',
  'شتوي',
  'صناعة يدوية',
  'مطرز',
  'حرير',
  'قطن',
  'مخمل',
  'فاخر',
  'كلاسيكي',
  'عتيق',
  'معاصر',
  'محتشم',
  'احتفالي',
];

/**
 * Get tag translation
 * الحصول على ترجمة الوسم
 */
export function getTagTranslation(tag: string, targetLanguage: 'ar' | 'en'): string {
  // If tag is already in target language, return it
  if (targetLanguage === 'en') {
    const indexInArabic = arabicTags.indexOf(tag);
    if (indexInArabic !== -1) {
      return englishTags[indexInArabic];
    }
    return tag; // Already in English or not found
  } else {
    const indexInEnglish = englishTags.indexOf(tag);
    if (indexInEnglish !== -1) {
      return arabicTags[indexInEnglish];
    }
    return tag; // Already in Arabic or not found
  }
}

/**
 * Get tags for current language from product
 * الحصول على الوسوم حسب اللغة الحالية من المنتج
 * 
 * @param product - Product object with tags and tagsEn
 * @param currentLanguage - Current language ('ar' or 'en')
 * @returns Array of tags in the current language
 */
export function getProductTags(product: { tags?: string[]; tagsEn?: string[] }, currentLanguage: 'ar' | 'en'): string[] {
  if (currentLanguage === 'ar') {
    return product.tags || [];
  } else {
    return product.tagsEn || [];
  }
}

/**
 * Sort tags by current language (DEPRECATED - use getProductTags instead)
 * This function is kept for backward compatibility
 */
export function sortTagsByLanguage(tags: string[], currentLanguage: 'ar' | 'en'): string[] {
  if (!tags || tags.length === 0) return [];
  return tags;
}

/**
 * Get all available tags for current language
 * الحصول على جميع الوسوم المتاحة للغة الحالية
 */
export function getAllTags(language: 'ar' | 'en'): string[] {
  return language === 'ar' ? arabicTags : englishTags;
}

/**
 * Check if a tag is in Arabic
 * التحقق من أن الوسم عربي
 */
export function isArabicTag(tag: string): boolean {
  return arabicTags.includes(tag);
}

/**
 * Check if a tag is in English
 * التحقق من أن الوسم إنجليزي
 */
export function isEnglishTag(tag: string): boolean {
  return englishTags.includes(tag);
}

/**
 * Normalize tags to current language
 * تطبيع الوسوم للغة الحالية
 * (Convert all tags to current language)
 */
export function normalizeTagsToLanguage(tags: string[], targetLanguage: 'ar' | 'en'): string[] {
  if (!tags || tags.length === 0) return [];
  
  return tags.map(tag => getTagTranslation(tag, targetLanguage));
}
