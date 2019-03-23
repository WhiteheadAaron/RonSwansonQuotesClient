import React, { Component } from "react";
import { API_BASE_URL } from "./config";
import axios from "axios";
import "./App.css";
import Rating from "react-rating";


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
      buttonDisabled: false,
      rating: 0,
      rated: [],
      ip: ""
    };
    this.handleClick = this.handleClick.bind(this);
  }

  getIP() {
    axios
      // .get('http://api.ipstack.com/134.201.250.155?access_key=3c8383d3061f516a5b6aa9a0f2091f0c')
      .get('https://ip.seeip.org/json')
      .then(json => {
        this.setState({ ip: json.data.ip })
      })
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

  getQuoteStats(input) {
    axios.get(`${API_BASE_URL}/quotes`).then(res => {
      let newArr = res.data.filter(item => item.quote === input);
      if (newArr.length > 0) {
        this.setState({
          quoteStats: {
            rating: newArr[0].rating,
            ip: newArr[0].ip,
            id: newArr[0].id
          }
        });
      }
      if (newArr.length === 0) {
        axios.post(`${API_BASE_URL}/quotes`, { quote: input }).then(res => {
          this.setState({
            quoteStats: { rating: [], ip: [], id: res.data.id }
          });
        });
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
      });
      this.getQuoteStats(this.state.shortQuotes[num]);
    }
    if (this.state.length === "Medium Quote") {
      let num = Math.floor(Math.random() * this.state.mediumQuotes.length);
      this.setState({
        chosenQuote: this.state.mediumQuotes[num]
      });
      this.getQuoteStats(this.state.mediumQuotes[num]);
    }
    if (this.state.length === "Long Quote") {
      let num = Math.floor(Math.random() * this.state.longQuotes.length);
      this.setState({
        chosenQuote: this.state.longQuotes[num]
      });
      this.getQuoteStats(this.state.longQuotes[num]);
    }
  }

  updateRating(inp1, inp2) {
    const newObj = {
      rating: [...this.state.quoteStats.rating, inp1],
      ip: [...this.state.quoteStats.ip, inp2]
    };

    this.setState({ rated: [...this.state.rated, this.state.quoteStats.id] });

    axios
      .put(`${API_BASE_URL}/quotes/${this.state.quoteStats.id}`, newObj)
      .catch(e => {
        console.log(e);
      })
      .then(() => {
        this.setState({
          quoteStats: {
            rating: [...this.state.quoteStats.rating, inp1],
            ip: [...this.state.quoteStats.ip, inp2],
            id: this.state.quoteStats.id
          }
        });
      });
  }

  handleLength(event) {
    this.setState({ length: event.target.value });
  }

  showRating() {
    let newArr = this.state.rated.filter(
      item => item === this.state.quoteStats.id
    );

    let newArr2 = this.state.quoteStats.ip.filter(item => item === this.state.ip);

    if (newArr.length === 0 && newArr2.length === 0) {
      return (
        <Rating
          fractions={2}
          initialRating={this.state.rating}
          onClick={event => {
            this.setState({ rating: event });
            this.updateRating(event, this.state.ip);
          }}
        />
      );
    } else {
      return <p>You have already rated this quote.</p>;
    }
  }

  getRating() {
    let total = 0;
    if (this.state.quoteStats.rating) {
      for (let i = 0; i < this.state.quoteStats.rating.length; i++) {
        total += this.state.quoteStats.rating[i];
      }

      total = total / this.state.quoteStats.rating.length;
    }

    if (total > 0) {
      return (
        <>
          <p>
            This quote has a rating of {total} out of{" "}
            {this.state.quoteStats.rating.length} votes.
          </p>
          {this.showRating()}
        </>
      );
    }
    if (this.state.chosenQuote !== "") {
      return (
        <>
          <p>This quote doesn't have a rating yet.</p>
          {this.showRating()}
        </>
      );
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
                this.getIP();
                this.setState({ rating: 0 });
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
