import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import RoleBasedDashboard from "./components/RoleBasedDashboard";
import Contacts from "./components/Contacts";
import Deals from "./components/Deals";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./ThemeContext";
import { useAuth } from "./hooks/useAuth";
import Leads from "./components/Leads";
import Reports from "./components/Reports";
import Analytics from "./components/Analytics";
import AddContact from "./components/AddContact";
import DealDetails from "./components/DealDetails";
import LeadDetails from "./components/LeadDetails";
import ReportDetails from "./components/ReportDetails";
import Profile from "./components/Profile";
import './App.css';

const MainApp = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <main className="main d-flex" id="top" style={{ height: '100vh', minHeight: '100vh' }}>
      <Sidebar />
      <div className="content d-flex flex-column flex-grow-1 container-fluid px-4" style={{ minHeight: '100vh' }}>
        <Header />
        <div className="main-content-area flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
          <Routes>
            <Route path="/dashboard" element={<RoleBasedDashboard />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/add-contact" element={<AddContact />} />
            <Route path="/deal-details/:id" element={<DealDetails />} />
            <Route path="/lead-details/:id" element={<LeadDetails />} />
            <Route path="/report-details/:id" element={<ReportDetails />} />
            <Route path="/report-details" element={<ReportDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
        <footer className="footer mt-auto pt-4">
          <div className="row g-0 justify-content-between align-items-center h-100">
            <div className="col-12 col-sm-auto text-center">
              <p className="mb-0 mt-2 mt-sm-0 text-body">Thank you for creating with Phoenix<span className="d-none d-sm-inline-block"></span><span className="d-none d-sm-inline-block mx-1">|</span><br className="d-sm-none" />2024 &copy;<a className="mx-1" href="https://themewagon.com/">Themewagon</a></p>
            </div>
            <div className="col-12 col-sm-auto text-center">
              <p className="mb-0 text-body-tertiary text-opacity-85">v1.20.1</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <MainApp />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
