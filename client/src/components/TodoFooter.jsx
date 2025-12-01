import React from "react";

function TodoFooter({itemLeft, filter, setFilter, onClearCompleted}) {
  return (
    <>
      {" "}
      <div className="bottom-filter">
        <div className="item-left">{itemLeft} items left</div>

        <div className="filter">
          <span className={filter==="all" ? "active-filter" : ""}  onClick={() => setFilter("all")}>All</span>
          <span className={filter==="active" ? "active-filter" : ""} onClick={() => setFilter("active")}>Active</span>
          <span className={filter==="completed" ? "active-filter" : ""} onClick={() => setFilter("completed")}>Completed</span>
        </div>

        <div className="remove" onClick={onClearCompleted}>Clear Completed</div>
      </div>
    </>
  );
}

export default TodoFooter;
