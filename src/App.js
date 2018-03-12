import React, { Component } from "react";
import Form from "./Form";
import Header from "./Header";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      embedded: false
    };
  }

  componentDidMount() {
    this.setState({
      embedded: window.parent !== window.top
    });
  }

  render() {
    return (
      <main className={this.state.embedded ? "app app--embedded" : "app"}>
        <Header
          embedded={this.state.embedded}
        />
        <Form 
          embedded={this.state.embedded}
        />
        <footer className="app__footer">
          <a href="https://kenyoncollegian.com" className="app__footer-link">
            The Kenyon Collegian Home
          </a>
        </footer>
      </main>
    );
  }
}

export default App;
