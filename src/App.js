import React, { Component } from 'react';

// Components
import SpotifyButton from './components/SpotifyButton';
import AlbumList from './components/AlbumList';
import NowPlaying from './components/NowPlaying';

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
      this.getNowPlaying();
    }
    this.state = {
      loggedIn: token ? true : false,
      token: token,
      error: '',
      deviceId: '',
      albumsResponse: [],
      nowPlayingResponse: {
        imgSrc: '',
        albumName: '',
        artistName: '',
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
    if (window.Spotify !== null) {
      this.player = new window.Spotify.Player({
        name: "Maker's Spotify Player",
        getOAuthToken: cb => { cb(this.state.token); },
      });
      this.createEventHandlers();
      // finally, connect!
      this.player.connect();
      // cancel the interval
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
    // this.player.on('player_state_changed', this.getNowPlaying());
  
    // Ready
    this.player.on('ready', data => {
      let { device_id } = data
      this.setState({ deviceId: device_id })
      this.playRadio(device_id)
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

  playRadio(deviceID){
      fetch('https://api.spotify.com/v1/me/player/play?device_id=' + deviceID + '', {
        method: 'PUT',
        body: JSON.stringify({ 
          uri: process.env.REACT_APP_MAKER_PLAYLIST,
          offset: { "position": 5 }
        }),
        headers: {
          'Content-Type': 'application/json',
          "Authorization": 'Bearer ' + this.state.token + ''
        }
      }).then(
        // this.player.setVolume(0.5).then(() => {
        //   console.log('Volume updated!');
        // })
        this.player.togglePlay().then(() => {
          console.log('Toggled playback!');
        })
      )
    }

  // curl -X "PUT" "https://api.spotify.com/v1/me/player/play" --data "{\"context_uri\":\"spotify:album:5ht7ItJgpBH7W6vJ5BqpPr\",\"offset\":{\"position\":5},\"position_ms\":0}" -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer "

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

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        console.log(response)
        this.setState({
          nowPlayingResponse: {
            imgSrc: response.item.album.images[0].url,
            albumName: response.item.album.name,
            artistName: response.item.album.artists[0].name,
          }
        });
      })
  }

  render() {
    
    return (
      <div className="App">
          {this.state.loggedIn && this.state.user.response === false ? this.getUserProfile() : null }
        <div style={{ display: 'flex', overflow: 'hidden' }}>
          <NowPlaying
            imgSrc={this.state.nowPlayingResponse.imgSrc}
            albumName={this.state.nowPlayingResponse.albumName}
            artistName={this.state.nowPlayingResponse.artistName}/>
          <AlbumList albumsResponse={this.state.albumsResponse}/>
        </div>
        <div style={{ position : 'absolute', right: '20px', bottom: '20px' }}>
            <SpotifyButton profileImage={this.state.user.image}></SpotifyButton>
        </div>
        <div 
          style={{ 
            position : 'absolute', 
            right: '100px', 
            bottom: '40px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-start',
            alignContent: 'space-between'
            }}>
            <div
              style={{
                // width: '200px',
                minHeight: '40px',
                borderRadius: '10px',
                padding: '5px',
                backgroundColor: '#f3f2f2'
              }}>
              <div
                style={{
                  fontSize: '15px',
                  margin: '5px 10px 2.5px 10px',
                }}>Next Podcast</div>
              <div
                style={{
                  fontSize: '25px',
                  margin: '2.5px 10px 5px 10px',
                }}>Podcast Title</div>
            </div>
        </div>
      </div>
    );
  }
}

export default App;
