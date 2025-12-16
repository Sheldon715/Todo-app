// ====================== Config ======================
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:4000";
const API_BASE_URL = `${API_ORIGIN}/api`;


// ====================== Helpers ======================
async function handleJsonResponse(res) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data?.error || data?.message || `Request failed: ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.payload = data;
    throw error;
  }

  return data;
}

// ====================== Auth APIs ======================
export async function registerApi(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleJsonResponse(res);
}

export async function loginApi(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleJsonResponse(res);
}

