const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
};

// ── AUTH ─────────────────────────────────────────────────────
export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

export const registerUser = async ({ fullName, email, password, role }) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password, role }),
  });
  return handleResponse(res);
};

// ── RECORDS ───────────────────────────────────────────────────
export const submitRecord = async (token, payload) => {
  const res = await fetch(`${BASE_URL}/api/records`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

// ── ADMIN ─────────────────────────────────────────────────────
export const getAdminRecords = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/records`, {
    headers: authHeaders(token),
  });
  return handleResponse(res);
};

export const getUsers = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/users`, {
    headers: authHeaders(token),
  });
  return handleResponse(res);
};

export const deleteUser = async (token, userId) => {
  const res = await fetch(`${BASE_URL}/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return handleResponse(res);
};

export const updateUserRole = async (token, userId, role) => {
  const res = await fetch(`${BASE_URL}/api/admin/users/${userId}/role`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ role }),
  });
  return handleResponse(res);
};

// Excel export — triggers file download directly
export const exportRecordsExcel = (token) => {
  const link = document.createElement("a");
  link.href = `${BASE_URL}/api/admin/records/export`;
  // Attach token via a query param isn't ideal for production,
  // but works for MVP. Better: set token in a cookie or use a short-lived URL.
  // Here we open in a new tab after setting auth header isn't possible for direct download,
  // so we use a fetch + blob approach:
  fetch(`${BASE_URL}/api/admin/records/export`, {
    headers: authHeaders(token),
  })
    .then((res) => res.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `BHF_Records_${Date.now()}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    });
};