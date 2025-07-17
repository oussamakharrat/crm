import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { updateUserProfile, uploadAvatar, fetchCurrentUserProfile } from "../api";
import { getLargeAvatarUrl } from "../utils/avatarUtils";

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    avatar: ""
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Fetch current user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) {
        setFetching(false);
        return;
      }

      try {
        const response = await fetchCurrentUserProfile(user.token);
        const profileData = response.data;
        setFormData({
          name: profileData.name || user.name || "",
          phone: profileData.phone || user.phone || "",
          address: profileData.address || user.address || "",
          avatar: profileData.avatar || user.avatar || ""
        });
        // Do not update user context here, just prefill form
      } catch (err) {
        setFormData({
          name: user.name || "",
          phone: user.phone || "",
          address: user.address || "",
          avatar: user.avatar || ""
        });
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [user?.token, user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await updateUserProfile(user.token, formData);
      
      // Update the user context with new data
      const updatedUser = {
        ...user,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        avatar: formData.avatar
      };
      
      login(updatedUser);
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

    setUploading(true);
    setError(null);

    try {
      const response = await uploadAvatar(user.token, file);
      // Only update formData, not user context or backend yet
      const newAvatarPath = response.data.avatar;
      setFormData(prev => ({
        ...prev,
        avatar: newAvatarPath
      }));
      setSuccess("Avatar uploaded successfully! (Don't forget to press 'Update Profile' to save changes.)");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  if (fetching) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0 px-md-3">
      <nav className="mb-4" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
          <li className="breadcrumb-item"><a href="#">Profile</a></li>
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
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-4xl me-4">
                      <img
                        className="rounded-circle"
                        src={getLargeAvatarUrl(formData.avatar)}
                        alt="Profile"
                        style={{ width: 96, height: 96, objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <label className="form-label fw-bold">Profile Picture</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploading}
                      />
                      <small className="text-muted">
                        Supported formats: JPG, PNG, GIF. Max size: 2MB.
                        {uploading && <span className="text-primary ms-2">Uploading...</span>}
                      </small>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="name">Full Name</label>
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
                  <label className="form-label" htmlFor="phone">Phone Number</label>
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
                  <label className="form-label" htmlFor="address">Address</label>
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
                {/* Remove Avatar URL input */}
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
                      avatar: user?.avatar || ""
                    });
                    setSuccess(null);
                    setError(null);
                  }}
                >
                  Reset
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
              {success && <div className="alert alert-success mt-3">{success}</div>}
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 