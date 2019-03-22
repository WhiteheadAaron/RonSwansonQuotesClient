import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      button: "Get a Quote",
      quotes: "",
      chosenQuote: "",
      length: "Any Quote",
      shortQuotes: [],
      mediumQuotes: [],
      longQuotes: []
    };
    this.handleClick = this.handleClick.bind(this);
  }


  getQuote() {
    if (this.state.length === "Any Quote") {
      this.setState({
        chosenQuote: this.state.quotes[Math.floor(Math.random() * 57)]
      });
    }
    if (this.state.length === "Short Quote") {
      this.setState({
        chosenQuote: this.state.shortQuotes[Math.floor(Math.random() * this.state.shortQuotes.length)]
      });
    }
    if (this.state.length === "Medium Quote") {
      this.setState({
        chosenQuote: this.state.mediumQuotes[Math.floor(Math.random() * this.state.mediumQuotes.length)]
      });
    }
    if (this.state.length === "Long Quote") {
      this.setState({
        chosenQuote: this.state.longQuotes[Math.floor(Math.random() * this.state.longQuotes.length)]
      });
    }
  }

  handleClick() {
    if (this.state.quotes.length === 0) {
      axios
        .get("https://ron-swanson-quotes.herokuapp.com/v2/quotes/58")
        .then(res => {
          for (let i = 0; i < res.data.length; i++) {
            let length = res.data[i].split(" ").length;
            if (length < 5) {
              this.setState({
                shortQuotes: [...this.state.shortQuotes, res.data[i]]
              });
            } else if (length < 13) {
              this.setState({
                mediumQuotes: [...this.state.mediumQuotes, res.data[i]]
              });
            } else {
              this.setState({
                longQuotes: [...this.state.longQuotes, res.data[i]]
              });
            }
          }
          this.setState({ quotes: res.data });
          this.setState({ button: "Get a New Quote" });
        })
        .then(() => {
          this.getQuote();
        })
    }
    else {
      this.getQuote();
    }
  }

  handleLength(event) {
    this.setState({ length: event.target.value });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="title">
            <h1>Ron Swanson Quotes</h1>
            <select onChange={e => this.handleLength(e)}>
              <option value="Any Quote">Any Quote</option>
              <option value="Short Quote">Short Quote</option>
              <option value="Medium Quote">Medium Quote</option>
              <option value="Long Quote">Long Quote</option>
            </select>
            <button
              className="getQuoteButton"
              onClick={() => {
                this.handleClick();
              }}
            >
              {this.state.button}
            </button>
          </div>
          <p>{this.state.chosenQuote}</p>
        </header>
      </div>
    );
  }
}

export default App;
