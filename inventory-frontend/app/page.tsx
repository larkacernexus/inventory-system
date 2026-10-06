'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuth } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace(isAuth() ? '/dashboard' : '/login');
  }, [router]);
  return <p className="p-8">Redirecting…</p>;
}