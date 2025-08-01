
import axios from "axios";

const USER_API = import.meta.env.VITE_USER_URL;


export const fetchUsers = async () => {
  const res = await axios.get(USER_API);
  return res.data;
};

export const setCurrentUser = (user) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("currentUser"));
};

export const logoutUser = () => {
  localStorage.removeItem("currentUser");
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("currentUser");
};
