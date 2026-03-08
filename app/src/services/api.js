const BASE_URL = import.meta.env.VITE_API_URL;

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
};

// ── Auth ─────────────────────────────────────────────────────
export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

export const registerUser = async ({ fullName, email, password, role }) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password, role }),
  });
  return handleResponse(res);
};

// ── Records ──────────────────────────────────────────────────
export const submitRecord = async (token, payload) => {
  const res = await fetch(`${BASE_URL}/api/records`, {
    method: "POST", headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

// ── Admin ────────────────────────────────────────────────────
export const getAdminRecords = async (token) =>
  handleResponse(await fetch(`${BASE_URL}/api/admin/records`, { headers: authHeaders(token) }));

export const getUsers = async (token) =>
  handleResponse(await fetch(`${BASE_URL}/api/admin/users`, { headers: authHeaders(token) }));

export const deleteUser = async (token, userId) =>
  handleResponse(await fetch(`${BASE_URL}/api/admin/users/${userId}`, {
    method: "DELETE", headers: authHeaders(token),
  }));

export const updateUserRole = async (token, userId, role) =>
  handleResponse(await fetch(`${BASE_URL}/api/admin/users/${userId}/role`, {
    method: "PUT", headers: authHeaders(token),
    body: JSON.stringify({ role }),
  }));

export const exportRecordsExcel = (token) => {
  fetch(`${BASE_URL}/api/admin/records/export`, { headers: authHeaders(token) })
    .then((res) => res.blob())
    .then((blob) => {
      const url  = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `BHF_Records_${Date.now()}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    });
};

export const exportUsersExcel = (token) => {
  fetch(`${BASE_URL}/api/admin/users/export`, { headers: authHeaders(token) })
    .then((res) => res.blob())
    .then((blob) => {
      const url  = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `BHF_Users_${Date.now()}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    });
};

// ── Chat ─────────────────────────────────────────────────────
export const getMessages = async (token, userId) =>
  handleResponse(await fetch(`${BASE_URL}/api/chat/messages/${userId}`, { headers: authHeaders(token) }));

export const sendMessage = async (token, { receiverId, content, type = "message" }) =>
  handleResponse(await fetch(`${BASE_URL}/api/chat/messages`, {
    method: "POST", headers: authHeaders(token),
    body: JSON.stringify({ receiverId, content, type }),
  }));

export const getUnreadCount = async (token) =>
  handleResponse(await fetch(`${BASE_URL}/api/chat/messages/unread/count`, { headers: authHeaders(token) }));

export const getAdminConversations = async (token) =>
  handleResponse(await fetch(`${BASE_URL}/api/chat/admin/conversations`, { headers: authHeaders(token) }));

export const getAdminId = async (token) =>
  handleResponse(await fetch(`${BASE_URL}/api/chat/admin/id`, { headers: authHeaders(token) }));

export const clearChat = async (token, userId) =>
  handleResponse(await fetch(`${BASE_URL}/api/chat/messages/clear/${userId}`, {
    method: "DELETE", headers: authHeaders(token),
  }));

export const updateStatus = async (token, status) =>
  handleResponse(await fetch(`${BASE_URL}/api/chat/status`, {
    method: "PUT", headers: authHeaders(token),
    body: JSON.stringify({ status }),
  }));

export const saveCookieConsent = async (token, accepted) =>
  handleResponse(await fetch(`${BASE_URL}/api/chat/cookie-consent`, {
    method: "PUT", headers: authHeaders(token),
    body: JSON.stringify({ accepted }),
  }));