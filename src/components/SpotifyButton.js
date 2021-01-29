import React, { Component } from 'react';

//styles
import styled from 'styled-components';
import Wrapper from './Wrapper';
import spotifyLogo from '../images/Spotify_Icon_RGB_White.png'

const SpotifyWrapper = styled(Wrapper)`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  align-content: space-between;
`

const SpotifyLogin = styled.a`
  background-image: none;
  background-color: #1DB954;
  border-color: #1aa34a;
  border-radius: 10px;
  border-width: 0;
  padding: 5px;
  cursor: pointer;
  user-select: none;
`

const SpotifyLogo = styled.img`
  width: 35px;
  height: 35px;
  margin: 5px;
  border-radius: 50px;
  border: 4px solid #1aa34a;
`

const UserProfileImage = styled.img`
  width: 35px;
  height: 35px;
  margin: 7px 5px 5px;
  border-radius: 50px;
  border: 4px solid #1aa34a;
`

class SpotifyButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      href: `${process.env.REACT_APP_AUTH_DOMAIN}login`,
    }
  }


  render() {
    console.log(process.env.REACT_APP_AUTH_DOMAIN)
    return (
      <SpotifyWrapper>
        <SpotifyLogin
          href={this.state.href}>
            { !this.props.profileImage ? <SpotifyLogo src={spotifyLogo} alt="spotify logo"/> :
             <UserProfileImage src={this.props.profileImage} alt="your user profile image"/> }
          </SpotifyLogin>
      </SpotifyWrapper>
    );
  }
}

export default SpotifyButton;
