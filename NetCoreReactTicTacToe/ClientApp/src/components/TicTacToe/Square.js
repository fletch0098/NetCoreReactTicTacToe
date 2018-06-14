import React, { Component } from 'react';
import './Square.css';

class Square extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  render() {
    return (
      <button className={this.props.className.join(' ')} onClick={this.onClick}>
        {this.props.value}
      </button>
    );
  }

  onClick(i){
    this.props.onClick();
  }
}

export default Square;
