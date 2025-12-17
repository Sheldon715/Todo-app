// ====================== API Base ======================
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:4000";
const API_BASE_URL = `${API_ORIGIN}/api`;

// ====================== Auth Helpers ======================
function getAuthHeaders() {
  const token = localStorage.getItem("todo-app-token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

// ====================== Response Helper ======================
async function handleJsonResponse(res) {
  let data = null;

  try {
    data = await res.json();
  } catch {
  }

  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed: ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return data;
}


// ====================== Fetch All Todos ======================
export async function fetchTodosApi() {
  const res = await fetch(`${API_BASE_URL}/todos`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleJsonResponse(res);
}

// ====================== Create Todo ======================
export async function createTodoApi(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("Todo text cannot be empty");
  }

  const res = await fetch(`${API_BASE_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ text: trimmed }),
  });

  return handleJsonResponse(res);
}

// ====================== Update Todo ======================
export async function updateTodoApi(id, partial) {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(partial),
  });

  return handleJsonResponse(res);
}

// ====================== Delete Todo ======================
export async function deleteTodoApi(id) {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });

  await handleJsonResponse(res);
}

// ====================== Clear Completed ======================
export async function clearCompletedApi() {
  const res = await fetch(`${API_BASE_URL}/todos`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });

  return handleJsonResponse(res);
}

// ====================== Reorder Todos ======================
export async function reorderTodosApi(orderIds) {
  const res = await fetch(`${API_BASE_URL}/todos/reorder`, {
    method: "PUT",
    headers: { "content-type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ orderIds }),
  });

  return handleJsonResponse(res);
}
