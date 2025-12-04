import React, { useState } from "react";
import PropTypes from "prop-types";
import iconSun from "../assets/images/icon-sun.svg";
import iconMoon from "../assets/images/icon-moon.svg";

function TodoHeader({ onAdd, theme, onToggleTheme }) {
  const [inputValue, setInputValue] = useState("");

  function handleChange(event) {
    const input = event.target.value;
    setInputValue(input);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (inputValue) {
      onAdd(inputValue);
      setInputValue("");
    }
  }

  return (
    <>
      <div className="theme-title">
        <div className="title">TODO</div>
        <button type="button" className="theme-button" onClick={onToggleTheme}>
          <img
            src={theme === "light" ? iconMoon : iconSun}
            alt={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          />
        </button>
      </div>
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
TodoHeader.propTypes = {
  onAdd: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
};

export default TodoHeader;
