'use client';

import { useState, useEffect, useCallback } from 'react';
import { getComments } from '@/lib/api';

/**
 * useComments — fetch, post, and delete comments for a target
 * @param {string} targetType - 'project' | 'blog'
 * @param {string} targetId
 */
export function useComments(targetType, targetId) {
  const [comments, setComments] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const fetchComments = useCallback(() => {
    if (!targetId) return;
    setLoading(true);
    getComments(targetType, targetId)
      .then((res) => setComments(res.data.comments))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [targetType, targetId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const addComment = (comment) => setComments((prev) => [comment, ...prev]);
  const removeComment = (id)   => setComments((prev) => prev.filter((c) => c._id !== id));

  return { comments, loading, addComment, removeComment, refresh: fetchComments };
}
