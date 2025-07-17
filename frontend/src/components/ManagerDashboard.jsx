import React from "react";
import { useAuth } from "../hooks/useAuth";

const ManagerDashboard = () => {
  const { user, roles, permissions } = useAuth();
  
  return (
    <div className="content">
      <div className="row gy-3 mb-4 justify-content-between">
        <div className="col-xxl-6">
          <h2 className="mb-2 text-body-emphasis">Manager Dashboard</h2>
          <h5 className="text-body-tertiary fw-semibold mb-4">Team management and performance overview</h5>
          <div className="row g-3 mb-3">
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex d-sm-block justify-content-between">
                    <div className="mb-3">
                      <h6 className="fw-bold fs-5 d-flex align-items-center mb-2">
                        <span className="fas fa-users text-primary me-2"></span>
                        Team Members
                      </h6>
                      <h4 className="fw-bold text-primary mb-2">24</h4>
                      <p className="fs-9 mb-0 fw-semibold text-body-tertiary">
                        <span className="fas fa-arrow-up text-success me-1"></span>
                        3 new this month
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex d-sm-block justify-content-between">
                    <div className="mb-3">
                      <h6 className="fw-bold fs-5 d-flex align-items-center mb-2">
                        <span className="fas fa-handshake text-warning me-2"></span>
                        Active Deals
                      </h6>
                      <h4 className="fw-bold text-warning mb-2">156</h4>
                      <p className="fs-9 mb-0 fw-semibold text-body-tertiary">
                        <span className="fas fa-arrow-up text-success me-1"></span>
                        8.2% increase
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex d-sm-block justify-content-between">
                    <div className="mb-3">
                      <h6 className="fw-bold fs-5 d-flex align-items-center mb-2">
                        <span className="fas fa-dollar-sign text-success me-2"></span>
                        Revenue
                      </h6>
                      <h4 className="fw-bold text-success mb-2">$2.4M</h4>
                      <p className="fs-9 mb-0 fw-semibold text-body-tertiary">
                        <span className="fas fa-arrow-up text-success me-1"></span>
                        15.3% this quarter
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex d-sm-block justify-content-between">
                    <div className="mb-3">
                      <h6 className="fw-bold fs-5 d-flex align-items-center mb-2">
                        <span className="fas fa-target text-info me-2"></span>
                        Conversion Rate
                      </h6>
                      <h4 className="fw-bold text-info mb-2">23.5%</h4>
                      <p className="fs-9 mb-0 fw-semibold text-body-tertiary">
                        <span className="fas fa-arrow-up text-success me-1"></span>
                        2.1% improvement
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance Section */}
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Team Performance</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Team Member</th>
                      <th>Deals</th>
                      <th>Revenue</th>
                      <th>Conversion</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-2xl me-3">
                            <img className="rounded-circle" src="/phoenix/v1.20.1/assets/img/team/1.webp" alt="" />
                          </div>
                          <div>
                            <h6 className="mb-0">John Smith</h6>
                            <p className="mb-0 fs-9 text-body-tertiary">Senior Sales</p>
                          </div>
                        </div>
                      </td>
                      <td>45</td>
                      <td>$450K</td>
                      <td>28.5%</td>
                      <td><span className="badge bg-success">On Track</span></td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-2xl me-3">
                            <img className="rounded-circle" src="/phoenix/v1.20.1/assets/img/team/2.webp" alt="" />
                          </div>
                          <div>
                            <h6 className="mb-0">Sarah Johnson</h6>
                            <p className="mb-0 fs-9 text-body-tertiary">Account Manager</p>
                          </div>
                        </div>
                      </td>
                      <td>38</td>
                      <td>$380K</td>
                      <td>25.2%</td>
                      <td><span className="badge bg-warning">Needs Attention</span></td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-2xl me-3">
                            <img className="rounded-circle" src="/phoenix/v1.20.1/assets/img/team/3.webp" alt="" />
                          </div>
                          <div>
                            <h6 className="mb-0">Mike Davis</h6>
                            <p className="mb-0 fs-9 text-body-tertiary">Sales Rep</p>
                          </div>
                        </div>
                      </td>
                      <td>32</td>
                      <td>$320K</td>
                      <td>22.1%</td>
                      <td><span className="badge bg-success">On Track</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-primary">
                  <span className="fas fa-plus me-2"></span>
                  Add New Team Member
                </button>
                <button className="btn btn-outline-primary">
                  <span className="fas fa-chart-bar me-2"></span>
                  Generate Report
                </button>
                <button className="btn btn-outline-primary">
                  <span className="fas fa-calendar me-2"></span>
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Your Permissions</h5>
            </div>
            <div className="card-body">
              {permissions.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {permissions.map((permission, index) => (
                    <span key={index} className="badge bg-info fs-9">
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
    </div>
  );
};

export default ManagerDashboard; 