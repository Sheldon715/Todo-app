import React, { useState } from "react";
import PropTypes from "prop-types";
import iconSun from "../assets/images/icon-sun.svg";
import iconMoon from "../assets/images/icon-moon.svg";

function TodoHeader({
  onAdd,
  theme,
  onToggleTheme,
  onLogout,
  showInput = true,
}) {
  const [inputValue, setInputValue] = useState("");

  function handleChange(event) {
    const input = event.target.value;
    setInputValue(input);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (inputValue) {
      if (typeof onAdd === "function") {
        onAdd(inputValue);
      }
      setInputValue("");
    }
  }

  return (
    <>
      <div className="theme-title">
        <div className="title">TODO</div>
        <button type="button" className="theme-button" onClick={onToggleTheme}>
          <img
            className="mode-image"
            src={theme === "light" ? iconMoon : iconSun}
            alt={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          />
        </button>
        {typeof onLogout === "function" ? (
          <button type="button" className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        ) : null}
      </div>
      {showInput ? (
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
      ) : null}
    </>
  );
}
TodoHeader.propTypes = {
  onAdd: PropTypes.func,
  theme: PropTypes.string.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
  onLogout: PropTypes.func,
  showInput: PropTypes.bool,
};

export default TodoHeader;
