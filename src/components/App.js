import React, { Component } from "react";
import "./App.css";
import Web3 from "web3";
import ToDo from "../abis/ToDo.json";
import Navbar from "./Navbar";
import Main from "./Main";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();

    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = ToDo.networks[networkId];
    if (networkData) {
      let todo = web3.eth.Contract(ToDo.abi, networkData.address);
      this.setState({ todo });
      const taskCount = await todo.methods.taskCount().call();
      this.setState({ taskCount });
      // Load tasks
      for (var i = 1; i <= taskCount; i++) {
        const task = await todo.methods.tasks(i).call();
        this.setState({
          tasks: [...this.state.tasks, task],
        });
      }

      this.setState({ loading: false });
    } else {
      window.alert("To Do List contract not deployed to detected network.");
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      taskCount: 0,
      tasks: [],
      loading: true,
    };
    this.createTask = this.createTask.bind(this);
    this.completeTask = this.completeTask.bind(this);
  }

  createTask(content) {
    this.setState({ loading: true });
    this.state.todo.methods
      .createTask(content)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
      })
      .on("confirmation", (receipt) => {
        window.location.reload();
      });
  }

  completeTask(taskId) {
    console.log(taskId);
    this.setState({ loading: true });
    this.state.todo.methods
      .completeTask(taskId)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
      })
      .on("confirmation", (receipt) => {
        window.location.reload();
      });
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5 d-flex justify-content-center flex-column">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading ? (
                <div id="loader" className="text-center">
                  <p className="text-center">Loading...</p>
                </div>
              ) : (
                <Main
                  tasks={this.state.tasks}
                  createTask={this.createTask}
                  completeTask={this.completeTask}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
