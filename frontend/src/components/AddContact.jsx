import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import ErrorMessage from "./ErrorMessage";
import { createContact, fetchLeads, updateLead } from "../api";

const AddContact = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const res = await fetchLeads(user?.token);
        setLeads(res.data);
      } catch (err) {
        setError("Failed to load leads");
      } finally {
        setLeadsLoading(false);
      }
    };

    if (user?.token) {
      loadLeads();
    }
  }, [user]);

  const handleLeadSelect = (lead) => {
    setSelectedLead(lead);
    const nameParts = lead.name.split(' ');
    setFirstName(nameParts[0] || '');
    setLastName(nameParts.slice(1).join(' ') || '');
    setEmail(lead.email || '');
    setPhone(lead.phone || '');
    setAddress(lead.company || ''); // Use company as address
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);

    try {
      // Create the contact
      await createContact(user?.token, {
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
        address
      });

      // If converting from a lead, update the lead status to "Converted"
      if (selectedLead) {
        try {
          await updateLead(user?.token, selectedLead.id, {
            ...selectedLead,
            status: "Converted"
          });
        } catch (err) {
          console.warn("Failed to update lead status:", err);
        }
      }

      setSuccess(selectedLead ? "Contact created successfully from lead!" : "Contact created successfully!");
      setTimeout(() => {
        navigate('/contacts');
      }, 1500);
    } catch (err) {
      setError("Failed to create contact");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedLead(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setAddress("");
  };

  // Filter leads by status (show only qualified leads, exclude converted ones)
  const qualifiedLeads = leads.filter(lead => 
    (lead.status === 'Qualified' || lead.status === 'Contacted' || lead.status === 'New') && 
    lead.status !== 'Converted'
  );

  return (
    <>
      <nav className="mb-3" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
          <li className="breadcrumb-item"><a href="#">Contacts</a></li>
          <li className="breadcrumb-item active">Add Contact</li>
        </ol>
      </nav>
      <div className="pb-6">
        <h2 className="mb-4">Add New Contact</h2>
        
        {/* Lead Selection Section */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Select from Leads</h5>
          </div>
          <div className="card-body">
            {leadsLoading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading leads...</p>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <button 
                    type="button" 
                    className="btn btn-outline-primary"
                    onClick={handleCreateNew}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Create New Contact
                  </button>
                </div>
                
                {qualifiedLeads.length === 0 ? (
                  <div className="alert alert-info">
                    No qualified leads found. You can create a new contact instead.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Company</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {qualifiedLeads.map(lead => (
                          <tr 
                            key={lead.id} 
                            className={selectedLead?.id === lead.id ? 'table-primary' : ''}
                          >
                            <td>{lead.name}</td>
                            <td>{lead.email}</td>
                            <td>{lead.phone}</td>
                            <td>{lead.company}</td>
                            <td>
                              <span className={`badge bg-${
                                lead.status.toLowerCase() === 'new' ? 'primary' : 
                                lead.status.toLowerCase() === 'contacted' ? 'warning' : 
                                lead.status.toLowerCase() === 'qualified' ? 'success' : 'secondary'
                              }`}>
                                {lead.status}
                              </span>
                            </td>
                            <td>
                              <button 
                                type="button" 
                                className="btn btn-sm btn-primary"
                                onClick={() => handleLeadSelect(lead)}
                              >
                                {selectedLead?.id === lead.id ? 'Selected' : 'Select'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              {selectedLead ? 'Convert Lead to Contact' : 'Contact Information'}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="firstName">First Name</label>
                  <input 
                    className="form-control" 
                    type="text" 
                    id="firstName" 
                    placeholder="Enter first name" 
                    value={firstName} 
                    onChange={e => setFirstName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="lastName">Last Name</label>
                  <input 
                    className="form-control" 
                    type="text" 
                    id="lastName" 
                    placeholder="Enter last name" 
                    value={lastName} 
                    onChange={e => setLastName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input 
                    className="form-control" 
                    type="email" 
                    id="email" 
                    placeholder="Enter email address" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="phone">Phone</label>
                  <input 
                    className="form-control" 
                    type="tel" 
                    id="phone" 
                    placeholder="Enter phone number" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    required 
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="address">Address</label>
                  <textarea 
                    className="form-control" 
                    id="address" 
                    rows="3" 
                    placeholder="Enter full address" 
                    value={address} 
                    onChange={e => setAddress(e.target.value)} 
                    required
                  ></textarea>
                </div>
              </div>
              
              {selectedLead && (
                <div className="alert alert-info mt-3">
                  <i className="fas fa-info-circle me-2"></i>
                  Converting lead: <strong>{selectedLead.name}</strong> ({selectedLead.status})
                </div>
              )}
              
              <div className="d-flex justify-content-end mt-4">
                <button 
                  type="button" 
                  className="btn btn-secondary me-2" 
                  onClick={() => navigate('/contacts')}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating...
                    </>
                  ) : (
                    selectedLead ? 'Convert to Contact' : 'Save Contact'
                  )}
                </button>
              </div>
              {error && <ErrorMessage message={error} />}
              {success && <div className="alert alert-success mt-3" role="alert">{success}</div>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddContact; 