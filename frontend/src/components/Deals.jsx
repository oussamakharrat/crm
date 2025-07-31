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
                <div className="deals-col flex-grow-1 w-100" style={{ minWidth: 0 }}>
                  <div className={`d-flex align-items-center justify-content-between position-sticky top-0 z-1 py-3 px-2 border-bottom border-2 border-primary-subtle mb-2 rounded-top-3 ${theme === "light" ? "bg-body" : "bg-dark"}`}>
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
                          <div className="card mb-3 shadow-sm border-0 rounded-3" key={deal.id}>
                            <div className="card-body p-3">
                              <a
                                className="dropdown-indicator-icon position-absolute text-body-tertiary"
                                href={`#collapseWidthDeals-${deal.id}`}
                                role="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapseWidthDeals-${deal.id}`}
                                aria-expanded="false"
                                aria-controls={`#collapseWidthDeals-${deal.id}`}
                                style={{ right: 16, top: 16 }}
                              >
                                <span className="fa-solid fa-angle-down"></span>
                              </a>
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="d-flex align-items-center gap-2"><span className="me-2" data-feather="clock" style={{strokeWidth:2}}></span>
                                  <p className={`mb-0 fs-9 fw-semibold ${theme === 'dark' ? 'text-white' : 'text-body-tertiary'} date`}>{deal.created_at ? new Date(deal.created_at).toLocaleString() : ""}</p>
                                </div>
                              </div>
                              <div className="deals-items-head d-flex align-items-center mb-2 gap-2 flex-wrap">
                                <Link className="text-primary fw-bold line-clamp-1 me-2 mb-0 fs-7" to={`/deal-details/${deal.id}`}>{deal.title}</Link>
                                <span className={`badge ${theme === "light" ? "bg-body text-secondary" : "bg-dark text-white"} ms-auto fs-9`}>${deal.value?.toLocaleString()}</span>
                              </div>
                              <div className="deals-company-agent d-flex flex-between-center gap-2 mb-2 flex-wrap">
                                <div className="d-flex align-items-center gap-1"><span className="uil uil-user me-1"></span>
                                  <span className={`${theme === 'dark' ? 'text-white' : 'text-body-secondary'} fw-bold fs-9`}>Owner ID: {deal.owner_id}</span>
                                </div>
                                <div className="d-flex align-items-center gap-1"><span className="uil uil-headphones me-1"></span>
                                  <span className={`${theme === 'dark' ? 'text-white' : 'text-body-secondary'} fw-bold fs-9`}>Contact ID: {deal.contact_id}</span>
                                </div>
                              </div>
                              {/* Collapsible details section (optional) */}
                              <div className="collapse" id={`collapseWidthDeals-${deal.id}`}></div>
                              <div className="mt-2 d-flex gap-2 flex-wrap">
                                <Link to={`/deal-details/${deal.id}`} className="btn btn-outline-primary btn-sm">View Details</Link>
                                {isAdmin && (
                                  <>
                                    {editingDealId === deal.id ? (
                                      <form className="d-inline-flex align-items-center gap-2 flex-wrap" onSubmit={e => {e.preventDefault(); handleUpdateStage(deal.id);}}>
                                        <select className="form-select form-select-sm" value={newStage} onChange={e => setNewStage(e.target.value)} required style={{ width: 150 }}>
                                          <option value="" disabled>Select Stage</option>
                                          {DEAL_STAGES.map(s => (
                                            <option key={s.key} value={s.key}>{s.label}</option>
                                          ))}
                                        </select>
                                        <button className="btn btn-success btn-sm" type="submit" disabled={updating}>{updating ? "Updating..." : "Save"}</button>
                                        <button className="btn btn-secondary btn-sm" type="button" onClick={() => setEditingDealId(null)} disabled={updating}>Cancel</button>
                                      </form>
                                    ) : (
                                      <button className="btn btn-warning btn-sm" type="button" onClick={() => { setEditingDealId(deal.id); setNewStage(deal.stage || ""); }}>Update</button>
                                    )}
                                    <button className="btn btn-danger btn-sm" type="button" onClick={() => handleDeleteDeal(deal.id)}>Delete</button>
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