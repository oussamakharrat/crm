import React from "react";
import { useAuth } from "../hooks/useAuth";
import AdminRolePanel from "./AdminRolePanel";

const AdminDashboard = () => {
  const { roles, permissions } = useAuth();

  return (
    <div className="content">
      <div className="row gy-3 mb-4 justify-content-between">
        <div className="col-xxl-6">
          <h2 className="mb-2 text-body-emphasis">CRM Dashboard</h2>
          <h5 className="text-body-tertiary fw-semibold mb-4">Check your business growth in one place</h5>
          <div className="row g-3 mb-3">
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex d-sm-block justify-content-between">
                    <div className="border-bottom-sm border-translucent mb-sm-4">
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center icon-wrapper-sm shadow-primary-100" style={{transform: 'rotate(-7.45deg)'}}><span className="fa-solid fa-phone-alt text-primary fs-7 z-1 ms-2"></span></div>
                        <p className="text-body-tertiary fs-9 mb-0 ms-2 mt-3">Outgoing call</p>
                      </div>
                      <p className="text-primary mt-2 fs-6 fw-bold mb-0 mb-sm-4">3 <span className="fs-8 text-body lh-lg">Leads Today</span></p>
                    </div>
                    <div className="d-flex flex-column justify-content-center flex-between-end d-sm-block text-end text-sm-start"><span className="badge badge-phoenix badge-phoenix-success fs-10 mb-2">+24.5%</span>
                      <p className="mb-0 fs-9 text-body-tertiary">Than Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex d-sm-block justify-content-between">
                    <div className="border-bottom-sm border-translucent mb-sm-4">
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center icon-wrapper-sm shadow-info-100" style={{transform: 'rotate(-7.45deg)'}}><span className="fa-solid fa-calendar text-info fs-7 z-1 ms-2"></span></div>
                        <p className="text-body-tertiary fs-9 mb-0 ms-2 mt-3">Outgoing meeting</p>
                      </div>
                      <p className="text-info mt-2 fs-6 fw-bold mb-0 mb-sm-4">12 <span className="fs-8 text-body lh-lg">This Week</span></p>
                    </div>
                    <div className="d-flex flex-column justify-content-center flex-between-end d-sm-block text-end text-sm-start"><span className="badge badge-phoenix badge-phoenix-warning fs-10 mb-2">+24.5%</span>
                      <p className="mb-0 fs-9 text-body-tertiary">Than last week</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-xl-6 col-xxl-4 gy-5 gy-md-3">
              <div className="border-bottom border-translucent">
                <h5 className="pb-4 border-bottom border-translucent">Top 5 Lead Sources</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent list-group-crm fw-bold text-body fs-9 py-2">
                    <span className="fw-normal fs-9 mx-1"><span className="fw-bold">1. </span>None </span><span>(65)</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent list-group-crm fw-bold text-body fs-9 py-2">
                    <span className="fw-normal mx-1"><span className="fw-bold">2. </span>Online Store</span><span>(74)</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent list-group-crm fw-bold text-body fs-9 py-2">
                    <span className="fw-normal fs-9 mx-1"><span className="fw-bold">3.</span> Advertisement</span><span>(32)</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent list-group-crm fw-bold text-body fs-9 py-2">
                    <span className="fw-normal fs-9 mx-1"><span className="fw-bold">4.</span> Seminar Partner</span><span>(25)</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent list-group-crm fw-bold text-body fs-9 py-2">
                    <span className="fw-normal fs-9 mx-1"><span className="fw-bold">5.</span> Partner</span><span>(23)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Example of dynamic section for roles/permissions, can be placed as needed */}
        <div className="row g-3 mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Your Roles</h5>
              </div>
              <div className="card-body">
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
        </div>
        <div className="row g-3 mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Your Permissions</h5>
              </div>
              <div className="card-body">
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
        {/* AdminRolePanel removed: now available on a dedicated page */}
      </div>
    </div>
  );
};

export default AdminDashboard; 