import React, { useState } from "react";
import PropTypes from "prop-types";

function TodoItem({ id, text, completed, onToggle, onRecorder }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (event) => {
    event.dataTransfer.effecteAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
    setIsDragging(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const soureId = event.dataTransfer.getData("text/plain");
    if (!soureId) return;
    if (!onRecorder) return;

    onRecorder(soureId, id);
    setIsDragging(false);
    setIsDragOver(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsDragOver(false);
  };

  return (
    <li
      className={`${completed ? "completed" : ""} 
        ${isDragging ? "dragging" : ""}
        ${isDragOver ? "drop-target" : ""}`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <label className="checkbox-wrapper">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(id)}
        />
        <span className="custom-checkbox"></span>
        <span className="text-drag">{text}</span>
      </label>
    </li>
  );
}
TodoItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  text: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onRecorder: PropTypes.func,
};

export default TodoItem;
