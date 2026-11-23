import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    if (typeof body.read !== 'boolean') {
      return NextResponse.json(
        { error: 'قيمة read يجب أن تكون true أو false' },
        { status: 400 }
      );
    }

    const read = body.read;
    const { id } = await context.params;

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: {
        read,
        readAt: read ? new Date() : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json(
      { error: 'فشل تحديث الرسالة' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await context.params;

    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      { error: 'فشل حذف الرسالة' },
      { status: 500 }
    );
  }
}
