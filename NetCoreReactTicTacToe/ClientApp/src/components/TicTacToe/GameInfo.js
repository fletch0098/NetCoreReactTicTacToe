import React, { Component } from 'react';
import './GameInfo.css';

class GameInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortMoves: 'asc'
    };
    this.jumpTo=this.jumpTo.bind(this);
  }

  render() {
    const history = this.props.history;
    const stepNumber = this.props.stepNumber;
    const current = history[stepNumber];
    const winner = this.props.winner;
    const xIsNext = this.props.xIsNext;


    let movesClassName = 'glyphicon glyphicon-sort-by-order';
    let moves = history.map((step, move) => {
      var desc = move ?
        '#' + move + ' ' + step.location.who + ': ('+step.location.row+','+step.location.col+')':
        'Game start';
        let className = "";
        if (move === stepNumber){
            className='bold';
        }
        return (
          <li key={move}>
            <a onClick={() => this.jumpTo(move)} className={className}>{desc}</a>
          </li>
        );
    });

    if (this.state.sortMoves === 'desc'){
      moves = moves.reverse();
      movesClassName = 'glyphicon glyphicon-sort-by-order-alt';
    }

    let status;
    if (winner) {
      status = "Winner: " + current.squares[winner[0]];
    }
    else {
      if (stepNumber < 9){
        status = "Next player: " + (xIsNext ? "X" : "O");
      }
      else {
        status = "Draw";
      }
    }

    return (
      <div className="game-info">
        <div>{status}</div>
        <span onClick={() => this.sortMoves()} className='btn'>Moves: <span className={movesClassName}></span></span>
        <ul className="list-unstyled">{moves}</ul>
      </div>
    );
  }

  jumpTo(step){
    this.props.jumpTo(step);
  }

  newGame(){
    this.jumpTo(0);
  }

  sortMoves() {
    const sortMoves = this.state.sortMoves;
    if (sortMoves === 'asc'){
      this.setState({
        sortMoves: 'desc'
      });
    }
    else{
      this.setState({
        sortMoves: 'asc'
      });
    }
  }

}

export default GameInfo;
