import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ThemeContext } from "../ThemeContext";
import { getSmallAvatarUrl, getMediumAvatarUrl } from "../utils/avatarUtils";

const Header = () => {
  const { user, logout } = useAuth();
  const { toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const notificationDropdownRef = useRef(null);

  // Close dropdown when clicking outside
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
        const token = localStorage.getItem('token') || user?.token;
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch notifications');
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, [user]);

  // Add a ref for the avatar dropdown toggle
  const avatarDropdownRef = useRef(null);

  // Initialize Bootstrap dropdowns
  useEffect(() => {
    // Initialize Bootstrap dropdowns
    if (window.bootstrap) {
      const dropdownElementList = document.querySelectorAll('.dropdown-toggle, [data-bs-toggle="dropdown"]');
      dropdownElementList.forEach(dropdownToggleEl => {
        new window.bootstrap.Dropdown(dropdownToggleEl);
      });
    }
    // Initialize Feather icons
    if (window.feather) {
      window.feather.replace();
    }
  }, [user]);

  // Sidebar toggle functionality
  const toggleSidebar = () => {
    const sidebar = document.querySelector('.navbar-vertical');
    if (sidebar) {
      sidebar.classList.toggle('show');
    }
  };

  // Search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  // Get page title and breadcrumbs based on current route
  const getPageInfo = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return { title: 'Dashboard', breadcrumbs: ['Home', 'Dashboard'] };
      case '/analytics':
        return { title: 'Analytics', breadcrumbs: ['CRM', 'Analytics'] };
      case '/deals':
        return { title: 'Deals', breadcrumbs: ['CRM', 'Deals'] };
      case '/deal-details':
        return { title: 'Deal Details', breadcrumbs: ['CRM', 'Deals', 'Deal Details'] };
      case '/leads':
        return { title: 'Leads', breadcrumbs: ['CRM', 'Leads'] };
      case '/lead-details':
        return { title: 'Lead Details', breadcrumbs: ['CRM', 'Leads', 'Lead Details'] };
      case '/reports':
        return { title: 'Reports', breadcrumbs: ['CRM', 'Reports'] };
      case '/report-details':
        return { title: 'Report Details', breadcrumbs: ['CRM', 'Reports', 'Report Details'] };
      case '/contacts':
        return { title: 'Contacts', breadcrumbs: ['Contacts'] };
      case '/add-contact':
        return { title: 'Add Contact', breadcrumbs: ['Contacts', 'Add Contact'] };
      default:
        return { title: 'Dashboard', breadcrumbs: ['Home', 'Dashboard'] };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <>
      <nav className="navbar navbar-top fixed-top navbar-expand" id="navbarDefault">
        <div className="collapse navbar-collapse justify-content-between">
          <div className="navbar-logo">
            <button 
              className="btn navbar-toggler navbar-toggler-humburger-icon hover-bg-transparent" 
              type="button" 
              onClick={toggleSidebar}
              aria-label="Toggle Navigation"
            >
              <span className="navbar-toggler-icon">
                <span className="toggle-line"></span>
              </span>
            </button>
            <a className="navbar-brand me-1 me-sm-3" href="#!" onClick={() => navigate('/dashboard')}>
              <div className="d-flex align-items-center py-0">
                <img src="/phoenix/v1.20.1/assets/img/icons/logo.png" alt="phoenix" width="58" />
                <span className="font-sans-serif fw-bolder fs-4 d-inline-block ms-2">phoenix</span>
              </div>
            </a>
          </div>
          
          {/* Page Title and Breadcrumbs */}
          <div className="d-none d-lg-block flex-grow-1 mx-4">
            <div className="d-flex align-items-center">
              <h4 className="mb-0 me-3">{pageInfo.title}</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  {pageInfo.breadcrumbs.map((crumb, index) => (
                    <li key={index} className={`breadcrumb-item ${index === pageInfo.breadcrumbs.length - 1 ? 'active' : ''}`}>
                      {index === pageInfo.breadcrumbs.length - 1 ? crumb : <a href="#!">{crumb}</a>}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </div>

          <div className="search-box navbar-top-search-box d-none d-lg-block" style={{width: '25rem'}}>
            <form className="position-relative" onSubmit={handleSearch}>
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
            {/* Theme Toggle */}
            <li className="nav-item">
              <button className="btn btn-phoenix-secondary px-2" type="button" onClick={toggleTheme} title="Toggle theme">
                <span className="fas fa-moon fs-0"></span>
              </button>
            </li>

            {/* Notifications Dropdown */}
            <li className="nav-item dropdown" ref={notificationDropdownRef} style={{ position: 'relative' }}>
              <a
                className="nav-link"
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setShowNotificationDropdown(v => !v);
                }}
                style={{ cursor: 'pointer' }}
              >
                <span className="text-500 fas fa-bell nav-link-fa"></span>
                <span className="badge rounded-pill bg-soft-secondary text-secondary bg-soft-warning text-warning count-indicator">
                  {notifications.filter(n => n.unread).length}
                </span>
              </a>
              {showNotificationDropdown && (
                <div className="dropdown-menu show dropdown-menu-end navbar-dropdown-caret py-0 dropdown-notification shadow border rounded-3"
                  style={{
                    minWidth: 340,
                    background: 'var(--phoenix-card-bg)',
                    border: '1px solid var(--phoenix-card-border-color)',
                    color: 'var(--phoenix-card-color)',
                    display: 'block',
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    zIndex: 9999
                  }}
                >
                  <div className="card position-relative border-0 rounded-3" style={{ boxShadow: 'none', background: 'transparent' }}>
                    <div className="card-header p-3 border-bottom rounded-top-3" style={{ background: 'var(--phoenix-card-header-bg)', color: 'var(--phoenix-card-header-color)' }}>
                      <h5 className="text-body-emphasis mb-0" style={{ color: 'var(--phoenix-card-header-color)' }}>Notifications</h5>
                    </div>
                    <div className="card-body p-0 rounded-bottom-3" style={{ background: 'var(--phoenix-card-bg)' }}>
                      <div className="scrollbar-overlay" style={{height: '27rem'}}>
                        {notifications.length > 0 ? (
                          notifications
                            .filter(n => n.type === 'invoice')
                            .map(notification => (
                              <div key={notification.id} className="px-2 py-2 border-bottom notification-card position-relative">
                                <a
                                  href={`http://localhost:5000${notification.pdf_path}`}
                                  download
                                  style={{ color: 'var(--phoenix-primary)', fontWeight: 500 }}
                                >
                                  {notification.label || `Invoice ${notification.invoice_number}`}
                                </a>
                                <div style={{ fontSize: 12, color: '#888' }}>{notification.time}</div>
                              </div>
                            ))
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-muted mb-0" style={{ color: 'var(--phoenix-card-color)' }}>No notifications</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>

            {/* User Profile Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link lh-1 pe-0"
                id="navbarDropdownUser"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                ref={avatarDropdownRef}
                onClick={e => {
                  e.preventDefault();
                  // Manually toggle dropdown if needed
                  if (window.bootstrap && avatarDropdownRef.current) {
                    const dropdown = window.bootstrap.Dropdown.getOrCreateInstance(avatarDropdownRef.current);
                    dropdown.toggle();
                  }
                }}
              >
                <div className="avatar avatar-l">
                  <img
                    className="rounded-circle"
                    src={getSmallAvatarUrl(user?.avatar)}
                    alt="Profile"
                    style={{ width: 40, height: 40, objectFit: 'cover' }}
                  />
                </div>
              </a>
              <div className="dropdown-menu dropdown-menu-end navbar-dropdown-caret py-0 dropdown-profile shadow border rounded-3"
                aria-labelledby="navbarDropdownUser"
                style={{
                  minWidth: 320,
                  background: 'var(--phoenix-card-bg)',
                  border: '1px solid var(--phoenix-card-border-color)',
                  color: 'var(--phoenix-card-color)'
                }}
              >
                <div className="card position-relative border-0 rounded-3" style={{ boxShadow: 'none', background: 'transparent' }}>
                  <div className="card-body p-0 rounded-top-3" style={{ background: 'var(--phoenix-card-bg)' }}>
                    <div className="text-center pt-4 pb-3 d-flex flex-column align-items-center">
                      <div className="avatar avatar-xl mb-2">
                        <img
                          className="rounded-circle"
                          src={getMediumAvatarUrl(user?.avatar)}
                          alt="Profile"
                          style={{ width: 72, height: 72, objectFit: 'cover' }}
                        />
                      </div>
                      <h6 className="mt-3 mb-0 fw-bold fs-5 text-body-emphasis" style={{ color: 'var(--phoenix-card-color)', wordBreak: 'break-word' }}>{user?.name || "User"}</h6>
                    </div>
                    <div className="mb-3 mx-3">
                      <input className="form-control form-control-sm" id="statusUpdateInput" type="text" placeholder="Update your status" />
                    </div>
                  </div>
                  <div className="overflow-auto scrollbar" style={{height: '10rem', background: 'var(--phoenix-card-bg)', color: 'var(--phoenix-card-color)' }}>
                    <ul className="nav d-flex flex-column mb-2 pb-1">
                      <li className="nav-item">
                        <a className="nav-link px-2 py-2 d-block" href="#" style={{ color: 'var(--phoenix-card-color)', fontSize: 14, fontWeight: 400 }}
                          onClick={e => { e.preventDefault(); navigate('/profile'); }}>
                          <span className="me-2 text-body align-bottom" data-feather="user"></span>Profile
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link px-2 py-2 d-block" href="/dashboard" style={{ color: 'var(--phoenix-card-color)', fontSize: 14, fontWeight: 400 }}>
                          <span className="me-2 text-body align-bottom" data-feather="pie-chart"></span>Dashboard
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link px-2 py-2 d-block" href="#" style={{ color: 'var(--phoenix-card-color)', fontSize: 14, fontWeight: 400 }}>
                          <span className="me-2 text-body align-bottom" data-feather="lock"></span>Posts & Activity
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link px-2 py-2 d-block" href="#" style={{ color: 'var(--phoenix-card-color)', fontSize: 14, fontWeight: 400 }}>
                          <span className="me-2 text-body align-bottom" data-feather="settings"></span>Settings & Privacy
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link px-2 py-2 d-block" href="#" style={{ color: 'var(--phoenix-card-color)', fontSize: 14, fontWeight: 400 }}>
                          <span className="me-2 text-body align-bottom" data-feather="help-circle"></span>Help Center
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link px-2 py-2 d-block" href="#" style={{ color: 'var(--phoenix-card-color)', fontSize: 14, fontWeight: 400 }}>
                          <span className="me-2 text-body align-bottom" data-feather="globe"></span>Language
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="card-footer p-0 border-top rounded-bottom-3" style={{ background: 'var(--phoenix-card-header-bg)', borderColor: 'var(--phoenix-card-border-color)', color: 'var(--phoenix-card-header-color)' }}>
                    <ul className="nav d-flex flex-column my-3">
                      <li className="nav-item"><a className="nav-link px-2 py-2 d-block" href="#" style={{ color: 'var(--phoenix-card-color)', fontSize: 14, fontWeight: 400 }}><span className="me-2 text-body align-bottom" data-feather="user-plus"></span>Add another account</a></li>
                    </ul>
                    <hr />
                    <div className="px-3">
                      <button className="btn btn-phoenix-secondary d-flex flex-center w-100" onClick={logout}>
                        <span className="me-2" data-feather="log-out"></span>Sign out
                      </button>
                    </div>
                    <div className="my-2 text-center fw-bold fs-10 text-body-quaternary">
                      <a className="text-body-quaternary me-1" href="#" style={{ color: 'var(--phoenix-card-color)', fontWeight: 400, fontSize: 13 }}>Privacy policy</a>&bull;
                      <a className="text-body-quaternary mx-1" href="#" style={{ color: 'var(--phoenix-card-color)', fontWeight: 400, fontSize: 13 }}>Terms</a>&bull;
                      <a className="text-body-quaternary ms-1" href="#" style={{ color: 'var(--phoenix-card-color)', fontWeight: 400, fontSize: 13 }}>Cookies</a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      
      {/* Mobile Page Title */}
      <div className="d-lg-none border-bottom border-translucent py-3 px-4" style={{ background: 'var(--phoenix-body-bg)', color: 'var(--phoenix-body-color)' }}>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-1">{pageInfo.title}</h5>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                {pageInfo.breadcrumbs.map((crumb, index) => (
                  <li key={index} className={`breadcrumb-item ${index === pageInfo.breadcrumbs.length - 1 ? 'active' : ''}`}>
                    {index === pageInfo.breadcrumbs.length - 1 ? crumb : <a href="#!">{crumb}</a>}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header; 