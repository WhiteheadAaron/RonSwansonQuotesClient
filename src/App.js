import React, { Component } from "react";
import { API_BASE_URL } from "./config";
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
      longQuotes: [],
      quoteStats: {
        rating: [],
        ip: []
      },
      buttonDisabled: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  getQuoteStats(input) {
    axios.get(`${API_BASE_URL}/quotes`).then(res => {
      let newArr = res.data.filter(item => item.quote === input);
      if (newArr.length > 0) {
        this.setState({
          quoteStats: { rating: newArr[0].rating, ip: newArr[0].ip }
        });
      }
      if (newArr.length === 0) {
        this.setState({ quoteStats: { rating: [], ip: [] } });
        axios.post(`${API_BASE_URL}/quotes`, { quote: input });
      }
    });
  }

  getQuote() {
    if (this.state.length === "Any Quote") {
      let num = Math.floor(Math.random() * this.state.quotes.length);
      this.setState({
        chosenQuote: this.state.quotes[num]
      });
      this.getQuoteStats(this.state.quotes[num]);
    }
    if (this.state.length === "Short Quote") {
      let num = Math.floor(Math.random() * this.state.shortQuotes.length);
      this.setState({
        chosenQuote: this.state.shortQuotes[num]
      }).then(() => {
        this.getQuoteStats(num);
      });
    }
    if (this.state.length === "Medium Quote") {
      let num = Math.floor(Math.random() * this.state.mediumQuotes.length);
      this.setState({
        chosenQuote: this.state.mediumQuotes[num]
      }).then(() => {
        this.getQuoteStats(num);
      });
    }
    if (this.state.length === "Long Quote") {
      let num = Math.floor(Math.random() * this.state.longQuotes.length);
      this.setState({
        chosenQuote: this.state.longQuotes[num]
      }).then(() => {
        this.getQuoteStats(num);
      });
    }
  }

  handleClick() {

    this.setState({ buttonDisabled: true });
    setTimeout(() => this.setState({ buttonDisabled: false }), 2000);

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
          return res;
        })
        .then(() => {
          this.getQuote();
        });
    } else {
      this.getQuote();
    }
  }

  handleLength(event) {
    this.setState({ length: event.target.value });
  }

  getRating() {
    let total = 0;
    for (let i = 0; i < this.state.quoteStats.rating.length; i++) {
      total += this.state.quoteStats.rating[i];
    }

    total = total / this.state.quoteStats.rating.length;

    if (total > 0) {
      return (
        <p>
          This quote has a rating of {total} out of{" "}
          {this.state.quoteStats.rating.length} votes.
        </p>
      );
    }
    if (this.state.chosenQuote !== "") {
      return <p>This quote doesn't have a rating yet.</p>;
    }
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
              disabled={this.state.buttonDisabled}
              onClick={() => {
                this.handleClick();
              }}
            >
              {this.state.button}
            </button>
          </div>
          <p>{this.state.chosenQuote}</p>
          {this.getRating()}
        </header>
      </div>
    );
  }
}

export default App;
