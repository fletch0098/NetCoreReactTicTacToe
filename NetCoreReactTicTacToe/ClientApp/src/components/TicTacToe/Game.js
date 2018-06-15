import React, { Component } from 'react';
import './Game.css';
import Board from './Board';
import GameInfo from './GameInfo';

export class Game extends Component {
    displayName = Game.name

    constructor(props) {
        super(props);
        this.state = {
           
        };
        //this.addGame = this.addGame.bind(this);
    }

    render() {
        const history = this.props.history;
        const current = history[this.props.stepNumber];
        const winner = this.props.winner;
        const stepNumber = this.props.stepNumber;
        const xIsNext = this.props.xIsNext;

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

    //addGame(game) {
    //    this.props.addGame(game);
    //}

    handleClick(i) {
        this.props.handleClick(i);
  }

}
