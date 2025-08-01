import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import ErrorMessage from "./ErrorMessage";

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchLead = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/leads/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLead(res.data);
      } catch {
        setError("Failed to fetch lead details");
      }
    };
    fetchLead();
    
  }, [id]);
  if (error) return <ErrorMessage message={error} />;
  if (!lead) return <div>Loading...</div>;
  return (
    <>
      <nav className="mb-3" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><a href="#!">Leads</a></li>
          <li className="breadcrumb-item active">Lead Details</li>
        </ol>
      </nav>
      <div className="pb-6">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Lead Details</h2>
        </div>
        <div className="row g-3">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Lead Information</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Lead Name</label>
                    <p className="mb-0">{lead.name}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Status</label>
                    <p className="mb-0">
                      <span className="badge badge-phoenix badge-phoenix-primary">{lead.status}</span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Email</label>
                    <p className="mb-0">{lead.email}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Phone</label>
                    <p className="mb-0">{lead.phone}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Company</label>
                    <p className="mb-0">{lead.company}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Assigned To</label>
                    <p className="mb-0">{lead.assigned_to}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Source</label>
                    <p className="mb-0">{lead.source}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card mt-3">
              <div className="card-header">
                <h5 className="mb-0">Notes</h5>
              </div>
              <div className="card-body">
                <p>{lead.notes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadDetails; 