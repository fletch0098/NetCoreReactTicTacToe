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

        //const url = 'https://netcorereacttictactoebrian.azurewebsites.net/chathub';
        const url = 'http://localhost:58656/chathub';

        this.state = {
            games: [],
            name: '',
            message: '',
            messages: [],
            players: [],
            hubConnection: null,
            url: url,
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

    render() {
        return (
            <div className='TicTacToe'>
                <Row>
                    <Col sm={4}>
                        <h1>TicTacToe</h1>
                        <p>This is a simple tictactoe game.</p>
                        <Game addGame={game => this.addGame(game)} />
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
