import React, { createContext, useState, useEffect, useMemo } from "react";
import { fetchCurrentUserProfile } from "./api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (storedToken && !userData.token) {
        userData.token = storedToken;
      }
      setUser(userData);
      setRoles(userData.roles || []);
      setPermissions(userData.permissions || []);
      console.log('AuthContext user after load:', userData);
    } else {
      console.log('AuthContext: No user found in localStorage');
    }
    setLoading(false);
  }, []);

  // Sync localStorage on user change
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      if (user.token) {
        localStorage.setItem('token', user.token);
      }
      console.log('AuthContext user after setUser:', user);
    }
  }, [user]);

  const login = async (userData) => {
    setUser(userData);
    setRoles(userData.roles || []);
    setPermissions(userData.permissions || []);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    console.log('AuthContext user after login:', userData);
    try {
      const profileResponse = await fetchCurrentUserProfile(userData.token);
      const profileData = profileResponse.data;
      const completeUserData = {
        ...userData,
        ...profileData,
        token: userData.token // always preserve the token!
      };
      setUser(completeUserData);
      localStorage.setItem('user', JSON.stringify(completeUserData));
      if (completeUserData.token) {
        localStorage.setItem('token', completeUserData.token);
      }
      console.log('AuthContext user after profile fetch:', completeUserData);
    } catch {
      // Ignore profile fetch errors
    }
  };

  const logout = () => {
    setUser(null);
    setRoles([]);
    setPermissions([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('AuthContext: User logged out');
  };

  const contextValue = useMemo(() => ({
    user, setUser, login, logout, roles, permissions, loading
  }), [user, roles, permissions, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext }; 