import React from "react";

function TodoItem( {text, completed} ) {
  return (
    <li>
      <input type="checkbox" onComplete={completed}/>
      <span>{text}</span>
    </li>
  );
}

export default TodoItem;
