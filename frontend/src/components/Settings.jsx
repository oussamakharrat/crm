import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import { useLogoContext } from "../LogoContext";

const Settings = () => {
  const { user, roles } = useContext(AuthContext);
  const { logoUrl, setLogoUrl, appName, setAppName } = useLogoContext();
  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [appNameInput, setAppNameInput] = useState("");
  const [appNameLoading, setAppNameLoading] = useState(false);
  const [appNameSuccess, setAppNameSuccess] = useState("");
  const [appNameError, setAppNameError] = useState("");

  const isAdmin = Array.isArray(roles)
    ? roles.map(r => r.toLowerCase()).includes("admin")
    : false;

  // Fetch current logo and app name on mount
  useEffect(() => {
    setAppNameInput(appName || "");
  }, [appName]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
    setSuccess("");
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!logoFile) return;
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const formData = new FormData();
      formData.append("logo", logoFile);
      const res = await axios.post(
        "http://localhost:5000/settings/logo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      const data = res.data;
      if (res.status === 200 && data.logo) {
        setLogoUrl(data.logo); // Update context so Header updates live
        setSuccess("Logo updated successfully!");
        setPreviewUrl("");
        setLogoFile(null);
      } else {
        setError(data.error || "Failed to upload logo");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload logo");
    } finally {
      setLoading(false);
    }
  };

  const handleAppNameChange = (e) => {
    setAppNameInput(e.target.value);
    setAppNameSuccess("");
    setAppNameError("");
  };

  const handleAppNameSave = async (e) => {
    e.preventDefault();
    setAppNameLoading(true);
    setAppNameSuccess("");
    setAppNameError("");
    try {
      await setAppName(appNameInput, user?.token);
      setAppNameSuccess("App name updated successfully!");
    } catch (err) {
      setAppNameError("Failed to update app name");
    } finally {
      setAppNameLoading(false);
    }
  };

  if (!isAdmin) {
    return <div className="alert alert-danger mt-4">Access Denied: Admins only.</div>;
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm rounded-4 p-4 mt-3">
            <div className="card-header bg-transparent border-bottom-0 pb-0 mb-3">
              <h3 className="mb-0">Settings</h3>
            </div>
            <div className="card-body p-0">
              {/* App Name Section */}
              <form onSubmit={handleAppNameSave} className="mb-4">
                <label className="form-label fw-bold">App Name</label>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={appNameInput}
                    onChange={handleAppNameChange}
                    placeholder="Enter app name"
                    disabled={appNameLoading}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={appNameLoading || !appNameInput.trim()}
                  >
                    {appNameLoading ? "Saving..." : "Save"}
                  </button>
                </div>
                {appNameSuccess && <div className="alert alert-success py-1 px-3 mb-0">{appNameSuccess}</div>}
                {appNameError && <div className="alert alert-danger py-1 px-3 mb-0">{appNameError}</div>}
              </form>
              {/* Logo Section */}
              <form onSubmit={handleUpload} className="pt-2">
                <div className="mb-4">
                  <label className="form-label fw-bold">Logo</label>
                  {logoUrl && (
                    <div className="mb-2">
                      <span className="text-body-tertiary">Current Logo:</span>
                      <div className="mt-1"><img src={logoUrl} alt="App Logo" className="img-fluid rounded shadow-sm border" style={{ maxHeight: 80, background: '#fff' }} /></div>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="form-control mt-2" onChange={handleFileChange} />
                  {previewUrl && (
                    <div className="mt-3">
                      <span className="text-body-tertiary">Preview:</span>
                      <div className="mt-1"><img src={previewUrl} alt="Preview" className="img-fluid rounded shadow border" style={{ maxHeight: 80, background: '#fff' }} /></div>
                    </div>
                  )}
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button type="submit" className="btn btn-primary px-4" disabled={loading || !logoFile}>
                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                    {loading ? "Uploading..." : "Upload Logo"}
                  </button>
                  {success && <div className="alert alert-success mb-0 py-1 px-3 ms-2 flex-grow-1">{success}</div>}
                  {error && <div className="alert alert-danger mb-0 py-1 px-3 ms-2 flex-grow-1">{error}</div>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 