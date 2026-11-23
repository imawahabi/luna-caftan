import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST toggle active status (Admin only)
export async function POST(
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

    console.log('🔄 TOGGLE Request for product:', params.id);

    // Get current product
    const currentProduct = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!currentProduct) {
      return NextResponse.json(
        { error: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    console.log('📊 Current active status:', currentProduct.active);

    // Toggle the active status
    const newActiveStatus = !currentProduct.active;
    
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        active: newActiveStatus,
      },
    });

    console.log('✅ Product toggled successfully. New active status:', product.active);

    return NextResponse.json({
      ...product,
      details: JSON.parse(product.details),
      detailsEn: JSON.parse(product.detailsEn),
      images: JSON.parse(product.images),
    });
  } catch (error) {
    console.error('❌ Error toggling product:', error);
    return NextResponse.json(
      { error: 'فشل تغيير حالة المنتج' },
      { status: 500 }
    );
  }
}
