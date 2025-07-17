import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../ThemeContext";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";

const Reports = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReport, setNewReport] = useState({
    name: '',
    type: '',
    description: '',
    status: 'In Progress'
  });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
        const res = await fetch("/api/reports", { headers });
        const data = await res.json();
        setReports(Array.isArray(data) ? data : []);
      } catch (err) {
        setReports([]);
      }
      setLoading(false);
    };
    if (user?.token) fetchReports();
    else setLoading(false);
  }, [user]);

  const handleAddReportChange = (e) => {
    const { name, value } = e.target;
    setNewReport((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddReport = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError('');
    try {
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to add report');
      setShowAddForm(false);
      setNewReport({ name: '', type: '', description: '', status: 'In Progress' });
      // Refresh reports
      setLoading(true);
      const refreshed = await fetch('/api/reports', { headers });
      const data = await refreshed.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to add report.');
    } finally {
      setAdding(false);
      setLoading(false);
    }
  };

  const mainStyle = {
    background: 'var(--phoenix-body-bg)',
    color: 'var(--phoenix-body-color)'
  };
  const cardStyle = {
    background: 'var(--phoenix-card-bg)',
    color: 'var(--phoenix-card-color)',
    boxShadow: '0 4px 24px rgba(37,99,235,0.08)'
  };
  const tableStyle = {
    background: 'var(--phoenix-card-bg)',
    color: 'var(--phoenix-card-color)'
  };

  return (
    <>
      <nav className="mb-3" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
          <li className="breadcrumb-item"><a href="#">Reports</a></li>
          <li className="breadcrumb-item active">Overview</li>
        </ol>
      </nav>
      <div className="pb-6" style={mainStyle}>
        <h2 className="mb-4">Reports</h2>
        <div className="row g-3 justify-content-between mb-4">
          <div className="col-auto">
            <div className="d-md-flex justify-content-between">
              <div>
                <button className="btn btn-primary me-4" onClick={() => setShowAddForm((v) => !v)}>
                  <span className="fas fa-plus me-2"></span>Create Report
                </button>
                <button className="btn btn-link text-body px-0">
                  <span className="fa-solid fa-file-export fs-9 me-2"></span>Export
                </button>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <div className="d-flex">
              <div className="search-box me-2">
                <form className="position-relative">
                  <input className="form-control search-input search" type="search" placeholder="Search reports" aria-label="Search" />
                  <span className="fas fa-search search-box-icon"></span>
                </form>
              </div>
              <button className="btn px-3 btn-phoenix-secondary" type="button" data-bs-toggle="modal" data-bs-target="#filterModal">
                <span className="fa-solid fa-filter text-primary" data-fa-transform="down-3"></span>
              </button>
            </div>
          </div>
        </div>
        {/* Cards for the first 3 reports, fallback to static if not enough */}
        {showAddForm && (
          <div className="card mb-4" style={cardStyle}>
            <div className="card-body">
              <h5 className="card-title mb-3">Add New Report</h5>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleAddReport}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={newReport.name}
                    onChange={handleAddReportChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <input
                    type="text"
                    className="form-control"
                    name="type"
                    value={newReport.type}
                    onChange={handleAddReportChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={newReport.description}
                    onChange={handleAddReportChange}
                  />
                </div>
                <button className="btn btn-success me-2" type="submit" disabled={adding}>
                  {adding ? 'Adding...' : 'Add Report'}
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => setShowAddForm(false)} disabled={adding}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
        <div className="row g-3 mb-6">
          {(reports.length > 0 ? reports.slice(0, 3) : [
            { name: "Sales Report", type: "Sales", description: "", parameters: {}, status: "Completed" },
            { name: "Lead Conversion", type: "Leads", description: "", parameters: {}, status: "In Progress" },
            { name: "Revenue Growth", type: "Revenue", description: "", parameters: {}, status: "Completed" }
          ]).map((report, idx) => (
            <div className="col-sm-6 col-md-4" key={idx}>
              <div className="card overflow-hidden" style={{ minWidth: '12rem', backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
                <div className="bg-holder bg-card" style={{backgroundImage: `url(/phoenix-assets/assets/img/icons/spot-illustrations/corner-${(idx%3)+1}.png)`}}></div>
                <div className="card-body position-relative">
                  <h6>{report.name}</h6>
                  <div className="display-4 fs-4 fw-normal font-sans-serif text-info">{report.type || '--'}</div>
                  <a className="fw-bold fs-10 text-uppercase" href="#">View Details<span className="fas fa-chevron-right ms-1 fs-10"></span></a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={cardStyle}>
          <div className="card-header" style={{ backgroundColor: 'var(--phoenix-card-header-bg) !important', color: 'var(--phoenix-card-header-color) !important', borderBottom: '1px solid var(--phoenix-card-border-color) !important' }}>
            <h5 className="mb-0">Recent Reports</h5>
          </div>
          <div className="card-body" style={cardStyle}>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover" style={tableStyle}>
                  <thead>
                    <tr>
                      <th>Report Name</th>
                      <th>Type</th>
                      <th>Created</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.length === 0 ? (
                      <tr><td colSpan="5">No reports found.</td></tr>
                    ) : (
                      reports.map((report, idx) => (
                        <tr key={report.id || idx}>
                          <td>{report.name}</td>
                          <td><span className="badge badge-phoenix badge-phoenix-primary">{report.type}</span></td>
                          <td>{report.created_at ? new Date(report.created_at).toLocaleDateString() : '--'}</td>
                          <td><span className="badge badge-phoenix badge-phoenix-success">Completed</span></td>
                          <td>
                            {report.id ? (
                              <Link to={`/report-details/${report.id}`} className="btn btn-sm btn-outline-primary">View</Link>
                            ) : (
                              <button className="btn btn-sm btn-outline-primary" disabled>View</button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports; 