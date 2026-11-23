'use server';

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminIndexPage() {
  const session = await getServerSession(authOptions);
  redirect(session ? '/admin/dashboard' : '/admin/login');
}
