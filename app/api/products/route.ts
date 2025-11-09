import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
interface Product {
  id: string;
  name: string;
  details: string;
  detailsEn: string;
  [key: string]: any;
}
// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });

    // Parse JSON strings back to arrays
    const parsedProducts = products.map((product: Product) => ({
      ...product,
      details: JSON.parse(product.details),
      detailsEn: JSON.parse(product.detailsEn),
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
      },
    });

    return NextResponse.json({
      ...product,
      details: JSON.parse(product.details),
      detailsEn: JSON.parse(product.detailsEn),
      images: JSON.parse(product.images),
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'فشل إضافة المنتج' },
      { status: 500 }
    );
  }
}
