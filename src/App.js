import React, { Component } from 'react';
import Button from './components/Button';

var Spotify = require('spotify-web-api-js');
var spotifyApi = new Spotify();

class App extends Component {

  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' }
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
      })
  }

  render() {
    return (
      <div className="App">
        <button className="spotify-login"><a href='http://localhost:8888' > Login to Spotify</a></button>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
          { this.state.loggedIn &&
            <Button primary onClick={() => this.getNowPlaying()}>
              Check Now Playing
            </Button>
          }
        </div>
      </div>
    );
  }
}

export default App;
