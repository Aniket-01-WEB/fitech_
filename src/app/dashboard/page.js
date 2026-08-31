'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortal } from '@/context/PortalContext';

export default function DashboardPage() {
  const { currentUser } = usePortal();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else if (currentUser.role === 'admin') {
      router.push('/admin-portal');
    } else {
      router.push('/student-portal');
    }
  }, [currentUser, router]);

  return null;
}
