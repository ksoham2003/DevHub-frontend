import axios from 'axios';
const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});
API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('devhub_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('devhub_token');
      localStorage.removeItem('devhub_user');
    }
    return Promise.reject(err);
  }
);
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser   = (data) => API.post('/auth/login', data);
export const getMe       = ()     => API.get('/auth/me');
export const getUsers        = (params)     => API.get('/users', { params });
export const getUserProfile  = (username)   => API.get(`/users/${username}`);
export const updateProfile   = (data)       => API.put('/users/profile', data);
export const toggleFollow    = (id)         => API.post(`/users/${id}/follow`);
export const getFollowers    = (id, params) => API.get(`/users/${id}/followers`, { params });
export const getFollowing    = (id, params) => API.get(`/users/${id}/following`, { params });
export const getProjects       = (params) => API.get('/projects', { params });
export const getProject        = (id)     => API.get(`/projects/${id}`);
export const createProject     = (data)   => API.post('/projects', data);
export const updateProject     = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject     = (id)     => API.delete(`/projects/${id}`);
export const toggleProjectLike = (id)     => API.post(`/projects/${id}/like`);
export const getBlogs      = (params)   => API.get('/blogs', { params });
export const getBlogBySlug = (slug)     => API.get(`/blogs/${slug}`);
export const createBlog    = (data)     => API.post('/blogs', data);
export const updateBlog    = (id, data) => API.put(`/blogs/edit/${id}`, data);
export const deleteBlog    = (id)       => API.delete(`/blogs/edit/${id}`);
export const toggleBlogLike = (id)     => API.post(`/blogs/${id}/like`);
export const getMyBlogs    = (params)   => API.get('/blogs/my', { params });
export const getComments   = (type, id, params) => API.get(`/comments/${type}/${id}`, { params });
export const createComment = (data) => API.post('/comments', data);
export const deleteComment = (id)   => API.delete(`/comments/${id}`);
export const searchAll   = (params) => API.get('/search', { params });
export const getTrending = ()       => API.get('/search/trending');
export default API;
