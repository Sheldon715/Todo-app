import React, { useEffect, useState } from "react";
import HeaderBackground from "./components/HeaderBackground";
import TodoHeader from "./components/TodoHeader";
import TodoList from "./components/TodoList";
import TodoFooter from "./components/TodoFooter";
import DragHint from "./components/DragHint";
import FilterTabs from "./components/FilterTab";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const res = await fetch("http://localhost:4000/api/todos");
        if (!res.ok) {
          console.error("Failed to fetch", res.status);
          return;
        }
        const data = await res.json();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }

    fetchTodos();
  }, []);

  const [filter, setFilter] = useState(() => {
    const saved = localStorage.getItem("todo-app-filter");
    return saved || "all";
  });

  useEffect(() => {
    localStorage.setItem("todo-app-filter", filter);
  }, [filter]);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("todo-app-theme");
    return saved || "light";
  });

  useEffect(() => {
    localStorage.setItem("todo-app-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  async function addTodo(inputText) {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    try {
      const res = await fetch("http://localhost:4000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!res.ok) {
        console.error("Failed to create todo:", res.status);
        return;
      }

      const createTodo = await res.json();

      setTodos((prev) => [...prev, createTodo]);
    } catch (error) {
      console.error("Error createing todo:", error);
    }
  }

  async function toggleTodo(id) {
    const current = todos.find((todo) => todo.id === id);
    if (!current) return;

    const nextCompleted = !current.completed;

    try {
      const res = await fetch(`http://localhost:4000/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: nextCompleted }),
      });

      if (!res.ok) {
        console.error("Failed to toggle todo:", res.status);
        return;
      }

      const updated = await res.json();

      setTodos((prev) => prev.map((todo) => (todo.id === id ? updated : todo)));
    } catch (error) {
      console.error("Error toggle todo:", error);
    }
  }

  async function clearCompleted() {
    try {
      const res = await fetch("http://localhost:4000/api/todos", {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to clear completed todo:", res.status);
        return;
      }

      setTodos((prev) => prev.filter((todo) => !todo.completed));
    } catch (error) {
      console.error("Error clear completed todo:", error);
    }
  }

  const filteredTodo = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const itemLeft = todos.filter((todo) => !todo.completed).length;

  function handleRecorder(sourceId, targetId) {
    if (sourceId === targetId) return;

    setTodos((prevTodo) => {
      const sourceIndex = prevTodo.findIndex((t) => t.id === sourceId);
      const targetIndex = prevTodo.findIndex((t) => t.id === targetId);

      if (sourceIndex === -1 || targetIndex === -1) return prevTodo;

      const updated = [...prevTodo];
      const [moved] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`http://localhost:4000/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete todo:", res.status);
        return;
      }

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error delete todo:", error);
    }
  
  }


  return (
    <div className={`app ${theme}`}>
      <HeaderBackground theme={theme} />

      <div className="todo-list">
        <TodoHeader onAdd={addTodo} theme={theme} onToggleTheme={toggleTheme} />
        <div className="list-item">
          <TodoList
            todo={filteredTodo}
            onToggle={toggleTodo}
            onRecorder={handleRecorder}
            onDelete={handleDelete}
          />
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
