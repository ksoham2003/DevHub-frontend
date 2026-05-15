'use client';

import { useState, useEffect, useCallback } from 'react';
import { getBlogs } from '@/lib/api';

/**
 * useBlogs — fetch & filter a paginated blog list
 */
export function useBlogs(initialParams = {}) {
  const [blogs,      setBlogs]      = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(initialParams.page || 1);
  const [sort,       setSort]       = useState(initialParams.sort || 'latest');
  const [category,   setCategory]   = useState(initialParams.category || 'All');

  const fetchBlogs = useCallback(() => {
    setLoading(true);
    const params = { page };
    if (sort === 'popular') params.sort = 'popular';
    if (category !== 'All') params.category = category;
    getBlogs(params)
      .then((res) => {
        setBlogs(res.data.blogs);
        setPagination(res.data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, sort, category]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const changeSort     = (val) => { setSort(val);     setPage(1); };
  const changeCategory = (val) => { setCategory(val); setPage(1); };

  return {
    blogs, pagination, loading,
    page, setPage,
    sort, changeSort,
    category, changeCategory,
    refresh: fetchBlogs,
  };
}

/**
 * useBlog — fetch a single blog by slug
 */
export function useBlog(slug) {
  const [blog,       setBlog]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [liked,      setLiked]      = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const load = useCallback((userId) => {
    if (!slug) return;
    setLoading(true);
    import('@/lib/api').then(({ getBlogBySlug }) =>
      getBlogBySlug(slug)
        .then((res) => {
          const b = res.data.blog;
          setBlog(b);
          setLikesCount(b.likesCount || 0);
          setLiked(b.likes?.includes(userId));
        })
        .finally(() => setLoading(false))
    );
  }, [slug]);

  return { blog, setBlog, loading, liked, setLiked, likesCount, setLikesCount, load };
}
