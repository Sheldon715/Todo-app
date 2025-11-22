import React from "react";

function TodoFooter() {
  return (
    <>
      {" "}
      <div className="bottom-filter">
        <div className="item-left">items left</div>

        <div className="filter">All Active Completed</div>

        <div className="remove">Clear Completed</div>
      </div>
    </>
  );
}

export default TodoFooter;
