import React, { useEffect, useState, useContext } from "react";
import { useAuth } from "../hooks/useAuth";
import { ThemeContext } from "../ThemeContext";
import { Link } from "react-router-dom";
import api from "../api";

const Leads = () => {
  // ... existing state ...
  const { user, roles } = useAuth();
  const { theme } = useContext(ThemeContext);
  // ... rest of the code ...

  // ... inside the return ...
  return (
    <div className="container-fluid px-0 px-md-3">
      {/* ... existing code ... */}
      <div className="mb-5">
        <div className="d-flex align-items-center mb-2">
          <h2 className="mb-0">{leads.length} Leads</h2>
          {isAdmin && (
            <span className="badge bg-primary ms-3">Admin View: All Leads</span>
          )}
        </div>
        <div className="row g-3 justify-content-between mb-4">
          <div className="col-auto">
            <div className="d-md-flex justify-content-between">
              <div>
                <button className="btn btn-primary me-4" onClick={handleOpenModal}>
                  <span className="fas fa-plus me-2"></span>Create Lead
                </button>
                <button className="btn btn-link px-0" type="button">
                  <span className="fa-solid fa-file-export fs-9 me-2"></span>
                  <span className={theme === "dark" ? "text-link-dark" : "text-link-light"}>Export</span>
                </button>
              </div>
            </div>
          </div>
          {/* ... existing code ... */}
        </div>
        <div className="table-responsive scrollbar mx-n1 px-1">
          {loading ? (
            <div className="text-center p-4">Loading leads...</div>
          ) : error ? (
            <div className="text-danger text-center p-4">{error}</div>
          ) : (
            <table className="table fs-9 mb-0 leads-table border-top border-translucent">
              <thead>
                {/* ... existing code ... */}
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover-actions-trigger btn-reveal-trigger position-static">
                    {/* ... existing code ... */}
                    <td className="email align-middle white-space-nowrap fw-semibold ps-4 border-end border-translucent">
                      <a className={theme === "dark" ? "text-link-dark" : "text-link-light"} href={`mailto:${lead.email}`}>{lead.email}</a>
                    </td>
                    <td className="phone align-middle white-space-nowrap fw-semibold ps-4 border-end border-translucent">
                      <a className={theme === "dark" ? "text-link-dark" : "text-link-light"} href={`tel:${lead.phone}`}>{lead.phone}</a>
                    </td>
                    <td className="status align-middle white-space-nowrap ps-4 border-end border-translucent fw-semibold">
                      <span className={theme === "dark" ? "text-body-dark" : "text-body-light"}>{lead.status}</span>
                    </td>
                    <td className="company align-middle white-space-nowrap text-opacity-85 ps-4 border-end border-translucent fw-semibold">
                      <span className={theme === "dark" ? "text-body-dark" : "text-body-light"}>{lead.company}</span>
                    </td>
                    <td className="assigned align-middle white-space-nowrap text-opacity-85 ps-4">
                      <span className={theme === "dark" ? "text-body-dark" : "text-body-light"}>{lead.assigned_to}</span>
                    </td>
                    {/* ... existing code ... */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
// ... existing code ... 