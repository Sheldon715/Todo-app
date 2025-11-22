import React from "react";
import HeaderBackground from "./components/HeaderBackground";

function App() {
  return (
    <>
      <HeaderBackground />

      <div className="todo-list">
        <div className="title">TODO</div>
        <div className="search-bar"></div>

        <div className="list-item">
          <ul>
            <li>
              <input type="checkbox" />
              <span>Complete online JavaScript course</span>
            </li>
            <li>
              <input type="checkbox" />
              <span>Jog around the park 3x</span>
            </li>
            <li>
              <input type="checkbox" />
              <span>10 minutes mediation</span>
            </li>
            <li>
              <input type="checkbox" />
              <span>Read for 1 hour</span>
            </li>
            <li>
              <input type="checkbox" />
              <span>Pick up groceries</span>
            </li>
            <li>
              <input type="checkbox" />
              <span>Complete Todo App on Fronted Mentor</span>
            </li>
          </ul>

          <div className="bottom-filter">
            <div className="item-left">
              {/* Add dynamic number */}
              items left
            </div>

            <div className="filter">All Active Completed</div>

            <div className="remove">Clear Completed</div>
          </div>
        </div>

        <span className="drag">Drag and drop to reorder list</span>
      </div>
    </>
  );
}

export default App;