import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const parseImages = (images: any) => {
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

// GET single product
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...product,
      details: JSON.parse(product.details),
      detailsEn: JSON.parse(product.detailsEn),
      images: parseImages(product.images),
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'فشل تحميل المنتج' },
      { status: 500 }
    );
  }
}

// PUT update product (Admin only)
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
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
      active,
    } = body;

    console.log('📝 UPDATE Request for product:', params.id);
    console.log('📦 Body received:', JSON.stringify(body, null, 2));
    console.log('🔄 Active field:', active, 'Type:', typeof active);

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(nameEn && { nameEn }),
        ...(description && { description }),
        ...(descriptionEn && { descriptionEn }),
        ...(typeof price !== 'undefined' && { price }),
        ...(typeof priceEn !== 'undefined' && { priceEn }),
        ...(details && { details: JSON.stringify(details) }),
        ...(detailsEn && { detailsEn: JSON.stringify(detailsEn) }),
        ...(images && { images: JSON.stringify(images) }),
        ...(typeof featured !== 'undefined' && { featured }),
        ...(typeof active !== 'undefined' && { active }),
      },
    });

    console.log('✅ Product updated successfully. New active status:', product.active);

    return NextResponse.json({
      ...product,
      details: JSON.parse(product.details),
      detailsEn: JSON.parse(product.detailsEn),
      images: parseImages(product.images),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'فشل تحديث المنتج' },
      { status: 500 }
    );
  }
}

// DELETE product (Admin only)
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'تم حذف المنتج بنجاح' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'فشل حذف المنتج' },
      { status: 500 }
    );
  }
}
