/* global Vue */
import * as d3 from "https://cdn.skypack.dev/d3@7";

const INDEXES = [0, 1, 2, 3, 4];

const App = {
  data() { // variables
    return {
      target: "CHART",
      guesses: [],
      currentGuess: "",
      tileDimension: 50,
      badGuess: {
        show: false,
        reason: ''
      },
      didWin: false
    };
  },
  methods: { // static functions
    addGuess() {
      const newGuess = this.currentGuess.toUpperCase();
      const indexOfNewGuess = this.guesses.indexOf(newGuess)
      if (newGuess.length < 5) {
        this.badGuess.show = true;
        this.badGuess.reason = 'guess too short'
      } else if (newGuess.length > 5) {
        this.badGuess.show = true;
        this.badGuess.reason = 'guess too long'
      } else if (indexOfNewGuess !== -1) {
        this.badGuess.show = true;
        this.badGuess.reason = 'already guessed'
      } else {
        this.guesses.push(newGuess);
        this.currentGuess = ""; 
      }
      if (newGuess === this.target) {
        this.didWin = true;
      }
    },
    clearBadGuess() {
      if (this.badGuess.show) {
        this.badGuess.show = false;
      }
    },
    resetGame() {
      this.guesses = [];
      this.currentGuess = "";
      this.clearBadGuess();
      this.didWin = false;
    }
  },
  computed: { // dynamic functions
    gridData() {
      return this.guesses.map((guess) => guess.split("").map((letter, i) => {
        let color = 'lightgrey'
        if (this.target[i] === letter) {
          color = 'green'
        } else if (this.target.indexOf(letter) !== -1) { // found index in target, but not in the same position
          color = 'orange'
        }
        return {
          letter,
          color
        }
      }));
    },
    svgWidth() {
      return this.tileDimension * 5;
    },
    svgHeight() {
      return Math.max(100, this.guesses.length * this.tileDimension);
    },
    xScale() {
      return d3.scaleBand().domain(INDEXES).range([0, this.svgWidth]);
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain([0, this.guesses.length])
        .range([0, this.svgHeight]);
    },
  },
};

Vue.createApp(App).mount("#app");
