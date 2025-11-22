import React from "react";

function TodoItem(props) {
  return (
    <li>
      <input type={props.type} />
      <span>{props.text}</span>
    </li>
  );
}

export default TodoItem;
