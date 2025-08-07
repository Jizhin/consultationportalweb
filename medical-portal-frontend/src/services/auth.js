import API from './api';

export const login = async (username, password) => {
  const res = await API.post('/users/login/', { username, password });
  return res.data;
};

export const register = async (data) => {
  const res = await API.post('/users/register/', data);
  return res.data;
};
