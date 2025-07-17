import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../api";

const Signup = ({ onSignup }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await signup(
        form.name,
        form.phone,
        form.address,
        form.email,
        form.password
      );
      if (res && res.data) {
        setSuccess(true);
        setError(null);
        if (onSignup) onSignup(res.data);
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main" id="top">
      <div className="container">
        <div className="row flex-center min-vh-100 py-5">
          <div className="col-sm-10 col-md-8 col-lg-5 col-xl-5 col-xxl-3">
            <a className="d-flex flex-center text-decoration-none mb-4" href="#!">
              <div className="d-flex align-items-center fw-bolder fs-3 d-inline-block">
                <img src="/phoenix/v1.20.1/assets/img/icons/logo.png" alt="phoenix" width="58" />
              </div>
            </a>
            <div className="text-center mb-7">
              <h3 className="text-body-highlight">Create an account</h3>
              <p className="text-body-tertiary">Get started with your free account</p>
            </div>
            <button className="btn btn-phoenix-secondary w-100 mb-3">
              <span className="fab fa-google text-danger me-2 fs-9"></span>Sign up with google
            </button>
            <button className="btn btn-phoenix-secondary w-100">
              <span className="fab fa-facebook text-primary me-2 fs-9"></span>Sign up with facebook
            </button>
            <div className="position-relative">
              <hr className="bg-body-secondary mt-5 mb-4" />
              <div className="divider-content-center">or use email</div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-start">
                <label className="form-label" htmlFor="name">Full name</label>
                <div className="form-icon-container">
                  <input 
                    className="form-control form-icon-input" 
                    id="name" 
                    name="name"
                    type="text" 
                    placeholder="Full name"
                    value={form.name} 
                    onChange={handleChange} 
                    required
                  />
                  <span className="fas fa-user text-body fs-9 form-icon"></span>
                </div>
              </div>
              <div className="mb-3 text-start">
                <label className="form-label" htmlFor="phone">Phone number</label>
                <div className="form-icon-container">
                  <input 
                    className="form-control form-icon-input" 
                    id="phone" 
                    name="phone"
                    type="tel" 
                    placeholder="Phone number"
                    value={form.phone} 
                    onChange={handleChange} 
                    required
                  />
                  <span className="fas fa-phone text-body fs-9 form-icon"></span>
                </div>
              </div>
              <div className="mb-3 text-start">
                <label className="form-label" htmlFor="address">Address</label>
                <div className="form-icon-container">
                  <input 
                    className="form-control form-icon-input" 
                    id="address" 
                    name="address"
                    type="text" 
                    placeholder="Address"
                    value={form.address} 
                    onChange={handleChange} 
                    required
                  />
                  <span className="fas fa-map-marker-alt text-body fs-9 form-icon"></span>
                </div>
              </div>
              <div className="mb-3 text-start">
                <label className="form-label" htmlFor="email">Email address</label>
                <div className="form-icon-container">
                  <input 
                    className="form-control form-icon-input" 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="name@example.com"
                    value={form.email} 
                    onChange={handleChange} 
                    required
                  />
                  <span className="fas fa-envelope text-body fs-9 form-icon"></span>
                </div>
              </div>
              <div className="mb-3 text-start">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="form-icon-container" data-password="data-password">
                  <input 
                    className="form-control form-icon-input pe-6" 
                    id="password" 
                    name="password"
                    type="password" 
                    placeholder="Password"
                    value={form.password} 
                    onChange={handleChange} 
                    required
                  />
                  <span className="fas fa-key text-body fs-9 form-icon"></span>
                  <button className="btn px-3 py-0 h-100 position-absolute top-0 end-0 fs-7 text-body-tertiary" type="button">
                    <span className="uil uil-eye show"></span>
                    <span className="uil uil-eye-slash hide"></span>
                  </button>
                </div>
              </div>
              <div className="mb-7 text-start">
                <div className="form-check mb-0">
                  <input className="form-check-input" id="terms-checkbox" type="checkbox" required />
                  <label className="form-check-label mb-0" htmlFor="terms-checkbox">
                    I accept the <a href="#!">terms</a> and <a href="#!">privacy policy</a>
                  </label>
                </div>
              </div>
              <button className="btn btn-primary w-100 mb-3" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </button>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">Signup successful! You can now log in.</div>}
              <div className="text-center">
                <Link className="fs-9 fw-bold" to="/login">Sign in to an existing account</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup; 