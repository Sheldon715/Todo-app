import React from "react";
import PropTypes from "prop-types";

function FilterTabs({ filter, setFilter }) {
  return (
    <div className="filter">
      <span
        className={filter === "all" ? "active-filter" : ""}
        onClick={() => setFilter("all")}
      >
        All
      </span>
      <span
        className={filter === "active" ? "active-filter" : ""}
        onClick={() => setFilter("active")}
      >
        Active
      </span>
      <span
        className={filter === "completed" ? "active-filter" : ""}
        onClick={() => setFilter("completed")}
      >
        Completed
      </span>
    </div>
  );
}
FilterTabs.propTypes = {
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
};

export default FilterTabs;
