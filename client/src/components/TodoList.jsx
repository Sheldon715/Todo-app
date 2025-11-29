import React from "react";
import TodoItem from "./TodoItem";

function TodoList({ todo, onToggle }) {
  return (
    <ul>
      {todo.map((item) => {
        return (
          <TodoItem
            key={item.id}
            id={item.id}
            text={item.text}
            completed={item.completed}
            onToggle={onToggle}
          />
        );
      })}
    </ul>
  );
}

export default TodoList;
