import React from "react";
import TodoItem from "./TodoItem";

function TodoList({ todo }) {
  return (
    <ul>
      {todo.map((item) => {
        return (
          <TodoItem
            key={item.id}
            id={item.id}
            text={item.text}
            completed={item.completed}
          />
        );
      })}
    </ul>
  );
}

export default TodoList;
