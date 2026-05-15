'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUserProfile, getProjects, getBlogs } from '@/lib/api';

/**
 * useProfile — fetch user profile + their projects & blogs
 * @param {string} username
 */
export function useProfile(username) {
  const [profile,     setProfile]     = useState(null);
  const [projects,    setProjects]    = useState([]);
  const [blogs,       setBlogs]       = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading,     setLoading]     = useState(true);

  const fetchProfile = useCallback(() => {
    if (!username) return;
    setLoading(true);
    getUserProfile(username)
      .then((res) => {
        setProfile(res.data.user);
        setIsFollowing(res.data.isFollowing);
        return Promise.all([
          getProjects({ author: res.data.user._id }),
          getBlogs({ author: res.data.user._id }),
        ]);
      })
      .then(([p, b]) => {
        setProjects(p.data.projects);
        setBlogs(b.data.blogs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [username]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const updateFollowCount = (isNowFollowing) => {
    setIsFollowing(isNowFollowing);
    setProfile((prev) => ({
      ...prev,
      followersCount: prev.followersCount + (isNowFollowing ? 1 : -1),
    }));
  };

  return {
    profile, setProfile,
    projects, blogs,
    isFollowing, updateFollowCount,
    loading,
    refresh: fetchProfile,
  };
}
