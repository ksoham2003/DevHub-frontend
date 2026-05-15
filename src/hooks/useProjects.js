'use client';
import { useState, useEffect, useCallback } from 'react';
import { getProjects } from '@/lib/api';
export function useProjects(initialParams = {}) {
  const [projects,   setProjects]   = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(initialParams.page || 1);
  const [sort,       setSort]       = useState(initialParams.sort || 'latest');
  const [techFilter, setTechFilter] = useState(initialParams.techFilter || []);
  const fetchProjects = useCallback(() => {
    setLoading(true);
    const params = { page, sort: sort === 'popular' ? 'popular' : undefined };
    if (techFilter.length > 0) params.techStack = techFilter.join(',');
    getProjects(params)
      .then((res) => {
        setProjects(res.data.projects);
        setPagination(res.data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, sort, techFilter]);
  useEffect(() => { fetchProjects(); }, [fetchProjects]);
  const toggleTech = (tech) => {
    setTechFilter((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
    setPage(1);
  };
  const changeSort = (val) => { setSort(val); setPage(1); };
  return {
    projects, pagination, loading,
    page, setPage,
    sort, changeSort,
    techFilter, toggleTech,
    clearTech: () => setTechFilter([]),
    refresh: fetchProjects,
  };
}
export function useProject(id) {
  const [project,    setProject]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [liked,      setLiked]      = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const load = useCallback((userId) => {
    if (!id) return;
    setLoading(true);
    import('@/lib/api').then(({ getProject }) =>
      getProject(id)
        .then((res) => {
          const p = res.data.project;
          setProject(p);
          setLikesCount(p.likesCount || 0);
          setLiked(p.likes?.includes(userId));
        })
        .finally(() => setLoading(false))
    );
  }, [id]);
  return { project, setProject, loading, liked, setLiked, likesCount, setLikesCount, load };
}
