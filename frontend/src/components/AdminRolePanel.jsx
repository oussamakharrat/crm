import React, { useEffect, useState, useRef, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { ThemeContext } from "../ThemeContext";

// Use only Phoenix template resources
// ECharts is available at /phoenix/v1.20.1/assets/js/vendors/echarts.min.js
// and /phoenix/v1.20.1/assets/js/echarts.min.js

const AdminRolePanel = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const chartRef = useRef(null);
  const { user } = useContext(AuthContext);
  const [roleData, setRoleData] = useState([]);
  // Add local state to track selected roles for each user
  const [pendingRoles, setPendingRoles] = useState({});

  // Fetch users and users-by-role from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const headers = user?.token ? { "Authorization": `Bearer ${user.token}` } : {};
      try {
        // Fetch user list (with roles)
        const usersRes = await fetch("/api/details", { headers });
        let usersData = [];
        if (usersRes.ok) {
          usersData = await usersRes.json();
        }
        setUsers(Array.isArray(usersData) ? usersData : []);
        // Fetch user-by-role data from backend
        const res = await fetch("/api/reports/users-by-role", { headers });
        let data = [];
        if (res.ok) {
          data = await res.json();
        }
        setRoleData(Array.isArray(data) ? data : []);
        // Fetch roles from backend
        const rolesRes = await fetch("/api/roles", { headers });
        let rolesData = [];
        if (rolesRes.ok) {
          rolesData = await rolesRes.json();
        }
        setRoles(Array.isArray(rolesData) ? rolesData : []);
      } catch {
        setUsers([]);
        setRoleData([]);
        setRoles([]);
      }
      setLoading(false);
    };
    if (user?.token) fetchData();
  }, [user]);

  // For chart
  useEffect(() => {
    if (!window.echarts && window.Phoenix) {
      const script = document.createElement('script');
      script.src = '/phoenix/v1.20.1/assets/js/vendors/echarts.min.js';
      script.onload = () => renderChart();
      document.body.appendChild(script);
      return;
    }
    renderChart();
    // eslint-disable-next-line
  }, [roleData]);

  const renderChart = () => {
    if (!chartRef.current || !window.echarts) return;
    const chart = window.echarts.init(chartRef.current);
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { top: '5%', left: 'center' },
      series: [
        {
          name: 'Users by Role',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: 18, fontWeight: 'bold' } },
          labelLine: { show: false },
          data: roleData.map(r => ({ name: r.role, value: r.user_count }))
        }
      ]
    });
  };

  // Update select to only update local state
  const handleSelectChange = (userId, roleId) => {
    setPendingRoles(prev => ({ ...prev, [userId]: roleId }));
  };

  // Update handleAssignRole to use pendingRoles
  const handleAssignRole = async (userId) => {
    const roleId = pendingRoles[userId];
    if (!roleId) {
      setFeedback({ type: 'error', message: 'Please select a role.' });
      return;
    }
    const targetUser = users.find(u => u.id === userId);
    if (targetUser && (targetUser.roles || []).some(r => (typeof r === 'string' ? r : r.id) == roleId)) {
      setFeedback({ type: 'error', message: 'User already has this role.' });
      return;
    }
    const headers = {
      "Content-Type": "application/json",
      ...(user?.token ? { "Authorization": `Bearer ${user.token}` } : {})
    };
    try {
      const res = await fetch("/api/roles/assign", {
        method: "POST",
        headers,
        body: JSON.stringify({ user_id: userId, role_id: roleId })
      });
      if (!res.ok) {
        const err = await res.json();
        setFeedback({ type: 'error', message: err.error || 'Failed to assign role.' });
        return;
      }
      setFeedback({ type: 'success', message: 'Role assigned successfully.' });
      // Refresh both users and roleData
      const usersRes = await fetch("/api/details", { headers });
      const usersData = await usersRes.json();
      setUsers(usersData);
      const roleRes = await fetch("/api/reports/users-by-role", { headers });
      const roleDataNew = await roleRes.json();
      setRoleData(Array.isArray(roleDataNew) ? roleDataNew : []);
      // Clear pending role for this user
      setPendingRoles(prev => ({ ...prev, [userId]: undefined }));
    } catch (e) {
      setFeedback({ type: 'error', message: 'Network error. Please try again. => ' + e });
    }
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="row g-3 mb-4" >
      <div className="col-12">
        <div className="card" >
          <div className="card-header">
            <h5 className="mb-0">User Role Management</h5>
          </div>
          <div className="card-body" >
            {feedback.message && (
              <div className={`alert alert-${feedback.type === 'error' ? 'danger' : 'success'} mb-3`}>
                {feedback.message}
              </div>
            )}
            <div className="row g-3 align-items-start">
              <div className="col-12">
                <div className="table-responsive scrollbar mx-n1 px-1 mb-3">
                  <table className="table fs-9 mb-0 border-top border-translucent">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Current Roles</th>
                        <th>Assign Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Array.isArray(users) ? users : []).map(user => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            {(user.roles || []).map((role, idx) => (
                              <span key={idx} className="badge bg-primary fs-9 me-1">{typeof role === 'string' ? role : role.name}</span>
                            ))}
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <select
                                className="form-select form-select-sm"
                                value={pendingRoles[user.id] || ""}
                                onChange={e => handleSelectChange(user.id, e.target.value)}
                              >
                                <option value="" disabled>Assign role...</option>
                                {(Array.isArray(roles) ? roles : []).map(role => {
                                  const alreadyHas = (user.roles || []).some(r => (typeof r === 'string' ? r : r.id) == role.id);
                                  return (
                                    <option key={role.id} value={role.id} disabled={alreadyHas}>{role.name}{alreadyHas ? ' (assigned)' : ''}</option>
                                  );
                                })}
                              </select>
                              <button
                                className="btn btn-sm btn-primary"
                                disabled={!pendingRoles[user.id]}
                                onClick={() => handleAssignRole(user.id)}
                              >
                                Confirm
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Make the card use all available space in its parent */}
              <div>
                <div className="card w-100">
                  <div className="card-header py-2" style={{ minHeight: 0 }}>
                    <h6 className="mb-0">Users by Role</h6>
                  </div>
                  <div className="card-body py-2 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 0 }}>
                    <div ref={chartRef} style={{ minHeight: 120, marginBottom: 8, width: '100%' }}></div>
                    <ul className="list-group mt-2 w-100">
                      {roleData.map(rc => (
                        <li key={rc.role} className="list-group-item py-2 px-2 w-100">
                          <div className="d-flex justify-content-between align-items-center w-100">
                            <span><strong>{rc.role}</strong></span>
                            <span className="badge bg-primary rounded-pill">{rc.user_count}</span>
                          </div>
                          {rc.users && rc.users.length > 0 && (
                            <ul className="list-unstyled ms-3 mb-0">
                              {rc.users.map((u, i) => (
                                <li key={i} className="text-muted small">{u.name} <span className="text-secondary">({u.email})</span></li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRolePanel; 