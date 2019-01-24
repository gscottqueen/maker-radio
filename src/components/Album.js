import React from 'react';
import styled from 'styled-components'

// module for color getter
import Palette from 'react-palette'

// our styles
const AlbumBlockWrapper = styled.li`
  width: 100%;
  height: auto;
  padding: 50px;
  background-image: linear-gradient( ${props => props.palette.lightVibrant}, #FFF );
`;

const AlbumBlock = styled.div`
  margin: 5px auto;
`;

const AlbumImage = styled.img`
  margin: 5px auto;
  width: ${props => props.width};
  height: ${props => props.height};
  max-height: 600px;
`;

const AlbumTitleBlock = styled.div`
  margin: 5px;
  position: relative;
  bottom: 0;
  left: 0;
`;

const AlbumTitle = styled.span`
  margin-right: 5px;
  font-size: 2em;
`;

const ArtistName = styled.span`
  font-style: italic;
  font-size: .75em;
`;

const Album = (props) => {
    return (
      <Palette image={props.image}>
      {palette => (
        <AlbumBlockWrapper palette={palette} >
        <AlbumBlock>
          {props.image && 
            <AlbumImage 
              src={props.image} 
              width={props.imageWidth}
              height={props.imageHeight}
              alt="album cover"/>
          }
          {props.albumName && 
            <AlbumTitleBlock>
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

export default Album;