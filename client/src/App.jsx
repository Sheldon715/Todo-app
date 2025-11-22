import React from "react";
import HeaderBackground from "./components/HeaderBackground";
import TodoHeader from "./components/TodoHeader";
import TodoList from "./components/TodoList";
import TodoFooter from "./components/TodoFooter";
import DragHint from "./components/DragHint";

function App() {
  return (
    <>
      <HeaderBackground />

      <div className="todo-list">
        <TodoHeader />
        <div className="list-item">
          <TodoList />
          <TodoFooter />
        </div>
        <DragHint />
      </div>
    </>
  );
}

export default App;
