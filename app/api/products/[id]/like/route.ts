import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Toggle like for a product (add or remove)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const body = await request.json();
    const action = body?.action; // 'add' or 'remove'

    console.log('🔄 Like action for product:', productId, action);

    if (!productId) {
      return NextResponse.json(
        { error: 'Missing product id' },
        { status: 400 }
      );
    }

    if (action !== 'add' && action !== 'remove') {
      return NextResponse.json(
        { error: 'Invalid like action' },
        { status: 400 }
      );
    }

    // Get current product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { likes: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    // Toggle likes based on action
    const currentLikes = product.likes || 0;
    let newLikes = currentLikes;
    
    if (action === 'remove' && currentLikes > 0) {
      newLikes = currentLikes - 1;
      console.log('➖ Like removed');
    } else if (action === 'add') {
      newLikes = currentLikes + 1;
      console.log('➕ Like added');
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { likes: newLikes },
    });

    console.log('✅ Total likes:', newLikes);

    return NextResponse.json({
      likes: updatedProduct.likes,
      success: true,
    });
  } catch (error) {
    console.error('❌ Error toggling like:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث الإعجاب' },
      { status: 500 }
    );
  }
}

// GET - Get likes count for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { likes: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      likes: product.likes || 0,
    });
  } catch (error) {
    console.error('❌ Error getting likes:', error);
    return NextResponse.json(
      { error: 'فشل في جلب عدد الإعجابات' },
      { status: 500 }
    );
  }
}
