import React from "react";
import { useAuth } from "../hooks/useAuth";
import AdminRolePanel from "./AdminRolePanel";
import { ThemeContext } from "../ThemeContext";

const AdminDashboard = () => {
  const { roles, permissions } = useAuth();

  // Theme variable styles for cards
  const cardStyle = {
    background: 'var(--phoenix-card-bg)',
    color: 'var(--phoenix-card-color)',
    borderColor: 'var(--phoenix-card-border-color)'
  };
  const cardHeaderStyle = {
    background: 'var(--phoenix-card-header-bg)',
    color: 'var(--phoenix-card-header-color)',
    borderBottom: '1px solid var(--phoenix-card-border-color)'
  };
  const cardBodyStyle = {
    background: 'var(--phoenix-card-bg)',
    color: 'var(--phoenix-card-color)'
  };

  return (
    <div className="content" style={{ background: 'var(--phoenix-body-bg)', color: 'var(--phoenix-body-color)' }}>
      <div className="row gy-3 mb-4 justify-content-between" style={{ background: 'var(--phoenix-body-bg)', color: 'var(--phoenix-body-color)' }}>
        <div className="col-xxl-6">
          <h2 className="mb-2 text-body-emphasis" style={{ color: 'var(--phoenix-body-color)' }}>Admin Dashboard</h2>
          <h5 className="text-body-tertiary fw-semibold mb-4" style={{ color: 'var(--phoenix-body-color)' }}>System administration and management</h5>
          <div className="row g-3 mb-3">
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-4">
              <div className="card h-100" style={cardStyle}>
                <div className="card-body" style={cardBodyStyle}>
                  <div className="d-flex d-sm-block justify-content-between">
                    <div className="mb-3">
                      <h6 className="fw-bold fs-5 d-flex align-items-center mb-2">
                        <span className="fas fa-users text-primary me-2"></span>
                        Total Users
                      </h6>
                      <h4 className="fw-bold text-primary mb-2">1,247</h4>
                      <p className="fs-9 mb-0 fw-semibold text-body-tertiary">
                        <span className="fas fa-arrow-up text-success me-1"></span>
                        12.5% from last month
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-4">
              <div className="card h-100" style={cardStyle}>
                <div className="card-body" style={cardBodyStyle}>
                  <div className="d-flex d-sm-block justify-content-between">
                    <div className="mb-3">
                      <h6 className="fw-bold fs-5 d-flex align-items-center mb-2">
                        <span className="fas fa-user-shield text-warning me-2"></span>
                        Active Roles
                      </h6>
                      <h4 className="fw-bold text-warning mb-2">2</h4>
                      <p className="fs-9 mb-0 fw-semibold text-body-tertiary">
                        <span className="fas fa-arrow-up text-success me-1"></span>
                        Roles assigned
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-4">
              <div className="card h-100" style={cardStyle}>
                <div className="card-body" style={cardBodyStyle}>
                  <div className="d-flex d-sm-block justify-content-between">
                    <div className="mb-3">
                      <h6 className="fw-bold fs-5 d-flex align-items-center mb-2">
                        <span className="fas fa-key text-info me-2"></span>
                        Permissions
                      </h6>
                      <h4 className="fw-bold text-info mb-2">23</h4>
                      <p className="fs-9 mb-0 fw-semibold text-body-tertiary">
                        <span className="fas fa-arrow-up text-success me-1"></span>
                        Permissions granted
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-4">
              <div className="card h-100" style={cardStyle}>
                <div className="card-body" style={cardBodyStyle}>
                  <div className="d-flex d-sm-block justify-content-between">
                    <div className="mb-3">
                      <h6 className="fw-bold fs-5 d-flex align-items-center mb-2">
                        <span className="fas fa-chart-line text-success me-2"></span>
                        System Health
                      </h6>
                      <h4 className="fw-bold text-success mb-2">98.5%</h4>
                      <p className="fs-9 mb-0 fw-semibold text-body-tertiary">
                        <span className="fas fa-arrow-up text-success me-1"></span>
                        Excellent performance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Management Section */}
      <div className="row g-3 mb-4" style={{ background: 'var(--phoenix-body-bg)', color: 'var(--phoenix-body-color)' }}>
        <div className="col-12">
          <div className="card" style={cardStyle}>
            <div className="card-header" style={cardHeaderStyle}>
              <h5 className="mb-0">System Management</h5>
            </div>
            <div className={`card-body`} style={cardBodyStyle}>
              <div className="row g-3">
                <div className="col-md-6 col-lg-3">
                  <div className="d-flex align-items-center p-3 border rounded-3" style={cardBodyStyle}>
                    <div className="flex-shrink-0">
                      <span className="fas fa-user-plus fs-3 text-primary"></span>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1">User Management</h6>
                      <p className="mb-0 fs-9 text-body-tertiary">Manage users and roles</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="d-flex align-items-center p-3 border rounded-3" style={cardBodyStyle}>
                    <div className="flex-shrink-0">
                      <span className="fas fa-shield-alt fs-3 text-warning"></span>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1">Role Management</h6>
                      <p className="mb-0 fs-9 text-body-tertiary">Configure user roles</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="d-flex align-items-center p-3 border rounded-3" style={cardBodyStyle}>
                    <div className="flex-shrink-0">
                      <span className="fas fa-cogs fs-3 text-info"></span>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1">System Settings</h6>
                      <p className="mb-0 fs-9 text-body-tertiary">Configure system options</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="d-flex align-items-center p-3 border rounded-3" style={cardBodyStyle}>
                    <div className="flex-shrink-0">
                      <span className="fas fa-database fs-3 text-success"></span>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1">Database</h6>
                      <p className="mb-0 fs-9 text-body-tertiary">Database management</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Roles and Permissions Display */}
      <div className="row g-3" style={{ background: 'var(--phoenix-body-bg)', color: 'var(--phoenix-body-color)' }}>
        <div className="col-lg-6">
          <div className="card" style={cardStyle}>
            <div className="card-header" style={cardHeaderStyle}>
              <h5 className="mb-0">Your Roles</h5>
            </div>
            <div className="card-body" style={cardBodyStyle}>
              {roles.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {roles.map((role, index) => (
                    <span key={index} className="badge bg-primary fs-9">
                      {role.name || role}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-body-tertiary mb-0">No roles assigned</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card" style={cardStyle}>
            <div className="card-header" style={cardHeaderStyle}>
              <h5 className="mb-0">Your Permissions</h5>
            </div>
            <div className="card-body" style={cardBodyStyle}>
              {permissions.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {permissions.map((permission, index) => (
                    <span key={index} className="badge bg-success fs-9">
                      {permission}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-body-tertiary mb-0">No permissions granted</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Role Management Section - Only for Admins */}
      {roles.some(role => (typeof role === 'string' && role.toLowerCase() === 'admin') || (typeof role === 'object' && role.name && role.name.toLowerCase() === 'admin')) && (
        <AdminRolePanel />
      )}
    </div>
  );
};

export default AdminDashboard; 