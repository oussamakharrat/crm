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
  const chartRef = useRef(null);
  const { user } = useContext(AuthContext);

  // Fetch users and roles from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const headers = user?.token ? { "Authorization": `Bearer ${user.token}` } : {};
      try {
        const usersRes = await fetch("/api/details", { headers });
        let usersData = [];
        if (usersRes.ok) {
          usersData = await usersRes.json();
        }
        const rolesRes = await fetch("/api/roles", { headers });
        let rolesData = [];
        if (rolesRes.ok) {
          rolesData = await rolesRes.json();
        }
        setUsers(Array.isArray(usersData) ? usersData : []);
        setRoles(Array.isArray(rolesData) ? rolesData : []);
      } catch {
        setUsers([]);
        setRoles([]);
      }
      setLoading(false);
    };
    if (user?.token) fetchData();
  }, [user]);

  // Group users by role for chart
  const roleCounts = (Array.isArray(roles) ? roles : []).map(role => ({
    name: role.name,
    value: users.filter(user => (user.roles || []).some(r => (typeof r === 'string' ? r : r.name) === role.name)).length
  }));

  // Initialize ECharts
  useEffect(() => {
    if (!window.echarts && window.Phoenix) {
      // Try to load ECharts from Phoenix assets if not already loaded
      const script = document.createElement('script');
      script.src = '/phoenix/v1.20.1/assets/js/vendors/echarts.min.js';
      script.onload = () => renderChart();
      document.body.appendChild(script);
      return;
    }
    renderChart();
    // eslint-disable-next-line
  }, [users, roles]);

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
          data: roleCounts
        }
      ]
    });
  };

  // Assign role to user
  const handleAssignRole = async (userId, roleId) => {
    const headers = {
      "Content-Type": "application/json",
      ...(user?.token ? { "Authorization": `Bearer ${user.token}` } : {})
    };
    await fetch("/api/roles/assign", {
      method: "POST",
      headers,
      body: JSON.stringify({ user_id: userId, role_id: roleId })
    });
    // Refresh users
    const usersRes = await fetch("/api/details", { headers });
    const usersData = await usersRes.json();
    setUsers(usersData);
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="row g-3 mb-4" style={{ background: 'var(--phoenix-body-bg)', color: 'var(--phoenix-body-color)' }}>
      <div className="col-12">
        <div className="card" style={{ background: 'var(--phoenix-card-bg)', color: 'var(--phoenix-card-color)' }}>
          <div className="card-header" style={{ background: 'var(--phoenix-card-header-bg)', color: 'var(--phoenix-card-header-color)' }}>
            <h5 className="mb-0">User Role Management</h5>
          </div>
          <div className="card-body" style={{ background: 'var(--phoenix-card-bg)', color: 'var(--phoenix-card-color)' }}>
            <div className="row g-3">
              <div className="col-lg-8">
                <div className="table-responsive scrollbar mx-n1 px-1">
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
                            <select
                              className="form-select form-select-sm"
                              onChange={e => handleAssignRole(user.id, e.target.value)}
                              defaultValue=""
                            >
                              <option value="" disabled>Assign role...</option>
                              {(Array.isArray(roles) ? roles : []).map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card h-100">
                  <div className="card-header">
                    <h6 className="mb-0">Users by Role</h6>
                  </div>
                  <div className="card-body">
                    <div ref={chartRef} style={{ width: '100%', height: 300 }}></div>
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