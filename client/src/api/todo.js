// ====================== API Base ======================
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:4000";
const API_BASE_URL = `${API_ORIGIN}/api`;

// ====================== Auth Helpers ======================
function getAuthHeaders() {
  const token = localStorage.getItem("todo-app-token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}


// ====================== Fetch All Todos ======================
export async function fetchTodosApi() {
  const res = await fetch(`${API_BASE_URL}/todos`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const message = `Failed to fetch todos: ${res.status}`;
    console.error(message);

    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  const data = await res.json();
  return data;
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

  if (!res.ok) {
    const message = `Failed to create todo: ${res.status}`;
    console.error(message);
    throw new Error(message);
  }

  const createdTodo = await res.json();
  return createdTodo;
}

// ====================== Update Todo ======================
export async function updateTodoApi(id, partial) {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(partial),
  });

  if (!res.ok) {
    const message = `Failed to update todo ${id}: ${res.status}`;
    console.error(message);
    throw new Error(message);
  }

  const updated = await res.json();
  return updated;
}

// ====================== Delete Todo ======================
export async function deleteTodoApi(id) {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });

  if (!res.ok) {
    const message = `Failed to delete todo ${id}: ${res.status}`;
    console.error(message);
    throw new Error(message);
  }

  return;
}

// ====================== Clear Completed ======================
export async function clearCompletedApi() {
  const res = await fetch(`${API_BASE_URL}/todos`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });

  if (!res.ok) {
    const message = `Failed to clear completed todos: ${res.status}`;
    console.error(message);
    throw new Error(message);
  }

  const data = await res.json();
  return data;
}

// ====================== Reorder Todos ======================
export async function reorderTodosApi(orderIds) {
  const res = await fetch(`${API_BASE_URL}/todos/reorder`, {
    method: "PUT",
    headers: { "content-type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ orderIds }),
  });

  if (!res.ok) {
    const message = `Failed to reorder todo: ${res.status}`;
    console.error(message);
    throw new Error(message);
  }

  const data = await res.json();
  return data;
}
