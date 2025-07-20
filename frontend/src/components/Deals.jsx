import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import api from "../api";
import { fetchClients } from '../api';

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
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [editingDealId, setEditingDealId] = useState(null);
  const [newStage, setNewStage] = useState("");
  const [updating, setUpdating] = useState(false);
  const [clients, setClients] = useState([]);

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

  // Group deals by stage
  const dealsByStage = DEAL_STAGES.reduce((acc, stage) => {
    acc[stage.key] = deals.filter(d => (d.stage || "New") === stage.key);
    return acc;
  }, {});

  // Placeholder forecast revenue per stage
  const forecastRevenue = (stageKey) => {
    // Sum values for the stage
    const sum = (dealsByStage[stageKey] || []).reduce((a, d) => a + (d.value || 0), 0);
    return sum.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  };

  return (
    <div className="content kanban-deals-content">
      <nav className="mb-3 crm-deals-breadcrumb" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><a href="#!">Page 1</a></li>
          <li className="breadcrumb-item"><a href="#!">Page 2</a></li>
          <li className="breadcrumb-item active">Default</li>
        </ol>
      </nav>
      <div>
        <div className="px-4 px-lg-6">
          <h2 className="mb-5">Deals</h2>
          <div className="d-xl-flex justify-content-between">
            <div className="mb-3">
              <button className="btn btn-primary me-4" type="button" onClick={() => setShowAddForm(true)} data-bs-toggle="modal" data-bs-target="#addDealModal">
                <span className="fas fa-plus me-2"></span>Add Deal
              </button>
              <button className="btn btn-link text-body px-0"><span className="fa-solid fa-file-export fs-9 me-2"></span>Export</button>
            </div>
            <div className="d-flex mb-4">
              <div className="search-box">
                <form className="position-relative">
                  <input className="form-control search-input search" type="search" placeholder="Search by name" aria-label="Search" />
                  <span className="fas fa-search search-box-icon"></span>
                </form>
              </div>
              <select className="form-select w-auto mx-2" id="select-deals">
                <option>Deals</option>
              </select>
              <button className="btn px-3 btn-phoenix-secondary" type="button" data-bs-toggle="modal" data-bs-target="#reportsFilterModal">
                <span className="fa-solid fa-filter text-primary"></span>
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 px-lg-6 scrollbar">
          <div className="deals">
            {DEAL_STAGES.map(stage => (
              <div className="deals-col me-4" key={stage.key}>
                <div className="d-flex align-items-center justify-content-between position-sticky top-0 z-1 bg-body">
                  <div>
                    <h5 className="mb-2">{stage.label}</h5>
                    <p className="fs-9 text-body-tertiary mb-1">Forecast Revenue:</p>
                    <h4 className="mb-3">{forecastRevenue(stage.key)}</h4>
                  </div>
                  <div className="d-flex gap-3">
                    <button className="btn p-0" type="button" onClick={() => setShowAddForm(true)} data-bs-toggle="modal" data-bs-target="#addDealModal"><span className="fa-solid fa-plus"></span></button>
                    <button className="btn p-0" type="button"><span className="fas fa-ellipsis-h fs-10"></span></button>
                  </div>
                </div>
                <div className="scrollbar deals-items-container">
                  <div className="w-100 min-vh-50" data-sortable="data-sortable">
                    {dealsByStage[stage.key] && dealsByStage[stage.key].length > 0 ? (
                      dealsByStage[stage.key].map((deal) => (
                        <div className="card mb-3" key={deal.id}>
                          <div className="card-body">
                            <a
                              className="dropdown-indicator-icon position-absolute text-body-tertiary"
                              href={`#collapseWidthDeals-${deal.id}`}
                              role="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapseWidthDeals-${deal.id}`}
                              aria-expanded="false"
                              aria-controls={`collapseWidthDeals-${deal.id}`}
                            >
                              <span className="fa-solid fa-angle-down"></span>
                            </a>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="d-flex"><span className="me-2" data-feather="clock" style={{strokeWidth:2}}></span>
                                <p className="mb-0 fs-9 fw-semibold text-body-tertiary date">{deal.created_at ? new Date(deal.created_at).toLocaleString() : ""}</p>
                              </div>
                            </div>
                            <div className="deals-items-head d-flex align-items-center mb-2">
                              <Link className="text-primary fw-bold line-clamp-1 me-3 mb-0 fs-7" to={`/deal-details/${deal.id}`}>{deal.title}</Link>
                              <p className="deals-category fs-10 mb-0 mt-1 d-none"><span className="me-1 text-body-quaternary" data-feather="grid" style={{strokeWidth:2, height:12, width:12}}></span>Financial</p>
                              <p className="ms-auto fs-9 text-body-emphasis fw-semibold mb-0 deals-revenue">${deal.value?.toLocaleString()}</p>
                            </div>
                            <div className="deals-company-agent d-flex flex-between-center">
                              <div className="d-flex align-items-center"><span className="uil uil-user me-2"></span>
                                <p className="text-body-secondary fw-bold fs-9 mb-0">Owner ID: {deal.owner_id}</p>
                              </div>
                              <div className="d-flex align-items-center"><span className="uil uil-headphones me-2"></span>
                                <p className="text-body-secondary fw-bold fs-9 mb-0">Contact ID: {deal.contact_id}</p>
                              </div>
                            </div>
                            {/* Collapsible details section (optional) */}
                            <div className="collapse" id={`collapseWidthDeals-${deal.id}`}>
                              {/* Place deal details here if needed */}
                            </div>
                            <div className="mt-2 d-flex gap-2">
                              <Link to={`/deal-details/${deal.id}`} className="btn btn-outline-primary btn-sm me-2">View Details</Link>
                              {isAdmin && (
                                <>
                                  {editingDealId === deal.id ? (
                                    <form className="d-inline-flex align-items-center" onSubmit={e => {e.preventDefault(); handleUpdateStage(deal.id);}}>
                                      <select className="form-select form-select-sm me-2" value={newStage} onChange={e => setNewStage(e.target.value)} required style={{ width: 150 }}>
                                        <option value="" disabled>Select Stage</option>
                                        {DEAL_STAGES.map(s => (
                                          <option key={s.key} value={s.key}>{s.label}</option>
                                        ))}
                                      </select>
                                      <button className="btn btn-success btn-sm me-2" type="submit" disabled={updating}>{updating ? "Updating..." : "Save"}</button>
                                      <button className="btn btn-secondary btn-sm" type="button" onClick={() => setEditingDealId(null)} disabled={updating}>Cancel</button>
                                    </form>
                                  ) : (
                                    <button className="btn btn-warning btn-sm me-2" type="button" onClick={() => { setEditingDealId(deal.id); setNewStage(deal.stage || ""); }}>Update</button>
                                  )}
                                  <button className="btn btn-danger btn-sm" type="button" onClick={() => handleDeleteDeal(deal.id)}>Delete</button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-body-tertiary py-4">No deals in this stage.</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* Add new stage column */}
            <div className="deals-col position-relative">
              <div className="d-flex flex-center flex-column h-100">
                <h3 className="mb-4">Add new stage</h3>
                <button className="btn btn-sm btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#addStageModal"><span className="fa-solid fa-plus me-2"></span>New Stage</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Deal Modal (structure only, not functional) */}
      {showAddForm && (
        <div className="modal fade show d-block" id="addDealModal" tabIndex="-1" aria-labelledby="addDealModal" aria-modal="true" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content bg-body-highlight p-6">
              <div className="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 className="mb-0">Deal Informations</h3>
                <button className="btn btn-sm btn-phoenix-secondary" onClick={() => setShowAddForm(false)}><span className="fas fa-times text-danger"></span></button>
              </div>
              <div className="modal-body px-0">
                <form onSubmit={handleAddDeal}>
                  <div className="row g-4">
                    <div className="col-lg-6">
                      <div className="mb-4"><label className="text-body-highlight fw-bold mb-2">Deal Name</label><input className="form-control" type="text" name="title" value={newDeal.title} onChange={handleAddDealChange} placeholder="Enter deal name" required /></div>
                      <div className="mb-4"><label className="text-body-highlight fw-bold mb-2">Deal Amount</label><input className="form-control" type="number" name="value" value={newDeal.value} onChange={handleAddDealChange} placeholder="$ Enter amount" required /></div>
                      <div className="mb-4"><label className="text-body-highlight fw-bold mb-2">Client</label><select className="form-select" name="contact_id" value={newDeal.contact_id} onChange={handleAddDealChange} required><option value="">Select Client</option>{clients.map(c => (<option key={c.id} value={c.id}>{c.name} ({c.email})</option>))}</select></div>
                    </div>
                  </div>
                  {error && <div className="alert alert-danger mt-2">{error}</div>}
                  <div className="modal-footer border-0 pt-6 px-0 pb-0">
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