import React, { Component } from 'react';

// Styles
import SpotifyButton from './components/SpotifyButton';

// module for color getter
import Palette from 'react-palette'

// Spotify wrapper library
var Spotify = require('spotify-web-api-js');
var spotifyApi = new Spotify();

class App extends Component {

  constructor(props){
    super(props);
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      error: "",
      deviceId: "",
      nowPlaying: {
        playBackResponse: false, 
        artist: '', 
        albumArt: '',
        albumName: '',
        playing: false,
        position: 0,
        duration: 0,
      },
      user: {
        meResponse: false,
        name: '',
        image: '',
      }
    }
  }
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  // from tutorial, need to understand more what is happening here
  getHashParams(){
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

  checkForPlayer() {
    if (window.Spotify !== null) {
      alert('You got a playa!')
      this.player = new window.Spotify.Player({
        name: "Matt's Spotify Player",
        getOAuthToken: cb => { cb(this.state.token); },
      });
      // this.createEventHandlers();
  
      // finally, connect!
      this.player.connect();
    }
  }

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              playBackResponse: true,
              artist: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
      })
  }

  getUserProfile(){
    spotifyApi.getMe()
      .then((response) => {
        this.setState({
          user: {
            meResponse: true,
            name: response.display_name,
            image: response.images[0].url
          }
        });
      })
  }

  // getMakerRadioPlaylist(){
  //   spotifyApi.getPlaylist('1PCdCzRKLLmd8XvVLw8eV7')
  //     .then((response) => {
  //       console.log(response)
  //       console.log(response.tracks.items[0].track.name)
  //       console.log(response.tracks.items[0].track.album.images[0].url)

  //       this.setState({
  //         makerPlaylist: {
  //           response: true,
  //           tracks: response.tracks,
  //           nowPlaying: {
  //             artist: response.tracks.items[0].track.name,
  //             albumArt: response.tracks.items[0].track.album.images[0].url,
  //             trackID: response.tracks.items[0].track.id
  //           }
  //         }
  //       });
  //     })
  // }

  render() {
    return (
      <div 
        className="App">
          {this.state.error && <p>Error: {this.state.error}</p>}
          
          {this.state.loggedIn && this.state.nowPlaying.playBackResponse === false ? this.getNowPlaying() : null }
          {this.state.loggedIn && this.state.user.meResponse === false ? this.getUserProfile() : null }
          
          {this.state.nowPlaying.playBackResponse === true ?
          <Palette image={this.state.nowPlaying.albumArt}>
            {palette => (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center', backgroundImage: 'linear-gradient(' + palette.lightVibrant + ', #FFF )', height: '100vh' }}>
              <h1>User Playing</h1>
              <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }} alt="album cover"/>
              <p style={{ textAlign: 'center' }}>{this.state.nowPlaying.artist}</p>
            </div>
            )}
            </Palette>
          : null }
          <div style={{ position : 'absolute', right: '20px', bottom: '20px' }}>
            <SpotifyButton profileImage={this.state.user.image}></SpotifyButton>
        </div>
      </div>
    );
  }
}

export default App;
