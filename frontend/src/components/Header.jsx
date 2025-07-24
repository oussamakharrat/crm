import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ThemeContext } from "../ThemeContext";
import { getSmallAvatarUrl, getMediumAvatarUrl } from "../utils/avatarUtils";
import { useLogoContext } from "../LogoContext";
import axios from "axios";

const Header = () => {
  const { theme } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const { toggleTheme } = useContext(ThemeContext);
  const { logoUrl, setLogoUrl, appName } = useLogoContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const notificationDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setShowNotificationDropdown(false);
      }
    }
    if (showNotificationDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotificationDropdown]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token") || user?.token;
        if (!token) return;
        const res = await fetch("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      } catch {
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, [user]);

  // Fetch logo from backend if not present in context (e.g., on direct page load)
  useEffect(() => {
    if (!logoUrl) {
      const fetchLogo = async () => {
        try {
          const res = await axios.get("http://localhost:5000/settings");
          const data = res.data;
          const logoSetting = data.find(s => s.key === "logo");
          if (logoSetting && logoSetting.value) {
            setLogoUrl(logoSetting.value);
          }
        } catch {
          // ignore
        }
      };
      fetchLogo();
    }
    // eslint-disable-next-line
  }, [logoUrl, setLogoUrl]);

  const avatarDropdownRef = useRef(null);

  const toggleSidebar = () => {
    const sidebar = document.querySelector(".navbar-vertical");
    if (sidebar) {
      sidebar.classList.toggle("show");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <nav
      className="navbar navbar-top fixed-top navbar-expand"
      id="navbarDefault"
    >
      <div className="collapse navbar-collapse justify-content-between">
        <div className="navbar-logo">
          <button
            className="btn navbar-toggler navbar-toggler-humburger-icon hover-bg-transparent"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarVerticalCollapse"
            aria-controls="navbarVerticalCollapse"
            aria-expanded="false"
            aria-label="Toggle Navigation"
            onClick={toggleSidebar}
          >
            <span className="navbar-toggle-icon">
              <span className="toggle-line"></span>
            </span>
          </button>
          <a
            className="navbar-brand me-1 me-sm-3"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard");
            }}
          >
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center">
                <img
                  src={logoUrl || "/phoenix/v1.20.1/assets/img/icons/logo.png"}
                  alt="phoenix"
                  width="27"
                />
                <h5 className="logo-text ms-2 d-none d-sm-block">{appName || "phoenix"}</h5>
              </div>
            </div>
          </a>
        </div>
        <div
          className="search-box navbar-top-search-box d-none d-lg-block"
          style={{ width: "25rem" }}
        >
          <form
            className="position-relative"
            onSubmit={handleSearch}
            data-bs-toggle="search"
            data-bs-display="static"
          >
            <input
              className="form-control search-input fuzzy-search rounded-pill form-control-sm"
              type="search"
              placeholder="Search..."
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="fas fa-search search-box-icon"></span>
          </form>
        </div>
        <ul className="navbar-nav navbar-nav-icons flex-row">
          <li className="nav-item">
            <div className="theme-control-toggle p-2">
              <button
                className={`btn ${
                  theme === "light" ? "bg-body" : "bg-dark"
                } rounded-circle p-2`}
                type="button"
                onClick={toggleTheme}
                title="Toggle theme"
              >
                <span className={`fas fa-moon fs-0 `}></span>
              </button>
            </div>
          </li>
          <li className="nav-item">
            <div className="dropdown" ref={notificationDropdownRef}>
              <button
                className="nav-link dropdown-toggle"
                id="notificationDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded={showNotificationDropdown}
                style={{ minWidth: "2.25rem" }}
                onClick={(e) => {
                  e.preventDefault();
                  setShowNotificationDropdown((v) => !v);
                }}
              >
                <span
                  className="d-block"
                  style={{ height: "20px", width: "20px" }}
                >
                  <span
                    className={`fas fa-bell ${theme === 'dark' ? 'text-light' : 'text-dark'}`}
                    style={{ height: "20px", width: "20px" }}
                  ></span>
                </span>
                <span className="badge rounded-pill bg-soft-secondary text-secondary bg-soft-warning text-warning count-indicator">
                  {notifications.filter((n) => n.unread).length}
                </span>
              </button>
              <div
                className={`dropdown-menu dropdown-menu-end notification-dropdown-menu py-0 shadow border navbar-dropdown-caret${
                  showNotificationDropdown ? " show" : ""
                }`}
                aria-labelledby="notificationDropdown"
              >
                <div className="card position-relative border-0">
                  <div className="card-header p-2">
                    <div className="d-flex justify-content-between">
                      <h5 className="text-body-emphasis mb-0">Notifications</h5>
                      <button
                        className="btn btn-link p-0 fs-9 fw-normal"
                        type="button"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div
                      className="scrollbar-overlay"
                      style={{ height: "27rem" }}
                    >
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-2 px-sm-3 py-3 notification-card position-relative ${
                              notification.unread ? "unread" : "read"
                            } border-bottom`}
                          >
                            <div className="d-flex align-items-center justify-content-between position-relative">
                              <div className="d-flex">
                                <div className="avatar avatar-m status-online me-3">
                                  {notification.avatar ? (
                                    <img
                                      className="rounded-circle"
                                      src={notification.avatar}
                                      alt=""
                                    />
                                  ) : (
                                    <div className="avatar-name rounded-circle">
                                      <span>
                                        {notification.name
                                          ? notification.name[0]
                                          : "?"}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 me-sm-3">
                                  <h4 className="fs-9 text-body-emphasis">
                                    {notification.name || "Notification"}
                                  </h4>
                                  <p className="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal">
                                    <span className="me-1 fs-10">
                                      {notification.emoji || "🔔"}
                                    </span>
                                    {notification.url || notification.file ? (
                                      <a
                                        href={
                                          (
                                            notification.url ||
                                            notification.file
                                          ).startsWith("http")
                                            ? notification.url ||
                                              notification.file
                                            : `http://localhost:5000${
                                                notification.url ||
                                                notification.file
                                              }`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          color: "blue",
                                          textDecoration: "underline",
                                          cursor: "pointer",
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {notification.message ||
                                          notification.label ||
                                          "You have a new notification."}
                                      </a>
                                    ) : (
                                      notification.message ||
                                      notification.label ||
                                      "You have a new notification."
                                    )}
                                    <span className="ms-2 text-body-quaternary text-opacity-75 fw-bold fs-10">
                                      {notification.timeAgo || ""}
                                    </span>
                                  </p>
                                  <p className="text-body-secondary fs-9 mb-0">
                                    <span className="me-1 fas fa-clock"></span>
                                    <span className="fw-bold">
                                      {notification.time || ""}{" "}
                                    </span>
                                    {notification.date || ""}
                                  </p>
                                </div>
                              </div>
                              <div className="dropdown notification-dropdown">
                                <button
                                  className="btn fs-10 btn-sm dropdown-toggle dropdown-caret-none transition-none"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  data-boundary="window"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                  data-bs-reference="parent"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span className="fas fa-ellipsis-h fs-10 text-body"></span>
                                </button>
                                <div className="dropdown-menu py-2">
                                  {notification.pdf_path ||
                                  notification.file ||
                                  notification.url ? (
                                    <a
                                      className="dropdown-item"
                                      href={
                                        (
                                          notification.pdf_path ||
                                          notification.file ||
                                          notification.url
                                        ).startsWith("http")
                                          ? notification.pdf_path ||
                                            notification.file ||
                                            notification.url
                                          : `http://localhost:5000${
                                              notification.pdf_path ||
                                              notification.file ||
                                              notification.url
                                            }`
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View Invoice PDF
                                    </a>
                                  ) : (
                                    <span className="dropdown-item text-muted">
                                      No PDF available
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted mb-0">No notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="card-footer p-0 border-top border-translucent border-0">
                    <div className="my-2 text-center fw-bold fs-10 text-body-tertiary text-opactity-85">
                      <a className="fw-bolder" href="#">
                        Notification history
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <div className="dropdown">
              <button
                className="nav-link lh-1 pe-0 dropdown-toggle"
                id="navbarDropdownUser"
                type="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                ref={avatarDropdownRef}
              >
                <div className="avatar avatar-l">
                  <img
                    className="rounded-circle"
                    src={getSmallAvatarUrl(user?.avatar)}
                    alt="Profile"
                  />
                </div>
              </button>
              <div
                className="dropdown-menu dropdown-menu-end navbar-dropdown-caret py-0 dropdown-profile shadow border rounded-3"
                aria-labelledby="navbarDropdownUser"
              >
                <div className="card position-relative border-0 rounded-3">
                  <div className="card-body p-0 rounded-top-3">
                    <div className="text-center pt-4 pb-3 d-flex flex-column align-items-center">
                      <div className="avatar avatar-xl mb-2">
                        <img
                          className="rounded-circle"
                          src={getMediumAvatarUrl(user?.avatar)}
                          alt="Profile"
                        />
                      </div>
                      <h6 className="mt-3 mb-0 fw-bold fs-5 text-body-emphasis">
                        {user?.name || "User"}
                      </h6>
                    </div>
                    <div className="mb-3 mx-3">
                      <input
                        className="form-control form-control-sm"
                        id="statusUpdateInput"
                        type="text"
                        placeholder="Update your status"
                      />
                    </div>
                  </div>
                  <div className="overflow-auto scrollbar">
                    <ul className="nav d-flex flex-column mb-2 pb-1">
                      <li className="nav-item">
                        <a
                          className={`nav-link px-3 d-block ${
                            theme === "light"
                              ? "custom-nav-link-light"
                              : "custom-nav-link-dark"
                          }`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/profile");
                          }}
                        >
                          <span
                            className={`me-2 align-bottom ${
                              theme === "light" ? "text-body" : "text-white"
                            }`}
                            data-feather="user"
                          ></span>
                          Profile
                        </a>
                      </li>

                      <li className="nav-item">
                        <a
                          className={`nav-link px-3 d-block ${
                            theme === "light"
                              ? "custom-nav-link-light"
                              : "custom-nav-link-dark"
                          }`}
                          href="/dashboard"
                        >
                          <span
                            className={`me-2 align-bottom ${
                              theme === "light" ? "text-body" : "text-white"
                            }`}
                            data-feather="pie-chart"
                          ></span>
                          Dashboard
                        </a>
                      </li>

                      <li className="nav-item">
                        <a
                          className={`nav-link px-3 d-block ${
                            theme === "light"
                              ? "custom-nav-link-light"
                              : "custom-nav-link-dark"
                          }`}
                          href="#"
                        >
                          <span
                            className={`me-2 align-bottom ${
                              theme === "light" ? "text-body" : "text-white"
                            }`}
                            data-feather="lock"
                          ></span>
                          Posts & Activity
                        </a>
                      </li>

                      <li className="nav-item">
                        <a
                          className={`nav-link px-3 d-block ${
                            theme === "light"
                              ? "custom-nav-link-light"
                              : "custom-nav-link-dark"
                          }`}
                          href="#"
                        >
                          <span
                            className={`me-2 align-bottom ${
                              theme === "light" ? "text-body" : "text-white"
                            }`}
                            data-feather="settings"
                          ></span>
                          Settings & Privacy
                        </a>
                      </li>

                      <li className="nav-item">
                        <a
                          className={`nav-link px-3 d-block  ${
                            theme === "light"
                              ? "custom-nav-link-light"
                              : "custom-nav-link-dark"
                          }`}
                          href="#"
                        >
                          <span
                            className={`me-2 align-bottom ${
                              theme === "light" ? "text-body" : "text-white"
                            }`}
                            data-feather="help-circle"
                          ></span>
                          Help Center
                        </a>
                      </li>

                      <li className="nav-item">
                        <a
                          className={`nav-link px-3 d-block  ${
                            theme === "light"
                              ? "custom-nav-link-light"
                              : "custom-nav-link-dark"
                          }`}
                          href="#"
                        >
                          <span
                            className={`me-2 align-bottom ${
                              theme === "light" ? "text-body" : "text-white"
                            }`}
                            data-feather="globe"
                          ></span>
                          Language
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="card-footer p-0 border-top rounded-bottom-3">
                    <ul className="nav d-flex flex-column my-3">
                      <li className="nav-item">
                        <a
                          className={`nav-link px-3 d-block ${
                            theme === "light"
                              ? "custom-nav-link-light"
                              : "custom-nav-link-dark"
                          }`}
                          href="#"
                        >
                          <span
                            className={`me-2 align-bottom ${
                              theme === "light" ? "text-body" : "text-white"
                            }`}
                            data-feather="user-plus"
                          ></span>
                          Add another account
                        </a>
                      </li>
                    </ul>
                    <hr />
                    <div className="px-3">
                      <button
                        className={`btn ${
                          theme === "light"
                            ? "bg-light text-black"
                            : "bg-dark text-white"
                        } d-flex flex-center w-100`}
                        onClick={logout}
                      >
                        <span className="me-2" data-feather="log-out"></span>
                        Sign out
                      </button>
                    </div>
                    <div className="my-2 text-center fw-bold fs-10 text-body-quaternary">
                      <a className="text-body-quaternary me-1" href="#">
                        Privacy policy
                      </a>
                      &bull;
                      <a className="text-body-quaternary mx-1" href="#">
                        Terms
                      </a>
                      &bull;
                      <a className="text-body-quaternary ms-1" href="#">
                        Cookies
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
