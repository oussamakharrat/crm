import React from "react";
import { useAuth } from "../hooks/useAuth";
import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard";
import SalesDashboard from "./SalesDashboard";
import Dashboard from "./Dashboard";

const RoleBasedDashboard = () => {
  const { user, roles, permissions } = useAuth();

  // Helper function to check if user has a specific role
  const hasRole = (roleName) => {
    return roles.some(role => 
      (typeof role === 'string' && role.toLowerCase() === roleName.toLowerCase()) ||
      (typeof role === 'object' && role.name && role.name.toLowerCase() === roleName.toLowerCase())
    );
  };

  // Helper function to check if user has a specific permission
  const hasPermission = (permissionName) => {
    return permissions.some(permission => 
      permission.toLowerCase() === permissionName.toLowerCase()
    );
  };

  // Determine which dashboard to show based on roles and permissions
  const getDashboard = () => {
    // Admin role takes highest priority
    if (hasRole('admin') || hasRole('administrator')) {
      return <AdminDashboard />;
    }
    
    // Manager role
    if (hasRole('manager') || hasRole('management')) {
      return <ManagerDashboard />;
    }
    
    // Sales role
    if (hasRole('sales') || hasRole('salesperson') || hasRole('sales rep')) {
      return <SalesDashboard />;
    }
    
    // Default dashboard for users without specific roles
    return <Dashboard />;
  };

  return (
    <div>
      {getDashboard()}
    </div>
  );
};

export default RoleBasedDashboard; 