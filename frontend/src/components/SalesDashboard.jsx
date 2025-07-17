import React from "react";
import { useAuth } from "../hooks/useAuth";

const SalesDashboard = () => {
  const { user, roles, permissions } = useAuth();
  
  return (
    <div className="content">
      <div className="row gy-3 mb-4 justify-content-between">
        <div className="col-xxl-6">
          <h2 className="mb-2 text-body-emphasis">Sales Dashboard</h2>
          <h5 className="text-body-tertiary fw-semibold mb-4">Track your sales performance and leads</h5>
          <div className="row g-3 mb-3">
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-4">
              <div className="card h-100" style={{ backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
                <div className="card-body">
                  <div className="d-flex d-sm-block justify-content-between">
                    <div className="mb-3">
                      <h6 className="fw-bold fs-5 d-flex align-items-center mb-2">
                        <span className="fas fa-handshake text-primary me-2"></span>
                        My Deals
                      </h6>
                      <h4 className="fw-bold text-primary mb-2">23</h4>
                      <p className="fs-9 mb-0 fw-semibold text-body-tertiary">
                        <span className="fas fa-arrow-up text-success me-1"></span>
                        5 new this week
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-4">
              <div className="card h-100" style={{ backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
                <div className="card-body">
                  <div className="d-flex d-sm-block justify-content-between">
                    <div className="mb-3">
                      <h6 className="fw-bold fs-5 d-flex align-items-center mb-2">
                        <span className="fas fa-dollar-sign text-success me-2"></span>
                        Revenue
                      </h6>
                      <h4 className="fw-bold text-success mb-2">$125K</h4>
                      <p className="fs-9 mb-0 fw-semibold text-body-tertiary">
                        <span className="fas fa-arrow-up text-success me-1"></span>
                        12.5% this month
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-4">
              <div className="card h-100" style={{ backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
                <div className="card-body">
                  <div className="d-flex d-sm-block justify-content-between">
                    <div className="mb-3">
                      <h6 className="fw-bold fs-5 d-flex align-items-center mb-2">
                        <span className="fas fa-user-plus text-warning me-2"></span>
                        New Leads
                      </h6>
                      <h4 className="fw-bold text-warning mb-2">18</h4>
                      <p className="fs-9 mb-0 fw-semibold text-body-tertiary">
                        <span className="fas fa-arrow-up text-success me-1"></span>
                        3 today
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-4">
              <div className="card h-100" style={{ backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
                <div className="card-body">
                  <div className="d-flex d-sm-block justify-content-between">
                    <div className="mb-3">
                      <h6 className="fw-bold fs-5 d-flex align-items-center mb-2">
                        <span className="fas fa-target text-info me-2"></span>
                        Conversion
                      </h6>
                      <h4 className="fw-bold text-info mb-2">28.5%</h4>
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

      {/* Recent Deals Section */}
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="card" style={{ backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
            <div className="card-header" style={{ backgroundColor: 'var(--phoenix-card-header-bg) !important', color: 'var(--phoenix-card-header-color) !important', borderBottom: '1px solid var(--phoenix-card-border-color) !important' }}>
              <h5 className="mb-0">Recent Deals</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Deal Name</th>
                      <th>Company</th>
                      <th>Value</th>
                      <th>Stage</th>
                      <th>Probability</th>
                      <th>Close Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-2xl me-3">
                            <div className="avatar-name rounded-circle bg-primary">
                              <span className="fs-7 text-white">AC</span>
                            </div>
                          </div>
                          <div>
                            <h6 className="mb-0">Enterprise Software License</h6>
                            <p className="mb-0 fs-9 text-body-tertiary">#DEAL-001</p>
                          </div>
                        </div>
                      </td>
                      <td>Acme Corp</td>
                      <td>$50,000</td>
                      <td><span className="badge bg-warning">Negotiation</span></td>
                      <td>75%</td>
                      <td>Dec 15, 2024</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-2xl me-3">
                            <div className="avatar-name rounded-circle bg-success">
                              <span className="fs-7 text-white">TC</span>
                            </div>
                          </div>
                          <div>
                            <h6 className="mb-0">Consulting Services</h6>
                            <p className="mb-0 fs-9 text-body-tertiary">#DEAL-002</p>
                          </div>
                        </div>
                      </td>
                      <td>TechCorp</td>
                      <td>$25,000</td>
                      <td><span className="badge bg-success">Closed Won</span></td>
                      <td>100%</td>
                      <td>Dec 10, 2024</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-2xl me-3">
                            <div className="avatar-name rounded-circle bg-info">
                              <span className="fs-7 text-white">GC</span>
                            </div>
                          </div>
                          <div>
                            <h6 className="mb-0">Annual Maintenance</h6>
                            <p className="mb-0 fs-9 text-body-tertiary">#DEAL-003</p>
                          </div>
                        </div>
                      </td>
                      <td>Global Corp</td>
                      <td>$15,000</td>
                      <td><span className="badge bg-primary">Proposal</span></td>
                      <td>60%</td>
                      <td>Dec 20, 2024</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Pipeline */}
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="card" style={{ backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
            <div className="card-header" style={{ backgroundColor: 'var(--phoenix-card-header-bg) !important', color: 'var(--phoenix-card-header-color) !important', borderBottom: '1px solid var(--phoenix-card-border-color) !important' }}>
              <h5 className="mb-0">Sales Pipeline</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="text-center p-3 border rounded-3" style={{ background: 'var(--phoenix-card-bg)', color: 'var(--phoenix-card-color)' }}>
                    <h4 className="text-primary mb-1">12</h4>
                    <p className="mb-0 fs-9 text-body-tertiary">Qualified Leads</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center p-3 border rounded-3" style={{ background: 'var(--phoenix-card-bg)', color: 'var(--phoenix-card-color)' }}>
                    <h4 className="text-warning mb-1">8</h4>
                    <p className="mb-0 fs-9 text-body-tertiary">Proposals</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center p-3 border rounded-3" style={{ background: 'var(--phoenix-card-bg)', color: 'var(--phoenix-card-color)' }}>
                    <h4 className="text-info mb-1">5</h4>
                    <p className="mb-0 fs-9 text-body-tertiary">Negotiation</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center p-3 border rounded-3" style={{ background: 'var(--phoenix-card-bg)', color: 'var(--phoenix-card-color)' }}>
                    <h4 className="text-success mb-1">3</h4>
                    <p className="mb-0 fs-9 text-body-tertiary">Closed Won</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card" style={{ backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
            <div className="card-header" style={{ backgroundColor: 'var(--phoenix-card-header-bg) !important', color: 'var(--phoenix-card-header-color) !important', borderBottom: '1px solid var(--phoenix-card-border-color) !important' }}>
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-primary">
                  <span className="fas fa-plus me-2"></span>
                  Add New Lead
                </button>
                <button className="btn btn-outline-primary">
                  <span className="fas fa-file-alt me-2"></span>
                  Create Proposal
                </button>
                <button className="btn btn-outline-primary">
                  <span className="fas fa-calendar me-2"></span>
                  Schedule Follow-up
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card" style={{ backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
            <div className="card-header" style={{ backgroundColor: 'var(--phoenix-card-header-bg) !important', color: 'var(--phoenix-card-header-color) !important', borderBottom: '1px solid var(--phoenix-card-border-color) !important' }}>
              <h5 className="mb-0">Your Permissions</h5>
            </div>
            <div className="card-body">
              {permissions.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {permissions.map((permission, index) => (
                    <span key={index} className="badge bg-warning fs-9">
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

export default SalesDashboard; 