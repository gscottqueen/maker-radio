import React, { Component } from 'react';

// Components
import SpotifyButton from './components/SpotifyButton';
import Album from './components/Album';

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
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000)
      // get our playlist
      this.getMakerRadioPlaylist();
    }
    this.state = {
      loggedIn: token ? true : false,
      token: token,
      error: '',
      deviceId: '',
      albumsResponse: [],
      nowPlaying: { 
        artist: '', 
        albumArt: {
          image: '',
          width: '',
          height: '',
        }, 
        albumName: '',
        playing: false,
        position: 0,
        duration: 0,
      },
      user: {
        response: false,
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
    // this.player.on('player_state_changed', state => { console.log(state); });
    // this.player.on('player_state_changed', state => this.onStateChanged(state));
  
    // Ready
    this.player.on('ready', data => {
      let { device_id } = data
      this.setState({ deviceId: device_id })
      console.log("Let the music play on!")
    });
  }

  // onStateChanged(state) {
  //   // if we're no longer listening to music, we'll get a null state.
  //   if (state !== null) {
  //     const {
  //       current_track: currentTrack,
  //       position,
  //       duration,
  //     } = state.track_window;
  //     const artistName = currentTrack.artists
  //       .map(artist => artist.name)
  //       .join(", ");
  //     const trackName = currentTrack.name;
  //     const albumName = currentTrack.album.name;
  //     const image = currentTrack.album.images[2].url
  //     const playing = !state.paused;
  //     this.setState({
  //       nowPlaying: { 
  //         artistName: artistName, 
  //         trackName: trackName,
  //         albumName: albumName,
  //         // albumArt: albumArt,
  //         albumArt: {
  //           image: image,
  //         }, 
  //         playing: playing,
  //         position: position,
  //         duration: duration,
  //       }
  //     });
  //   }
  // }

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
    spotifyApi.getPlaylist(
      String(process.env.REACT_APP_MAKER_PLAYLIST))
      .then((response) => {
        // console.log(response)
        this.setState({ albumsResponse: response.tracks.items })
      })
  }

  render() {

    let albums = null;

    console.log(this.state.albumsResponse)

    if (this.state.albumsResponse) {
      albums = (
        <div>
          {this.state.albumsResponse.map((item) => {
            return  <Album
              image={item.track.album.images[0].url}
              imageWidth={item.track.album.images[0].width}
              imageHeight={item.track.album.images[0].height}
              albumName={item.track.name}
              artistName={item.track.album.name}/>
          })}
        </div>
      );
    }
    
    return (
      <div className="App">
          {this.state.loggedIn && this.state.user.response === false ? this.getUserProfile() : null }
          {albums}
          <div style={{ position : 'absolute', right: '20px', bottom: '20px' }}>
            <SpotifyButton profileImage={this.state.user.image}></SpotifyButton>
        </div>
      </div>
    );
  }
}

export default App;
