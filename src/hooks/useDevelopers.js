'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUsers } from '@/lib/api';

/**
 * useDevelopers — fetch paginated developer list with skill filter
 */
export function useDevelopers() {
  const [devs,        setDevs]        = useState([]);
  const [pagination,  setPagination]  = useState({});
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState(1);
  const [skillFilter, setSkillFilter] = useState([]);

  const fetchDevs = useCallback(() => {
    setLoading(true);
    const params = { page };
    if (skillFilter.length > 0) params.skills = skillFilter.join(',');
    getUsers(params)
      .then((res) => {
        setDevs(res.data.users);
        setPagination(res.data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, skillFilter]);

  useEffect(() => { fetchDevs(); }, [fetchDevs]);

  const toggleSkill = (skill) => {
    setSkillFilter((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
    setPage(1);
  };

  return {
    devs, pagination, loading,
    page, setPage,
    skillFilter, toggleSkill,
    refresh: fetchDevs,
  };
}
