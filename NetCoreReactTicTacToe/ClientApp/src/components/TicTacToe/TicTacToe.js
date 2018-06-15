import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import './TicTacToe.css';
import { Game } from './Game';
import { HighScore } from './HighScore';
import { Players } from './Players';
import * as signalR from '@aspnet/signalr';

export class TicTacToe extends Component {
    displayName = TicTacToe.name

    constructor(props) {
        super(props);
        this.state = {
            games: [],
            initials: '',
            player: '',
            players: [],
            hubConnection: null,
      };
        this.addGame = this.addGame.bind(this);
    }

    componentDidMount = () => {
        //console.log('players: ' + this.state.players);
        //console.log('players length: ' + this.state.players.length);
        if (this.state.players.length < 2) {
            const initials = window.prompt('Your Initials:', 'P1');

            //const Url = 'https://netcorereacttictactoebrian.azurewebsites.net/tictactoehub';
            const Url = 'http://localhost:58656/tictactoehub';

            const hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(Url)
                .configureLogging(signalR.LogLevel.Information)
                .build();

            hubConnection.start().catch(err => console.error(err.toString()));

            this.setState({ hubConnection, initials }, () => {
                this.state.hubConnection
                    .start()
                    .then(() => console.log('Connection started!'))
                    .catch(err => console.log('Error while establishing connection :('));

                this.state.hubConnection.on('NewPlayer', (initials, player) => {
                    const text = `${initials}: ${player}`;
                    const players = this.state.players.concat([text]);
                    this.setState({ players });
                });
            });

            //console.log('componentDidMount - State: '+ this.state);

            this.newPlayer(initials);
        }
        else {
            window.alert('Already 2 players, please refresh and try again');
        }
    }

    newPlayer(initials) { 
        //console.log('NewPlayer: Initials '  + initials);
        if (this.state.players.length) {
            //console.log('NewPlayer: Player O');
            this.setState({
                player: 'O'
            });
        }
        else {
            //console.log('NewPlayer: Player X');
            this.setState({
                player: 'X'
            });
        }

        //console.log('NewPlayer: player ' + this.state.player);

        this.state.hubConnection
            .invoke('NewPlayer', initials, this.state.player)
            .catch(err => console.error(err));
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
                          <Players players={this.state.players} />
                      </Col>
                  </Row>
              </Grid>

              <button onClick={(initials) => this.newPlayer('BMF')} >NewPlayer</button>
              <HighScore games={this.state.games} newGame={() => this.newGame()} />
          </div>
        );
    }

    addGame(game) {
        this.setState({ games: [...this.state.games, game] });
    }
}
