import React, { useState } from "react";
import HeaderBackground from "./components/HeaderBackground";
import TodoHeader from "./components/TodoHeader";
import TodoList from "./components/TodoList";
import TodoFooter from "./components/TodoFooter";
import DragHint from "./components/DragHint";

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Complete online JavaScript course", completed: false },
    { id: 2, text: "Jog around the park 3x", completed: false },
    { id: 3, text: "10 minutes meditation", completed: false },
    { id: 4, text: "Read for 1 hour", completed: false },
    { id: 5, text: "Pick up groceries", completed: false },
    { id: 6, text: "Complete Todo App on Frontend Mentor", completed: false },
  ]);

  const [filter, setFilter] = useState("all");

  function addTodo(inputText) {
    const newTodo = {
      id: crypto.randomUUID(),
      text: inputText,
      completed: false
    }

    setTodos((prevTodo) => {
      return [...prevTodo, newTodo];
    });
  }

  function toggleTodo(id) {
    setTodos(prev => prev.map(todo => 
      todo.id === id ?
      {...todo, completed: !todo.completed} :
      todo
    ))
  }

  function clearCompleted() {
    setTodos(prev => prev.filter((todo) => !todo.completed));
  }

  const filteredTodo = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });
  
  const itemLeft = todos.filter((todo) => !todo.completed).length;

  return (
    <>
      <HeaderBackground />

      <div className="todo-list">
        <TodoHeader onAdd={addTodo} />
        <div className="list-item">
          <TodoList todo={filteredTodo} onToggle={toggleTodo}/>
          <TodoFooter 
            itemLeft={itemLeft}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={clearCompleted}
          />
        </div>
        <DragHint />
      </div>
    </>
  );
}

export default App;
