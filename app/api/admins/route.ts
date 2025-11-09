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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: 'asc' },
      select: ADMIN_SELECT,
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json({ error: 'فشل تحميل المسؤولين' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { email } });

    if (existingAdmin) {
      return NextResponse.json({ error: 'البريد الإلكتروني مستخدم مسبقاً' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: ADMIN_SELECT,
    });

    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ error: 'فشل إنشاء المسؤول' }, { status: 500 });
  }
}
