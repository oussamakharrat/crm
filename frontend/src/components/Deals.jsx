import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import api from "../api";
import { fetchClients } from '../api';
import "../assets/deals-fix.css";
import { ThemeContext } from "../ThemeContext";

const DEAL_STAGES = [
  { key: "New", label: "New" },
  { key: "In Progress", label: "In Progress" },
  { key: "Pending", label: "Pending" },
  { key: "Canceled", label: "Canceled" },
  { key: "Completed", label: "Completed" },
];

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const { user } = useContext(AuthContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: '',
    value: '',
    contact_id: '',
    owner_id: user?.id || '',
  });
  const { theme } = useContext(ThemeContext);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [editingDealId, setEditingDealId] = useState(null);
  const [newStage, setNewStage] = useState("");
  const [updating, setUpdating] = useState(false);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");

  const isAdmin = user?.roles?.includes("Admin");

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await api.get("/deals", {
          headers: {
            "Authorization": `Bearer ${user?.token}`
          }
        });
        setDeals(res.data);
      } catch {
        setDeals([]);
      }
    };
    if (user?.token) fetchDeals();
  }, [user]);

  useEffect(() => {
    if (showAddForm && user?.token) {
      fetchClients(user.token)
        .then(res => setClients(res.data))
        .catch(() => setClients([]));
    }
  }, [showAddForm, user]);

  const handleAddDealChange = (e) => {
    const { name, value } = e.target;
    setNewDeal((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDeal = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError('');
    try {
      await api.post(
        "/deals",
        {
          ...newDeal,
          value: Number(newDeal.value),
          contact_id: Number(newDeal.contact_id),
          owner_id: Number(user?.user_id),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setShowAddForm(false);
      setNewDeal({ title: '', value: '', contact_id: '', owner_id: user?.user_id || '' });
      const refreshed = await api.get("/deals", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setDeals(refreshed.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add deal.');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteDeal = async (dealId) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) return;
    try {
      await api.delete(`/deals/${dealId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const refreshed = await api.get("/deals", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setDeals(refreshed.data);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete deal.");
    }
  };

  const handleUpdateStage = async (dealId) => {
    setUpdating(true);
    try {
      await api.patch(
        `/deals/${dealId}/stage`,
        { stage: newStage },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setEditingDealId(null);
      setNewStage("");
      const refreshed = await api.get("/deals", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setDeals(refreshed.data);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update stage.");
    } finally {
      setUpdating(false);
    }
  };

  // Filter deals by search
  const filteredDeals = deals.filter(deal =>
    deal.title && deal.title.toLowerCase().includes(search.toLowerCase())
  );

  // Group filtered deals by stage
  const dealsByStage = DEAL_STAGES.reduce((acc, stage) => {
    acc[stage.key] = filteredDeals.filter(d => (d.stage || "New") === stage.key);
    return acc;
  }, {});

  // Placeholder forecast revenue per stage
  const forecastRevenue = (stageKey) => {
    const sum = (dealsByStage[stageKey] || []).reduce((a, d) => a + (Number(d.value) || 0), 0);
    return sum.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  };

  return (
    <div className="content kanban-deals-content" style={{ width: '100%', padding: '0 1rem' }}>
      <nav className="mb-3 crm-deals-breadcrumb" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><a href="#!">Page 1</a></li>
          <li className="breadcrumb-item"><a href="#!">Page 2</a></li>
          <li className="breadcrumb-item active">Default</li>
        </ol>
      </nav>
      <div>
        <div className="px-4 px-lg-6">
          <h2 className="mb-5 fw-bold">Deals</h2>
          <div className="d-xl-flex justify-content-between align-items-center mb-4 gap-3 flex-wrap">
            <div className="mb-3">
              <button className="btn btn-primary me-3 mb-2 mb-sm-0" type="button" onClick={() => setShowAddForm(true)}>
                <span className="fas fa-plus me-2"></span>Add Deal
              </button>
              <button className="btn btn-link text-body px-0 mb-2 mb-sm-0"><span className="fa-solid fa-file-export fs-9 me-2"></span>Export</button>
            </div>
            <div className="d-flex align-items-center mb-2 mb-sm-0 gap-2">
              <div className="search-box">
                <form className="position-relative" onSubmit={e => e.preventDefault()}>
                  <input
                    className="form-control search-input search"
                    type="search"
                    placeholder="Search by name"
                    aria-label="Search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <span className="fas fa-search search-box-icon"></span>
                </form>
              </div>
              <select className="form-select w-auto mx-2">
                <option>Deals</option>
              </select>
              <button className={`btn px-3 btn-phoenix-secondary ${theme === "light" ? "bg-body" : "bg-dark"}`} type="button" data-bs-toggle="modal" data-bs-target="#reportsFilterModal">
                <span className={`fa-solid fa-filter text-primary`}></span>
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 px-lg-6 scrollbar">
          <div className="row deals g-4" style={{ overflowX: 'auto' }}>
            {DEAL_STAGES.map(stage => (
              <div className="col-12 col-md-6 col-lg-4 d-flex" key={stage.key}>
                <div className="card flex-grow-1 w-100" style={{ minWidth: 0 }}>
                  <div className="card-header">
                    <div>
                      <h5 className="mb-2 fw-bold">{stage.label}</h5>
                      <p className="fs-9 text-body-tertiary mb-1">Forecast Revenue:</p>
                      <h4 className="mb-0 text-primary">{forecastRevenue(stage.key)}</h4>
                    </div>
                    <div className="d-flex gap-2">
                      <button className={`btn ${theme === "light" ? "btn-light" : "btn-dark"} p-1 shadow-sm ${theme === "light" ? "bg-body" : "bg-dark"}`} type="button" onClick={() => setShowAddForm(true)}><span className="fa-solid fa-plus"></span></button>
                      <button className={`btn ${theme === "light" ? "btn-light" : "btn-dark"} p-1 shadow-sm ${theme === "light" ? "bg-body" : "bg-dark"}`} type="button"><span className="fas fa-ellipsis-h fs-10"></span></button>
                    </div>
                  </div>
                  <div className="scrollbar deals-items-container py-2 px-1">
                    <div className="w-100 min-vh-50" data-sortable="data-sortable">
                      {dealsByStage[stage.key] && dealsByStage[stage.key].length > 0 ? (
                        dealsByStage[stage.key].map((deal) => (
                          <div className="card mb-3 shadow-sm border-0 rounded-3 deal-card" key={deal.id} style={{ 
                            border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                            backgroundColor: theme === 'dark' ? 'var(--phoenix-card-bg)' : 'var(--phoenix-card-bg)'
                          }}>
                            <div className="card-body p-3">
                              {/* Deal Header */}
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center gap-2">
                                  <span className="fa-solid fa-clock me-2" style={{color: 'var(--phoenix-primary)'}}></span>
                                  <p className={`mb-0 fs-9 fw-semibold ${theme === 'dark' ? 'text-white' : 'text-body-tertiary'}`}>
                                    {deal.created_at ? new Date(deal.created_at).toLocaleDateString() : ""}
                                  </p>
                                </div>
                                <div className="dropdown">
                                  <button className="btn btn-sm btn-link text-body-tertiary p-0" type="button" data-bs-toggle="dropdown">
                                    <span className="fa-solid fa-ellipsis-v"></span>
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end">
                                    <li><Link className="dropdown-item" to={`/deal-details/${deal.id}`}>View Details</Link></li>
                                    {isAdmin && (
                                      <>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><button className="dropdown-item text-warning" onClick={() => { setEditingDealId(deal.id); setNewStage(deal.stage || ""); }}>Edit Stage</button></li>
                                        <li><button className="dropdown-item text-danger" onClick={() => handleDeleteDeal(deal.id)}>Delete</button></li>
                                      </>
                                    )}
                                  </ul>
                                </div>
                              </div>

                              {/* Deal Title and Value */}
                              <div className="mb-3">
                                <h6 className="card-title mb-2">
                                  <Link className="text-decoration-none fw-bold" to={`/deal-details/${deal.id}`} style={{color: 'var(--phoenix-primary)'}}>
                                    {deal.title}
                                  </Link>
                                </h6>
                                <div className="d-flex align-items-center justify-content-between">
                                  <span className={`badge ${theme === "light" ? "bg-primary text-white" : "bg-primary text-white"} fs-9`}>
                                    ${deal.value?.toLocaleString()}
                                  </span>
                                  <span className={`badge ${theme === "light" ? "bg-success text-white" : "bg-success text-white"} fs-9`}>
                                    {deal.stage || 'Unknown'}
                                  </span>
                                </div>
                              </div>

                              {/* Deal Details */}
                              <div className="mb-3">
                                <div className="row g-2">
                                  <div className="col-6">
                                    <div className="d-flex align-items-center gap-1">
                                      <span className="fa-solid fa-user me-1" style={{fontSize: '12px', color: 'var(--phoenix-secondary)'}}></span>
                                      <span className={`${theme === 'dark' ? 'text-white' : 'text-body-secondary'} fw-semibold fs-9`}>
                                        Owner: {deal.owner_id}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="d-flex align-items-center gap-1">
                                      <span className="fa-solid fa-address-book me-1" style={{fontSize: '12px', color: 'var(--phoenix-secondary)'}}></span>
                                      <span className={`${theme === 'dark' ? 'text-white' : 'text-body-secondary'} fw-semibold fs-9`}>
                                        Contact: {deal.contact_id}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="d-flex gap-2 flex-wrap">
                                <Link to={`/deal-details/${deal.id}`} className="btn btn-outline-primary btn-sm flex-fill">
                                  <span className="fa-solid fa-eye me-1"></span>
                                  View Details
                                </Link>
                                {isAdmin && (
                                  <>
                                    {editingDealId === deal.id ? (
                                      <div className="d-flex gap-2 flex-wrap w-100 mt-2">
                                        <select className="form-select form-select-sm" value={newStage} onChange={e => setNewStage(e.target.value)} required style={{ flex: '1', minWidth: '120px' }}>
                                          <option value="" disabled>Select Stage</option>
                                          {DEAL_STAGES.map(s => (
                                            <option key={s.key} value={s.key}>{s.label}</option>
                                          ))}
                                        </select>
                                        <button className="btn btn-success btn-sm" type="button" onClick={() => handleUpdateStage(deal.id)} disabled={updating}>
                                          {updating ? "Updating..." : "Save"}
                                        </button>
                                        <button className="btn btn-secondary btn-sm" type="button" onClick={() => setEditingDealId(null)} disabled={updating}>
                                          Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <button className="btn btn-warning btn-sm" type="button" onClick={() => { setEditingDealId(deal.id); setNewStage(deal.stage || ""); }}>
                                        <span className="fa-solid fa-edit me-1"></span>
                                        Edit
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center text-body-tertiary">
                          <span className="fas fa-folder-open fa-2x mb-2"></span>
                          <p className="mb-0">No deals in this stage.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Add Deal Modal (structure only, not functional) */}
      {showAddForm && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="mb-0">Deal Informations</h3>
                <button className={`btn btn-sm btn-phoenix-secondary ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`} onClick={() => setShowAddForm(false)}><span className="fas fa-times"></span></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddDeal}>
                  <div className="row g-4">
                    <div className="col-lg-6">
                      <div className="mb-4"><label className={`fw-bold mb-2 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Deal Name</label><input className="form-control" type="text" name="title" value={newDeal.title} onChange={handleAddDealChange} placeholder="Enter deal name" required /></div>
                      <div className="mb-4"><label className={`fw-bold mb-2 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Deal Amount</label><input className="form-control" type="number" name="value" value={newDeal.value} onChange={handleAddDealChange} placeholder="$ Enter amount" required /></div>
                      <div className="mb-4"><label className={`fw-bold mb-2 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Client</label><select className="form-select" name="contact_id" value={newDeal.contact_id} onChange={handleAddDealChange} required><option value="">Select Client</option>{clients.map(c => (<option key={c.id} value={c.id}>{c.name} ({c.email})</option>))}</select></div>
                    </div>
                  </div>
                  {error && <div className="alert alert-danger mt-2">{error}</div>}
                  <div className="modal-footer">
                    <button className="btn btn-link text-danger px-3 my-0" type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
                    <button className="btn btn-primary my-0" type="submit" disabled={adding}>{adding ? 'Adding...' : 'Create Deal'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deals; 