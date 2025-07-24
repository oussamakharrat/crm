import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import ErrorMessage from "./ErrorMessage";

const AddContact = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          address
        })
      });
      if (!res.ok) throw new Error("Failed to add contact");
      setSuccess("Contact added successfully!");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setAddress("");
    } catch {
      setError("Failed to add contact");
    }
  };

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
                  onClick={() => {
                    setFirstName(""); 
                    setLastName(""); 
                    setEmail(""); 
                    setPhone(""); 
                    setAddress(""); 
                    setSuccess(null); 
                    setError(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Contact
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