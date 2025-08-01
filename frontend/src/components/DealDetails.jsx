import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../AuthContext";
import { ThemeContext } from "../ThemeContext";

const DealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    value: '',
    stage: '',
    contact_id: '',
    owner_id: ''
  });
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const isAdmin = user?.roles?.includes("Admin");

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await api.get(`/deals/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDeal(res.data);
        // Initialize edit form with current deal data
        setEditForm({
          title: res.data.title || '',
          value: res.data.value || '',
          stage: res.data.stage || '',
          contact_id: res.data.contact_id || '',
          owner_id: res.data.owner_id || ''
        });
        console.log("Deal details:", res.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Deal not found.");
        } else {
          setError("An error occurred while fetching the deal.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDeal();
  }, [id]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateDeal = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await api.put(`/deals/${id}`, {
        ...editForm,
        value: Number(editForm.value),
        contact_id: Number(editForm.contact_id),
        owner_id: Number(editForm.owner_id)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh deal data
      const updatedRes = await api.get(`/deals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeal(updatedRes.data);
      setShowEditModal(false);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update deal.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteDeal = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/deals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      navigate('/deals');
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete deal.");
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdateStage = async (newStage) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await api.patch(`/deals/${id}/stage`, {
        stage: newStage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh deal data
      const updatedRes = await api.get(`/deals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeal(updatedRes.data);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update stage.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: 400}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-4">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
        <h4 className="text-muted">No deal found</h4>
      </div>
    );
  }

  const getStageBadgeColor = (stage) => {
    switch (stage?.toLowerCase()) {
      case 'new': return 'bg-primary';
      case 'in progress': return 'bg-info';
      case 'pending': return 'bg-warning';
      case 'completed': return 'bg-success';
      case 'canceled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const DEAL_STAGES = [
    { key: "New", label: "New" },
    { key: "In Progress", label: "In Progress" },
    { key: "Pending", label: "Pending" },
    { key: "Canceled", label: "Canceled" },
    { key: "Completed", label: "Completed" },
  ];

  return (
    <div className="content" style={{ width: '100%', padding: '0 1rem' }}>
      {/* Breadcrumb */}
      <nav className="mb-3" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to="/deals" style={{ color: 'var(--phoenix-link-color)' }}>Deals</Link>
          </li>
          <li className="breadcrumb-item active" style={{ color: 'var(--phoenix-emphasis-color)' }}>
            Deal Details
          </li>
        </ol>
      </nav>

      <div className="pb-6">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-2 fw-bold" style={{ color: 'var(--phoenix-emphasis-color)' }}>
              {deal.title}
            </h2>
            <p className="text-muted mb-0">
              Deal ID: {deal.id}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/deals" className="btn btn-outline-secondary">
              <i className="fas fa-arrow-left me-2"></i>
              Back to Deals
            </Link>
            {isAdmin && (
              <button className="btn btn-primary" onClick={() => setShowEditModal(true)}>
                <i className="fas fa-edit me-2"></i>
                Edit Deal
              </button>
            )}
          </div>
        </div>

        <div className="row g-4">
          {/* Main Deal Information */}
          <div className="col-lg-8">
            <div className="card h-100" style={{
              backgroundColor: 'var(--phoenix-card-bg)',
              border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: '1rem'
            }}>
              <div className="card-header bg-transparent border-bottom" style={{
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}>
                <h5 className="mb-0 fw-bold" style={{ color: 'var(--phoenix-emphasis-color)' }}>
                  <i className="fas fa-info-circle me-2" style={{ color: 'var(--phoenix-primary)' }}></i>
                  Deal Information
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-4">
                  {/* Deal Value */}
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 rounded" style={{
                      backgroundColor: theme === 'dark' ? 'rgba(79,140,255,0.1)' : 'rgba(79,140,255,0.05)',
                      border: `1px solid ${theme === 'dark' ? 'rgba(79,140,255,0.2)' : 'rgba(79,140,255,0.1)'}`
                    }}>
                      <div className="me-3">
                        <i className="fas fa-dollar-sign fa-2x" style={{ color: 'var(--phoenix-primary)' }}></i>
                      </div>
                      <div>
                        <p className="mb-1 text-muted" style={{ fontSize: '0.875rem' }}>Deal Value</p>
                        <h4 className="mb-0 fw-bold" style={{ color: 'var(--phoenix-emphasis-color)' }}>
                          ${Number(deal.value).toLocaleString()}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Deal Stage */}
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 rounded" style={{
                      backgroundColor: theme === 'dark' ? 'rgba(111,207,151,0.1)' : 'rgba(111,207,151,0.05)',
                      border: `1px solid ${theme === 'dark' ? 'rgba(111,207,151,0.2)' : 'rgba(111,207,151,0.1)'}`
                    }}>
                      <div className="me-3">
                        <i className="fas fa-chart-line fa-2x" style={{ color: 'var(--phoenix-success)' }}></i>
                      </div>
                      <div>
                        <p className="mb-1 text-muted" style={{ fontSize: '0.875rem' }}>Current Stage</p>
                        <span className={`badge ${getStageBadgeColor(deal.stage)} fs-6`}>
                          {deal.stage || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Owner Information */}
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 rounded" style={{
                      backgroundColor: theme === 'dark' ? 'rgba(242,201,76,0.1)' : 'rgba(242,201,76,0.05)',
                      border: `1px solid ${theme === 'dark' ? 'rgba(242,201,76,0.2)' : 'rgba(242,201,76,0.1)'}`
                    }}>
                      <div className="me-3">
                        <i className="fas fa-user fa-2x" style={{ color: 'var(--phoenix-warning)' }}></i>
                      </div>
                      <div>
                        <p className="mb-1 text-muted" style={{ fontSize: '0.875rem' }}>Deal Owner</p>
                        <h6 className="mb-0 fw-bold" style={{ color: 'var(--phoenix-emphasis-color)' }}>
                          User ID: {deal.owner_id}
                        </h6>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 rounded" style={{
                      backgroundColor: theme === 'dark' ? 'rgba(235,87,87,0.1)' : 'rgba(235,87,87,0.05)',
                      border: `1px solid ${theme === 'dark' ? 'rgba(235,87,87,0.2)' : 'rgba(235,87,87,0.1)'}`
                    }}>
                      <div className="me-3">
                        <i className="fas fa-address-book fa-2x" style={{ color: 'var(--phoenix-danger)' }}></i>
                      </div>
                      <div>
                        <p className="mb-1 text-muted" style={{ fontSize: '0.875rem' }}>Contact</p>
                        <h6 className="mb-0 fw-bold" style={{ color: 'var(--phoenix-emphasis-color)' }}>
                          Contact ID: {deal.contact_id}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Information */}
          <div className="col-lg-4">
            <div className="card h-100" style={{
              backgroundColor: 'var(--phoenix-card-bg)',
              border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: '1rem'
            }}>
              <div className="card-header bg-transparent border-bottom" style={{
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}>
                <h5 className="mb-0 fw-bold" style={{ color: 'var(--phoenix-emphasis-color)' }}>
                  <i className="fas fa-clock me-2" style={{ color: 'var(--phoenix-primary)' }}></i>
                  Timeline
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="timeline">
                  {/* Created */}
                  <div className="timeline-item mb-3">
                    <div className="d-flex align-items-start">
                      <div className="timeline-marker me-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: 'var(--phoenix-success)',
                          color: 'white'
                        }}>
                          <i className="fas fa-plus" style={{ fontSize: '12px' }}></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-bold" style={{ color: 'var(--phoenix-emphasis-color)' }}>
                          Deal Created
                        </h6>
                        <p className="mb-0 text-muted" style={{ fontSize: '0.875rem' }}>
                          {deal.created_at ? new Date(deal.created_at).toLocaleString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Updated */}
                  {deal.updated_at && deal.updated_at !== deal.created_at && (
                    <div className="timeline-item mb-3">
                      <div className="d-flex align-items-start">
                        <div className="timeline-marker me-3">
                          <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: 'var(--phoenix-info)',
                            color: 'white'
                          }}>
                            <i className="fas fa-edit" style={{ fontSize: '12px' }}></i>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold" style={{ color: 'var(--phoenix-emphasis-color)' }}>
                            Last Updated
                          </h6>
                          <p className="mb-0 text-muted" style={{ fontSize: '0.875rem' }}>
                            {new Date(deal.updated_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stage Changes */}
                  <div className="timeline-item">
                    <div className="d-flex align-items-start">
                      <div className="timeline-marker me-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: 'var(--phoenix-warning)',
                          color: 'white'
                        }}>
                          <i className="fas fa-chart-line" style={{ fontSize: '12px' }}></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-bold" style={{ color: 'var(--phoenix-emphasis-color)' }}>
                          Current Stage
                        </h6>
                        <p className="mb-0 text-muted" style={{ fontSize: '0.875rem' }}>
                          {deal.stage || 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card" style={{
              backgroundColor: 'var(--phoenix-card-bg)',
              border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: '1rem'
            }}>
              <div className="card-header bg-transparent border-bottom" style={{
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}>
                <h5 className="mb-0 fw-bold" style={{ color: 'var(--phoenix-emphasis-color)' }}>
                  <i className="fas fa-cogs me-2" style={{ color: 'var(--phoenix-primary)' }}></i>
                  Actions
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="d-flex gap-3 flex-wrap">
                  {isAdmin && (
                    <>
                      <button className="btn btn-outline-primary" onClick={() => setShowEditModal(true)}>
                        <i className="fas fa-edit me-2"></i>
                        Edit Deal
                      </button>
                      <div className="dropdown d-inline-block">
                        <button className="btn btn-outline-success dropdown-toggle" type="button" data-bs-toggle="dropdown">
                          <i className="fas fa-chart-line me-2"></i>
                          Update Stage
                        </button>
                        <ul className="dropdown-menu">
                          {DEAL_STAGES.map(stage => (
                            <li key={stage.key}>
                              <button 
                                className="dropdown-item" 
                                onClick={() => handleUpdateStage(stage.key)}
                                disabled={updating}
                              >
                                {stage.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                  <button className="btn btn-outline-info">
                    <i className="fas fa-file-alt me-2"></i>
                    Generate Report
                  </button>
                  <button className="btn btn-outline-warning">
                    <i className="fas fa-share me-2"></i>
                    Share Deal
                  </button>
                  {isAdmin && (
                    <button className="btn btn-outline-danger" onClick={() => setShowDeleteModal(true)}>
                      <i className="fas fa-trash me-2"></i>
                      Delete Deal
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Deal Modal */}
      {showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Deal</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleUpdateDeal}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Deal Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="title" 
                      value={editForm.title} 
                      onChange={handleEditChange} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Deal Value</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="value" 
                      value={editForm.value} 
                      onChange={handleEditChange} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Stage</label>
                    <select 
                      className="form-select" 
                      name="stage" 
                      value={editForm.stage} 
                      onChange={handleEditChange} 
                      required
                    >
                      <option value="">Select Stage</option>
                      {DEAL_STAGES.map(stage => (
                        <option key={stage.key} value={stage.key}>{stage.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contact ID</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="contact_id" 
                      value={editForm.contact_id} 
                      onChange={handleEditChange} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Owner ID</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="owner_id" 
                      value={editForm.owner_id} 
                      onChange={handleEditChange} 
                      required 
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={updating}>
                    {updating ? "Updating..." : "Update Deal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">Delete Deal</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="text-center">
                  <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                  <h5>Are you sure you want to delete this deal?</h5>
                  <p className="text-muted">This action cannot be undone. The deal "{deal.title}" will be permanently removed.</p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteDeal} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete Deal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealDetails; 