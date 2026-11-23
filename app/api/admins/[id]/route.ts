import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

const ADMIN_SELECT = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
};

async function ensureAuthorized() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  return session;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await ensureAuthorized();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, password } = body;

    if (!name && !email && !password) {
      return NextResponse.json({ error: 'لا توجد بيانات لتحديثها' }, { status: 400 });
    }

    const data: { name?: string; email?: string; password?: string } = {};

    if (name) data.name = name;
    if (email) {
      const existingWithEmail = await prisma.admin.findUnique({ where: { email } });
      if (existingWithEmail && existingWithEmail.id !== id) {
        return NextResponse.json({ error: 'البريد الإلكتروني مستخدم مسبقاً' }, { status: 409 });
      }
      data.email = email;
    }
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data,
      select: ADMIN_SELECT,
    });

    return NextResponse.json(updatedAdmin);
  } catch (error) {
    console.error('Error updating admin:', error);
    return NextResponse.json({ error: 'فشل تعديل بيانات المسؤول' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await ensureAuthorized();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;

    const adminsCount = await prisma.admin.count();
    if (adminsCount <= 1) {
      return NextResponse.json({ error: 'لا يمكن حذف آخر مسؤول متبقٍ' }, { status: 400 });
    }

    if (session.user?.id === id) {
      return NextResponse.json({ error: 'لا يمكن حذف حسابك الحالي' }, { status: 400 });
    }

    await prisma.admin.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json({ error: 'فشل حذف المسؤول' }, { status: 500 });
  }
}
