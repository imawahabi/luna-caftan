// Product Types and Interfaces

export interface ProductTag {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: string;
  priceEn: string;
  details?: string[];
  detailsEn?: string[];
  images: string[];
  featured: boolean;
  active?: boolean;
  likes?: number;
  tags?: string[];      // Arabic tags
  tagsEn?: string[];    // English tags
  views?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ProductFilters {
  search?: string;
  featured?: boolean;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'popular' | 'price-asc' | 'price-desc';
}

export interface ProductFormData {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: string;
  details: string[];
  detailsEn: string[];
  images: string[];
  featured: boolean;
  tags: string[];      // Arabic tags
  tagsEn: string[];    // English tags
}
