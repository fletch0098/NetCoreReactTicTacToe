import React, { Component } from 'react';
import * as signalR from '@aspnet/signalr';

import { Col, Grid, Row } from 'react-bootstrap';

export class Chat extends Component {

    constructor(props) {
        super(props);

        //const url = 'https://netcorereacttictactoebrian.azurewebsites.net/chathub';
        //const url = 'http://localhost:58656/chathub';

        this.state = {
            message: '',
        };
    }

    //componentDidMount = () => {
    //    const name = window.prompt('Your name:', 'Player 1');

    //    const hubConnection = new signalR.HubConnectionBuilder()
    //        .withUrl(this.state.url)
    //        .configureLogging(signalR.LogLevel.Information)
    //        .build();

    //    this.setState({ hubConnection, name }, () => {
    //        this.state.hubConnection
    //            .start()
    //            .then(() => {
    //                //Now that we started the connection
    //                console.log('Connection started!')
    //                this.newChatUser(name)
    //            })
    //            .catch(err => console.log('Error while establishing connection :('));

    //        this.state.hubConnection
    //            .on('sendToAll', (time,name, receivedMessage) => {
    //                const text = `${Moment(time).format('DD/MM/YY:h:mm:ss a')}: ${name}: ${receivedMessage}`;
    //                const messages = this.state.messages.concat([text]);
    //                this.setState({ messages });
    //            });
    //        this.state.hubConnection
    //            .on('loadNewPlayer', (player) => {
    //                console.log('New Player: ' + player);
    //                const text = `${player.playerName}: ${player.playerXorO}`;
    //                const players = this.state.players.concat([text]);
    //                this.setState({ players });
    //            });
    //        this.state.hubConnection
    //            .on('chatFull', (receivedMessage) => {
    //                window.alert(receivedMessage);
    //            });
    //        this.state.hubConnection
    //            .on('playerDisconnected', (receivedMessage) => {
    //                window.alert(receivedMessage);
    //            });
    //        this.state.hubConnection
    //            .on('catchUpNewPlayer', (messagesList, playerList) => {
    //                console.log('PlayerList' + playerList);
    //                playerList.map((player, index) => (
    //                    this.setState({ players: this.state.players.concat([`${player.playerName}: ${player.playerXorO}`]) })
    //                ));
    //                console.log('Message List' + messagesList);
    //                messagesList.map((message, index) => (
    //                    this.setState({ messages: this.state.messages.concat([`${Moment(message.timestamp).format('DD/MM/YY:h:mm:ss a')}: ${message.name}: ${message.messageText}`]) })
    //                ));
    //            });
    //    });
    //}

    sendMessage = () => {
        this.props.sendMessage(this.state.message)
        //this.state.hubConnection
        //    .invoke('sendToAll', this.state.name, this.state.message)
        //    .catch(err => console.error(err));

        this.setState({ message: '' });
    };



    render() {
        return (
                
            <div className='Chat'>
                <row>
                    <Col sm={4}>
                        <div className='players'>
                            <h3>Players online:</h3>
                            <ul className='chat-users'>
                                {this.props.players.map((player, index) => (
                                    <li key={index}>{player}</li>
                                ))}
                            </ul>
                        </div>
                    </Col>
                    <Col sm={8}>
                        <div className=''>
                            <h3>Messages:</h3>
                            <input
                                type="text"
                                value={this.state.message}
                                onChange={e => this.setState({ message: e.target.value })}
                            />

                            <button onClick={this.sendMessage}>Send</button>

                            <div className='messages'>
                                
                                {this.props.messages.map((message, index) => (
                                    <span style={{ display: 'block' }} key={index}> {message} </span>
                                ))}
                            </div>
                        </div>
                    </Col>
                </row>
                
                
                

                
            </div>
        );
    }

}