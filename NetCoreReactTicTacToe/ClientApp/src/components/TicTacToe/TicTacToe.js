import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import './TicTacToe.css';
import { Game } from './Game';
import { HighScore } from './HighScore';
import { Players } from './Players';

export class TicTacToe extends Component {
    displayName = TicTacToe.name

    constructor(props) {
        super(props);
        this.state = {
            games: [],
      };
        this.addGame = this.addGame.bind(this);
  }

    render() {
      return (
          <div className='TicTacToe'>
              <h1>TicTacToe</h1>
              <p>This is a simple tictactoe game.</p>
              <Grid fluid>
                  <Row>
                      <Col sm={3}>
                          <Game addGame={game => this.addGame(game)} />
                      </Col>
                      <Col sm={3}>
                          <Players />
                      </Col>
                  </Row>
              </Grid>
             
              
              <HighScore games={this.state.games} newGame={() => this.newGame()} />
          </div>
        );
    }

    addGame(game) {
        this.setState({ games: [...this.state.games, game] });
    }
}
