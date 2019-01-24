import React from 'react';
import styled from 'styled-components'
import Album from './Album'

const AlbumListWrapper = styled.ul`
  display: flex; 
  margin: 0;
  padding: 0;
  height: 100vh;
  list-style: none;
`;

const AlbumList = (props) => {

  let albums = null;

  if (props.albumsResponse) {
    albums = (
      <AlbumListWrapper>
        {props.albumsResponse.map((item) => {
          return  <Album
            image={item.track.album.images[0].url}
            imageWidth={item.track.album.images[0].width}
            imageHeight={item.track.album.images[0].height}
            albumName={item.track.name}
            artistName={item.track.album.name}/>
        })}
      </AlbumListWrapper>
    );
  }
  
  return ( albums );
};

export default AlbumList;