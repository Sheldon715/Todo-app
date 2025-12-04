import React, { useEffect, useState } from "react";
import HeaderBackground from "./components/HeaderBackground";
import TodoHeader from "./components/TodoHeader";
import TodoList from "./components/TodoList";
import TodoFooter from "./components/TodoFooter";
import DragHint from "./components/DragHint";
import FilterTabs from "./components/FilterTab";

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todo-app-todos");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("todo-app-todos", JSON.stringify(todos));
  }, [todos]);

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

  function addTodo(inputText) {
    const newTodo = {
      id: crypto.randomUUID(),
      text: inputText,
      completed: false,
    };

    setTodos((prevTodo) => {
      return [...prevTodo, newTodo];
    });
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
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
