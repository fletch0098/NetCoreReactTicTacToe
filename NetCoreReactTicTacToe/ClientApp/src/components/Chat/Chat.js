import React, { Component } from 'react';
import * as signalR from '@aspnet/signalr';

export class Chat extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nick: '',
            message: '',
            messages: [],
            hubConnection: null,
            url: '',
        };
    }

    componentDidMount = () => {
        const nick = window.prompt('Your name:', 'John');

        //const Url = 'https://netcorereacttictactoebrian.azurewebsites.net/chathub';
        const Url = 'http://localhost:58656/chathub';

        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(Url)
            .configureLogging(signalR.LogLevel.Information)
            .build();
        hubConnection.start().catch(err => console.error(err.toString()));

        this.setState({ hubConnection, nick }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log('Connection started!'))
                .catch(err => console.log('Error while establishing connection :('));

            this.state.hubConnection.on('sendToAll', (nick, receivedMessage) => {
                const text = `${nick}: ${receivedMessage}`;
                const messages = this.state.messages.concat([text]);
                this.setState({ messages });
            });
        });


    }

    sendMessage = () => {
        this.state.hubConnection
            .invoke('sendToAll', this.state.nick, this.state.message)
            .catch(err => console.error(err));

        this.setState({ message: '' });
    };

    render() {
        return (
            <div className='Chat'>
                <br />
                <input
                    type="text"
                    value={this.state.message}
                    onChange={e => this.setState({ message: e.target.value })}
                />

                <button onClick={this.sendMessage}>Send</button>

                <div>
                    {this.state.messages.map((message, index) => (
                        <span style={{ display: 'block' }} key={index}> {message} </span>
                    ))}
                </div>
            </div>
        );
    }
}