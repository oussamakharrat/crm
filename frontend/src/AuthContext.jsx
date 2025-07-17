import React, { createContext, useState, useEffect } from "react";
import { fetchCurrentUserProfile } from "./api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // If token is not in userData but is in localStorage, add it
      if (storedToken && !userData.token) {
        userData.token = storedToken;
      }
      setUser(userData);
      setRoles(userData.roles || []);
      setPermissions(userData.permissions || []);
    }
  }, []);

  const login = async (userData) => {
    // First set the basic user data
    setUser(userData);
    setRoles(userData.roles || []);
    setPermissions(userData.permissions || []);
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }

    // Fetch complete profile data from backend
    try {
      const profileResponse = await fetchCurrentUserProfile(userData.token);
      const profileData = profileResponse.data;
      
      // Update user with complete profile data
      const completeUserData = {
        ...userData,
        name: profileData.name || userData.name,
        phone: profileData.phone || userData.phone,
        address: profileData.address || userData.address,
        avatar: profileData.avatar || userData.avatar
      };
      
      setUser(completeUserData);
      localStorage.setItem('user', JSON.stringify(completeUserData));
    } catch (err) {
      console.error('Failed to fetch complete profile:', err);
      // Continue with basic user data if profile fetch fails
    }
  };

  const logout = () => {
    setUser(null);
    setRoles([]);
    setPermissions([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, roles, permissions }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext }; 