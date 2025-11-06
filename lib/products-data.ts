export interface Product {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: string;
  priceEn: string;
  images: string[];
  details: string[];
  detailsEn: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: 'قفطان الأناقة الملكية',
    nameEn: 'Royal Elegance Caftan',
    description: 'قفطان فاخر بتطريز يدوي دقيق وأقمشة حريرية فاخرة من فاس',
    descriptionEn: 'Luxurious caftan with precise hand embroidery and premium silk fabrics from Fes',
    price: 'السعر حسب الطلب',
    priceEn: 'Price on Request',
    images: [
      '/images/caftan1-1.jpg',
      '/images/caftan1-2.jpg',
      '/images/product1.jpg',
    ],
    details: [
      'تطريز يدوي فاخر بخيوط حريرية',
      'قماش حرير طبيعي 100%',
      'تصميم مغربي تقليدي أصيل',
      'مصنوع في فاس بأيدي حرفيين مهرة',
      'مناسب للمناسبات الخاصة والأعراس',
    ],
    detailsEn: [
      'Luxurious hand embroidery with silk threads',
      '100% natural silk fabric',
      'Authentic traditional Moroccan design',
      'Handcrafted in Fes by skilled artisans',
      'Perfect for special occasions and weddings',
    ],
  },
  {
    id: 2,
    name: 'قفطان التراث الفاسي',
    nameEn: 'Fassi Heritage Caftan',
    description: 'حرفية فاسية تقليدية مع لمسات عصرية راقية',
    descriptionEn: 'Traditional Fassi craftsmanship with modern elegant touches',
    price: 'السعر حسب الطلب',
    priceEn: 'Price on Request',
    images: [
      '/images/caftan2-1.jpg',
      '/images/caftan2-2.jpg',
      '/images/product2.jpg',
    ],
    details: [
      'تصميم فاسي عريق',
      'أزرار تقليدية فاخرة',
      'قماش فاخر عالي الجودة',
      'ألوان زاهية ومتناسقة',
      'مثالي للحفلات والمناسبات',
    ],
    detailsEn: [
      'Ancient Fassi design',
      'Traditional premium buttons',
      'High-quality premium fabric',
      'Vibrant and harmonious colors',
      'Ideal for parties and occasions',
    ],
  },
  {
    id: 3,
    name: 'قفطان الأحلام الذهبية',
    nameEn: 'Golden Dreams Caftan',
    description: 'تصميم فاخر بزخارف راقية وتطريز يدوي يخطف الأنظار',
    descriptionEn: 'Luxurious design with elegant ornaments and exquisite hand embroidery',
    price: 'السعر حسب الطلب',
    priceEn: 'Price on Request',
    images: [
      '/images/caftan3-1.jpg',
      '/images/caftan3-2.jpg',
      '/images/product3.jpg',
    ],
    details: [
      'زخارف فاخرة ومتقنة',
      'تطريز بالخرز والكريستال',
      'قصة عصرية أنيقة',
      'قماش مخملي فاخر',
      'تصميم حصري ومميز',
    ],
    detailsEn: [
      'Luxurious and intricate ornaments',
      'Beads and crystal embroidery',
      'Modern elegant cut',
      'Premium velvet fabric',
      'Exclusive and distinctive design',
    ],
  },
  {
    id: 4,
    name: 'قفطان عظمة العروس',
    nameEn: 'Bridal Majesty Caftan',
    description: 'قفطان عروس مذهل بتطريز دقيق وتفاصيل فاخرة',
    descriptionEn: 'Stunning bridal caftan with precise embroidery and luxurious details',
    price: 'السعر حسب الطلب',
    priceEn: 'Price on Request',
    images: [
      '/images/caftan4-1.jpg',
      '/images/caftan4-2.jpg',
      '/images/product4.jpg',
    ],
    details: [
      'تصميم خاص للعرائس',
      'تطريز يدوي فاخر ودقيق',
      'قماش أبيض ناصع فاخر',
      'تفاصيل دقيقة ومتقنة',
      'قطعة فنية استثنائية',
    ],
    detailsEn: [
      'Special bridal design',
      'Luxurious and precise hand embroidery',
      'Premium pure white fabric',
      'Precise and perfect details',
      'Exceptional artistic piece',
    ],
  },
  {
    id: 5,
    name: 'قفطان الجمال المغربي',
    nameEn: 'Moroccan Beauty Caftan',
    description: 'قفطان أنيق بألوان زاهية وتطريز مغربي أصيل',
    descriptionEn: 'Elegant caftan with vibrant colors and authentic Moroccan embroidery',
    price: 'السعر حسب الطلب',
    priceEn: 'Price on Request',
    images: [
      '/images/caftan5-1.jpg',
      '/images/caftan5-2.jpg',
      '/images/caftan5-3.jpg',
    ],
    details: [
      'ألوان مغربية أصيلة',
      'تطريز يدوي تقليدي',
      'قماش عالي الجودة',
      'تصميم عصري مريح',
      'مناسب للمناسبات اليومية والخاصة',
    ],
    detailsEn: [
      'Authentic Moroccan colors',
      'Traditional hand embroidery',
      'High-quality fabric',
      'Modern comfortable design',
      'Suitable for daily and special occasions',
    ],
  },
  {
    id: 6,
    name: 'قفطان الفخامة الملكية',
    nameEn: 'Royal Luxury Caftan',
    description: 'قفطان ملكي بتصميم فاخر وتفاصيل استثنائية',
    descriptionEn: 'Royal caftan with luxurious design and exceptional details',
    price: 'السعر حسب الطلب',
    priceEn: 'Price on Request',
    images: [
      '/images/product1.jpg',
      '/images/product2.jpg',
      '/images/product3.jpg',
    ],
    details: [
      'تصميم ملكي فاخر',
      'تطريز بخيوط حريرية فاخرة',
      'قماش حريري فاخر',
      'قصة أنيقة ومريحة',
      'قطعة فنية فريدة',
    ],
    detailsEn: [
      'Royal luxurious design',
      'Premium silk thread embroidery',
      'Premium silk fabric',
      'Elegant and comfortable cut',
      'Unique artistic piece',
    ],
  },
];
