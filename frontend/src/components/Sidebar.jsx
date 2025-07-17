import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SidebarLink = ({ to, icon, text, active }) => (
  <li className="nav-item">
    <Link className={`nav-link${active ? ' active' : ''}`} to={to}>
      <div className="d-flex align-items-center">
        {icon && (
          <span className="nav-link-icon">
            <span data-feather={icon}></span>
          </span>
        )}
        <span className="nav-link-text">{text}</span>
      </div>
    </Link>
  </li>
);

const SidebarSection = ({ label, icon, links, parent, show = false }) => (
  <li className="nav-item">
    {label && <>
      <p className="navbar-vertical-label">{label}</p>
      <hr className="navbar-vertical-line" />
    </>}
    <div className="nav-item-wrapper">
      <a className="nav-link dropdown-indicator label-1" href={`#nv-${parent}`} role="button" data-bs-toggle="collapse" aria-expanded={show} aria-controls={`nv-${parent}`}>
        <div className="d-flex align-items-center">
          <div className="dropdown-indicator-icon-wrapper">
            <span className="fas fa-caret-right dropdown-indicator-icon"></span>
          </div>
          {icon && (
            <span className="nav-link-icon">
              <span data-feather={icon}></span>
            </span>
          )}
          <span className="nav-link-text">{parent}</span>
        </div>
      </a>
      <div className="parent-wrapper label-1">
        <ul className={`nav collapse parent${show ? ' show' : ''}`} data-bs-parent="#navbarVerticalCollapse" id={`nv-${parent}`}>{links}</ul>
      </div>
    </div>
  </li>
);

const Sidebar = () => {
  const location = useLocation();
  const { roles } = useAuth();

  // Case-insensitive role checks
  const lowerRoles = Array.isArray(roles) ? roles.map(r => r.toLowerCase()) : [];
  const isAdmin = lowerRoles.includes("admin");
  const isUser = lowerRoles.includes("user") && !isAdmin;
  const isClient = lowerRoles.includes("client") && !isAdmin && !isUser;

  let crmLinks = [];
  if (isAdmin) {
    crmLinks = [
      <SidebarLink key="analytics" to="/analytics" text="Analytics" active={location.pathname === "/analytics"} />,
      <SidebarLink key="deals" to="/deals" text="Deals" active={location.pathname === "/deals"} />,
      <SidebarLink key="leads" to="/leads" text="Leads" active={location.pathname === "/leads"} />,
      <SidebarLink key="reports" to="/reports" text="Reports" active={location.pathname === "/reports"} />,
      <SidebarLink key="add-contact" to="/add-contact" text="Add contact" active={location.pathname === "/add-contact"} />
    ];
  } else if (isUser) {
    crmLinks = [
      <SidebarLink key="deals" to="/deals" text="Deals" active={location.pathname === "/deals"} />,
      <SidebarLink key="leads" to="/leads" text="Leads" active={location.pathname === "/leads"} />,
      <SidebarLink key="reports" to="/reports" text="Reports" active={location.pathname === "/reports"} />,
      <SidebarLink key="add-contact" to="/add-contact" text="Add contact" active={location.pathname === "/add-contact"} />
    ];
  } else if (isClient) {
    crmLinks = [
      <SidebarLink key="leads" to="/leads" text="Leads" active={location.pathname === "/leads"} />,
      <SidebarLink key="reports" to="/reports" text="Reports" active={location.pathname === "/reports"} />
    ];
  }

  return (
    <nav className="navbar navbar-vertical navbar-expand-lg">
      <div className="collapse navbar-collapse" id="navbarVerticalCollapse">
        <div className="navbar-vertical-content">
          <ul className="navbar-nav flex-column" id="navbarVerticalNav">
            <SidebarLink to="/dashboard" icon="pie-chart" text="Home" active={location.pathname === "/dashboard"} />
            {crmLinks.length > 0 && (
              <SidebarSection
                label="Apps"
                icon="phone"
                parent="CRM"
                show={true}
                links={crmLinks}
              />
            )}
            {(isAdmin || isUser) && (
              <SidebarLink to="/contacts" icon="users" text="Contacts" active={location.pathname === "/contacts"} />
            )}
            {isAdmin && (
              <SidebarLink to="/settings" icon="settings" text="Settings" active={location.pathname === "/settings"} />
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;