import React from "react";
import PropTypes from "prop-types";
import TodoItem from "./TodoItem";

function TodoList({ todo, onToggle, onReorder, onDelete }) {

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
            onReorder={onReorder}
            onDelete={onDelete}
          />
        );
      })}
    </ul>
  );
}
TodoList.propTypes = {
  todo: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onToggle: PropTypes.func.isRequired,
  onReorder: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TodoList;
