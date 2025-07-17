import React from "react";
import { useAuth } from "../hooks/useAuth";
import Deals from "./Deals";
import Leads from "./Leads";

const Dashboard = () => {
  const { roles } = useAuth();
  const isAdmin = roles && roles.includes("admin");
  const isUser = roles && roles.includes("user");
  const isClient = roles && roles.includes("client");

  return (
    <div className="content">
      <div className="row gy-3 mb-4 justify-content-between">
        <div className="col-xxl-6">
          <h2 className="mb-2">CRM Dashboard</h2>
          <h5 className="fw-semibold mb-4">Check your business growth in one place</h5>
          {(isAdmin || isUser || isClient) && (
            <div className="mb-3">
              {isAdmin && <div className="alert alert-info">Admin View: You can see and manage all leads and users.</div>}
              {isUser && !isAdmin && <div className="alert alert-info">User View: You can see and manage your assigned leads.</div>}
              {isClient && !isAdmin && !isUser && <div className="alert alert-success">Client View: You can see your assigned leads.</div>}
            </div>
          )}
          <div className="row g-3 mb-3">
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-4">
              <div className="card h-100 border-0 shadow-none" style={{ backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
                <div className="card-body">
                  <div className="d-flex d-sm-block justify-content-between">
                    <div className="mb-3">
                      <h6 className="fw-bold fs-5 d-flex align-items-center mb-2">
                        <span className="fa-solid fa-phone-alt text-info me-2" style={{fontSize: 28}}></span>
                        Outgoing call
                      </h6>
                      <h4 className="fw-bold text-info mb-2">3 Leads Today</h4>
                      <p className="fs-9 mb-0 fw-semibold text-body-tertiary">
                        <span className="badge bg-success-subtle text-success me-1">+24.5%</span>
                        Than Yesterday
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-xl-3 col-xxl-4">
              <div className="card h-100 border-0 shadow-none" style={{ backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
                <div className="card-body">
                  <div className="d-flex d-sm-block justify-content-between">
                    <div className="mb-3">
                      <h6 className="fw-bold fs-5 d-flex align-items-center mb-2">
                        <span className="fa-solid fa-calendar text-info me-2"></span>
                        Outgoing meeting
                      </h6>
                      <h4 className="fw-bold text-info mb-2">12 This Week</h4>
                      <p className="fs-9 mb-0 fw-semibold text-body-tertiary">
                        <span className="badge bg-success-subtle text-success me-1">+24.5%</span>
                        Than last week
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-4">
              <div className="card h-100 border-0 shadow-none" style={{ backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
                <div className="card-body">
                  <h5 className="mb-3">Top 5 Lead Sources</h5>
                  <ol className="mb-0 ps-3">
                    <li>None</li>
                    <li>Online Store</li>
                    <li>Advertisement</li>
                    <li>Seminar Partner</li>
                    <li>Partner</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-5">
        <h3>Contacts Created</h3>
        <p className="text-body-tertiary mb-1">Payment received across all channels</p>
        <div className="echart-contacts-created" style={{minHeight: '270px', width: '100%'}}></div>
      </div>
      {/* Deals section visible on all screens */}
      <Deals />
      {/* Leads section visible for all, but you can restrict further if needed */}
      <Leads />
      {/* You can add more role/permission-based sections here */}
    </div>
  );
};

export default Dashboard; 