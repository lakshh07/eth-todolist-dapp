import React, { Component } from "react";
import "./main.css";

class Main extends Component {
  render() {
    return (
      <div id="content" className="d-flex justify-content-center flex-column">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const content = this.taskContent.value;
            this.props.createTask(content);
          }}
        >
          <div className="form-group mr-sm-2">
            <input
              id="taskContent"
              type="text"
              ref={(input) => {
                this.taskContent = input;
              }}
              className="form-control"
              placeholder="Add Task"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Task
          </button>
        </form>
        <p>&nbsp;</p>
        <ul id="taskList" className="list-unstyled">
          {this.props.tasks.map((task, key) => {
            return (
              <div className="taskTemplate" className="checkbox" key={key}>
                <label>
                  <input
                    type="checkbox"
                    name={task.id}
                    defaultChecked={task.completed}
                    ref={(input) => {
                      this.checkbox = input;
                    }}
                    onClick={(event) => {
                      this.props.completeTask(this.checkbox.name);
                    }}
                  />
                  <span className="content para">{task.content}</span>
                </label>
              </div>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Main;
