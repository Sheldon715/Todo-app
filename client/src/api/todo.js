const API_BASE_URL = "http://localhost:4000/api";

export async function fetchTodosApi() {
  const res = await fetch(`${API_BASE_URL}/todos`);

  if (!res.ok) {
    const message = `Failed to fetch todos: ${res.status}`;
    console.error(message);
    throw new Error(message);
  }

  const data = await res.json();
  return data;
}

export async function createTodoApi(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("Todo text cannot be empty");
  }

  const res = await fetch(`${API_BASE_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

export async function updateTodoApi(id, partial) {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
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

export async function deleteTodoApi(id) {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const message = `Failed to delete todo ${id}: ${res.status}`;
    console.error(message);
    throw new Error(message);
  }

  return;
}

export async function clearCompletedApi() {
  const res = await fetch(`${API_BASE_URL}/todos`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const message = `Failed to clear completed todos: ${res.status}`;
    console.error(message);
    throw new Error(message);
  }

  const data = await res.json();
  return data;
}
