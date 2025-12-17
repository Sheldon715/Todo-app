// ====================== Imports ======================
import React, { useEffect, useState } from "react";
import HeaderBackground from "./components/HeaderBackground";
import TodoHeader from "./components/TodoHeader";
import TodoList from "./components/TodoList";
import TodoFooter from "./components/TodoFooter";
import DragHint from "./components/DragHint";
import FilterTabs from "./components/FilterTab";
import AuthPage from "./components/AuthPage";
import {
  fetchTodosApi,
  createTodoApi,
  updateTodoApi,
  deleteTodoApi,
  clearCompletedApi,
  reorderTodosApi,
} from "./api/todo";
import { meApi } from "./api/auth";

// ====================== App Component ======================
function App() {
  // ====================== State ======================
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(
    () => localStorage.getItem("todo-app-token") || ""
  );
  const [user, setUser] = useState(null);
  const isAuthenticated = Boolean(token);
  const [apiError, setApiError] = useState("");
  const [userEmail, setUserEmail] = useState(
    () => localStorage.getItem("todo-app-user-email") || ""
  );
  const [authBooting, setAuthBooting] = useState(true);
  const [authMessage, setAuthMessage] = useState("");

  // ====================== Auth Handlers ======================
  function handleAuthSuccess(authResult) {
    const nextToken = authResult?.token;
    const nextUser = authResult?.user || null;

    if (!nextToken) return;

    localStorage.setItem("todo-app-token", nextToken);

    setToken(nextToken);
    setUser(nextUser);

    const nextEmail = nextUser?.email || "";
    if (nextEmail) {
      localStorage.setItem("todo-app-user-email", nextEmail);
      setUserEmail(nextEmail);
    }
  }

  function handleLogout(reasonMessage = "") {
    localStorage.removeItem("todo-app-token");
    localStorage.removeItem("todo-app-user-email");
    setToken("");
    setUser(null);
    setUserEmail("");
    setTodos([]);
    setLoading(false);
    setAuthMessage(reasonMessage);
    setApiError("");
    setAuthBooting(false);
  }

  // ====================== Load Todos ======================
  async function loadTodos() {
    if (!isAuthenticated) return;

    setLoading(true);
    setApiError("");

    try {
      const data = await fetchTodosApi();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);

      if (error.status === 401) {
        handleLogout("Session expired. Please log in again.");
      } else {
        setApiError(error.message || "Failed to load todos.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ====================== Load Current User ======================
  async function loadMe() {
    if (!isAuthenticated) return;

    try {
      const data = await meApi();
      const nextUser = data?.user || null;
      setUser(nextUser);

      const nextEmail = nextUser?.email || "";
      setUserEmail(nextEmail);
      if (nextEmail) {
        localStorage.setItem("todo-app-user-email", nextEmail);
      }
      setAuthBooting(false);
    } catch (error) {
      console.error("Error fetching current user:", error);

      if (error.status === 401) {
        handleLogout("Session expired. Please log in again.");
      }
    }
  }

  useEffect(() => {
    if (!token) {
      setAuthBooting(false);
    }
  }, [token]);

  // ====================== Google OAuth Callback ======================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const urlEmail = params.get("email");

    if (!urlToken) return;

    localStorage.setItem("todo-app-token", urlToken);
    setToken(urlToken);

    if (urlEmail) {
      localStorage.setItem("todo-app-user-email", urlEmail);
      setUserEmail(urlEmail);
      setUser({ email: urlEmail });
    }

    // Clean URL (remove ?token=...)
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  // Initial fetch
  useEffect(() => {
    if (!isAuthenticated) return;
    loadMe();
    loadTodos();
  }, [isAuthenticated]);

  // ====================== Filter State ======================
  const [filter, setFilter] = useState(() => {
    const saved = localStorage.getItem("todo-app-filter");
    return saved || "all";
  });

  useEffect(() => {
    localStorage.setItem("todo-app-filter", filter);
  }, [filter]);

  // ====================== Theme State ======================
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("todo-app-theme");
    return saved || "light";
  });

  useEffect(() => {
    localStorage.setItem("todo-app-theme", theme);
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // ====================== CRUD Handlers ======================

  // Add new todo
  async function addTodo(inputText) {
    try {
      const createTodo = await createTodoApi(inputText);
      setTodos((prev) => [...prev, createTodo]);
    } catch (error) {
      console.error("Error createing todo:", error);
    }
  }

  // Toggle completed
  async function toggleTodo(id) {
    const current = todos.find((todo) => todo.id === id);
    if (!current) return;

    const nextCompleted = !current.completed;

    try {
      const updated = await updateTodoApi(id, { completed: nextCompleted });

      setTodos((prev) => prev.map((todo) => (todo.id === id ? updated : todo)));
    } catch (error) {
      console.error("Error toggle todo:", error);
    }
  }

  // Clear completed todos
  async function clearCompleted() {
    try {
      await clearCompletedApi();
      loadTodos();
    } catch (error) {
      console.error("Error clear completed todo:", error);
    }
  }

  // Delete todo
  async function handleDelete(id) {
    try {
      await deleteTodoApi(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error delete todo:", error);
    }
  }

  // ====================== Reorder Handler ======================
  async function saveOrderToServer(nextTodos) {
    const orderedIds = nextTodos.map((todo) => todo.id);

    try {
      await reorderTodosApi(orderedIds);
    } catch (error) {
      console.error("Error saving todos order:", error);
    }
  }

  function handleReorder(sourceId, targetId) {
    if (sourceId === targetId) return;

    setTodos((prevTodo) => {
      const sourceIndex = prevTodo.findIndex(
        (t) => String(t.id) === String(sourceId)
      );
      const targetIndex = prevTodo.findIndex(
        (t) => String(t.id) === String(targetId)
      );

      if (sourceIndex === -1 || targetIndex === -1) return prevTodo;

      const updated = [...prevTodo];
      const [moved] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, moved);

      saveOrderToServer(updated);

      return updated;
    });
  }

  // ====================== Derived Values ======================
  const filteredTodo = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const itemLeft = todos.filter((todo) => !todo.completed).length;

  // ====================== Render ======================
  if (authBooting) {
    return (
      <div className={`app ${theme}`}>
        <HeaderBackground theme={theme} />
        <div className="todo-list">
          <div className="todo-card loading-card">Checking session...</div>
        </div>
      </div>
    );
  }

  return !isAuthenticated ? (
    <div className={`app ${theme}`}>
      <HeaderBackground theme={theme} />

      <div className="todo-list">
        <TodoHeader
          theme={theme}
          onToggleTheme={toggleTheme}
          showInput={false}
        />

        <AuthPage
          onAuthSuccess={handleAuthSuccess}
          externalMessage={authMessage}
          onClearExternalMessage={() => setAuthMessage("")}
        />
      </div>
    </div>
  ) : (
    <div className={`app ${theme}`}>
      <HeaderBackground theme={theme} />
      <div className="top-right-user">
        <div className="top-right-user-inner">
          {userEmail ? (
            <div className="top-right-email">{userEmail}</div>
          ) : null}

          <button
            type="button"
            className="top-right-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="todo-list">
        <TodoHeader
          onAdd={addTodo}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
          userEmail={user?.email || ""}
        />
        {apiError ? <div className="api-error">{apiError}</div> : null}
        <div className="list-item">
          {loading ? (
            <div className="todo-card loading-card">Loading todos...</div>
          ) : (
            <TodoList
              todo={filteredTodo}
              onToggle={toggleTodo}
              onReorder={handleReorder}
              onDelete={handleDelete}
              showInput={false}
            />
          )}
          <TodoFooter
            itemLeft={itemLeft}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={clearCompleted}
          />
        </div>
        <div className="mobile-filter-card">
          <FilterTabs filter={filter} setFilter={setFilter} />
        </div>
      </div>
      <DragHint />
    </div>
  );
}

export default App;
