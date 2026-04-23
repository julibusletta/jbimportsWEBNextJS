'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track every page view
    // We don't send individual product data here as that's handled in the product page
    // but the tracker will still capture location, device, and referrer from headers
    
    // Ignore admin routes to not pollute stats with owner clicks
    if (pathname && pathname.startsWith('/admin')) return;
    
    fetch('/api/track', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
      keepalive: true 
    }).catch(() => {});
    
  }, [pathname]);

  return null;
}
