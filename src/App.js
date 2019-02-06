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
      // check every second for the user playing.
      this.nowPlayingCheckInterval = setInterval(() => this.getNowPlaying(), 1000)
    }
    this.state = {
      loggedIn: token ? true : false,
      token: token,
      error: '',
      deviceId: '',
      albumsResponse: [],
      makerPlaylist: '',
      nowPlayingResponse: {
        response: false,
        offsetPosition: 0,
        imgSrc: '',
        albumName: '',
        artistName: '',
        albumID: '',
      },
      user: {
        response: false,
        name: '',
        image: '',
      }
    }
  }

  componentWillMount(){
     // pick a random list from our avalible playlists array
    const publicLists = ['0RClNbul65Q9fN3n7dDsk2', '4gY2Kfwh9cKCW5gkGmADMQ', '1PCdCzRKLLmd8XvVLw8eV7', '37i9dQZF1DXa2SPUyWl8Y5', '1fX5wTaNu6ogWxu66tjN7t']
    const list = publicLists[Math.floor(Math.random() * publicLists.length)]

    this.setState({ 
      makerPlaylist: list,
     })
  }

  // Obtains our parameters from the hash of the URL @return Object
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

  // This works pretty much identically to how the documentation recommends setting things up, but instead of using a constant OAuth token, we’re taking it from our app component’s state, and instead of creating a global variable called player, we just add player as one of the app’s class variables. This means that we can access it from any of the other class methods. (https://mbell.me/blog/2017-12-29-react-spotify-playback-api/)
  checkForPlayer() {
    if (window.Spotify !== null) {
      this.player = new window.Spotify.Player({
        name: "Maker's Spotify Player",
        getOAuthToken: cb => { cb(this.state.token); },
      });
      this.createEventHandlers();
      // finally, connect!
      this.player.connect().then(success => {
        if (success) {
          // since we have the player we can now cancel the interval
          clearInterval(this.playerCheckInterval);
          // and get our playlist
          this.getMakerRadioPlaylist()
        }
      })
    }
  }

  createEventHandlers() {
    this.player.on('initialization_error', e => { console.error(e); });
    this.player.on('authentication_error', e => {
      console.error(e);

      this.setState({ 
        loggedIn: false 
      });
    });
    this.player.on('account_error', e => { console.error(e); });
    this.player.on('playback_error', e => { console.error(e); });
  
    // Playback status updates
    // this.player.on('player_state_changed', state => { console.log(state); });
  
    // Ready
    this.player.on('ready', data => {
      let { device_id } = data
      this.playRadio(device_id)
      
      this.setState({ 
        deviceId: device_id, 
      })

    });

    this.player.addListener('player_state_changed', ({
      track_window: { current_track: {
        id
      } }
    }) => {
      if (id !== window.localStorage.getItem('Track ID')) {
        window.localStorage.setItem('Track ID', id)
        this.shiftPlaylist()
      }
    });

  }

  

  shiftPlaylist(){    
    // make a copy of our array
    let albums = [...this.state.albumsResponse]
    const cutPlaylist = albums.shift(0)
    // rebuild our albums with the last track played appended to the end
    const updatedPlaylist = albums.concat(cutPlaylist)
    console.log(updatedPlaylist)
    this.setState({
      albumsResponse: updatedPlaylist,
    })
  }


  playRadio(deviceID){
      if (this.makerPlaylist !== '') {
        fetch('https://api.spotify.com/v1/me/player/play?device_id=' + deviceID + '', {
          method: 'PUT',
          body: JSON.stringify({
            "context_uri": 'spotify:playlist:' + this.state.makerPlaylist + '',
            "offset": {
              "position": this.state.offsetPosition,
            },
            "position_ms": 0,
          }),
          headers: {
            'Content-Type': 'application/json',
            "Authorization": 'Bearer ' + this.state.token + ''
          }
        }).then(
          this.player.togglePlay().then(() => {
            this.player.setVolume(0.1)
          })
        )
      }
    }

  getMakerRadioPlaylist(){
    if (this.state.makerPlaylist !== ''){
      spotifyApi.getPlaylist(this.state.makerPlaylist)
      .then((response) => {
        const tracks = response.tracks.items
        // select a random track to offset
        const randomTrack = Math.floor((Math.random() * tracks.length))
        window.localStorage.setItem('Track ID', tracks[randomTrack].track.id)
        // remove any index from 0 to our random track
        let cutPlaylist = tracks.splice(randomTrack + 1)
        // rebuild our playlist with the random track in the nowPlaying position and its next index in the first index of the playlist
        const newPlaylist = cutPlaylist.concat(tracks)

        this.setState({
          albumsResponse: newPlaylist,
          offsetPosition: randomTrack,
        })
      })
    }
  }

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        if (response) {
          this.setState({
            nowPlayingResponse: {
              imgSrc: response.item.album.images[0].url,
              albumName: response.item.album.name,
              artistName: response.item.album.artists[0].name,
            }
          })
        }
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
