import React, { Component } from 'react';
import './Players.css';

export class Players extends Component {
    displayName = Players.name

    constructor(props) {
        super(props);
        this.state = {
            users: [
                { player: 'X', initials: 'BMF' },
                { player: 'O', initials: 'FPS' }
            ]
        };
    //this.onClick = this.onClick.bind(this);
  }

    render() {
    return (
            <div className='players'>
                <h3>Players online:</h3>
                <ul className='chat-users'>
                    {this.state.users.map(user =>
                        <li key={user.player}>{user.initials}</li>
                    )}
                </ul>
            </div>
    );
  }

  //  onClick(i){
  //  this.props.onClick();
  //}
}