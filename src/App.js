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

      // check every second for the sdk player.
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    }
    this.state = {
      loggedIn: token ? true : false,
      token: token,
      error: '',
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
    this.playerCheckInterval = null;
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

  // This works pretty much identically to how the documentation recommends setting things up, but instead of using a constant OAuth token, we’re taking it from our app component’s state, and instead of creating a global variable called player, we just add player as one of the app’s class variables. This means that we can access it from any of the other class methods. (https://mbell.me/blog/2017-12-29-react-spotify-playback-api/)
  checkForPlayer() {
    // alert('you gotta playa')
    if (window.Spotify !== null) {
      this.player = new window.Spotify.Player({
        name: "Maker's Spotify Player",
        getOAuthToken: cb => { cb(this.state.token); },
      });
      this.createEventHandlers();
  
      // finally, connect!
      this.player.connect();
      // cacel the interval
      clearInterval(this.playerCheckInterval);
    }
  }

  createEventHandlers() {
    this.player.on('initialization_error', e => { console.error(e); });
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false });
    });
    this.player.on('account_error', e => { console.error(e); });
    this.player.on('playback_error', e => { console.error(e); });
  
    // Playback status updates
    this.player.on('player_state_changed', state => { console.log(state); });
  
    // Ready
    this.player.on('ready', data => {
      let { device_id } = data;
      console.log("Let the music play on!");
      this.setState({ deviceId: device_id });
    });
  }

  onStateChanged(state) {
    // if we're no longer listening to music, we'll get a null state.
    if (state !== null) {
      const {
        current_track: currentTrack,
        position,
        duration,
      } = state.track_window;
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      const artistName = currentTrack.artists
        .map(artist => artist.name)
        .join(", ");
      const playing = !state.paused;
      this.setState({
        position,
        duration,
        trackName,
        albumName,
        artistName,
        playing
      });
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
