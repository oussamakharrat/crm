import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import {
  updateUserProfile,
  uploadAvatar,
  fetchCurrentUserProfile,
} from "../api";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

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
            // Only update if different
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
      setSuccess(
        "Avatar uploaded successfully! (Don't forget to press 'Update Profile' to save changes.)"
      );
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload avatar");
    } finally {
      setUploading(false);
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
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-4xl me-4">
                      <img
                        className="rounded-circle"
                        src={
                          formData.avatar && formData.avatar.trim()
                            ? formData.avatar
                            : (user && user.avatar && user.avatar.trim()
                                ? user.avatar
                                : "/phoenix/v1.20.1/assets/img/generic/avatar.png")
                        }
                        alt="Profile"
                        style={{ width: 96, height: 96, objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src =
                            "/phoenix/v1.20.1/assets/img/generic/avatar.png";
                        }}
                      />
                    </div>
                    <div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
