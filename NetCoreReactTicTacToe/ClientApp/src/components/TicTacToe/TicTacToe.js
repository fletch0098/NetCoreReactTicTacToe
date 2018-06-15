import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import './TicTacToe.css';
import { Game } from './Game';
import { HighScore } from './HighScore';
import { Players } from './Players';
import { Chat } from '../Chat/Chat';
import * as signalR from '@aspnet/signalr';
import Moment from 'moment';

export class TicTacToe extends Component {
    displayName = TicTacToe.name

    constructor(props) {
        super(props);

        const url = 'https://netcorereacttictactoebrian.azurewebsites.net/chathub';
        //const url = 'http://localhost:58656/chathub';

        this.state = {
            games: [],
            name: '',
            message: '',
            messages: [],
            players: [],
            hubConnection: null,
            url: url,
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

    componentDidMount = () => {

        const name = window.prompt('Your name:', 'Player 1');

        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.state.url)
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.setState({ hubConnection, name }, () => {
            this.state.hubConnection
                .start()
                .then(() => {
                    //Now that we started the connection
                    console.log('Connection started!')
                    this.newChatUser(name)
                })
                .catch(err => console.log('Error while establishing connection :('));

            this.state.hubConnection
                .on('sendToAll', (time, name, receivedMessage) => {
                    const text = `${Moment(time).format('DD/MM/YY:h:mm:ss a')}: ${name}: ${receivedMessage}`;
                    const messages = this.state.messages.concat([text]);
                    this.setState({ messages });
                });

            this.state.hubConnection
                .on('sendMove', (i) => {
                    this.handleClick(i);
                });

            this.state.hubConnection
                .on('loadNewPlayer', (player) => {
                    console.log('New Player: ' + player);
                    const text = `${player.playerName}: ${player.playerXorO}`;
                    const players = this.state.players.concat([text]);
                    this.setState({ players });
                });
            this.state.hubConnection
                .on('chatFull', (receivedMessage) => {
                    window.alert(receivedMessage);
                });
            this.state.hubConnection
                .on('playerDisconnected', (receivedMessage) => {
                    window.alert(receivedMessage);
                });
            this.state.hubConnection
                .on('catchUpNewPlayer', (messagesList, playerList) => {
                    console.log('PlayerList' + playerList);
                    playerList.map((player, index) => (
                        this.setState({ players: this.state.players.concat([`${player.playerName}: ${player.playerXorO}`]) })
                    ));
                    console.log('Message List' + messagesList);
                    messagesList.map((message, index) => (
                        this.setState({ messages: this.state.messages.concat([`${Moment(message.timestamp).format('DD/MM/YY:h:mm:ss a')}: ${message.name}: ${message.messageText}`]) })
                    ));
                });
        });
    }

    newPlayer = (initials) => {
        //console.log('NewPlayer: Initials '  + initials);
        let player = null;

        if (this.state.players.length) {
            //console.log('NewPlayer: Player O');
                player = 'O'
        }
        else {
            //console.log('NewPlayer: Player X');
                player = 'X'
        }

        this.state.hubConnection
            .invoke('NewPlayer', initials, player)
            .catch(err => console.error(err));
    }

    newChatUser = (name) => {
        this.state.hubConnection
            .invoke('newChatUser', name)
            .catch(err => console.error(err));
    };

    sendMessage = (msg) => {
        this.state.hubConnection
            .invoke('sendToAll', this.state.name, msg)
            .catch(err => console.error(err));

        //this.setState({ message: '' });
    };

    addGame(game) {
        this.setState({ games: [...this.state.games, game] });
    }

    sendClick(i) {
        this.state.hubConnection
            .invoke('sendMove', i)
            .catch(err => console.error(err));
    }

    handleClick(i) {
        const gameHistory = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = gameHistory[gameHistory.length - 1];
        const squares = current.squares.slice();
        const currentPlayer = !this.state.xIsNext ? "X" : "O";

        if (this.calculateWinner(squares) || this.state.stepNumber > 8) {
            console.log('Game Over!');
            //this.props.history.push({
            //    pathname: '/highscore',
            //    props: { newGame:this.newGame }
            //})

            if (this.state.stepNumber <= 8) {
                
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

        //Only here
        this.setState({
            history: gameHistory.concat([
                {
                    squares: squares,
                    location: { who: this.state.xIsNext ? "X" : "O", row: row, col: col }
                }
            ]),
            stepNumber: gameHistory.length,
            xIsNext: !this.state.xIsNext,
        });
        //until here


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

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares)
        const stepNumber = this.state.stepNumber;
        const xIsNext = this.state.xIsNext;

        return (
            <div className='TicTacToe'>
                <Row>
                    <Col sm={4}>
                        <h1>TicTacToe</h1>
                        <p>This is a simple tictactoe game.</p>
                        <Game history={this.state.history} xIsNext={this.state.xIsNext} winner={winner} stepNumber={this.state.stepNumber} handleClick={i => this.sendClick(i)} addGame={game => this.addGame(game)} />
                     </Col>
                    <Col sm={8}>
                        <Chat players={this.state.players} messages={this.state.messages} sendMessage={(msg) => this.sendMessage(msg)} />
                     </Col>
                </Row>
                <Row>
                <button onClick={(initials) => this.newPlayer('BMF')} >NewPlayer</button>
                    <HighScore games={this.state.games} newGame={() => this.newGame()} />
                </Row>
            </div>
        );
    }
}
