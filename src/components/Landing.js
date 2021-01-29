import React, { Component } from 'react';
import SpotifyButton from './SpotifyButton'

class Landing extends Component {

    constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    return (
    <div class="container">
      <div id="login">
        <div class="title"
        style={{
          position: 'absolute',
          margin: '0 auto',
          textQlign: 'center',
        }}
        >
        <h1
          style={{
            fontFamily: 'Six Caps, sans-serif',
            fontWeight: 'normal',
            lineHeight: 1,
            margin: 0,
          }}
        >MAKER RADIO</h1>
        <h2
          style={{
            fontWeight: 'normal',
          }}
        >Scientifically proven to make you smarter.</h2>
        </div>
        <div id="spotify-button"
          style={{
            position: 'absolute',
            right: '20px',
            bottom: '20px'
          }}
        >
        <div class="arrow"
        style={{
          transform: 'rotate(258deg)',
          position: 'absolute',
          right: '70px',
          top: '-120px'
          }}
        >
          <div class="greeting"
          style={{
            fontFamily: 'Rock Salt, cursive',
            transform: 'rotate(90deg)'
          }}
          >Welcome my dudes!</div>
          <img src="arrow.png" alt="arrow"
          style={{
            transform: 'scaleX(-1)',
            width: '100px'
          }}
          />
        </div>
        <SpotifyButton />
        </div>
      </div>
    </div>
    )
  }
}

export default Landing
