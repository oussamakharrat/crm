import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import {
  updateUserProfile,
  uploadAvatar,
  fetchCurrentUserProfile,
  updateUserAuth,
} from "../api";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    avatar: "",
  });
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [authData, setAuthData] = useState({
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!user || !user.token) {
      setFetching(false);
      return;
    }
    setFetching(true);
    const fetchProfile = async () => {
      try {
        const { data: profileData } = await fetchCurrentUserProfile(user.token);
        if (profileData && profileData.error) {
          if (isMounted) {
            setError(profileData.error);
            setFetching(false);
          }
          return;
        }
        if (isMounted) {
          setFormData((prev) => {
            const newFormData = {
              name: profileData?.name || user.name || "",
              phone: profileData?.phone || user.phone || "",
              address: profileData?.address || user.address || "",
              avatar: profileData?.avatar || user.avatar || "",
            };
            if (
              prev.name !== newFormData.name ||
              prev.phone !== newFormData.phone ||
              prev.address !== newFormData.address ||
              prev.avatar !== newFormData.avatar
            ) {
              return newFormData;
            }
            return prev;
          });
          // Always reset previewAvatar to show backend avatar on profile fetch
          if (previewAvatar) URL.revokeObjectURL(previewAvatar);
          setPreviewAvatar("");
          setAuthData((prev) => ({
            ...prev,
            email: profileData?.email || user.email || "",
            password: "",
            confirmPassword: "",
          }));
        }
      } catch {
        if (isMounted) {
          setError("Failed to fetch profile. Please try again later.");
          setFormData((prev) => {
            const fallback = {
              name: user.name || "",
              phone: user.phone || "",
              address: user.address || "",
              avatar: user.avatar || "",
            };
            if (
              prev.name !== fallback.name ||
              prev.phone !== fallback.phone ||
              prev.address !== fallback.address ||
              prev.avatar !== fallback.avatar
            ) {
              return fallback;
            }
            return prev;
          });
        }
      } finally {
        if (isMounted) setFetching(false);
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [user && user.token]);

  useEffect(() => {
    // Clean up preview URL when component unmounts or preview changes
    return () => {
      if (previewAvatar) URL.revokeObjectURL(previewAvatar);
    };
  }, [previewAvatar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      await updateUserProfile(user.token, formData);

      // Only update the user context if values have changed
      setUser((prev) => {
        if (
          prev.name === formData.name &&
          prev.phone === formData.phone &&
          prev.address === formData.address &&
          prev.avatar === formData.avatar
        ) {
          return prev;
        }
        return {
          ...prev,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          avatar: formData.avatar,
        };
      });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    if (previewAvatar) URL.revokeObjectURL(previewAvatar);
    const localUrl = URL.createObjectURL(file);
    setPreviewAvatar(localUrl);

    setUploading(true);
    setError(null);

    try {
      const response = await uploadAvatar(user.token, file);
      // Only update formData, not user context or backend yet
      const newAvatarPath = response.data.avatar;
      setFormData((prev) => ({
        ...prev,
        avatar: newAvatarPath,
      }));
      // Do NOT clear previewAvatar here; let the user see their selected image until profile is reloaded
      setSuccess(
        "Avatar uploaded successfully! (Don't forget to press 'Update Profile' to save changes.)"
      );
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthSuccess(null);
    setAuthError(null);
    if (authData.password && authData.password !== authData.confirmPassword) {
      setAuthError("Passwords do not match");
      setAuthLoading(false);
      return;
    }
    try {
      const payload = {};
      if (authData.email && authData.email !== user.email) payload.email = authData.email;
      if (authData.password) payload.password = authData.password;
      if (!payload.email && !payload.password) {
        setAuthError("No changes to update");
        setAuthLoading(false);
        return;
      }
      await updateUserAuth(user.token, payload);
      setUser((prev) => ({ ...prev, email: authData.email }));
      setAuthSuccess("Credentials updated successfully!");
      setAuthData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      setAuthError(err.response?.data?.error || "Failed to update credentials");
    } finally {
      setAuthLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container-fluid px-0 px-md-3">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm p-4 my-5">
              <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                {error && <div className="alert alert-danger mt-4">{error}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <nav className="mb-4" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <a href="#">Dashboard</a>
          </li>
          <li className="breadcrumb-item">
            <a href="#">Profile</a>
          </li>
          <li className="breadcrumb-item active">Edit Profile</li>
        </ol>
      </nav>
      <div className="mb-5">
        <h2 className="mb-4">Edit Profile</h2>
        <div className="card shadow-sm p-3 p-md-4 mb-4">
          <div className="card-header bg-transparent border-bottom-0 pb-0 mb-3">
            <h5 className="mb-0">Profile Information</h5>
          </div>
          <div className="card-body p-0">
            <form onSubmit={handleSubmit} className="pt-2">
              <div className="row g-3">
                {/* Avatar Section */}
                <div className="col-12 mb-4">
                  <div className="d-flex align-items-center" style={{ gap: 24 }}>
                    <div className="avatar avatar-4xl me-4" style={{ minWidth: 96, minHeight: 96, background: '#f8f9fa', border: '1px solid #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 24, borderRadius: '50%' }}>
                      <img
                        className="rounded-circle"
                        src={
                          previewAvatar
                            ? previewAvatar
                            : formData.avatar && formData.avatar.trim()
                            ? formData.avatar
                            : "/phoenix/v1.20.1/assets/img/generic/avatar.png"
                        }
                        alt="Profile"
                        style={{ width: 96, height: 96, objectFit: "cover", border: '2px solid #adb5bd', background: '#fff', borderRadius: '50%' }}
                        onError={(e) => {
                          e.target.src = "/phoenix/v1.20.1/assets/img/generic/avatar.png";
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label fw-bold">
                        Profile Picture
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploading}
                      />
                      <small className="text-muted">
                        Supported formats: JPG, PNG, GIF. Max size: 2MB.
                        {uploading && (
                          <span className="text-primary ms-2">
                            Uploading...
                          </span>
                        )}
                      </small>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    className="form-control"
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="address">
                    Address
                  </label>
                  <textarea
                    className="form-control"
                    id="address"
                    name="address"
                    rows="3"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-4">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={() => {
                    setFormData({
                      name: user?.name || "",
                      phone: user?.phone || "",
                      address: user?.address || "",
                      avatar: user?.avatar || "",
                    });
                    setSuccess(null);
                    setError(null);
                  }}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
              {success && (
                <div className="alert alert-success mt-3">{success}</div>
              )}
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
            <hr className="my-4" />
            <h5 className="mb-3">Change Email or Password</h5>
            <form onSubmit={handleAuthSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  className="form-control"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={authData.email}
                  onChange={handleAuthChange}
                  required
                />
              </div>
              <div className="col-md-6"></div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="password">New Password</label>
                <input
                  className="form-control"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter new password"
                  value={authData.password}
                  onChange={handleAuthChange}
                  autoComplete="new-password"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  className="form-control"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={authData.confirmPassword}
                  onChange={handleAuthChange}
                  autoComplete="new-password"
                />
              </div>
              <div className="d-flex justify-content-end mt-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={authLoading}
                >
                  {authLoading ? "Updating..." : "Update Email/Password"}
                </button>
              </div>
              {authSuccess && (
                <div className="alert alert-success mt-3">{authSuccess}</div>
              )}
              {authError && <div className="alert alert-danger mt-3">{authError}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
