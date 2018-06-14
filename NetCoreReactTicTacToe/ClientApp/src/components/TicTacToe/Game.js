import React, { Component } from 'react';
import './Game.css';
import Board from './Board';
import GameInfo from './GameInfo';

export class Game extends Component {
    displayName = Game.name

    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    location: { who: '', col: null, row: null }
                }
            ],
            stepNumber: 0,
            xIsNext: true,
        };
        this.addGame = this.addGame.bind(this);
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares);
        const stepNumber = this.state.stepNumber;
        const xIsNext = this.state.xIsNext;

        return (
            <div className="game">
                <Board
                    squares={current.squares}
                    onClick={i => this.handleClick(i)}
                    winner={winner} />
                <GameInfo history={history}
                    stepNumber={stepNumber}
                    xIsNext={xIsNext}
                    winner={winner}
                    jumpTo={step => this.jumpTo(step)} />
            </div>
        );
    }

    addGame(game) {
        this.props.addGame(game);
    }

    handleClick(i) {
        const gameHistory = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = gameHistory[gameHistory.length - 1];
        const squares = current.squares.slice();

        if (this.calculateWinner(squares) || this.state.stepNumber > 8) {
            console.log('Game Over!');
            //this.props.history.push({
            //    pathname: '/highscore',
            //    props: { newGame:this.newGame }
            //})

            if (this.state.stepNumber <= 8) {
                const currentPlayer = !this.state.xIsNext ? "X" : "O";
                console.log('Player: ' + currentPlayer);
                let game = { player: currentPlayer, initials: 'BMF', time: new Date().toLocaleString(), moves: this.state.stepNumber };
                this.addGame(game);
            }
            
            this.newGame();
            return;
        }

        if (squares[i]) {
            //console.log('Already Taken!');
            return;
        }

    squares[i] = this.state.xIsNext ? "X" : "O";
    let row = Math.floor(i / 3) + 1;
    let col = (i % 3) + 1;
    this.setState({
        history: gameHistory.concat([
        {
          squares: squares,
          location: {who:this.state.xIsNext ? "X" : "O",row:row,col:col}
        }
      ]),
        stepNumber: gameHistory.length,
      xIsNext: !this.state.xIsNext,
    });
  }

    jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

    newGame() {
        console.log('Game: newGame');
        this.setState({
            history: [
                {
                    squares: Array(9).fill(null),
                    location: { who: '', col: null, row: null }
                }
            ],
            stepNumber: 0,
            xIsNext: true,
        });
  }

    calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        //return squares[a];
        return lines[i];
      }
    }
    return null;
  }
}
