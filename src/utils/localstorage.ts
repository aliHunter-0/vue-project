// src/utils/localStorage.ts

const USER_KEY = 'user';

export const setUser = (user: { email: string; isRoot: boolean }) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};
