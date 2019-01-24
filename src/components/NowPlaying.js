import React from 'react';
import styled from 'styled-components'

// module for color getter
import Palette from 'react-palette'

// our styles
const AlbumBlockWrapper = styled.div`
  padding: 75px 100px 0px;
  background-image: linear-gradient( ${props => props.palette.lightVibrant}, #FFF );
  min-width: 45vw;
`;

const AlbumBlockTitle = styled.h1`
  position: absolute;
  top: 0;
  color: ${props => props.palette.muted};
`;

const AlbumBlock = styled.div`
  margin: 5px auto;
`;

const AlbumImage = styled.img`
  margin: 5px auto;
  width: 100%;
  height: auto;
  max-height: 600px;
`;

const AlbumTitleBlock = styled.div`
  margin: 5px;
  position: relative;
  bottom: 0;
  left: 0;
  color: ${props => props.palette.muted};
`;

const AlbumTitle = styled.div`
  margin-right: 5px;
  font-size: .75em;
`;

const ArtistName = styled.div`
  font-style: italic;
  font-size: .75em;
`;

const NowPlaying = (props) => {
    return (
      <Palette image={props.imgSrc}>
      {palette => (
        <AlbumBlockWrapper palette={palette}>
        <AlbumBlockTitle palette={palette}>Now Playing</AlbumBlockTitle>
        <AlbumBlock>
          {props.imgSrc && 
            <AlbumImage
              src={props.imgSrc} 
              alt="album cover"/>
          }
          {props.albumName && 
            <AlbumTitleBlock palette={palette}>
              <AlbumTitle><strong>{props.albumName}</strong></AlbumTitle>
              <ArtistName>by {props.artistName}</ArtistName>
            </AlbumTitleBlock>
            }
          </AlbumBlock>
        </AlbumBlockWrapper>
      )}
      </Palette>
    )
};

export default NowPlaying;