import React, { Component } from 'react';

// Components
import SpotifyButton from './components/SpotifyButton';
import NowPlaying from './components/NowPlaying';
import Landing from './components/Landing'
// svgs
import doubleArrow from './images/double-arrow.svg'
import pause from './images/pause.svg'
import play from './images/play.svg'

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
      // check every second for the user playing. We continue to run this so we can listen to user changes on our webplayer
      this.nowPlayingCheckInterval = setInterval(() => this.getNowPlaying(), 1000)
    }
    this.state = {
      loggedIn: token ? true : false,
      token: token,
      error: '',
      deviceId: '',
      albumsResponse: [],
      podcastResponse: [],
      context: '',
      makerPlaylist: '',
      podcastimage: '',
      podcastnameame: '',
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
      },
      track: {
        static: false,
        staticSwitch: "Pause"
      }
    }
    this.handlePrevTrack = this.handlePrevTrack.bind(this);
    this.handleTrackStatic = this.handleTrackStatic.bind(this);
    this.handleNextTrack = this.handleNextTrack.bind(this);
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
        console.log('user', response)
        this.setState({
          user: {
            response: true,
            name: response.display_name,
            image: response.images[0] ? response.images[0].url : null
          }
        });
      })
  }

  // This works pretty much identically to how the documentation recommends setting things up, but instead of using a constant OAuth token, we’re taking it from our app component’s state, and instead of creating a global variable called player, we just add player as one of the app’s class variables. This means that we can access it from any of the other class methods. (https://mbell.me/blog/2017-12-29-react-spotify-playback-api/)
  checkForPlayer() {
    if (window.Spotify) {
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
          // this.getPodcasts()
          console.log('playlist', this.state.makerPlaylist)
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

    // state seems to change in an unpredictable pattern, often twice on each change - this seems to be a known issue [in an iframe](https://github.com/spotify/web-playback-sdk/issues/63), [on listener](https://github.com/spotify/web-api/issues/878), etc.  seems to be an issue with the player sdk and not the api. This make it a bit unpredictable on how it is going to update state as a single reliable occurance.

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
      track_window: { current_track: { id } }
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
    this.setState({
      albumsResponse: updatedPlaylist,
    })
  }
// spotify:show:2GM7Lo15uxyqhIv5uXfBpM
  playPodcast(deviceID){
    console.log('deviceID', deviceID)
    console.log('context', this.state.context)
    console.log('makerPlaylist', this.state.makerPlaylist)
    console.log('token', this.state.token)
      if (this.makerPlaylist !== '') {
        fetch('https://api.spotify.com/v1/me/player/play?device_id=' + deviceID + '', {
          method: 'PUT',
          body: JSON.stringify({
            "context_uri": 'spotify:show:2GM7Lo15uxyqhIv5uXfBpM',
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
      console.log('fired')
      if (this.state.makerPlaylist !== ''){
        spotifyApi.getPlaylist(this.state.makerPlaylist)
        .then((response) => {
          if(response) {
            const tracks = response.tracks.items || response.items
            // select a random track to offset
            const length = tracks.length
            const randomTrack = Math.floor((Math.random() * length))
            const id = tracks[randomTrack].track.id || tracks[randomTrack].id
            window.localStorage.setItem('Track ID', id)
            // remove any index from 0 to our random track
            let cutPlaylist = tracks.splice(randomTrack + 1)
            // rebuild our playlist with the random track in the nowPlaying position and its next index in the first index of the playlist
            const newPlaylist = cutPlaylist.concat(tracks)

            this.setState({
              albumsResponse: newPlaylist,
              offsetPosition: randomTrack,
              context: 'playlist'
            })
          }
        })
      }
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

   getPodcasts() {
      fetch('https://api.spotify.com/v1/shows/2GM7Lo15uxyqhIv5uXfBpM/episodes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": 'Bearer ' + this.state.token + ''
        }
      }).then(response => response.json())
        .then(data => {
          console.log(data)
           this.setState({
            podcastResponse: data.items,
            makerPlaylist: data.items,
            podcastimage: data.items[0].images[0].url,
            podcastname: data.items[0].name,
            podcastdescription: data.items[0].description,
            context: 'show'
          })
        })
    }

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        console.log("nowplaying", {response})
        if (response) {
          this.setState({
            nowPlayingResponse: {
              imgSrc: response.item.album.images[0].url || this.state.podcastimage,
              albumName: response.item.album.name || this.state.podcastname,
              artistName: response.item.album.artists[0].name || this.state.podcastdescription,
            }
          })
        }
      })
  }

  handlePrevTrack() {
    this.player.previousTrack().then(() => {
      console.log('Skipped to prev track!');
    });
  }

  handleTrackStatic() {
    if (this.state.track.static === false) {
      this.player.pause().then(() => {
        this.setState({
          track: {
            static: !this.state.track.static,
            staticSwitch: "Play"
          }
        })
        console.log('Paused');
      });
    } else {
      this.player.resume().then(() => {
        this.setState({
          track: {
            static: !this.state.track.static,
            staticSwitch: "Pause"
          }
        })
        console.log('Playing');
      });
    }
  }

  handleNextTrack() {
    this.player.nextTrack().then(() => {
      console.log('Skipped to next track!');
    });
  }

  render() {

    console.log('nowPlaying', this.state.nowPlayingResponse)
    console.log('user', this.state.user.response)
    console.log('loggedin', this.loggedIn)
    console.log('switch', this.state.track.staticSwitch)
    return (
      <div className="App">
      {this.state.loggedIn && this.state.user.response === false ? this.getUserProfile() : null }
      {this.state.loggedIn === false ? <Landing /> :
        <div>
          <NowPlaying
            imgSrc={this.state.nowPlayingResponse.imgSrc}
            albumName={this.state.nowPlayingResponse.albumName}
            artistName={this.state.nowPlayingResponse.artistName}/>
        </div> }
        {this.state.loggedIn && this.player ?
        <>
          <div
            style={{
              position: 'absolute',
              left: '40px',
              bottom: '24px' ,
              display: 'flex'
              }}>
            <button
              style={{
                height: '60px',
                width: '60px',
                border: 'none',
                borderRadius: '50px',
                backgroundColor: 'linear-gradient(145deg, #e6e6e6b3, #ffffff)',
                boxShadow: '20px 20px 60px #d9d9d9',
                margin: '20px 20px 20px 0px',
                position: 'relative',
                transform: 'scaleX(-1)',
                background: `url(${doubleArrow}) no-repeat left`,
                backgroundSize: '30px',
                backgroundPosition: '18px 15px',
                cursor: 'pointer'
              }}
              onClick={this.handlePrevTrack}
             />
            <button
            style={{
              height: '60px',
              width: '60px',
              border: 'none',
              borderRadius: '50px',
              backgroundColor: 'linear-gradient(145deg, #e6e6e6b3, #ffffff)',
              boxShadow: '20px 20px 60px #d9d9d9',
              margin: '20px 20px 20px 0px',
              cursor: 'pointer',
              background: `${
                this.state.track.staticSwitch === "Play" ?
                `no-repeat center/80% 35px url(${play})` :
                `no-repeat center/80% 35px url(${pause})`
                }`,
              }}
              aria-label={this.state.track.staticSwitch}
              onClick={this.handleTrackStatic}
            >
            </button>
            <button
              style={{
                height: '60px',
                width: '60px',
                border: 'none',
                borderRadius: '50px',
                backgroundColor: 'linear-gradient(145deg, #e6e6e6b3, #ffffff)',
                boxShadow: '20px 20px 60px #d9d9d9',
                margin: '20px 20px 20px 0px',
                position: 'relative',
                background: `url(${doubleArrow}) no-repeat left`,
                backgroundSize: '30px',
                backgroundPosition: '18px 15px',
                cursor: 'pointer'
              }}
              onClick={this.handleNextTrack}
              aria-label="Next"
            >
            </button>
          </div>
          <div style={{ position : 'absolute', right: '20px', bottom: '20px' }}>
              <SpotifyButton profileImage={this.state.user.image}></SpotifyButton>
          </div>
          </>
          : null }
      </div>
    );
  }
}

export default App;
