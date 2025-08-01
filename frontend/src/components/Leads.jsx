import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { ThemeContext } from "../ThemeContext";
import { Link } from "react-router-dom";
import api from "../api";
import ErrorMessage from "./ErrorMessage";
import AILeadGenerator from "./AILeadGenerator";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "New",
    source: "",
    notes: "",
    assigned_to: ""
  });
  const [formError, setFormError] = useState(null);
  const { user, roles } = useAuth();
  const { theme } = React.useContext(ThemeContext);
  const [search, setSearch] = useState("");
  const [showAIModal, setShowAIModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      // setCurrentTheme(document.documentElement.getAttribute('data-theme') || 'light'); // This line was removed
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const isAdmin = roles && roles.includes("admin");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get("/leads", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLeads(res.data);
    } catch {
      setError("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenModal = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "New",
      source: "",
      notes: "",
      assigned_to: user?.user_id || ""
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenAIModal = () => {
    setShowAIModal(true);
  };

  const handleCloseAIModal = () => {
    setShowAIModal(false);
  };

  const handleLeadsGenerated = () => {
    // Refresh the leads list after AI generation
    fetchLeads();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      const token = localStorage.getItem('token');
      const payload = { ...form };
      if (!isAdmin) {
        payload.assigned_to = user?.user_id;
      }
      await api.post("/leads", payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowModal(false);
      fetchLeads();
    } catch {
      setFormError("Failed to add lead");
    }
  };

  // Edit lead functionality
  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setForm({
      name: lead.name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      company: lead.company || "",
      status: lead.status || "New",
      source: lead.source || "",
      notes: lead.notes || "",
      assigned_to: lead.assigned_to || ""
    });
    setFormError(null);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingLead(null);
  };

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      const token = localStorage.getItem('token');
      const payload = { ...form };
      if (!isAdmin) {
        payload.assigned_to = user?.user_id;
      }
      await api.put(`/leads/${editingLead.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowEditModal(false);
      setEditingLead(null);
      fetchLeads();
    } catch {
      setFormError("Failed to update lead");
    }
  };

  // Delete lead functionality
  const handleDeleteLead = (lead) => {
    setLeadToDelete(lead);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setLeadToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/leads/${leadToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowDeleteModal(false);
      setLeadToDelete(null);
      fetchLeads();
    } catch {
      setFormError("Failed to delete lead");
    }
  };

  // Filter leads by search
  const filteredLeads = leads.filter(lead =>
    lead.name && lead.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid px-0 px-md-3">
      {/* Modal for Add Lead */}
      {showModal && (
                        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header" >
                <h5 className="modal-title" >Add Lead</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" value={form.name} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" value={form.email} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Company</label>
                    <input type="text" className="form-control" name="company" value={form.company} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select" name="status" value={form.status} onChange={handleInputChange}>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Lost">Lost</option>
                      <option value="Won">Won</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Source</label>
                    <input type="text" className="form-control" name="source" value={form.source} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <textarea className="form-control" name="notes" value={form.notes} onChange={handleInputChange} />
                  </div>
                  {isAdmin && (
                    <div className="mb-3">
                      <label className="form-label">Assigned To (User ID)</label>
                      <input type="text" className="form-control" name="assigned_to" value={form.assigned_to} onChange={handleInputChange} />
                    </div>
                  )}
                  {formError && <ErrorMessage message={formError} />}
                </div>
                <div className="modal-footer" >
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Lead</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Edit Lead */}
      {showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Lead</h5>
                <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
              </div>
              <form onSubmit={handleUpdateLead}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" value={form.name} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" value={form.email} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Company</label>
                    <input type="text" className="form-control" name="company" value={form.company} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select" name="status" value={form.status} onChange={handleInputChange}>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Lost">Lost</option>
                      <option value="Won">Won</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Source</label>
                    <input type="text" className="form-control" name="source" value={form.source} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <textarea className="form-control" name="notes" value={form.notes} onChange={handleInputChange} />
                  </div>
                  {isAdmin && (
                    <div className="mb-3">
                      <label className="form-label">Assigned To (User ID)</label>
                      <input type="text" className="form-control" name="assigned_to" value={form.assigned_to} onChange={handleInputChange} />
                    </div>
                  )}
                  {formError && <ErrorMessage message={formError} />}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Update Lead</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Delete Confirmation */}
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the lead <strong>{leadToDelete?.name}</strong>?</p>
                <p className="text-muted">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Delete Lead</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="mb-4" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
          <li className="breadcrumb-item"><a href="#">Leads</a></li>
          <li className="breadcrumb-item active">Overview</li>
        </ol>
      </nav>
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
                <button className="btn btn-primary me-2" onClick={handleOpenModal}>
                  <span className="fas fa-plus me-2"></span>Create Lead
                </button>
                <button className="btn btn-success me-2" onClick={handleOpenAIModal}>
                  <span className="fas fa-robot me-2"></span>AI Generate
                </button>
                <button className="btn btn-link text-body px-0" type="button">
                  <span className="fa-solid fa-file-export fs-9 me-2"></span>Export
                </button>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <div className="d-flex">
              <div className="search-box me-2">
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
              <button className="btn px-3 btn-phoenix-secondary" type="button" data-bs-toggle="modal" data-bs-target="#filterModal">
                <span className="fa-solid fa-filter text-primary" data-fa-transform="down-3"></span>
              </button>
            </div>
          </div>
        </div>
        <div className="table-responsive scrollbar mx-n1 px-1">
          {loading ? (
            <div className="text-center p-4">Loading leads...</div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <table className="table fs-9 mb-0 leads-table">
              <thead>
                <tr>
                  <th className="white-space-nowrap fs-9 align-middle ps-0" >
                    <div className="form-check mb-0 fs-8">
                      <input className="form-check-input" type="checkbox" />
                    </div>
                  </th>
                  <th className="sort white-space-nowrap align-middle text-uppercase ps-0" scope="col" >Name</th>
                  <th className="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent" scope="col" >Email</th>
                  <th className="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent" scope="col" >Phone</th>
                  <th className="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent" scope="col" >Status</th>
                  <th className="sort align-middle ps-4 pe-5 text-uppercase border-end border-translucent" scope="col" >Company</th>
                  <th className="sort align-middle ps-4 pe-5 text-uppercase" scope="col" >Assigned To</th>
                  <th className="sort text-end align-middle pe-0 ps-4" scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover-actions-trigger btn-reveal-trigger position-static">
                    <td className="fs-9 align-middle">
                      <div className="form-check mb-0 fs-8">
                        <input className="form-check-input" type="checkbox" />
                      </div>
                    </td>
                    <td className="name align-middle white-space-nowrap ps-0">
                      <div className="d-flex align-items-center">
                        <div>
                          <span className={`fs-8 fw-bold ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>{lead.name}</span>
                                                     <div className="d-flex align-items-center">
                             <span className={`badge bg-${lead.status.toLowerCase() === 'new' ? 'primary' : lead.status.toLowerCase() === 'contacted' ? 'warning' : lead.status.toLowerCase() === 'qualified' ? 'success' : lead.status.toLowerCase() === 'won' ? 'success' : 'secondary'}`}>
                               {lead.status}
                             </span>
                           </div>
                        </div>
                      </div>
                    </td>
                    <td className={`email align-middle white-space-nowrap fw-semibold ps-4 border-end border-translucent`}>
                      <a className={`${theme === 'dark' ? 'text-light custom-nav-link-dark' : 'text-dark custom-nav-link-light'}`} href={`mailto:${lead.email}`}>{lead.email}</a>
                    </td>
                    <td className={`phone align-middle white-space-nowrap fw-semibold ps-4 border-end border-translucent`}>
                      <a className={`${theme === 'dark' ? 'text-light custom-nav-link-dark' : 'text-dark custom-nav-link-light'}`} href={`tel:${lead.phone}`}>{lead.phone}</a>
                    </td>
                                         <td className="status align-middle white-space-nowrap ps-4 border-end border-translucent">
                       <span className={`badge bg-${lead.status.toLowerCase() === 'new' ? 'primary' : lead.status.toLowerCase() === 'contacted' ? 'warning' : lead.status.toLowerCase() === 'qualified' ? 'success' : lead.status.toLowerCase() === 'won' ? 'success' : 'secondary'}`}>
                         {lead.status}
                       </span>
                     </td>
                    <td className={`company align-middle white-space-nowrap ps-4 border-end border-translucent fw-semibold ${theme === 'dark' ? 'text-light custom-nav-link-dark' : 'text-dark custom-nav-link-light'}`}>
                      {lead.company}
                    </td>
                    <td className={`assigned align-middle white-space-nowrap text-opacity-85 ps-4 ${theme === 'dark' ? 'text-white' : 'text-body-tertiary'}`}>
                      {lead.assigned_to}
                    </td>
                    <td className="align-middle white-space-nowrap text-end pe-0 ps-4">
                      <div className="btn-reveal-trigger position-static dropdown">
                        <button className="btn btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs-10" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <span className="fas fa-ellipsis-h fs-10"></span>
                        </button>
                        <div className="dropdown-menu dropdown-menu-end py-2">
                          <Link className="dropdown-item" to={`/deal-details/${lead.id}`}>View in Deal Details</Link>
                          <Link className="dropdown-item" to={`/lead-details/${lead.id}`}>View in Lead Details</Link>
                          <button className="dropdown-item" onClick={() => handleEditLead(lead)}>
                            <i className="fas fa-edit me-2"></i>Edit Lead
                          </button>
                          <a className="dropdown-item" href="#">Export</a>
                          <div className="dropdown-divider"></div>
                          <button className="dropdown-item text-danger" onClick={() => handleDeleteLead(lead)}>
                            <i className="fas fa-trash me-2"></i>Delete Lead
                          </button>
                        </div>
                      </div>
                      <Link to={`/lead-details/${lead.id}`} className="btn btn-outline-primary btn-sm ms-2">View Details</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* AI Lead Generator Modal */}
      {showAIModal && (
        <AILeadGenerator
          onLeadsGenerated={handleLeadsGenerated}
          onClose={handleCloseAIModal}
        />
      )}
    </div>
  );
};

export default Leads; 