const { assert } = require("chai");
require("chai")
  .use(require("chai-as-promised"))
  .should();

const ToDo = artifacts.require("./ToDo.sol");

contract("ToDo", (accounts) => {
  let todo;

  before(async () => {
    todo = await ToDo.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await todo.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
    it("list task", async () => {
      let taskCount = await todo.taskCount();
      let task = await todo.tasks(taskCount);
      assert.equal(taskCount.toNumber(), 1);
      assert.equal(task.id, 1);
      assert.equal(task.content, "For more check my github account.");
      assert.equal(task.completed, false);
    });
  });

  describe("task", async () => {
    let result, taskCount;
    before(async () => {
      result = await todo.createTask("a new task");

      taskCount = await todo.taskCount();
    });
    // console.log(result.logs);
    // console.log(taskCount);
    it("create task", async () => {
      assert.equal(taskCount, 2);
      const event = result.logs[0].args;
      assert.equal(event._id.toNumber(), 2);
      assert.equal(event._content, "a new task");
      assert.equal(event._completed, false);
    });
    it("complete task", async () => {
      let completetask = await todo.completeTask(1);
      const event = completetask.logs[0].args;
      const task = await todo.tasks(1);
      assert.equal(task.completed, true);
      assert.equal(event._completed, true);
      assert.equal(event._id.toNumber(), 1);
    });
  });
});
