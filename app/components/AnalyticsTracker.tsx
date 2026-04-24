'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    // 1. Ignorar rutas de administrador
    if (pathname && pathname.startsWith('/admin')) return;
    
    // 2. Ignorar si el usuario está logueado como ADMIN
    if (session?.user && (session.user as any).role?.toUpperCase() === 'ADMIN') {
      console.log('Analytics: Admin detected, skipping track.');
      return;
    }

    // 3. Ignorar si este navegador tiene la marca de "No Track" (seteada al entrar al admin)
    if (typeof window !== 'undefined' && localStorage.getItem('jb_no_track') === 'true') {
      console.log('Analytics: Flag jb_no_track detected, skipping track.');
      return;
    }

    // Track every page view
    fetch('/api/track', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
      keepalive: true 
    }).catch(() => {});
    
  }, [pathname, session]);

  return null;
}
