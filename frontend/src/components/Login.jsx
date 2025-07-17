import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login(email, password);
      console.log('Login response:', res);
      if (res && res.status === 200 && res.data && res.data.id) {
        // Store the token in localStorage
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
        authLogin(res.data);
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      // Check for 401 status code
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main" id="top">
      <div className='container'>
        <div className="row flex-center min-vh-100 py-5">
          <div className="col-sm-10 col-md-8 col-lg-5 col-xl-5 col-xxl-3">
            <a className="d-flex flex-center text-decoration-none mb-4" href="#!">
              <div className="d-flex align-items-center fw-bolder fs-3 d-inline-block">
                <img src="/phoenix/v1.20.1/assets/img/icons/logo.png" alt="phoenix" width="58" />
              </div>
            </a>
            <div className="text-center mb-7">
              <h3 className="text-body-highlight">Sign In</h3>
              <p className="text-body-tertiary">Get access to your account</p>
            </div>
            <button className="btn btn-phoenix-secondary w-100 mb-3">
              <span className="fab fa-google text-danger me-2 fs-9"></span>Sign in with google
            </button>
            <button className="btn btn-phoenix-secondary w-100">
              <span className="fab fa-facebook text-primary me-2 fs-9"></span>Sign in with facebook
            </button>
            <div className="position-relative">
              <hr className="bg-body-secondary mt-5 mb-4" />
              <div className="divider-content-center">or use email</div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-start">
                <label className="form-label" htmlFor="email">Email address</label>
                <div className="form-icon-container">
                  <input 
                    className="form-control form-icon-input" 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <span className="fas fa-user text-body fs-9 form-icon"></span>
                </div>
              </div>
              <div className="mb-3 text-start">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="form-icon-container" data-password="data-password">
                  <input 
                    className="form-control form-icon-input pe-6" 
                    id="password" 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className="fas fa-key text-body fs-9 form-icon"></span>
                  <button className="btn px-3 py-0 h-100 position-absolute top-0 end-0 fs-7 text-body-tertiary" type="button">
                    <span className="uil uil-eye show"></span>
                    <span className="uil uil-eye-slash hide"></span>
                  </button>
                </div>
              </div>
              <div className="row flex-between-center mb-7">
                <div className="col-auto">
                  <div className="form-check mb-0">
                    <input className="form-check-input" id="basic-checkbox" type="checkbox" defaultChecked />
                    <label className="form-check-label mb-0" htmlFor="basic-checkbox">Remember me</label>
                  </div>
                </div>
                <div className="col-auto">
                  <a className="fs-9 fw-semibold" href="#!">Forgot Password?</a>
                </div>
              </div>
              <button className="btn btn-primary w-100 mb-3" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="text-center">
                <Link className="fs-9 fw-bold" to="/signup">Create an account</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login; 