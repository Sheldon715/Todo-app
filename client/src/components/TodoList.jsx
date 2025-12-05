import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import TodoItem from "./TodoItem";

function TodoList({ todo, onToggle, onRecorder, onDelete }) {
  const [touchDraggingId, setTouchDraggingId] = useState(null);
  const [touchDragOverId, setTouchDragOverId] = useState(null);
  const listRef = useRef(null);

  const handleDragStart = (id) => {
    setTouchDraggingId(id);
  };

  const handleTouchDragOver = (id) => {
    setTouchDragOverId(id);
  };

  const handleTouchDragEnd = (targetId) => {
    if (!touchDraggingId) return;

    const dropTarget = targetId ?? touchDragOverId;
    if (!dropTarget || dropTarget === touchDraggingId) {
      setTouchDraggingId(null);
      setTouchDragOverId(null);
      return;
    }

    onRecorder(touchDraggingId, dropTarget);

    setTouchDraggingId(null);
    setTouchDragOverId(null);
  };

  return (
    <ul ref={listRef}>
      {todo.map((item) => {
        return (
          <TodoItem
            key={item.id}
            id={item.id}
            text={item.text}
            completed={item.completed}
            onToggle={onToggle}
            onRecorder={onRecorder}
            onDelete={onDelete}
            touchDraggingId={touchDraggingId}
            onTouchDragStart={handleDragStart}
            onTouchDragOver={handleTouchDragOver}
            onTouchDragEnd={handleTouchDragEnd}
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
  onRecorder: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TodoList;
