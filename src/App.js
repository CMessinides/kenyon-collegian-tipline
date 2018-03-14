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
    const embedded = window.parent !== window.top;
    this.setState({
      embedded
    });
    if (embedded) document.querySelector("html").classList.add("is-embedded");
  }

  render() {
    return (
      <main className="app">
        <Header embedded={this.state.embedded} />
        <div className="app__body">
          <p className="app__intro">
            Do you have a story for the <em>Kenyon Collegian</em>? We want to
            hear it. Please use the form below to submit your tip. Required
            items are marked with a red asterisk.
          </p>
          <Form fields={this.props.fields} embedded={this.state.embedded} />
        </div>
        {this.state.embedded || (
          <footer className="app__footer">
            <nav className="app__nav">
              <ul className="app__nav-list">
                <li className="app__nav-item app__nav-item--primary">
                  <a
                    href="https://kenyoncollegian.com"
                    className="app__nav-link"
                  >
                    The Kenyon Collegian
                  </a>
                </li>
                <li className="app__nav-item">
                  <a
                    href="https://kenyoncollegian.com/privacy/"
                    className="app__nav-link"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </nav>
          </footer>
        )}
      </main>
    );
  }
}

export default App;
