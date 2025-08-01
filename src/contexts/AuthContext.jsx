import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, setCurrentUser, logoutUser as clearUser } from "../Utils/Auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (user) => {
    setCurrentUser(user);
    setUser(user);
  };

  const logout = () => {
    clearUser();
    setUser(null);
  };

  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
