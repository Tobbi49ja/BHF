import { useState, useEffect } from "react";
import Icon from "./Icon";
import { getAdminRecords, getUsers, deleteUser, updateUserRole, exportRecordsExcel } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ROLES = ["Field Volunteer", "Health Worker", "Program Manager", "Data Analyst", "Administrator"];

export default function AdminDashboard({ onBack }) {
  const { user } = useAuth();
  const [tab, setTab] = useState("records"); // "records" | "users"
  const [records, setRecords] = useState([]);
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadData();
  }, [tab]);

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
    try {
      await exportRecordsExcel(user.token);
    } finally {
      setExporting(false);
    }
  };

  const filteredRecords = records.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.firstName?.toLowerCase().includes(q) ||
      r.lastName?.toLowerCase().includes(q) ||
      r.address?.toLowerCase().includes(q) ||
      r.submittedBy?.fullName?.toLowerCase().includes(q)
    );
  });

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const bmiColor = (bmi) => {
    if (!bmi) return "var(--text-muted)";
    const b = parseFloat(bmi);
    if (b < 18.5) return "#f59e0b";
    if (b < 25)   return "#10b981";
    if (b < 30)   return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <button className="back-to-home" onClick={onBack}>
            <Icon name="arrow-left" size={15} />
            Back
          </button>
          <div>
            <h1 className="admin-title">
              <Icon name="shield-check" size={22} color="#10b981" />
              Admin Dashboard
            </h1>
            <p className="admin-sub">Logged in as <strong>{user.fullName}</strong> · Administrator</p>
          </div>
        </div>

        {tab === "records" && (
          <button
            className="btn btn-success"
            onClick={handleExport}
            disabled={exporting || records.length === 0}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            {exporting
              ? <><span className="login-spinner" /> Exporting...</>
              : <><Icon name="file-text" size={16} /> Export to Excel</>
            }
          </button>
        )}
      </div>

      {/* Stats bar */}
      <div className="admin-stats-bar">
        <div className="admin-stat">
          <span className="admin-stat-val">{records.length}</span>
          <span className="admin-stat-lbl">Total Records</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-val">{users.length}</span>
          <span className="admin-stat-lbl">Registered Users</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-val">
            {records.filter((r) => {
              const d = new Date(r.createdAt);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length}
          </span>
          <span className="admin-stat-lbl">This Month</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-val">
            {users.filter((u) => u.role === "Field Volunteer").length}
          </span>
          <span className="admin-stat-lbl">Field Volunteers</span>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Search */}
      <div className="admin-search-row">
        <div className="input-wrapper" style={{ flex: 1 }}>
          <Icon name="user-round" size={16} className="input-icon" />
          <input
            type="text"
            placeholder={tab === "records" ? "Search by name, address, volunteer…" : "Search by name or email…"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.65rem 1rem 0.65rem 2.75rem",
              background: "var(--dark-input)",
              border: "1px solid var(--dark-border)",
              borderRadius: "0.5rem",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              fontFamily: "inherit",
            }}
          />
        </div>
        <button className="btn btn-secondary" onClick={loadData} style={{ flexShrink: 0 }}>
          <Icon name="activity" size={15} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="submit-error">
          <Icon name="x" size={14} />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
          <span className="login-spinner" style={{ width: 20, height: 20 }} />
          <p style={{ marginTop: "0.75rem" }}>Loading...</p>
        </div>
      )}

      {/* ── RECORDS TABLE ── */}
      {!loading && tab === "records" && (
        <div className="admin-table-wrapper">
          {filteredRecords.length === 0 ? (
            <div className="admin-empty">
              <Icon name="clipboard-list" size={40} color="var(--text-muted)" />
              <p>No records found</p>
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
                  <th>Sugar</th>
                  <th>BMI</th>
                  <th>Conditions</th>
                  <th>Volunteer</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r) => (
                  <tr key={r._id}>
                    <td><strong>{r.firstName} {r.lastName}</strong></td>
                    <td style={{ textTransform: "capitalize" }}>{r.gender || "—"}</td>
                    <td>{r.age || "—"}</td>
                    <td>{r.phone || "—"}</td>
                    <td>{r.address || "—"}</td>
                    <td>
                      {r.bloodPressureSystolic && r.bloodPressureDiastolic
                        ? `${r.bloodPressureSystolic}/${r.bloodPressureDiastolic}`
                        : "—"}
                    </td>
                    <td>{r.bloodSugar ? `${r.bloodSugar} mg/dL` : "—"}</td>
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
                    <td>{r.submittedBy?.fullName || r.volunteerName || "—"}</td>
                    <td style={{ whiteSpace: "nowrap", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                      {new Date(r.submittedAt || r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── USERS TABLE ── */}
      {!loading && tab === "users" && (
        <div className="admin-table-wrapper">
          {filteredUsers.length === 0 ? (
            <div className="admin-empty">
              <Icon name="users" size={40} color="var(--text-muted)" />
              <p>No users found</p>
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
                        <strong>{u.fullName}</strong>
                      </div>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{u.email}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="admin-role-select"
                        disabled={u._id === user._id} // can't demote yourself
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {u._id !== user._id && (
                        <button
                          className="admin-del-btn"
                          onClick={() => handleDeleteUser(u._id)}
                          title="Delete user"
                        >
                          <Icon name="x" size={14} />
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