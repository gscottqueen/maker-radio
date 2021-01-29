import React, { Component } from 'react';

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
        // style="position: absolute; margin: 0 auto; text-align: center;"
        >
        <h1
        // style="font-family: 'Six Caps', sans-serif; font-weight: normal; line-height: 1; margin: 0;"
        >MAKER RADIO</h1>
        <h2
        // style="font-weight: normal;"
        >Scientifically proven to make you smarter.</h2>
        </div>
        <div id="spotify-button"
        // style="position : absolute; right: 20px; bottom: 20px;"
        >
        <div class="arrow"
        // style="transform: rotate(258deg); position: absolute;right: 70px;top: -120px;"
        >
          <div class="greeting"
          // style="font-family: 'Rock Salt', cursive; transform: rotate(90deg);"
          >Welcome my dudes!</div>
          <img src="arrow.png"
          // style="-webkit-transform: scaleX(-1); transform: scaleX(-1); width: 100px;"
          />
        </div>
        <div
        // style="display: flex; justify-content: space-around; align-items: flex-start; align-content: space-between;"
        >
          <a href="http://localhost:8888/login"
          style={{ color: "black"}}
          // style=" background-image: none; background-color: #1DB954; border-color: #1aa34a; border-radius: 10px; border-width: 0; padding: 5px; cursor: pointer; user-select: none;"
          > login
            {/* <img src="Spotify_Icon_RGB_White.png"
            // style={{
            //   width: 35px,
            //   height: 35px
            //   margin: 5px;border-radius: 50px; border: 4px solid #1aa34a;
            //   }}
              /> */}
          </a>
        </div>
        </div>
      </div>
    </div>
    )
  }
}

export default Landing
