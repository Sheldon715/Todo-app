import React from "react";
import TodoItem from "./TodoItem";

function TodoList() {
  return (
    <ul>
      <TodoItem text="Complete online JavaScript course" type="checkbox" />
      <TodoItem text="Jog around the park 3x" type="checkbox" />
      <TodoItem text="10 minutes mediation" type="checkbox" />
      <TodoItem text="Read for 1 hour" type="checkbox" />
      <TodoItem text="Pick up groceries" type="checkbox" />
      <TodoItem text="Complete Todo App on Fronted Mentor" type="checkbox" />
    </ul>
  );
}

export default TodoList;
