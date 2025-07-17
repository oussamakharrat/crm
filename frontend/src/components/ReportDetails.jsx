import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/reports/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!res.ok) {
          if (res.status === 404) throw new Error("Report not found.");
          throw new Error("Failed to fetch report.");
        }
        const data = await res.json();
        setReport(data);
      } catch (err) {
        setError(err.message);
      }
    };
    if (id) fetchReport();
  }, [id]);
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!report) return <div>Loading...</div>;
  return (
    <>
      <nav className="mb-3" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><a href="/reports">Reports</a></li>
          <li className="breadcrumb-item active">Report Details</li>
        </ol>
      </nav>
      <div className="pb-6">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{report.name || report.title || "Report"}</h2>
        </div>
        <div className="row g-3">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Report Summary</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Type</label>
                    <p className="mb-0">{report.type || '--'}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Status</label>
                    <p className="mb-0">{report.status || '--'}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Created At</label>
                    <p className="mb-0">{report.created_at ? new Date(report.created_at).toLocaleString() : '--'}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Updated At</label>
                    <p className="mb-0">{report.updated_at ? new Date(report.updated_at).toLocaleString() : '--'}</p>
                  </div>
                  {report.description && (
                    <div className="col-12">
                      <label className="form-label fw-bold">Description</label>
                      <p className="mb-0">{report.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Report Actions</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary">Download PDF</button>
                  <button className="btn btn-outline-secondary">Download Excel</button>
                  <button className="btn btn-outline-info">Schedule Report</button>
                  <button className="btn btn-outline-warning">Edit Report</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportDetails; 