import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
interface Product {
  id: string;
  name: string;
  details: string;
  detailsEn: string;
  images?: string | string[] | null;
  views?: number;
  likes?: number;
  tags?: string;
  tagsEn?: string;
  [key: string]: any;
}

const parseImages = (images: Product['images']) => {
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === 'string') return [parsed];
    } catch (error) {
      if (images.trim().length > 0) {
        return [images];
      }
    }
  }
  return [];
};
// GET all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';
    
    const products = await prisma.product.findMany({
      where: isAdmin ? {} : { active: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        nameEn: true,
        description: true,
        descriptionEn: true,
        price: true,
        priceEn: true,
        details: true,
        detailsEn: true,
        images: true,
        featured: true,
        active: true,
        likes: true,
        tags: true,
        tagsEn: true,
        views: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Parse JSON strings back to arrays
    const parsedProducts = products.map((product: Product) => ({
      ...product,
      details: JSON.parse(product.details),
      detailsEn: JSON.parse(product.detailsEn),
      images: parseImages(product.images),
      tags: product.tags ? JSON.parse(product.tags as string) : [],
      tagsEn: product.tagsEn ? JSON.parse(product.tagsEn as string) : [],
    }));

    return NextResponse.json(parsedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'فشل تحميل المنتجات' },
      { status: 500 }
    );
  }
}

// POST new product (Admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      nameEn,
      description,
      descriptionEn,
      price,
      priceEn,
      details,
      detailsEn,
      images,
      featured,
      tags,
      tagsEn,
    } = body;

    // Validate required fields
    if (!name || !nameEn || !description || !descriptionEn) {
      return NextResponse.json(
        { error: 'الحقول الأساسية مطلوبة (الاسم والوصف)' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        nameEn,
        description,
        descriptionEn,
        price,
        priceEn,
        details: JSON.stringify(details || []),
        detailsEn: JSON.stringify(detailsEn || []),
        images: JSON.stringify(images || []),
        featured: featured || false,
        tags: JSON.stringify(tags || []),
        tagsEn: JSON.stringify(tagsEn || []),
      },
    });

    return NextResponse.json({
      ...product,
      details: JSON.parse(product.details),
      detailsEn: JSON.parse(product.detailsEn),
      images: parseImages(product.images),
      tags: JSON.parse(product.tags as string),
      tagsEn: product.tagsEn ? JSON.parse(product.tagsEn as string) : [],
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'فشل إضافة المنتج' },
      { status: 500 }
    );
  }
}
