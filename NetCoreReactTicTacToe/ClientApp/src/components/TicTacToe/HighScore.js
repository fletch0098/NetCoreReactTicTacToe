import React, { Component } from 'react';
import './HighScore.css';

export class HighScore extends Component {
    displayName = HighScore.name
  constructor(props) {
      super(props);

      this.state = {
          sort: ''
      };

        this.newGame = this.newGame.bind(this);
  }

    render() {
        const games = this.props.games;

        //let gamesListClassName = 'glyphicon glyphicon-sort-by-order';
        let gamesList = games.map((step, game) => {
            //var desc = move ?
            //    '#' + move + ' ' + step.location.who + ': (' + step.location.row + ',' + step.location.col + ')' :
            //    'Game start';
            //let className = "";
            //if (move === stepNumber) {
            //    className = 'bold';
            //}
            return (
                <tr key={game}>
                    <td>{step.initials}</td>
                    <td>{step.player}</td>
                    <td>{step.moves}</td>
                    <td>{step.time}</td>
                </tr>
            );
        });

        //if (this.state.sortMoves === 'desc') {
        //    moves = moves.reverse();
        //    movesClassName = 'glyphicon glyphicon-sort-by-order-alt';
        //}

        //let status;
        //if (winner) {
        //    status = "Winner: " + current.squares[winner[0]];
        //}
        //else {
        //    if (stepNumber < 9) {
        //        status = "Next player: " + (xIsNext ? "X" : "O");
        //    }
        //    else {
        //        status = "Draw";
        //    }
        //}

        return (
            <div className="HighScore">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Initials</th>
                            <th>Player</th>
                            <th>Moves</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gamesList}
                    </tbody>
                </table>
            </div>
            
        );
    }



    newGame() {
        console.log('HighScore: New Game');
        this.props.newGame();
  }
}
