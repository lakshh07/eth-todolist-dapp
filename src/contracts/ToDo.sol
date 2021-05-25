// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ToDo {
    uint256 public taskCount = 0;

    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    mapping(uint256 => Task) public tasks;

    event CreateTask(uint256 _id, string _content, bool _completed);
    event CompleteTask(uint256 _id, bool _completed);

    constructor() {
        createTask("For more check my github account.");
    }

    function createTask(string memory _content) public {
        require(bytes(_content).length > 0, "please enter content");
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit CreateTask(taskCount, _content, false);
    }

    function completeTask(uint256 _id) public {
        require(_id <= taskCount);
        Task memory _tasks = tasks[_id];
        _tasks.completed = !_tasks.completed;
        tasks[_id] = _tasks;
        emit CompleteTask(_id, _tasks.completed);
    }
}
