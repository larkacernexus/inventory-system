export const setToken = (t: string) => localStorage.setItem('token', t);
export const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;
export const clearToken = () => localStorage.removeItem('token');
export const isAuth = () => !!getToken();
export const logout = () => {
  clearToken();
  window.location.href = '/login';
};