import { useState, useEffect } from "react";
import Icon from "./Icon";
import { getAdminRecords, getUsers, deleteUser, updateUserRole, exportRecordsExcel } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ROLES = ["Field Volunteer", "Health Worker", "Program Manager", "Data Analyst", "Administrator"];

export default function AdminDashboard({ onBack }) {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("records");
  const [records, setRecords] = useState([]);
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [search,  setSearch]  = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => { loadData(); }, [tab]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      if (tab === "records") {
        const data = await getAdminRecords(user.token);
        setRecords(data);
      } else {
        const data = await getUsers(user.token);
        setUsers(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    try {
      await deleteUser(user.token, id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(user.token, id, role);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role } : u));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try { await exportRecordsExcel(user.token); }
    finally { setExporting(false); }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const filteredRecords = records.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.firstName?.toLowerCase().includes(q) ||
      r.lastName?.toLowerCase().includes(q)  ||
      r.address?.toLowerCase().includes(q)   ||
      r.submittedBy?.fullName?.toLowerCase().includes(q)
    );
  });

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const bmiColor = (bmi) => {
    if (!bmi) return "var(--text-3)";
    const b = parseFloat(bmi);
    if (b < 18.5) return "#f59e0b";
    if (b < 25)   return "#10b981";
    if (b < 30)   return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="admin-page">
      <div className="admin-bg-grid" />

      {/* ── Header ── */}
      <div className="admin-header">
        <div className="admin-header-left">
          <div className="landing-logo-icon">
            <Icon name="shield-plus" size={18} />
          </div>
          <div className="admin-title-block">
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-sub">
              Logged in as <strong>{user.fullName}</strong> · Administrator
            </p>
          </div>
        </div>

        <div className="admin-header-right">
          {/* User chip */}
          <div className="user-chip">
            <div className="user-chip-avatar">
              {user.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="user-chip-info">
              <span className="user-chip-name">{user.fullName}</span>
              <span className="user-chip-role">Administrator</span>
            </div>
            <button
              className="user-chip-logout"
              onClick={handleLogout}
              title="Logout"
            >
              <Icon name="log-out" size={15} />
            </button>
          </div>

          {/* Export button */}
          {tab === "records" && (
            <button
              className="btn btn-success"
              onClick={handleExport}
              disabled={exporting || records.length === 0}
            >
              {exporting
                ? <><span className="login-spinner" />Exporting...</>
                : <><Icon name="file-text" size={16} />Export to Excel</>
              }
            </button>
          )}
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="admin-stats-bar">
        <div className="admin-stat">
          <span className="admin-stat-val">{records.length}</span>
          <span className="admin-stat-label">Total Records</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-val">{users.length}</span>
          <span className="admin-stat-label">Registered Users</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-val">
            {records.filter((r) => {
              const d = new Date(r.createdAt);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length}
          </span>
          <span className="admin-stat-label">This Month</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-val">
            {users.filter((u) => u.role === "Field Volunteer").length}
          </span>
          <span className="admin-stat-label">Field Volunteers</span>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="admin-toolbar">
        <div className="admin-tabs">
          <button
            className={`admin-tab${tab === "records" ? " active" : ""}`}
            onClick={() => { setTab("records"); setSearch(""); }}
          >
            <Icon name="clipboard-list" size={15} />
            Beneficiary Records
          </button>
          <button
            className={`admin-tab${tab === "users" ? " active" : ""}`}
            onClick={() => { setTab("users"); setSearch(""); }}
          >
            <Icon name="users" size={15} />
            Manage Users
          </button>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
          <div className="input-wrapper" style={{ maxWidth: 340, width: "100%" }}>
            <Icon name="search" size={16} className="input-icon" />
            <input
              type="text"
              placeholder={tab === "records" ? "Search by name, address, volunteer…" : "Search by name or email…"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem",
                background: "var(--input)", border: "1px solid var(--border)",
                borderRadius: "0.5rem", color: "var(--text)",
                fontSize: "0.875rem", fontFamily: "inherit",
              }}
            />
          </div>
          <button className="btn btn-secondary" onClick={loadData} style={{ flexShrink: 0 }}>
            <Icon name="refresh-cw" size={15} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="submit-error">
          <Icon name="x" size={14} />{error}
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="admin-loading">
          <span className="login-spinner" style={{ width: 20, height: 20 }} />
          Loading...
        </div>
      )}

      {/* ── Records table ── */}
      {!loading && tab === "records" && (
        <div className="admin-table-wrap">
          {filteredRecords.length === 0 ? (
            <div className="admin-loading">
              <Icon name="clipboard-list" size={32} />
              No records found
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>BP</th>
                  <th>Blood Sugar</th>
                  <th>BMI</th>
                  <th>Conditions</th>
                  <th>Volunteer</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r) => (
                  <tr key={r._id}>
                    <td className="td-name">{r.firstName} {r.lastName}</td>
                    <td className="td-muted" style={{ textTransform: "capitalize" }}>{r.gender || "—"}</td>
                    <td className="td-muted">{r.age || "—"}</td>
                    <td className="td-muted">{r.phone || "—"}</td>
                    <td className="td-muted">{r.address || "—"}</td>
                    <td className="td-muted">
                      {r.bloodPressureSystolic && r.bloodPressureDiastolic
                        ? `${r.bloodPressureSystolic}/${r.bloodPressureDiastolic}`
                        : "—"}
                    </td>
                    <td className="td-muted">{r.bloodSugar ? `${r.bloodSugar} mg/dL` : "—"}</td>
                    <td>
                      {r.bmi
                        ? <span style={{ color: bmiColor(r.bmi), fontWeight: 700 }}>{r.bmi}</span>
                        : "—"}
                    </td>
                    <td>
                      {r.conditions?.length
                        ? r.conditions.map((c) => (
                          <span key={c} className="tag" style={{ fontSize: "0.68rem", padding: "0.15rem 0.5rem", marginRight: 2 }}>{c}</span>
                        ))
                        : "—"}
                    </td>
                    <td className="td-muted">{r.submittedBy?.fullName || r.volunteerName || "—"}</td>
                    <td className="td-muted" style={{ whiteSpace: "nowrap", fontSize: "0.78rem" }}>
                      {new Date(r.submittedAt || r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Users table ── */}
      {!loading && tab === "users" && (
        <div className="admin-table-wrap">
          {filteredUsers.length === 0 ? (
            <div className="admin-loading">
              <Icon name="users" size={32} />
              No users found
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div className="user-chip-avatar" style={{ width: 28, height: 28, fontSize: "0.72rem" }}>
                          {u.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="td-name">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="td-muted">{u.email}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="role-select"
                        disabled={u._id === user._id}
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="td-muted" style={{ fontSize: "0.78rem" }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {u._id !== user._id && (
                        <button
                          className="icon-btn red"
                          onClick={() => handleDeleteUser(u._id)}
                          title="Delete user"
                        >
                          <Icon name="trash-2" size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}