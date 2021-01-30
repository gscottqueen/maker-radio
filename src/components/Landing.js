import React, { Component } from 'react';
import SpotifyButton from './SpotifyButton'

class Landing extends Component {

    constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    return (
    <div className="container"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative'
      }}>
      <div id="login">
        <div className="title"
        style={{
          position: 'absolute',
          margin: '0 auto',
          textAlign: 'center',
          width: '100%',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        >
        <h1
          style={{
            fontSize: '200px',
            fontFamily: 'Six Caps, sans-serif',
            fontWeight: 'normal',
            lineHeight: 1,
            margin: 0,
          }}
        >MAKER RADIO</h1>
        <h2
          style={{
            fontWeight: 'normal',
            fontSize: '20px',
            maxWidth: '80%',
            margin: '40px auto'
          }}
        >Scientifically proven to make you smarter.</h2>
        </div>
        <div id="spotify-button"
          style={{
            position: 'absolute',
            right: '5%',
            bottom: '20px'
          }}
        >
        <div className="arrow"
        style={{
          transform: 'rotate(258deg)',
          position: 'absolute',
          right: '80px',
          top: '-100px'
          }}
        >
          <div className="greeting"
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
