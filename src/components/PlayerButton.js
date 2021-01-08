import React, { Component } from 'react';

class PlayerButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.action,
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log(this.props.action);
    let action = this.props.action;
    this.player = window.Spotify.Player;

    switch (action) {
      case 'previous':
        console.log(action);
        // player.previousTrack().then(() => {
        //   console.log('Set to previous track!');
        // });
        break;
      case 'play':
        // console.log(action);
        break;
      case 'next':
        // console.log(action);
        break;
      default:
        // console.log(action);
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>{this.state.value}</button>
      </div>
    );
  }
}

export default PlayerButton;
