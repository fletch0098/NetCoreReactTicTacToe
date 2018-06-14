import React, {} from 'react';
import './Board.css';
import Square from './Square';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.onClick=this.onClick.bind(this);
  }

  render() {
    return (
      <div className="game-board">
          {this.renderBoard()}
      </div>
    );
  }

  renderBoard = () => {

    let board = []

    // Outer loop to create board
    for (let i = 0; i < 3; i++) {
      let row = []
      //Inner loop to create row
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare(((i*3) + (j+1)) - 1))
      }
      //Create the parent and add the children
      board.push(<div key={i} className="board-row">{row}</div>)
    }
    return board
  }

  renderSquare(i) {
    let className = ["square"];
    if (this.props.winner){
       let cosa = this.props.winner.find(function(element) {
          return element === i;
        });
          if (this.props.winner && cosa !== undefined) {
               className.push("winningSquare");
          }
    }
    return (
      <Square key={i} value={this.props.squares[i]} onClick={() => this.onClick(i)}  className={className}/>
    );
  }

  onClick(i){
    this.props.onClick(i);
  }

}

export default Board;
