'use client';
import { useState, useCallback } from 'react';
import { searchAll } from '@/lib/api';
export function useSearch() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [type,    setType]    = useState('all');
  const doSearch = useCallback((q, filterType) => {
    const t = filterType ?? type;
    if (!q?.trim()) return;
    setLoading(true);
    searchAll({ q: q.trim(), type: t === 'all' ? undefined : t })
      .then((res) => setResults(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [type]);
  const total =
    (results.usersTotal    || 0) +
    (results.projectsTotal || 0) +
    (results.blogsTotal    || 0);
  return { results, loading, type, setType, total, doSearch };
}
