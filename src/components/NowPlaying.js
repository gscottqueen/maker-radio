import React from 'react';
import styled from 'styled-components';
import Tilt from 'react-vanilla-tilt'


// module for color getter
import Palette from 'react-palette'

// our styles
const AlbumBlockWrapper = styled.div`
  padding: 75px 100px 0px;
  background-image: linear-gradient( ${props => props.palette.lightVibrant !== null ? props.palette.lightVibrant : props.palette.vibrant }, #FFF );
  /* width: 100%; */
`;

const AlbumBlockTitle = styled.h1`
  position: absolute;
  top: 0;
  color: ${props => props.palette.darkMuted};
`;

const AlbumBlock = styled.div`
  /* margin: 5px auto; */
  width: fit-content;
  margin: 0 auto;
`;

const AlbumImage = styled.img`
  /* display: flex;
  margin: 5px auto;
  width: auto;
  height: auto;
  max-height: 525px;
  transform: translateZ(20px); */
  transform-style: preserve-3d;
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
  max-width: 630px;
`;

const NowPlaying = (props) => {
    return (
      <Palette image={props.imgSrc}>
      {palette => (
        <AlbumBlockWrapper palette={palette}>
            <AlbumBlock>
            { props.imgSrc &&
            <AlbumBlockTitle palette={palette}>Now Playing</AlbumBlockTitle> }
              {props.imgSrc &&
              <Tilt
              style={{ backgroundColor: 'transparent' }}
              >
                <AlbumImage
                  src={props.imgSrc}
                  alt="album cover"/>
               </Tilt>
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
