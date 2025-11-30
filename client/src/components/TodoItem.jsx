import React from "react";

function TodoItem( {id, text, completed, onToggle} ) {
  return (
    <li className={completed ? "completed" : ""}>
      <label className="checkbox-wrapper">
        <input type="checkbox" checked={completed} onChange={() => onToggle(id)}/>
        <span className="custom-checkbox"></span>
        <span>{text}</span>
      </label>
    </li>
  );
}

export default TodoItem;
