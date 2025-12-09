// ====================== Imports ======================
import React, { useState } from "react";
import PropTypes from "prop-types";
import iconCross from "../assets/images/icon-cross.svg";

// ====================== Component ======================
function TodoItem({
  id,
  text,
  completed,
  onToggle,
  onReorder,
  onDelete,
}) {
  // ====================== Local State ======================
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // ====================== Local State ======================

  // Start dragging
  const handleDragStart = (event) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
    setIsDragging(true);
  };

  // Dragging over item
  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  // Drag enters target
  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  // Drag leaves target
  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Drop event → reorder list
  const handleDrop = (event) => {
    event.preventDefault();
    const soureId = event.dataTransfer.getData("text/plain");
    if (!soureId) return;
    if (!onReorder) return;

    onReorder(soureId, id);
    setIsDragging(false);
    setIsDragOver(false);
  };

  // Drag end cleanup
  const handleDragEnd = () => {
    setIsDragging(false);
    setIsDragOver(false);
  };

  // ====================== Render ======================
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

      <button className="delete-btn" onClick={() => onDelete(id)}>
        <img src={iconCross} alt="delete" />
      </button>
    </li>
  );
}

// ====================== PropTypes ======================
TodoItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  text: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onReorder: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default TodoItem;
