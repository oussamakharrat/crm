import axios from "axios";

  console.log("api.js loaded");
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

export const login = async (email, password) => {
  try {
    const res = await api.post("/login", { email, password });
    console.log('Login response:', res);
    return res;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Login failed");
  }
};

export const signup = async (name, phone, address, email, password) => {
  try {
    const detailsRes = await api.post("/details", { name, phone, address });
    const user_id = detailsRes.data.id || (detailsRes.data.user && detailsRes.data.user.id);
    const authRes = await api.post("/auth", { user_id, email, password });
    return authRes;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Signup failed");
  }
};

export const fetchUserDetails = () => api.get("/details");
export const fetchRoles = () => api.get("/roles");
export const fetchPermissions = () => api.get("/permissions");

// New functions for user profile management
export const fetchCurrentUserProfile = (token) => {
  return api.get("/profile", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateUserProfile = (token, profileData) => {
  return api.put("/profile", profileData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Upload avatar file
export const uploadAvatar = (token, file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  return api.post("/profile/avatar", formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Analytics/Reporting endpoints
export const fetchUsersByRole = () => api.get("/reports/users-by-role");
export const fetchLeadsByStatus = (token) => api.get("/reports/leads-by-status", {
  headers: { Authorization: `Bearer ${token}` }
});
export const fetchDealsByStage = (token) => api.get("/reports/deals-by-stage", {
  headers: { Authorization: `Bearer ${token}` }
});

export const fetchTotalRevenue = (token) => api.get("/reports/total-revenue", {
  headers: { Authorization: `Bearer ${token}` }
});

export const fetchRevenueByMonth = (token) => api.get("/reports/revenue-by-month", {
  headers: { Authorization: `Bearer ${token}` }
});

export const fetchTopPerformers = (token) => api.get("/reports/top-performers", {
  headers: { Authorization: `Bearer ${token}` }
});

export const fetchHighestDeal = (token) => api.get("/reports/highest-deal", {
  headers: { Authorization: `Bearer ${token}` }
});

export default api; 