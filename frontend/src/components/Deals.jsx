import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import api from "../api";

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

  // Helper to check if user is admin
  const isAdmin = user?.roles?.includes("Admin");

  // Define possible deal stages
  const dealStages = [
    "Prospecting",
    "Qualification",
    "Needs Analysis",
    "Proposal",
    "Negotiation",
    "Closed Won",
    "Closed Lost"
  ];

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // Debug: log API base URL and token
        console.log('API base URL:', api.defaults.baseURL);
        console.log('User token:', user?.token);
        const res = await api.get("/deals", {
          headers: {
            "Authorization": `Bearer ${user?.token}`
          }
        });
        console.log('Deals response:', res.data);
        setDeals(res.data);
      } catch (err) {
        console.error('Failed to fetch deals:', err);
        setDeals([]);
      }
    };
    if (user?.token) fetchDeals();
  }, [user]);

  const handleAddDealChange = (e) => {
    const { name, value } = e.target;
    setNewDeal((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDeal = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError('');
    try {
      console.log("User object:", user);
      console.log("Submitting deal with owner_id:", Number(user?.user_id));
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
      // Refresh deals
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

  // Delete deal handler
  const handleDeleteDeal = async (dealId) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) return;
    try {
      await api.delete(`/deals/${dealId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      // Refresh deals
      const refreshed = await api.get("/deals", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setDeals(refreshed.data);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete deal.");
    }
  };

  // Update deal stage handler
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
      // Refresh deals
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

  return (
    <div className="container-fluid px-0 px-md-3">
      <nav className="mb-4" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
          <li className="breadcrumb-item"><a href="#">Deals</a></li>
          <li className="breadcrumb-item active">Overview</li>
        </ol>
      </nav>
      <div className="mb-5">
        <h2 className="mb-4">Deals</h2>
        <div className="d-flex justify-content-between flex-wrap mb-4">
            <div className="mb-3">
              <button className="btn btn-primary" type="button" onClick={() => setShowAddForm((v) => !v)}>
                <span className="fas fa-plus me-2"></span>Add Deal
              </button>
              <button className="btn btn-link text-body px-0">
                <span className="fa-solid fa-file-export fs-9 me-2"></span>Export
              </button>
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
              <button className="btn px-3 btn-phoenix-secondary" type="button">
                <span className="fa-solid fa-filter text-primary"></span>
              </button>
            </div>
          </div>
      </div>
      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Add New Deal</h5>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleAddDeal}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={newDeal.title}
                  onChange={handleAddDealChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Value</label>
                <input
                  type="number"
                  className="form-control"
                  name="value"
                  value={newDeal.value}
                  onChange={handleAddDealChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contact ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="contact_id"
                  value={newDeal.contact_id}
                  onChange={handleAddDealChange}
                  required
                />
              </div>
              {/* owner_id is not shown as an input, it will always use the current user's id */}
              <button className="btn btn-success me-2" type="submit" disabled={adding}>
                {adding ? 'Adding...' : 'Add Deal'}
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => setShowAddForm(false)} disabled={adding}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-12">
          <div className="w-100 min-vh-50">
            {deals.length === 0 ? (
              <div>No deals found.</div>
            ) : (
              deals.map((deal) => (
                <div className="card mb-3" key={deal.id} style={{ backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex">
                        <span className="me-2" data-feather="clock"></span>
                        <p className="mb-0 fs-9 fw-semibold date">
                          {deal.created_at ? new Date(deal.created_at).toLocaleString() : ""}
                        </p>
                      </div>
                    </div>
                    <div className="deals-items-head d-flex align-items-center mb-2">
                      <span className="text-primary fw-bold line-clamp-1 me-3 mb-0 fs-7">{deal.title}</span>
                      <p className="ms-auto fs-9 text-body-emphasis fw-semibold mb-0 deals-revenue">
                        ${deal.value?.toLocaleString()}
                      </p>
                    </div>
                    <div className="deals-company-agent d-flex flex-between-center">
                      <div className="d-flex align-items-center">
                        <span className="uil uil-user me-2"></span>
                        <p className="text-body-secondary fw-bold fs-9 mb-0">Owner ID: {deal.owner_id}</p>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="uil uil-headphones me-2"></span>
                        <p className="text-body-secondary fw-bold fs-9 mb-0">Contact ID: {deal.contact_id}</p>
                      </div>
                    </div>
                    <Link to={`/deal-details/${deal.id}`} className="btn btn-outline-primary btn-sm mt-2 me-2">View Details</Link>
                    {isAdmin && (
                      <>
                        {editingDealId === deal.id ? (
                          <form
                            className="d-inline-flex align-items-center mt-2 me-2"
                            onSubmit={e => {
                              e.preventDefault();
                              handleUpdateStage(deal.id);
                            }}
                          >
                            <select
                              className="form-select form-select-sm me-2"
                              value={newStage}
                              onChange={e => setNewStage(e.target.value)}
                              required
                              style={{ width: 150 }}
                            >
                              <option value="" disabled>Select Stage</option>
                              {dealStages.map(stage => (
                                <option key={stage} value={stage}>{stage}</option>
                              ))}
                            </select>
                            <button className="btn btn-success btn-sm me-2" type="submit" disabled={updating}>
                              {updating ? "Updating..." : "Save"}
                            </button>
                            <button className="btn btn-secondary btn-sm" type="button" onClick={() => setEditingDealId(null)} disabled={updating}>
                              Cancel
                            </button>
                          </form>
                        ) : (
                          <button className="btn btn-warning btn-sm mt-2 me-2" type="button" onClick={() => { setEditingDealId(deal.id); setNewStage(deal.stage || ""); }}>
                            Update
                          </button>
                        )}
                        <button className="btn btn-danger btn-sm mt-2" type="button" onClick={() => handleDeleteDeal(deal.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deals; 