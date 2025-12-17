import React from "react";
import PropTypes from "prop-types";
import FilterTabs from "./FilterTab";

function TodoFooter({
  itemLeft,
  filter,
  setFilter,
  onClearCompleted,
  isActionLoading,
}) {
  return (
    <>
      {" "}
      <div className="bottom-filter">
        <div className="item-left">{itemLeft} items left</div>

        <div className="filter-desktop">
          <FilterTabs filter={filter} setFilter={setFilter} />
        </div>

        <div
          className="remove"
          onClick={() => {
            if (isActionLoading) return;
            onClearCompleted;
          }}
        >
          Clear Completed
        </div>
      </div>
    </>
  );
}

TodoFooter.propTypes = {
  itemLeft: PropTypes.number.isRequired,
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  onClearCompleted: PropTypes.func.isRequired,
  isActionLoading: PropTypes.bool,
};

export default TodoFooter;
