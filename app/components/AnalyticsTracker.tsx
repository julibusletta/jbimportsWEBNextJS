'use client';

import { useEffect } from 'react';

export default function AnalyticsTracker() {
  useEffect(() => {
    // Only track once per browser session
    const hasVisitedToday = sessionStorage.getItem('jbi_visited');
    
    if (!hasVisitedToday) {
      fetch('/api/track', { method: 'POST', keepalive: true }).catch(() => {});
      sessionStorage.setItem('jbi_visited', 'true');
    }
  }, []);

  return null;
}
