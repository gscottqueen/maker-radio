import React, { Component } from 'react';

// Styles
import SpotifyButton from './components/SpotifyButton';

// module for color getter
import Palette from 'react-palette'

// Spotify wrapper library
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
      makerPlaylist: {
        response: false,
        tracks: {},
        nowPlaying: {
          artist: '',
          albumArt: ''
        }
      },
      nowPlaying: {
        response: false, 
        artist: '', 
        albumArt: ''
      },
      user: {
        response: false,
        name: '',
        image: ''
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

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              response: true,
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
            response: true,
            name: response.display_name,
            image: response.images[0].url
          }
        });
      })
  }

  getMakerRadioPlaylist(){
    spotifyApi.getPlaylist(process.env.MAKER_PLAYLIST)
      .then((response) => {
        console.log(response)
        console.log(response.tracks.items[0].track.name)
        console.log(response.tracks.items[0].track.album.images[0].url)

        this.setState({
          makerPlaylist: {
            response: true,
            tracks: response.tracks,
            nowPlaying: {
              artist: response.tracks.items[0].track.name,
              albumArt: response.tracks.items[0].track.album.images[0].url,
              trackID: response.tracks.items[0].track.id
            }
          }
        });
      })
  }

  render() {
    return (
      <div 
        className="App">

          {this.state.loggedIn && this.state.nowPlaying.response === false ? this.getNowPlaying() : null }
          {this.state.loggedIn && this.state.user.response === false ? this.getUserProfile() : null }
          {this.state.makerPlaylist.response === false ? this.getMakerRadioPlaylist() : null }
          
          {this.state.nowPlaying.response === true ?
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
