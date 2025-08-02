import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import ErrorMessage from "./ErrorMessage";
import { fetchContactById, updateContact } from "../api";

const EditContact = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetchContactById(user?.token, id);
        const contact = res.data;
        const nameParts = contact.name.split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
        setEmail(contact.email);
        setPhone(contact.phone);
        setAddress(contact.address);
      } catch (err) {
        setError("Failed to load contact");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token && id) {
      fetchContact();
    }
  }, [user, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    try {
      await updateContact(user?.token, id, {
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
        address
      });
      setSuccess("Contact updated successfully!");
      setTimeout(() => {
        navigate('/contacts');
      }, 1500);
    } catch (err) {
      setError("Failed to update contact");
    }
  };

  if (loading) {
    return (
      <div className="container-fluid px-0 px-md-3">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="mb-3" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
          <li className="breadcrumb-item"><a href="#">Contacts</a></li>
          <li className="breadcrumb-item active">Edit Contact</li>
        </ol>
      </nav>
      <div className="pb-6">
        <h2 className="mb-4">Edit Contact</h2>
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Contact Information</h5>
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
              <div className="d-flex justify-content-end mt-4">
                <button 
                  type="button" 
                  className="btn btn-secondary me-2" 
                  onClick={() => navigate('/contacts')}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Contact
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

export default EditContact; 