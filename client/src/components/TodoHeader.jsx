import React, { useState } from "react";

function TodoHeader(props) {
  const [inputValue, setInputValue] = useState("");

  function handleChange(event) {
    const input = event.target.value;
    setInputValue(input);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (inputValue) {
      props.onAdd(inputValue);
      setInputValue("");
    }
  }

  return (
    <>
      <div className="title">TODO</div>
      <div className="search-bar">
        <form onSubmit={handleSubmit}>
          <input
            className="search-input"
            onChange={handleChange}
            type="text"
            value={inputValue}
            placeholder="Create a new todo..."
          />
        </form>
      </div>
    </>
  );
}

export default TodoHeader;
