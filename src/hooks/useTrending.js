'use client';
import { useState, useEffect, useCallback } from 'react';
import { getTrending } from '@/lib/api';
export function useTrending() {
  const [trending, setTrending] = useState({ projects: [], blogs: [], developers: [] });
  const [loading,  setLoading]  = useState(true);
  const fetch = useCallback(() => {
    setLoading(true);
    getTrending()
      .then((res) => setTrending(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { trending, loading, refresh: fetch };
}
